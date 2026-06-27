package com.app.venus.shared.exception;

import java.util.Objects;

public class AppException extends RuntimeException {
    private final ApiError error;

    public AppException(ApiError error) {
        super(error.getMessage());
        this.error = Objects.requireNonNull(error, "error must not be null");
    }

    public AppException(ApiError error, String message) {
        super(message);
        this.error = Objects.requireNonNull(error, "error must not be null");
    }

    public AppException(ApiError error, String message, Throwable cause) {
        super(message, cause);
        this.error = Objects.requireNonNull(error, "error must not be null");
    }

    public ApiError getError() {
        return error;
    }
}