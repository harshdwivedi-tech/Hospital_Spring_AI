package com.example.HospitalManagementAi.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.HospitalManagementAi.ai.tools.JavaTool;
import com.example.HospitalManagementAi.service.HospitalAiService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/hospital/ai")
public class HospitalAiController {

    private final HospitalAiService aiService;

    public HospitalAiController(HospitalAiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@Valid @RequestBody ChatRequest request) {
        try {
            return Map.of("reply", aiService.ask(request.message()));
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "The AI assistant could not complete the request. Check your OpenRouter API key and model configuration.");
        }
    }

    public record ChatRequest(@NotBlank(message = "Message cannot be empty") String message) {
    }
}
