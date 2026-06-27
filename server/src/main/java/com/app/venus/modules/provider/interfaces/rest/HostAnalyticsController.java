package com.app.venus.modules.provider.interfaces.rest;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.venus.modules.provider.application.HostAnalyticsService;
import com.app.venus.modules.provider.interfaces.dto.response.HostAnalyticsResponse;
import com.app.venus.shared.web.ApiPaths;

import jakarta.validation.constraints.Min;

@Validated
@RestController
public class HostAnalyticsController {
    private final HostAnalyticsService hostAnalyticsService;

    public HostAnalyticsController(HostAnalyticsService hostAnalyticsService) {
        this.hostAnalyticsService = hostAnalyticsService;
    }

    @GetMapping(ApiPaths.API_V1 + "/me/station/analytics")
    public HostAnalyticsResponse getAnalytics(@RequestParam(required = false) @Min(2000) Integer year) {
        return HostAnalyticsResponse.from(hostAnalyticsService.analytics(year));
    }
}
