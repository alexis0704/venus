package com.app.venus.modules.review.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.venus.modules.provider.application.HostStationService;
import com.app.venus.modules.provider.domain.Station;
import com.app.venus.modules.review.domain.Review;
import com.app.venus.modules.review.infrastructure.ReviewRepository;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final HostStationService hostStationService;

    public ReviewService(ReviewRepository reviewRepository, HostStationService hostStationService) {
        this.reviewRepository = reviewRepository;
        this.hostStationService = hostStationService;
    }

    @Transactional(readOnly = true)
    public HostReviewsResponse getCurrentProviderReviewsResponse() {
        Station station = hostStationService.getCurrentProviderStation();
        List<Review> reviews = reviewRepository.findByProviderStationOrderByCreatedInstantDesc(station);
        return new HostReviewsResponse(reviews.stream().map(HostReviewItem::from).toList());
    }

    @Transactional(readOnly = true)
    public ReviewStatsResponse getCurrentProviderReviewStatsResponse() {
        Station station = hostStationService.getCurrentProviderStation();
        long totalReviews = reviewRepository.countByProviderStation(station);
        Double averageRating = reviewRepository.averageRatingByProviderStation(station);
        return new ReviewStatsResponse(
                averageRating == null ? 0.0
                        : java.math.BigDecimal.valueOf(averageRating)
                                .setScale(1, java.math.RoundingMode.HALF_UP)
                                .doubleValue(),
                totalReviews);
    }

    public record HostReviewsResponse(List<HostReviewItem> reviews) {
    }

    public record HostReviewItem(
            String id,
            String authorName,
            String authorAvatarUrl,
            int rating,
            String comment,
            java.time.Instant createdAt) {

        static HostReviewItem from(Review review) {
            return new HostReviewItem(
                    review.getId(),
                    review.getAuthor().getFullName(),
                    review.getAuthor().getAvatarUrl(),
                    review.getRating(),
                    review.getComment(),
                    review.getCreatedInstant());
        }
    }

    public record ReviewStatsResponse(double averageRating, long totalReviews) {
    }
}
