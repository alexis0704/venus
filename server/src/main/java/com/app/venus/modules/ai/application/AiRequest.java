package com.app.venus.modules.ai.application;

public record AiRequest(
        AiOperation operation,
        String input,
        String systemPrompt,
        String schemaHint) {
}
