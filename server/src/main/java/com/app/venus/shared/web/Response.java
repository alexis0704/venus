package com.app.venus.shared.web;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;

import com.app.venus.shared.exception.ApiError;

import lombok.Getter;

@Getter
public class Response<T> {
    private final int status;
    private final String code;
    private final String message;
    private final T data;
    private final Instant timestamp;
    private final Map<String, Object> metadata;

    private Response(int status, String code, String message, T data,
            Map<String, Object> metadata, Instant timestamp) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = (timestamp != null) ? timestamp : Instant.now();
        this.metadata = (metadata == null || metadata.isEmpty()) ? null : Map.copyOf(metadata);
    }

    private Response(int status, String code, String message, T data, Map<String, Object> metadata) {
        this(status, code, message, data, metadata, null);
    }

    public static <T> Response<T> success(int httpStatus, T data, String message) {
        String reason = HttpStatus.valueOf(httpStatus).getReasonPhrase(); // "OK", "Created", etc.
        return new Response<>(httpStatus, reason.toUpperCase(), message, data, null);
    }

    public static <T> Response<T> ok(T data, String message) {
        return success(HttpStatus.OK.value(), data, message);
    }

    public static <T> Response<T> created(T data, String message) {
        return success(HttpStatus.CREATED.value(), data, message);
    }

    public static <T> Response<T> error(ApiError error) {
        return new Response<>(error.getStatus().value(), error.getCode(), error.getMessage(), null, null);
    }

    public static <T> Response<T> error(ApiError error, String message) {
        return new Response<>(error.getStatus().value(), error.getCode(), message, null, null);
    }

    public Response<T> withMeta(String key, Object value) {
        Map<String, Object> map = (this.metadata == null) ? new LinkedHashMap<>() : new LinkedHashMap<>(this.metadata);
        map.put(key, value);
        return new Response<>(status, code, message, data, map, this.timestamp);
    }
}
