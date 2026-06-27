package com.app.venus.modules.ai.infrastructure;

import org.springframework.stereotype.Component;

import com.app.venus.modules.ai.application.AiProvider;
import com.app.venus.modules.ai.application.AiRequest;
import com.app.venus.modules.ai.application.AiResult;

@Component
public class MockAiClient implements AiProvider {

    @Override
    public String name() {
        return "mock";
    }

    @Override
    public String model() {
        return "mock-starter";
    }

    @Override
    public AiResult complete(AiRequest request) {
        String text = switch (request.operation()) {
            case GENERATE_TEXT -> """
                    Mock response:
                    This starter is running without a live AI provider. Use this response to verify the request flow, response wrapper, and frontend integration.
                    """;
            case SUMMARIZE -> """
                    - The backend accepted the request.
                    - The AI wrapper returned a mock summary.
                    - Configure Ollama or an OpenAI-compatible provider for live output.
                    """;
            case EXTRACT_STRUCTURED -> """
                    {
                      "mode": "mock",
                      "provider": "mock",
                      "readyForIntegration": true
                    }
                    """;
            case CLASSIFY -> "mock, starter, ai-wrapper";
        };

        return AiResult.success(text.trim(), name(), model(), true);
    }
}
