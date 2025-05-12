package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.*;
@Component
public class ConversationalContext {
    private final Map<String, List<String>> context = new HashMap<>();
    public String preparePromptWithContext(String contextId, String message) {
        // Get or create history for this context
        List<String> history = context.computeIfAbsent(contextId, k -> new ArrayList<>());
        
        // Add the new message to history
        history.add(message);
        
        // Build the prompt with context
        StringBuilder prompt = new StringBuilder();
        
        // Add system message to set context
        prompt.append("You are having a conversation. Here is the conversation history:\n\n");
        
        // Add previous messages with clear user/assistant roles
        for (int i = 0; i < history.size() - 1; i++) {
            if (i % 2 == 0) {
                prompt.append("User: ").append(history.get(i)).append("\n");
            } else {
                prompt.append("Assistant: ").append(history.get(i)).append("\n");
            }
        }
        
        // Add current message
        prompt.append("\nUser: ").append(history.get(history.size() - 1)).append("\n");
        prompt.append("Assistant: ");
        
        return prompt.toString();
    }
    private String padStringWithDelimiter(final String message) {
        return PrompConstant.PROMPT_DELIMITER + message + PrompConstant.PROMPT_DELIMITER;
    }
    public void addResponse(String contextId, String response) {
        List<String> history = context.get(contextId);
        if (history != null) {
            history.add(response);
        }
    }
    public void clear(){
        context.clear();
    }
}
