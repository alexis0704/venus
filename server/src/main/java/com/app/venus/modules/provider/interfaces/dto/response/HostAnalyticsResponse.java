package com.app.venus.modules.provider.interfaces.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import com.app.venus.modules.provider.application.HostAnalyticsService.HostAnalytics;

public record HostAnalyticsResponse(
        List<SummaryMetricResponse> summary,
        List<Integer> revenueSeries,
        List<Integer> weeklyRevenue,
        List<OccupancyRevenueResponse> occupancyRevenue,
        List<TransactionResponse> transactions) {

    public static HostAnalyticsResponse from(HostAnalytics analytics) {
        return new HostAnalyticsResponse(
                analytics.summary().stream()
                        .map(metric -> new SummaryMetricResponse(metric.label(), metric.value(), metric.delta()))
                        .toList(),
                analytics.revenueSeries(),
                analytics.weeklyRevenue(),
                analytics.occupancyRevenue().stream()
                        .map(item -> new OccupancyRevenueResponse(item.day(), item.occupancy(), item.revenue()))
                        .toList(),
                analytics.transactions().stream()
                        .map(item -> new TransactionResponse(
                                item.date(),
                                item.driverName(),
                                item.vehicle(),
                                item.durationHours(),
                                item.amount(),
                                item.status()))
                        .toList());
    }

    public record SummaryMetricResponse(String label, int value, String delta) {
    }

    public record OccupancyRevenueResponse(String day, int occupancy, int revenue) {
    }

    public record TransactionResponse(
            OffsetDateTime date,
            String driverName,
            String vehicle,
            BigDecimal durationHours,
            int amount,
            String status) {
    }
}
