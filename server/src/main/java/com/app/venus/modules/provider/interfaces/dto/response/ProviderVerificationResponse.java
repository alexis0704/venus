package com.app.venus.modules.provider.interfaces.dto.response;

import java.time.OffsetDateTime;

import com.app.venus.modules.provider.application.ProviderVerificationService.VerificationResult;

public record ProviderVerificationResponse(boolean verified, OffsetDateTime verifiedAt, String message) {
    public static ProviderVerificationResponse from(VerificationResult result) {
        return new ProviderVerificationResponse(result.verified(), result.verifiedAt(), result.message());
    }
}
