package com.app.venus.modules.provider.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.app.venus.modules.order.domain.Order;
import com.app.venus.modules.order.infrastructure.OrderRepository;
import com.app.venus.modules.provider.domain.BlockReason;
import com.app.venus.modules.provider.domain.BlockedSlot;
import com.app.venus.modules.provider.domain.Station;
import com.app.venus.modules.provider.infrastructure.BlockedSlotRepository;
import com.app.venus.modules.provider.infrastructure.StationRepository;
import com.app.venus.modules.provider.interfaces.dto.request.CreateBlockedSlotRequest;
import com.app.venus.modules.user.application.DemoCurrentUserService;
import com.app.venus.modules.user.domain.User;
import com.app.venus.modules.user.infrastructure.UserRepository;
import com.app.venus.modules.vehicle.domain.Vehicle;
import com.app.venus.modules.vehicle.infrastructure.VehicleRepository;
import com.app.venus.shared.domain.Amenity;
import com.app.venus.shared.domain.ConnectorType;
import com.app.venus.shared.domain.OrderStatus;
import com.app.venus.shared.domain.Role;
import com.app.venus.shared.exception.ConflictException;
import com.app.venus.shared.exception.NotFoundException;
import com.app.venus.shared.exception.UnprocessableEntityException;

@SpringBootTest
@Transactional
class BlockedSlotServiceTests {
    @Autowired
    private BlockedSlotService blockedSlotService;

    @Autowired
    private BlockedSlotRepository blockedSlotRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    private Station station;
    private Vehicle vehicle;
    private User driver;

    @BeforeEach
    void setUp() {
        blockedSlotRepository.deleteAll();
        orderRepository.deleteAll();
        vehicleRepository.deleteAll();
        stationRepository.deleteAll();

        User provider = userRepository.findById(DemoCurrentUserService.DEMO_PROVIDER_ID)
                .orElseGet(() -> userRepository.saveAndFlush(new User(
                        DemoCurrentUserService.DEMO_PROVIDER_ID,
                        "Minh Tuan",
                        "p1@volzen.test",
                        Role.PROVIDER,
                        null)));
        driver = userRepository.findById("usr_block_service_driver")
                .orElseGet(() -> userRepository.saveAndFlush(new User(
                        "usr_block_service_driver",
                        "Block Driver",
                        "block-driver@volzen.test",
                        Role.DRIVER,
                        null)));
        station = stationRepository.saveAndFlush(station(provider));
        vehicle = vehicleRepository.saveAndFlush(new Vehicle(
                "veh_block_service",
                driver,
                "VinFast",
                "VF8",
                2024,
                ConnectorType.CCS,
                true));
    }

    @Test
    void createsAndDeletesBlockedSlot() {
        BlockedSlot blockedSlot = blockedSlotService.createBlockedSlot(request("2026-06-29T10:00:00+07:00", "2026-06-29T12:00:00+07:00"));

        assertThat(blockedSlot.getId()).startsWith("blk_");
        assertThat(blockedSlot.getReason()).isEqualTo(BlockReason.MAINTENANCE);

        blockedSlotService.deleteBlockedSlot(blockedSlot.getId());

        assertThat(blockedSlotRepository.findById(blockedSlot.getId())).isEmpty();
    }

    @Test
    void rejectsInvalidRangeAndOverlaps() {
        assertThatThrownBy(() -> blockedSlotService.createBlockedSlot(request("2026-06-29T12:00:00+07:00", "2026-06-29T10:00:00+07:00")))
                .isInstanceOf(UnprocessableEntityException.class);

        blockedSlotRepository.saveAndFlush(new BlockedSlot(
                "blk_existing",
                station,
                OffsetDateTime.parse("2026-06-29T10:00:00+07:00"),
                OffsetDateTime.parse("2026-06-29T12:00:00+07:00"),
                BlockReason.BUSY));

        assertThatThrownBy(() -> blockedSlotService.createBlockedSlot(request("2026-06-29T11:00:00+07:00", "2026-06-29T13:00:00+07:00")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void rejectsOverlapWithBlockingOrderAndUnknownDelete() {
        orderRepository.saveAndFlush(new Order(
                "ord_block_conflict",
                station,
                vehicle,
                driver,
                OffsetDateTime.parse("2026-06-29T10:00:00+07:00"),
                OffsetDateTime.parse("2026-06-29T12:00:00+07:00"),
                new BigDecimal("2.00"),
                25000,
                50000,
                5000,
                55000,
                OrderStatus.CONFIRMED));

        assertThatThrownBy(() -> blockedSlotService.createBlockedSlot(request("2026-06-29T11:00:00+07:00", "2026-06-29T13:00:00+07:00")))
                .isInstanceOf(ConflictException.class);
        assertThatThrownBy(() -> blockedSlotService.deleteBlockedSlot("blk_missing"))
                .isInstanceOf(NotFoundException.class);
    }

    private CreateBlockedSlotRequest request(String start, String end) {
        return new CreateBlockedSlotRequest(OffsetDateTime.parse(start), OffsetDateTime.parse(end), "Maintenance");
    }

    private Station station(User provider) {
        return new Station(
                "pvd_block_service",
                provider,
                "Block Service Station",
                "12 Nguyen Hue",
                new BigDecimal("10.7769000"),
                new BigDecimal("106.7009000"),
                25000,
                Set.of(ConnectorType.CCS),
                Set.of(Amenity.WIFI),
                List.of(),
                true);
    }
}
