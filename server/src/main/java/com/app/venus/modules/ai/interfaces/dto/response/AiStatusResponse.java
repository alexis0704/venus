package com.app.venus.modules.ai.interfaces.dto.response;

public record AiStatusResponse(
        String configuredProvider,
        String provider,
        String model,
        String status,
        boolean connected,
        boolean mockActive,
        boolean fallbackToMockOnError) {
}
