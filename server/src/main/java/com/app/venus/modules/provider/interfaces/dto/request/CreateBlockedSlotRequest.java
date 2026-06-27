package com.app.venus.modules.provider.interfaces.dto.request;

import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBlockedSlotRequest(
        @NotNull(message = "Start time is required.") OffsetDateTime startTime,
        @NotNull(message = "End time is required.") OffsetDateTime endTime,
        @NotBlank(message = "Reason is required.") String reason) {
}
