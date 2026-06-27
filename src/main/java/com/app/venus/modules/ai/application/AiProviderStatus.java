package com.app.venus.modules.ai.application;

public record AiProviderStatus(
        String configuredProvider,
        String provider,
        String model,
        String status,
        boolean connected,
        boolean mockActive,
        boolean fallbackToMockOnError) {
}
