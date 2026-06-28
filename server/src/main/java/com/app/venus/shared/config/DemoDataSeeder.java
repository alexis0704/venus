package com.app.venus.shared.config;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.app.venus.modules.order.domain.Order;
import com.app.venus.modules.order.infrastructure.OrderRepository;
import com.app.venus.modules.provider.domain.BlockReason;
import com.app.venus.modules.provider.domain.BlockedSlot;
import com.app.venus.modules.provider.domain.Station;
import com.app.venus.modules.provider.infrastructure.BlockedSlotRepository;
import com.app.venus.modules.provider.infrastructure.StationRepository;
import com.app.venus.modules.review.domain.Review;
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

@Component
@ConditionalOnProperty(name = "app.seed.demo-data", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    public DemoDataSeeder(
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            StationRepository stationRepository,
            BlockedSlotRepository blockedSlotRepository,
            OrderRepository orderRepository,
            ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.stationRepository = stationRepository;
        this.blockedSlotRepository = blockedSlotRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        User driver = user("usr_demo_driver", "Demo Driver", "driver@volzen.test", Role.DRIVER,
                "https://cdn.volzen.vn/avatars/usr_demo_driver.jpg");
        User providerOne = user("usr_provider_p1", "Minh Tuan", "p1@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p1.jpg");
        User providerTwo = user("usr_provider_p2", "Linh Tran", "p2@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p2.jpg");
        User providerThree = user("usr_provider_p3", "An Nguyen", "p3@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p3.jpg");
        User providerFour = user("usr_provider_p4", "Gia Han", "p4@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p4.jpg");
        User providerFive = user("usr_provider_p5", "Bao Chau", "p5@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p5.jpg");
        User providerSix = user("usr_provider_p6", "Quoc Bao", "p6@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p6.jpg");
        User providerSeven = user("usr_provider_p7", "Thao Nguyen", "p7@volzen.test", Role.PROVIDER,
                "https://cdn.volzen.vn/avatars/pvd_p7.jpg");

        Vehicle vehicle = vehicle("veh_demo_vf8", driver, "VinFast", "VF8", 2024, ConnectorType.CCS, true);
        Vehicle typeTwoVehicle = vehicle("veh_demo_model3", driver, "Tesla", "Model 3", 2023, ConnectorType.TYPE_2, false);
        Vehicle chademoVehicle = vehicle("veh_demo_leaf", driver, "Nissan", "Leaf", 2021, ConnectorType.CHADEMO, false);

        Station stationOne = station(
                "pvd_p1",
                providerOne,
                "Nguyen Hue Home Charger",
                "Vinhomes Grand Park, Thu Duc City, Ho Chi Minh City",
                "10.8789000",
                "106.8021000",
                25000,
                Set.of(ConnectorType.CCS, ConnectorType.TYPE_2),
                Set.of(Amenity.COFFEE, Amenity.WIFI, Amenity.PARKING),
                List.of(
                        "/stations/pvd-p1-1.svg",
                        "/stations/pvd-p1-2.svg"),
                true);
        Station stationTwo = station(
                "pvd_p2",
                providerTwo,
                "Le Loi Type 2 Bay",
                "Linh Trung, Thu Duc City, Ho Chi Minh City",
                "10.8725000",
                "106.7974000",
                22000,
                Set.of(ConnectorType.TYPE_2),
                Set.of(Amenity.WIFI, Amenity.RESTROOM),
                List.of("/stations/pvd-p2-1.svg"),
                true);
        Station stationThree = station(
                "pvd_p3",
                providerThree,
                "Thu Duc Fast Charge",
                "Long Binh, Thu Duc City, Ho Chi Minh City",
                "10.8842000",
                "106.8078000",
                30000,
                Set.of(ConnectorType.CCS, ConnectorType.CHADEMO),
                Set.of(Amenity.PARKING, Amenity.SECURITY),
                List.of("/stations/pvd-p3-1.svg"),
                true);
        Station stationFour = station(
                "pvd_p4",
                providerFour,
                "Sala Riverside Charge",
                "Di An, Binh Duong",
                "10.8959000",
                "106.7895000",
                28000,
                Set.of(ConnectorType.CCS, ConnectorType.TYPE_2),
                Set.of(Amenity.COVERED, Amenity.WIFI, Amenity.SECURITY),
                List.of(
                        "/stations/pvd-p4-1.svg",
                        "/stations/pvd-p4-2.svg"),
                true);
        Station stationFive = station(
                "pvd_p5",
                providerFive,
                "Binh Thanh Garden Charger",
                "Phu Huu, Thu Duc City, Ho Chi Minh City",
                "10.8618000",
                "106.8136000",
                24000,
                Set.of(ConnectorType.TYPE_2),
                Set.of(Amenity.PARKING, Amenity.COFFEE, Amenity.RESTROOM),
                List.of("/stations/pvd-p5-1.svg"),
                true);
        Station stationSix = station(
                "pvd_p6",
                providerSix,
                "District 7 Solar Bay",
                "Tan Dong Hiep, Di An, Binh Duong",
                "10.9125000",
                "106.8027000",
                26000,
                Set.of(ConnectorType.CCS),
                Set.of(Amenity.COVERED, Amenity.SNACKS, Amenity.WIFI),
                List.of("/stations/pvd-p6-1.svg"),
                true);
        Station stationSeven = station(
                "pvd_p7",
                providerSeven,
                "Tan Binh Night Charge",
                "Phuoc Long B, Thu Duc City, Ho Chi Minh City",
                "10.8309000",
                "106.8242000",
                21000,
                Set.of(ConnectorType.TYPE_2, ConnectorType.CHADEMO),
                Set.of(Amenity.RESTROOM, Amenity.SECURITY, Amenity.PARKING),
                List.of("/stations/pvd-p7-1.svg"),
                false);

        Order confirmed = order(
                "ord_demo_confirmed",
                stationOne,
                vehicle,
                driver,
                "2026-06-28T09:00:00+07:00",
                "2026-06-28T11:00:00+07:00",
                25000,
                OrderStatus.CONFIRMED);
        order(
                "ord_demo_pending_host_action",
                stationOne,
                typeTwoVehicle,
                driver,
                "2026-06-28T14:00:00+07:00",
                "2026-06-28T15:00:00+07:00",
                25000,
                OrderStatus.PENDING);
        order(
                "ord_demo_active_calendar",
                stationOne,
                vehicle,
                driver,
                "2026-06-28T16:00:00+07:00",
                "2026-06-28T17:30:00+07:00",
                25000,
                OrderStatus.ACTIVE);
        Order completedOne = order(
                "ord_demo_completed_1",
                stationOne,
                vehicle,
                driver,
                "2026-06-20T09:00:00+07:00",
                "2026-06-20T11:00:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_completed_january",
                stationOne,
                vehicle,
                driver,
                "2026-01-15T08:00:00+07:00",
                "2026-01-15T10:00:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_completed_february",
                stationOne,
                typeTwoVehicle,
                driver,
                "2026-02-12T13:00:00+07:00",
                "2026-02-12T14:30:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_completed_march",
                stationOne,
                vehicle,
                driver,
                "2026-03-18T18:00:00+07:00",
                "2026-03-18T20:00:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_completed_april",
                stationOne,
                typeTwoVehicle,
                driver,
                "2026-04-09T07:30:00+07:00",
                "2026-04-09T09:00:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_completed_may",
                stationOne,
                vehicle,
                driver,
                "2026-05-23T11:00:00+07:00",
                "2026-05-23T12:00:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_completed_weekday",
                stationOne,
                typeTwoVehicle,
                driver,
                "2026-06-24T12:00:00+07:00",
                "2026-06-24T13:30:00+07:00",
                25000,
                OrderStatus.COMPLETED);
        Order completedTwo = order(
                "ord_demo_completed_2",
                stationThree,
                vehicle,
                driver,
                "2026-06-21T14:00:00+07:00",
                "2026-06-21T15:30:00+07:00",
                30000,
                OrderStatus.COMPLETED);
        order(
                "ord_demo_reviewable",
                stationTwo,
                typeTwoVehicle,
                driver,
                "2026-06-22T16:00:00+07:00",
                "2026-06-22T17:00:00+07:00",
                22000,
                OrderStatus.COMPLETED);
        Order completedThree = order(
                "ord_demo_completed_3",
                stationFour,
                typeTwoVehicle,
                driver,
                "2026-06-25T17:00:00+07:00",
                "2026-06-25T19:00:00+07:00",
                28000,
                OrderStatus.COMPLETED);
        Order completedFour = order(
                "ord_demo_completed_4",
                stationFive,
                typeTwoVehicle,
                driver,
                "2026-06-26T08:00:00+07:00",
                "2026-06-26T09:30:00+07:00",
                24000,
                OrderStatus.COMPLETED);
        Order completedFive = order(
                "ord_demo_completed_5",
                stationSix,
                vehicle,
                driver,
                "2026-06-27T19:00:00+07:00",
                "2026-06-27T20:30:00+07:00",
                26000,
                OrderStatus.COMPLETED);

        /* ═══════════════════════════════════════════════════════
           ADDITIONAL ORDERS — fill 12-month revenue, this week,
           all stations, all statuses
           ═══════════════════════════════════════════════════════ */

        /* ── 2025 orders (1 per month, for year-selection) ── */
        order("ord_2025_jan", stationOne, vehicle, driver,
                "2025-01-12T08:00:00+07:00", "2025-01-12T10:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_feb", stationOne, typeTwoVehicle, driver,
                "2025-02-18T14:00:00+07:00", "2025-02-18T16:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_mar", stationOne, vehicle, driver,
                "2025-03-05T09:00:00+07:00", "2025-03-05T11:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_apr", stationOne, typeTwoVehicle, driver,
                "2025-04-20T16:00:00+07:00", "2025-04-20T17:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_may", stationOne, vehicle, driver,
                "2025-05-10T07:00:00+07:00", "2025-05-10T09:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_jun", stationOne, typeTwoVehicle, driver,
                "2025-06-15T12:00:00+07:00", "2025-06-15T13:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_jul", stationOne, vehicle, driver,
                "2025-07-04T10:00:00+07:00", "2025-07-04T12:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_aug", stationOne, typeTwoVehicle, driver,
                "2025-08-22T15:00:00+07:00", "2025-08-22T17:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_sep", stationOne, vehicle, driver,
                "2025-09-13T08:00:00+07:00", "2025-09-13T10:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_oct", stationOne, typeTwoVehicle, driver,
                "2025-10-31T14:00:00+07:00", "2025-10-31T15:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_nov", stationOne, vehicle, driver,
                "2025-11-08T09:00:00+07:00", "2025-11-08T11:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_2025_dec", stationOne, typeTwoVehicle, driver,
                "2025-12-25T16:00:00+07:00", "2025-12-25T18:00:00+07:00", 25000, OrderStatus.COMPLETED);

        /* ── 2026 H2 orders (Jul-Dec) for 12-month revenue chart ── */
        order("ord_p1_jul_a", stationOne, vehicle, driver,
                "2026-07-08T09:00:00+07:00", "2026-07-08T11:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_jul_b", stationOne, typeTwoVehicle, driver,
                "2026-07-16T14:00:00+07:00", "2026-07-16T16:00:00+07:00", 30000, OrderStatus.COMPLETED);
        order("ord_p1_jul_c", stationOne, vehicle, driver,
                "2026-07-25T18:00:00+07:00", "2026-07-25T19:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_aug_a", stationOne, typeTwoVehicle, driver,
                "2026-08-05T08:00:00+07:00", "2026-08-05T10:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_aug_b", stationOne, vehicle, driver,
                "2026-08-14T12:00:00+07:00", "2026-08-14T14:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_aug_c", stationOne, typeTwoVehicle, driver,
                "2026-08-28T16:00:00+07:00", "2026-08-28T18:00:00+07:00", 30000, OrderStatus.COMPLETED);
        order("ord_p1_sep_a", stationOne, vehicle, driver,
                "2026-09-10T07:00:00+07:00", "2026-09-10T09:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_sep_b", stationOne, typeTwoVehicle, driver,
                "2026-09-22T15:00:00+07:00", "2026-09-22T17:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_oct_a", stationOne, vehicle, driver,
                "2026-10-03T10:00:00+07:00", "2026-10-03T12:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_oct_b", stationOne, typeTwoVehicle, driver,
                "2026-10-19T14:00:00+07:00", "2026-10-19T16:00:00+07:00", 30000, OrderStatus.COMPLETED);
        order("ord_p1_oct_c", stationOne, vehicle, driver,
                "2026-10-29T18:00:00+07:00", "2026-10-29T19:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_nov_a", stationOne, typeTwoVehicle, driver,
                "2026-11-07T08:00:00+07:00", "2026-11-07T10:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_nov_b", stationOne, vehicle, driver,
                "2026-11-21T13:00:00+07:00", "2026-11-21T15:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_dec_a", stationOne, typeTwoVehicle, driver,
                "2026-12-05T09:00:00+07:00", "2026-12-05T11:00:00+07:00", 30000, OrderStatus.COMPLETED);
        order("ord_p1_dec_b", stationOne, vehicle, driver,
                "2026-12-18T14:00:00+07:00", "2026-12-18T16:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_dec_c", stationOne, typeTwoVehicle, driver,
                "2026-12-26T17:00:00+07:00", "2026-12-26T19:00:00+07:00", 25000, OrderStatus.COMPLETED);

        /* ── This week (Jun 22-28) — fill every day for weeklyRevenue ── */
        // Monday Jun 22
        order("ord_p1_mon_a", stationOne, vehicle, driver,
                "2026-06-22T08:00:00+07:00", "2026-06-22T09:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_mon_b", stationOne, typeTwoVehicle, driver,
                "2026-06-22T14:00:00+07:00", "2026-06-22T16:00:00+07:00", 25000, OrderStatus.COMPLETED);
        // Tuesday Jun 23
        order("ord_p1_tue_a", stationOne, vehicle, driver,
                "2026-06-23T07:00:00+07:00", "2026-06-23T09:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_tue_b", stationOne, typeTwoVehicle, driver,
                "2026-06-23T12:00:00+07:00", "2026-06-23T13:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_tue_c", stationOne, vehicle, driver,
                "2026-06-23T17:00:00+07:00", "2026-06-23T18:30:00+07:00", 30000, OrderStatus.COMPLETED);
        // Wednesday Jun 24 — already have 2, add 1 more
        order("ord_p1_wed_c", stationOne, typeTwoVehicle, driver,
                "2026-06-24T08:00:00+07:00", "2026-06-24T10:00:00+07:00", 25000, OrderStatus.COMPLETED);
        // Thursday Jun 25
        order("ord_p1_thu_a", stationOne, vehicle, driver,
                "2026-06-25T08:00:00+07:00", "2026-06-25T09:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_thu_b", stationOne, typeTwoVehicle, driver,
                "2026-06-25T13:00:00+07:00", "2026-06-25T15:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_thu_c", stationOne, vehicle, driver,
                "2026-06-25T18:00:00+07:00", "2026-06-25T19:00:00+07:00", 25000, OrderStatus.COMPLETED);
        // Friday Jun 26 — already have cancelled order, add completed
        order("ord_p1_fri_a", stationOne, typeTwoVehicle, driver,
                "2026-06-26T08:00:00+07:00", "2026-06-26T10:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_fri_b", stationOne, vehicle, driver,
                "2026-06-26T11:00:00+07:00", "2026-06-26T12:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_fri_c", stationOne, typeTwoVehicle, driver,
                "2026-06-26T14:00:00+07:00", "2026-06-26T15:30:00+07:00", 30000, OrderStatus.COMPLETED);
        // Saturday Jun 27 — already have 1, add 2 more
        order("ord_p1_sat_b", stationOne, vehicle, driver,
                "2026-06-27T08:00:00+07:00", "2026-06-27T10:00:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_sat_c", stationOne, typeTwoVehicle, driver,
                "2026-06-27T14:00:00+07:00", "2026-06-27T16:00:00+07:00", 30000, OrderStatus.COMPLETED);
        // Sunday Jun 28 today — already have 1, add 2 more
        order("ord_p1_sun_b", stationOne, vehicle, driver,
                "2026-06-28T08:00:00+07:00", "2026-06-28T09:30:00+07:00", 25000, OrderStatus.COMPLETED);
        order("ord_p1_sun_c", stationOne, typeTwoVehicle, driver,
                "2026-06-28T10:00:00+07:00", "2026-06-28T11:00:00+07:00", 25000, OrderStatus.COMPLETED);

        // Pending order today — shows in booking timeline
        order("ord_p1_pending_lunch", stationOne, vehicle, driver,
                "2026-06-28T12:00:00+07:00", "2026-06-28T13:00:00+07:00", 25000, OrderStatus.PENDING);
        // Active order today — shows in booking timeline
        order("ord_p1_active_evening", stationOne, typeTwoVehicle, driver,
                "2026-06-28T18:00:00+07:00", "2026-06-28T19:30:00+07:00", 25000, OrderStatus.ACTIVE);
        // Cancelled order
        order("ord_p1_cancelled", stationOne, vehicle, driver,
                "2026-06-26T16:00:00+07:00", "2026-06-26T17:00:00+07:00", 25000, OrderStatus.CANCELLED);

        /* ── More orders at stationTwo and stationThree ── */
        order("ord_p2_completed_a", stationTwo, typeTwoVehicle, driver,
                "2026-06-25T10:00:00+07:00", "2026-06-25T11:00:00+07:00", 22000, OrderStatus.COMPLETED);
        order("ord_p2_completed_b", stationTwo, typeTwoVehicle, driver,
                "2026-06-20T14:00:00+07:00", "2026-06-20T15:30:00+07:00", 22000, OrderStatus.COMPLETED);
        order("ord_p2_completed_c", stationTwo, typeTwoVehicle, driver,
                "2026-06-15T09:00:00+07:00", "2026-06-15T11:00:00+07:00", 22000, OrderStatus.COMPLETED);
        order("ord_p2_completed_d", stationTwo, typeTwoVehicle, driver,
                "2026-06-10T16:00:00+07:00", "2026-06-10T17:00:00+07:00", 22000, OrderStatus.COMPLETED);
        order("ord_p2_completed_e", stationTwo, typeTwoVehicle, driver,
                "2026-05-28T12:00:00+07:00", "2026-05-28T14:00:00+07:00", 22000, OrderStatus.COMPLETED);
        order("ord_p2_pending", stationTwo, typeTwoVehicle, driver,
                "2026-06-28T16:00:00+07:00", "2026-06-28T17:00:00+07:00", 22000, OrderStatus.PENDING);
        order("ord_p3_completed_a", stationThree, vehicle, driver,
                "2026-06-26T09:00:00+07:00", "2026-06-26T10:30:00+07:00", 30000, OrderStatus.COMPLETED);
        order("ord_p3_completed_b", stationThree, vehicle, driver,
                "2026-06-18T14:00:00+07:00", "2026-06-18T16:00:00+07:00", 30000, OrderStatus.COMPLETED);
        order("ord_p3_completed_c", stationThree, vehicle, driver,
                "2026-06-05T08:00:00+07:00", "2026-06-05T10:00:00+07:00", 30000, OrderStatus.COMPLETED);

        /* ── Upcoming confirmed orders ── */
        order("ord_p1_upcoming_tomorrow", stationOne, vehicle, driver,
                "2026-06-29T08:00:00+07:00", "2026-06-29T09:30:00+07:00", 25000, OrderStatus.CONFIRMED);
        order("ord_p1_upcoming_lunch", stationOne, typeTwoVehicle, driver,
                "2026-06-29T12:00:00+07:00", "2026-06-29T13:30:00+07:00", 25000, OrderStatus.CONFIRMED);
        order("ord_demo_upcoming", stationTwo, typeTwoVehicle, driver,
                "2026-06-29T13:00:00+07:00", "2026-06-29T14:00:00+07:00", 22000, OrderStatus.CONFIRMED);
        order("ord_p3_upcoming", stationThree, vehicle, driver,
                "2026-06-30T10:00:00+07:00", "2026-06-30T12:00:00+07:00", 30000, OrderStatus.CONFIRMED);
        order("ord_demo_p4_pending", stationFour, typeTwoVehicle, driver,
                "2026-06-29T18:00:00+07:00", "2026-06-29T19:30:00+07:00", 28000, OrderStatus.PENDING);
        order("ord_demo_p6_confirmed", stationSix, vehicle, driver,
                "2026-06-30T07:00:00+07:00", "2026-06-30T08:30:00+07:00", 26000, OrderStatus.CONFIRMED);
        order("ord_demo_p7_completed", stationSeven, chademoVehicle, driver,
                "2026-06-18T21:00:00+07:00", "2026-06-18T22:00:00+07:00", 21000, OrderStatus.COMPLETED);

        /* ═══════════════════════════════════════════════════════
           REVIEWS
           ═══════════════════════════════════════════════════════ */
        review("rev_demo_p1", completedOne, stationOne, driver, 5, "Great host, fast charger, highly recommend.");
        review("rev_demo_p3", completedTwo, stationThree, driver, 4, "Easy to find and reliable charging.");
        review("rev_demo_p4", completedThree, stationFour, driver, 5, "Clean parking bay and smooth check-in.");
        review("rev_demo_p5", completedFour, stationFive, driver, 4, "Nice waiting area with coffee nearby.");
        review("rev_demo_p6", completedFive, stationSix, driver, 5, "Good evening slot and stable CCS charger.");
        review("rev_p1_extra_1", orderRepository.findById("ord_p1_sun_c").orElseThrow(), stationOne, driver, 5, "Smooth charging — will come back.");
        review("rev_p1_extra_2", orderRepository.findById("ord_p1_sat_b").orElseThrow(), stationOne, driver, 4, "Convenient location and fast response.");
        review("rev_p1_extra_3", orderRepository.findById("ord_p1_mon_a").orElseThrow(), stationOne, driver, 5, "Best charging spot in the area.");
        review("rev_p1_extra_4", orderRepository.findById("ord_p1_tue_a").orElseThrow(), stationOne, driver, 3, "Good but charger was a bit slow.");
        review("rev_p1_extra_5", orderRepository.findById("ord_2025_jun").orElseThrow(), stationOne, driver, 5, "Reliable as always.");
        review("rev_p2_1", orderRepository.findById("ord_p2_completed_a").orElseThrow(), stationTwo, driver, 4, "Clean and well maintained.");
        review("rev_p2_2", orderRepository.findById("ord_p2_completed_b").orElseThrow(), stationTwo, driver, 5, "Amazing backyard setup!");

        /* ═══════════════════════════════════════════════════════
           BLOCKED SLOTS
           ═══════════════════════════════════════════════════════ */
        blockedSlot("blk_demo_p1_maintenance", stationOne,
                "2026-06-29T10:00:00+07:00", "2026-06-29T12:00:00+07:00", BlockReason.MAINTENANCE);
        blockedSlot("blk_demo_p1_busy", stationOne,
                "2026-06-30T08:00:00+07:00", "2026-06-30T09:30:00+07:00", BlockReason.BUSY);
        blockedSlot("blk_demo_p1_personal", stationOne,
                "2026-07-01T14:00:00+07:00", "2026-07-01T16:00:00+07:00", BlockReason.PERSONAL);
        blockedSlot("blk_p1_holiday", stationOne,
                "2026-07-02T00:00:00+07:00", "2026-07-02T23:59:00+07:00", BlockReason.PERSONAL);
        blockedSlot("blk_p1_weekend", stationOne,
                "2026-07-04T08:00:00+07:00", "2026-07-04T12:00:00+07:00", BlockReason.OTHER);
        blockedSlot("blk_demo_p2_other", stationTwo,
                "2026-06-29T13:00:00+07:00", "2026-06-29T14:30:00+07:00", BlockReason.OTHER);
        blockedSlot(
                "blk_demo_p4_personal",
                stationFour,
                "2026-06-30T12:00:00+07:00",
                "2026-06-30T14:00:00+07:00",
                BlockReason.PERSONAL);
        blockedSlot(
                "blk_demo_p5_busy",
                stationFive,
                "2026-06-28T18:00:00+07:00",
                "2026-06-28T20:00:00+07:00",
                BlockReason.BUSY);

        orderRepository.save(confirmed);
    }

    private User user(String id, String name, String email, Role role, String avatarUrl) {
        return userRepository.findById(id)
                .orElseGet(() -> userRepository.save(new User(id, name, email, role, avatarUrl)));
    }

    private Vehicle vehicle(
            String id,
            User driver,
            String brand,
            String model,
            int year,
            ConnectorType connectorType,
            boolean defaultVehicle) {
        return vehicleRepository.findById(id)
                .orElseGet(() -> vehicleRepository.save(new Vehicle(
                        id,
                        driver,
                        brand,
                        model,
                        year,
                        connectorType,
                        defaultVehicle)));
    }

    private Station station(
            String id,
            User provider,
            String name,
            String address,
            String lat,
            String lng,
            int pricePerHour,
            Set<ConnectorType> connectorTypes,
            Set<Amenity> amenities,
            List<String> photoUrls,
            boolean available) {
        Station existing = stationRepository.findById(id)
                .orElse(null);

        if (existing != null) {
            existing.update(
                    name,
                    address,
                    new BigDecimal(lat),
                    new BigDecimal(lng),
                    pricePerHour,
                    connectorTypes,
                    amenities,
                    photoUrls,
                    available);
            return stationRepository.save(existing);
        }

        return stationRepository.save(new Station(
                        id,
                        provider,
                        name,
                        address,
                        new BigDecimal(lat),
                        new BigDecimal(lng),
                        pricePerHour,
                        connectorTypes,
                        amenities,
                        photoUrls,
                        available));
    }

    private Order order(
            String id,
            Station station,
            Vehicle vehicle,
            User driver,
            String start,
            String end,
            int pricePerHour,
            OrderStatus status) {
        return orderRepository.findById(id)
                .orElseGet(() -> orderRepository.save(new Order(
                        id,
                        station,
                        vehicle,
                        driver,
                        OffsetDateTime.parse(start),
                        OffsetDateTime.parse(end),
                        duration(start, end),
                        pricePerHour,
                        subtotal(start, end, pricePerHour),
                        serviceFee(start, end, pricePerHour),
                        subtotal(start, end, pricePerHour) + serviceFee(start, end, pricePerHour),
                        status)));
    }

    private void review(String id, Order order, Station station, User author, int rating, String comment) {
        if (reviewRepository.existsById(id)) {
            return;
        }
        reviewRepository.save(new Review(id, order, station, author, rating, comment));
    }

    private void blockedSlot(String id, Station station, String start, String end, BlockReason reason) {
        if (blockedSlotRepository.existsById(id)) {
            return;
        }
        blockedSlotRepository.save(new BlockedSlot(
                id,
                station,
                OffsetDateTime.parse(start),
                OffsetDateTime.parse(end),
                reason));
    }

    private BigDecimal duration(String start, String end) {
        long minutes = java.time.Duration.between(OffsetDateTime.parse(start), OffsetDateTime.parse(end)).toMinutes();
        return new BigDecimal(minutes).divide(new BigDecimal("60"), 2, java.math.RoundingMode.HALF_UP);
    }

    private int subtotal(String start, String end, int pricePerHour) {
        return duration(start, end)
                .multiply(new BigDecimal(pricePerHour))
                .setScale(0, java.math.RoundingMode.HALF_UP)
                .intValueExact();
    }

    private int serviceFee(String start, String end, int pricePerHour) {
        return new BigDecimal(subtotal(start, end, pricePerHour))
                .multiply(new BigDecimal("0.10"))
                .setScale(0, java.math.RoundingMode.HALF_UP)
                .intValueExact();
    }
}
