// Define the Message interface (same as in Chat.tsx)
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
}

// The URL of your Spring Boot backend
const API_URL = "http://localhost:8080/api";

/**
 * Sends a message to the backend and returns the AI response
 * Using GET request with path variable
 */
export async function sendMessage(message: string): Promise<Message> {
  try {
    // Encode the message for URL use
    const encodedMessage = encodeURIComponent(message);
    const url = `${API_URL}/chat/${encodedMessage}`;
    
    console.log(`Sending request to: ${url}`);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "text/plain",
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error status: ${response.status}, response: ${errorText}`);
      throw new Error(`API error: ${response.status} - ${errorText || 'No error details'}`);
    }

    // Get the response as plain text
    const responseText = await response.text();
    console.log("Response text:", responseText);
    
    return {
      id: Date.now().toString(),
      content: responseText,
      sender: "ai"
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
} 