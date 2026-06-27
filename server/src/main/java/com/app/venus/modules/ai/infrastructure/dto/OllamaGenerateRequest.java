package com.app.venus.modules.ai.infrastructure.dto;

import java.util.Map;

public record OllamaGenerateRequest(
        String model,
        String prompt,
        boolean stream,
        String format,
        Map<String, Object> options) {
}
