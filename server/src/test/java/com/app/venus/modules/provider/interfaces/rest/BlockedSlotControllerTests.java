package com.app.venus.modules.provider.interfaces.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import com.app.venus.modules.order.infrastructure.OrderRepository;
import com.app.venus.modules.provider.domain.BlockReason;
import com.app.venus.modules.provider.domain.BlockedSlot;
import com.app.venus.modules.provider.domain.Station;
import com.app.venus.modules.provider.infrastructure.BlockedSlotRepository;
import com.app.venus.modules.provider.infrastructure.StationRepository;
import com.app.venus.modules.review.infrastructure.ReviewRepository;
import com.app.venus.modules.user.application.DemoCurrentUserService;
import com.app.venus.modules.user.domain.User;
import com.app.venus.modules.user.infrastructure.UserRepository;
import com.app.venus.modules.vehicle.infrastructure.VehicleRepository;
import com.app.venus.shared.domain.Amenity;
import com.app.venus.shared.domain.ConnectorType;
import com.app.venus.shared.domain.Role;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class BlockedSlotControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BlockedSlotRepository blockedSlotRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    private Station station;

    @BeforeEach
    void setUp() {
        reviewRepository.deleteAll();
        orderRepository.deleteAll();
        blockedSlotRepository.deleteAll();
        vehicleRepository.deleteAll();
        stationRepository.deleteAll();
        User provider = userRepository.findById(DemoCurrentUserService.DEMO_PROVIDER_ID)
                .orElseGet(() -> userRepository.saveAndFlush(new User(
                        DemoCurrentUserService.DEMO_PROVIDER_ID,
                        "Minh Tuan",
                        "p1@volzen.test",
                        Role.PROVIDER,
                        null)));
        station = stationRepository.saveAndFlush(new Station(
                "pvd_block_controller",
                provider,
                "Block Controller Station",
                "12 Nguyen Hue",
                new BigDecimal("10.7769000"),
                new BigDecimal("106.7009000"),
                25000,
                Set.of(ConnectorType.CCS),
                Set.of(Amenity.WIFI),
                List.of(),
                true));
    }

    @Test
    void createsBlockedSlot() throws Exception {
        mockMvc.perform(post("/api/v1/me/station/blocked-slots")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "startTime": "2026-06-29T10:00:00+07:00",
                          "endTime": "2026-06-29T12:00:00+07:00",
                          "reason": "Maintenance"
                        }
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.reason").value("Maintenance"));
    }

    @Test
    void validationConflictAndDeleteWork() throws Exception {
        mockMvc.perform(post("/api/v1/me/station/blocked-slots")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "reason": "Busy" }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"));

        blockedSlotRepository.saveAndFlush(new BlockedSlot(
                "blk_delete_me",
                station,
                java.time.OffsetDateTime.parse("2026-06-29T10:00:00+07:00"),
                java.time.OffsetDateTime.parse("2026-06-29T12:00:00+07:00"),
                BlockReason.BUSY));

        mockMvc.perform(post("/api/v1/me/station/blocked-slots")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "startTime": "2026-06-29T11:00:00+07:00",
                          "endTime": "2026-06-29T13:00:00+07:00",
                          "reason": "Busy"
                        }
                        """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("SLOT_CONFLICT"));

        mockMvc.perform(delete("/api/v1/me/station/blocked-slots/{blockId}", "blk_delete_me"))
                .andExpect(status().isNoContent());
    }

    @Test
    void malformedReasonEnumUsesProductValidationError() throws Exception {
        mockMvc.perform(post("/api/v1/me/station/blocked-slots")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "startTime": "2026-06-29T10:00:00+07:00",
                          "endTime": "2026-06-29T12:00:00+07:00",
                          "reason": "Not A Real Reason"
                        }
                        """))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error").value("UNPROCESSABLE_ENTITY"));
    }
}
