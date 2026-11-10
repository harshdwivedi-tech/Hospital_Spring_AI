package com.example.HospitalManagementAi.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.example.HospitalManagementAi.ai.tools.JavaTool;

@Service
public class HospitalAiService {

    private final ChatClient chatClient;
    private final JavaTool javaTool;

    public HospitalAiService(ChatClient.Builder chatClientBuilder, JavaTool javaTool) {
        this.chatClient = chatClientBuilder.build();
        this.javaTool = javaTool;
    }

    public String ask(String message) {
        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException("Please enter a message.");
        }

        return chatClient.prompt()
                .system("""
                        You are the Hospital Management AI Assistant.
                        Help users explore the hospitals stored in this application's database.
                        Use the available tools when the user asks about hospital records, locations,
                        specializations, or the hospital directory. Do not invent hospital records.
                        If no matching record exists, say so clearly.
                        You are not a doctor and must not diagnose conditions or prescribe treatment.
                        For medical emergencies, advise the user to contact local emergency services
                        or a qualified healthcare professional.
                        Keep answers clear, friendly, and concise.
                        """)
                .user(message)
                .tools(javaTool)
                .call()
                .content();
    }
}
