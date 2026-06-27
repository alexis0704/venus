package com.app.venus.modules.provider.application;

import static org.assertj.core.api.Assertions.assertThat;

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
import com.app.venus.modules.provider.domain.Station;
import com.app.venus.modules.provider.infrastructure.BlockedSlotRepository;
import com.app.venus.modules.provider.infrastructure.StationRepository;
import com.app.venus.modules.review.infrastructure.ReviewRepository;
import com.app.venus.modules.user.application.DemoCurrentUserService;
import com.app.venus.modules.user.domain.User;
import com.app.venus.modules.user.infrastructure.UserRepository;
import com.app.venus.modules.vehicle.domain.Vehicle;
import com.app.venus.modules.vehicle.infrastructure.VehicleRepository;
import com.app.venus.shared.domain.Amenity;
import com.app.venus.shared.domain.ConnectorType;
import com.app.venus.shared.domain.OrderStatus;
import com.app.venus.shared.domain.Role;

@SpringBootTest
@Transactional
class HostAnalyticsServiceTests {
    @Autowired
    private HostAnalyticsService hostAnalyticsService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private BlockedSlotRepository blockedSlotRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    private Station station;
    private User driver;
    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        reviewRepository.deleteAll();
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
        driver = userRepository.findById("usr_analytics_driver")
                .orElseGet(() -> userRepository.saveAndFlush(new User(
                        "usr_analytics_driver",
                        "Analytics Driver",
                        "analytics-driver@volzen.test",
                        Role.DRIVER,
                        null)));
        station = stationRepository.saveAndFlush(new Station(
                "pvd_analytics",
                provider,
                "Analytics Station",
                "12 Nguyen Hue",
                new BigDecimal("10.7769000"),
                new BigDecimal("106.7009000"),
                25000,
                Set.of(ConnectorType.CCS),
                Set.of(Amenity.WIFI),
                List.of(),
                true));
        vehicle = vehicleRepository.saveAndFlush(new Vehicle(
                "veh_analytics",
                driver,
                "VinFast",
                "VF8",
                2024,
                ConnectorType.CCS,
                true));
    }

    @Test
    void returnsEmptyAnalyticsShape() {
        var analytics = hostAnalyticsService.analytics(2026);

        assertThat(analytics.summary()).hasSize(4);
        assertThat(analytics.revenueSeries()).hasSize(12).allMatch(value -> value == 0);
        assertThat(analytics.weeklyRevenue()).hasSize(7);
        assertThat(analytics.occupancyRevenue()).hasSize(7);
        assertThat(analytics.transactions()).isEmpty();
    }

    @Test
    void aggregatesCompletedOrdersAndTransactions() {
        orderRepository.save(order("ord_analytics_completed", "2026-06-20T09:00:00+07:00", OrderStatus.COMPLETED, 55000));
        orderRepository.save(order("ord_analytics_pending", "2026-06-21T09:00:00+07:00", OrderStatus.PENDING, 55000));
        orderRepository.flush();

        var analytics = hostAnalyticsService.analytics(2026);

        assertThat(analytics.summary().get(0).value()).isEqualTo(55000);
        assertThat(analytics.revenueSeries().get(5)).isEqualTo(55000);
        assertThat(analytics.transactions()).hasSize(2);
    }

    private Order order(String id, String start, OrderStatus status, int total) {
        return new Order(
                id,
                station,
                vehicle,
                driver,
                OffsetDateTime.parse(start),
                OffsetDateTime.parse(start).plusHours(2),
                new BigDecimal("2.00"),
                25000,
                50000,
                5000,
                total,
                status);
    }
}
