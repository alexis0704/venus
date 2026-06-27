package com.app.venus.modules.provider.interfaces.rest;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class HostAnalyticsControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsHostAnalytics() throws Exception {
        mockMvc.perform(get("/api/v1/me/station/analytics").param("year", "2026"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary", hasSize(4)))
                .andExpect(jsonPath("$.revenueSeries", hasSize(12)))
                .andExpect(jsonPath("$.weeklyRevenue", hasSize(7)))
                .andExpect(jsonPath("$.occupancyRevenue", hasSize(7)));
    }

    @Test
    void invalidYearUsesProductValidationError() throws Exception {
        mockMvc.perform(get("/api/v1/me/station/analytics").param("year", "1999"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"));
    }
}
