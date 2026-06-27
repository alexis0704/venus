package com.app.venus.modules.provider.interfaces.dto.response;

import java.time.OffsetDateTime;

import com.app.venus.modules.provider.domain.BlockedSlot;

public record BlockedSlotResponse(
        String id,
        OffsetDateTime startTime,
        OffsetDateTime endTime,
        String reason) {

    public static BlockedSlotResponse from(BlockedSlot blockedSlot) {
        return new BlockedSlotResponse(
                blockedSlot.getId(),
                blockedSlot.getStartTime(),
                blockedSlot.getEndTime(),
                blockedSlot.getReason().getValue());
    }
}
