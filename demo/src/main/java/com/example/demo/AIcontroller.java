package com.example.demo;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class AIcontroller {
    private final OpenAiChatModel openAiChatModel;
    private final ConversationalContext context;

    public AIcontroller(OpenAiChatModel chatModel, ConversationalContext context) {
        this.openAiChatModel = chatModel;
        this.context = context;
    }
    
    @GetMapping("/chat/{message}")
    public ResponseEntity<Map<String, String>> ans(
            @PathVariable String message,
            @RequestParam(value = "contextId", defaultValue = "") String contextId,
            HttpServletRequest request) {

        // Generate new context ID if not provided
        if (contextId.isEmpty()) {
            contextId = UUID.randomUUID().toString();
        }

        // Prepare prompt with context
        String prompt = context.preparePromptWithContext(contextId, message);
        
        // Get AI response
        String response = openAiChatModel.call(prompt);
        
        // Return response with context ID
        return ResponseEntity.ok()
                .header("X-Context-ID", contextId)
                .body(Map.of("generated", response));
    }

    @PostMapping("/chat/clear")
    public ResponseEntity<Void> clearChat() {
        try {
            context.clear();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
