package com.app.venus.modules.provider.application;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.venus.modules.order.domain.Order;
import com.app.venus.modules.order.infrastructure.OrderRepository;
import com.app.venus.modules.user.application.DemoCurrentUserService;
import com.app.venus.shared.domain.OrderStatus;

@Service
public class HostAnalyticsService {
    private static final ZoneOffset BUSINESS_OFFSET = ZoneOffset.ofHours(7);

    private final OrderRepository orderRepository;
    private final DemoCurrentUserService currentUserService;

    public HostAnalyticsService(OrderRepository orderRepository, DemoCurrentUserService currentUserService) {
        this.orderRepository = orderRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public HostAnalytics analytics(Integer year) {
        int targetYear = year == null ? LocalDate.now(BUSINESS_OFFSET).getYear() : year;
        List<Order> orders = orderRepository.findByProviderStationProviderIdOrderByStartTimeAsc(currentUserService.currentProviderId());
        List<Order> completed = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                .toList();
        LocalDate today = LocalDate.now(BUSINESS_OFFSET);
        LocalDate monthStart = today.withDayOfMonth(1);
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));

        int totalRevenue = sum(completed);
        int monthRevenue = sum(completed.stream().filter(order -> !localDate(order).isBefore(monthStart)).toList());
        int pendingPayout = sum(completed.stream().filter(order -> !localDate(order).isBefore(weekStart)).toList());
        long completedSessions = completed.size();

        List<SummaryMetric> summary = List.of(
                new SummaryMetric("Total Revenue", totalRevenue, null),
                new SummaryMetric("Revenue This Month", monthRevenue, null),
                new SummaryMetric("Pending Payout", pendingPayout, null),
                new SummaryMetric("Completed Sessions", Math.toIntExact(completedSessions), null));

        List<Integer> revenueSeries = java.util.stream.IntStream.rangeClosed(1, 12)
                .map(month -> sum(completed.stream()
                        .filter(order -> localDate(order).getYear() == targetYear)
                        .filter(order -> localDate(order).getMonthValue() == month)
                        .toList()))
                .boxed()
                .toList();

        List<Integer> weeklyRevenue = java.util.stream.IntStream.range(0, 7)
                .mapToObj(weekStart::plusDays)
                .map(day -> sum(completed.stream().filter(order -> localDate(order).isEqual(day)).toList()))
                .toList();

        List<OccupancyRevenue> occupancyRevenue = java.util.stream.IntStream.range(0, 7)
                .mapToObj(weekStart::plusDays)
                .map(day -> {
                    List<Order> dayOrders = orders.stream().filter(order -> localDate(order).isEqual(day)).toList();
                    int revenue = sum(dayOrders.stream().filter(order -> order.getStatus() == OrderStatus.COMPLETED).toList());
                    int occupancy = Math.min(100, dayOrders.size() * 20);
                    return new OccupancyRevenue(day.getDayOfWeek().name().substring(0, 3).toLowerCase(Locale.ROOT), occupancy, revenue);
                })
                .toList();

        List<Transaction> transactions = orders.stream()
                .filter(order -> order.getStatus() == OrderStatus.COMPLETED || order.getStatus() == OrderStatus.PENDING)
                .sorted(Comparator.comparing(Order::getStartTime).reversed())
                .limit(10)
                .map(order -> new Transaction(
                        order.getStartTime(),
                        order.getDriver().getFullName(),
                        order.getVehicle().getBrand() + " " + order.getVehicle().getModel(),
                        order.getDurationHours(),
                        order.getTotal(),
                        order.getStatus().getValue()))
                .toList();

        return new HostAnalytics(summary, revenueSeries, weeklyRevenue, occupancyRevenue, transactions);
    }

    private int sum(List<Order> orders) {
        return orders.stream().mapToInt(Order::getTotal).sum();
    }

    private LocalDate localDate(Order order) {
        return order.getStartTime().withOffsetSameInstant(BUSINESS_OFFSET).toLocalDate();
    }

    public record HostAnalytics(
            List<SummaryMetric> summary,
            List<Integer> revenueSeries,
            List<Integer> weeklyRevenue,
            List<OccupancyRevenue> occupancyRevenue,
            List<Transaction> transactions) {
    }

    public record SummaryMetric(String label, int value, String delta) {
    }

    public record OccupancyRevenue(String day, int occupancy, int revenue) {
    }

    public record Transaction(
            OffsetDateTime date,
            String driverName,
            String vehicle,
            java.math.BigDecimal durationHours,
            int amount,
            String status) {
    }
}
