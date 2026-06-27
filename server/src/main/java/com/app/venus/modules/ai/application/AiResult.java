package com.app.venus.modules.ai.application;

public record AiResult(
        String text,
        String provider,
        String model,
        boolean mock,
        boolean fallback,
        String notice) {

    public static AiResult success(String text, String provider, String model, boolean mock) {
        return new AiResult(text, provider, model, mock, false, null);
    }

    public AiResult asFallback(String notice) {
        return new AiResult(text, provider, model, mock, true, notice);
    }
}
