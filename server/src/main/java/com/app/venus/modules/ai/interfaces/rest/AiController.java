package com.app.venus.modules.ai.interfaces.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.venus.modules.ai.application.AiOperation;
import com.app.venus.modules.ai.application.AiProviderStatus;
import com.app.venus.modules.ai.application.AiService;
import com.app.venus.modules.ai.interfaces.dto.request.AiGenerateRequest;
import com.app.venus.modules.ai.interfaces.dto.response.AiGenerateResponse;
import com.app.venus.modules.ai.interfaces.dto.response.AiStatusResponse;
import com.app.venus.shared.web.Response;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    @GetMapping("/status")
    public ResponseEntity<Response<AiStatusResponse>> status() {
        AiProviderStatus status = aiService.status();
        return ResponseEntity.ok(Response.ok(
                new AiStatusResponse(
                        status.configuredProvider(),
                        status.provider(),
                        status.model(),
                        status.status(),
                        status.connected(),
                        status.mockActive(),
                        status.fallbackToMockOnError()),
                "AI status fetched."));
    }

    @PostMapping
    public ResponseEntity<Response<AiGenerateResponse>> complete(@Valid @RequestBody AiGenerateRequest request) {
        AiOperation operation = operation(request.mode());
        var result = switch (operation) {
            case GENERATE_TEXT -> aiService.generateText(request.prompt(), request.systemPrompt());
            case SUMMARIZE -> aiService.summarize(request.prompt());
            case EXTRACT_STRUCTURED -> aiService.extractStructured(request.prompt(), request.systemPrompt());
            case CLASSIFY -> aiService.classify(request.prompt(), request.systemPrompt());
        };

        return ResponseEntity.ok(Response.ok(AiGenerateResponse.from(result), message(operation)));
    }

    private String message(AiOperation operation) {
        return switch (operation) {
            case GENERATE_TEXT -> "Text generated.";
            case SUMMARIZE -> "Summary generated.";
            case EXTRACT_STRUCTURED -> "Structured data extracted.";
            case CLASSIFY -> "Classification generated.";
        };
    }

    private AiOperation operation(String mode) {
        if (mode == null || mode.isBlank()) {
            return AiOperation.GENERATE_TEXT;
        }

        return switch (mode.trim().toLowerCase()) {
            case "summarize", "summary" -> AiOperation.SUMMARIZE;
            case "extract_structured", "extract-structured", "extract", "json" -> AiOperation.EXTRACT_STRUCTURED;
            case "classify", "classification" -> AiOperation.CLASSIFY;
            default -> AiOperation.GENERATE_TEXT;
        };
    }
}
