package com.app.venus.modules.provider.application;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.venus.shared.exception.UnprocessableEntityException;

@Service
public class ProviderVerificationService {
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "application/pdf");

    public VerificationResult verifyLicence(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new UnprocessableEntityException("Licence file is required.");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new UnprocessableEntityException("Licence file must be a JPG, PNG, or PDF.");
        }
        boolean manualReview = file.getOriginalFilename() != null
                && file.getOriginalFilename().toLowerCase(java.util.Locale.ROOT).contains("review");
        return new VerificationResult(
                !manualReview,
                manualReview ? null : OffsetDateTime.now(ZoneOffset.ofHours(7)),
                manualReview ? "Document submitted for manual review. You will be notified within 24 hours." : null);
    }

    public record VerificationResult(boolean verified, OffsetDateTime verifiedAt, String message) {
    }
}
