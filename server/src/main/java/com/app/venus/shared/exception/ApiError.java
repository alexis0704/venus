package com.app.venus.shared.exception;

import org.springframework.http.HttpStatus;

public enum ApiError {
        VALIDATION_FAILED("REQ_001", HttpStatus.BAD_REQUEST, "Validation failed."),
        REQUEST_BODY_INVALID("REQ_002", HttpStatus.BAD_REQUEST, "Malformed request body."),
        INVALID_REQUEST("REQ_003", HttpStatus.BAD_REQUEST, "Invalid request."),
        RESOURCE_NOT_FOUND("RES_001", HttpStatus.NOT_FOUND, "Resource not found."),
        RESOURCE_CONFLICT("RES_002", HttpStatus.CONFLICT, "Resource conflict."),
        UNPROCESSABLE_ENTITY("RES_003", HttpStatus.UNPROCESSABLE_CONTENT, "Request cannot be processed."),
        AI_PROVIDER_UNAVAILABLE("AI_001", HttpStatus.SERVICE_UNAVAILABLE, "AI provider unavailable."),
        INTERNAL_ERROR("SYS_001", HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error.");

        private final String code;
        private final HttpStatus status;
        private final String message;

        ApiError(String code, HttpStatus status, String message) {
                this.code = code;
                this.status = status;
                this.message = message;
        }

        public String getCode() {
                return code;
        }

        public HttpStatus getStatus() {
                return status;
        }

        public String getMessage() {
                return message;
        }
}
