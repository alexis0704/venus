package com.app.venus.modules.ai.infrastructure;

import org.springframework.stereotype.Component;

import com.app.venus.modules.ai.application.AiRequest;

@Component
public class PromptBuilder {

    public String build(AiRequest request) {
        return switch (request.operation()) {
            case GENERATE_TEXT -> withOptionalSystemPrompt(request.systemPrompt(), request.input());
            case SUMMARIZE -> """
                    Summarize the following text in 3 concise bullet points.

                    Text:
                    %s
                    """.formatted(request.input());
            case EXTRACT_STRUCTURED -> """
                    Extract structured data from the text below.
                    Return only valid JSON.
                    Schema hint: %s

                    Text:
                    %s
                    """.formatted(blankToDefault(request.schemaHint(), "Infer a useful JSON object."), request.input());
            case CLASSIFY -> """
                    Classify the following text.
                    %s

                    Text:
                    %s
                    """.formatted(blankToDefault(request.schemaHint(), "Return a short, useful classification."), request.input());
        };
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private String withOptionalSystemPrompt(String systemPrompt, String input) {
        if (systemPrompt == null || systemPrompt.isBlank()) {
            return input;
        }

        return """
                System instruction:
                %s

                User prompt:
                %s
                """.formatted(systemPrompt.trim(), input);
    }
}
