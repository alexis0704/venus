package com.app.venus.modules.review.interfaces.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.venus.modules.review.application.ReviewService;
import com.app.venus.modules.review.application.ReviewService.HostReviewsResponse;
import com.app.venus.modules.review.application.ReviewService.ReviewStatsResponse;
import com.app.venus.shared.web.ApiPaths;

@RestController
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping(ApiPaths.API_V1 + "/me/station/reviews")
    public HostReviewsResponse getCurrentProviderReviews() {
        return reviewService.getCurrentProviderReviewsResponse();
    }

    @GetMapping(ApiPaths.API_V1 + "/me/station/reviews/stats")
    public ReviewStatsResponse getCurrentProviderReviewStats() {
        return reviewService.getCurrentProviderReviewStatsResponse();
    }
}
