package com.app.venus.modules.provider.interfaces.rest;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.app.venus.modules.provider.application.BlockedSlotService;
import com.app.venus.modules.provider.interfaces.dto.request.CreateBlockedSlotRequest;
import com.app.venus.modules.provider.interfaces.dto.response.BlockedSlotResponse;
import com.app.venus.shared.web.ApiPaths;

import jakarta.validation.Valid;

@RestController
public class BlockedSlotController {
    private final BlockedSlotService blockedSlotService;

    public BlockedSlotController(BlockedSlotService blockedSlotService) {
        this.blockedSlotService = blockedSlotService;
    }

    @GetMapping(ApiPaths.API_V1 + "/me/station/spots")
    public List<BlockedSlotResponse> getCurrentProviderSpots() {
        return blockedSlotService.getCurrentProviderSpotsResponse();
    }

    @PostMapping(ApiPaths.API_V1 + "/me/station/blocked-slots")
    @ResponseStatus(HttpStatus.CREATED)
    public BlockedSlotResponse createBlockedSlot(@Valid @RequestBody CreateBlockedSlotRequest request) {
        return BlockedSlotResponse.from(blockedSlotService.createBlockedSlot(request));
    }

    @DeleteMapping(ApiPaths.API_V1 + "/me/station/blocked-slots/{blockId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBlockedSlot(@PathVariable String blockId) {
        blockedSlotService.deleteBlockedSlot(blockId);
    }
}
