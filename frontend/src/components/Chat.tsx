import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/config";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
}

interface ChatResponse {
  generated: string;
}

// Mock AI responses - in a real app, this would be an API call
const mockResponses = [
  "I'm an AI assistant here to help answer your questions.",
  "That's an interesting question. Let me think about that...",
  "Based on my understanding, there are several ways to approach this.",
  "I don't have all the answers, but I can certainly try to help.",
  "Let me provide some insights that might be helpful.",
  "That's a great question! Here's what I know about this topic."
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextId, setContextId] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Test function to check backend connectivity
  const testBackendConnection = async () => {
    setError(null);
    try {
      console.log("Testing backend connection...");
      const response = await fetch(`${API_BASE_URL}/api/test`, {
        method: "GET",
        headers: {
          "Accept": "text/plain",
        }
      });
      
      console.log("Test response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log("Raw test response:", responseText);
      
      // Handle text response directly
      setError(`Backend test successful: ${responseText}`);
    } catch (err) {
      console.error("Backend test failed:", err);
      setError(`Backend test failed: ${err.message}`);
    }
  };
  
  const clearChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/clear`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear chat: ${response.status}`);
      }
      
      // Reset messages to initial state
      setMessages([{
        id: '1',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "ai"
      }]);
      // Reset context ID
      setContextId("");
      setError(null);
    } catch (err) {
      console.error("Failed to clear chat:", err);
      setError(`Failed to clear chat: ${err.message}`);
    }
  };
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user"
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError(null);
    
    try {
      // Send request to Spring Boot backend
      const encodedMessage = encodeURIComponent(inputValue);
      const url = `${API_BASE_URL}/api/chat/${encodedMessage}${contextId ? `?contextId=${contextId}` : ''}`;
      console.log("Sending request to:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText || 'No details'}`);
      }

      // Get response as JSON
      const data: ChatResponse = await response.json();
      console.log("Response data:", data);
      
      // Store the context ID if it's a new conversation
      if (!contextId) {
        const newContextId = response.headers.get('X-Context-ID');
        if (newContextId) {
          setContextId(newContextId);
        }
      }
      
      // Create AI message from response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.generated,
        sender: "ai"
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (err) {
      console.error("Failed to get response:", err);
      setError(`Failed to get a response: ${err.message}`);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages bg-white/20 backdrop-blur-sm rounded-t-xl">
        <div className="p-2 flex justify-between items-center">
          <Button 
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
          <Button 
            onClick={testBackendConnection}
            variant="outline"
            size="sm"
          >
            Test Backend Connection
          </Button>
        </div>
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            {message.content}
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai-message">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="message error-message">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-area rounded-b-xl flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage} 
          className="bg-primary hover:bg-primary/90"
          disabled={isTyping}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}