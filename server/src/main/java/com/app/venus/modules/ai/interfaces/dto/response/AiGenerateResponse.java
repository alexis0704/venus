package com.app.venus.modules.ai.interfaces.dto.response;

import com.app.venus.modules.ai.application.AiResult;

public record AiGenerateResponse(
        String text,
        String provider,
        String model,
        boolean mock,
        boolean fallback,
        String notice) {

    public static AiGenerateResponse from(AiResult result) {
        return new AiGenerateResponse(
                result.text(),
                result.provider(),
                result.model(),
                result.mock(),
                result.fallback(),
                result.notice());
    }
}
