package com.app.venus.shared.exception;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.method.ParameterErrors;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import com.app.venus.modules.ai.application.AiProviderException;
import com.app.venus.shared.web.Response;

import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final Map<String, Integer> VALIDATION_PRIORITY = Map.of(
            "NotBlank", 0,
            "NotNull", 0,
            "NotEmpty", 0,
            "Pattern", 1,
            "Email", 1,
            "Size", 2,
            "Min", 2,
            "Max", 2);

    @ExceptionHandler(AppException.class)
    public ResponseEntity<Response<Object>> handleAppException(
            AppException exception,
            HttpServletRequest request) {
        log.warn(
                "Application error at path={} error={} message={}",
                request.getRequestURI(),
                exception.getError().name(),
                exception.getMessage());

        return ResponseEntity
                .status(exception.getError().getStatus())
                .body(Response.error(exception.getError(), exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Response<Object>> handleRequestBodyValidation(
            MethodArgumentNotValidException exception) {
        return ResponseEntity
                .badRequest()
                .body(buildValidationResponse(exception.getBindingResult().getFieldErrors()));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Response<Object>> handleQueryOrPathValidation(
            BindException exception) {
        return ResponseEntity
                .badRequest()
                .body(buildValidationResponse(exception.getBindingResult().getFieldErrors()));
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Response<Object>> handleMethodValidation(
            HandlerMethodValidationException exception) {
        List<FieldError> fieldErrors = exception.getParameterValidationResults()
                .stream()
                .filter(ParameterErrors.class::isInstance)
                .map(ParameterErrors.class::cast)
                .flatMap(parameterErrors -> parameterErrors.getFieldErrors().stream())
                .toList();

        if (fieldErrors.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(Response.error(ApiError.VALIDATION_FAILED));
        }

        return ResponseEntity
                .badRequest()
                .body(buildValidationResponse(fieldErrors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Response<Object>> handleInvalidRequestBody(
            HttpMessageNotReadableException exception) {
        Throwable rootCause = exception.getMostSpecificCause();

        if (rootCause instanceof InvalidFormatException invalidFormatException
                && invalidFormatException.getTargetType() != null
                && invalidFormatException.getTargetType().isEnum()) {

            String fieldName = extractFieldName(invalidFormatException);

            Map<String, String> errors = new LinkedHashMap<>();
            errors.put(fieldName, "Must be a valid enum value.");

            return ResponseEntity
                    .badRequest()
                    .body(Response.error(ApiError.VALIDATION_FAILED).withMeta("errors", errors));
        }

        return ResponseEntity
                .badRequest()
                .body(Response.error(ApiError.REQUEST_BODY_INVALID));
    }

    @ExceptionHandler(AiProviderException.class)
    public ResponseEntity<Response<Object>> handleAiProviderException(
            AiProviderException exception,
            HttpServletRequest request) {
        log.warn("AI provider error at path={} message={}", request.getRequestURI(), exception.getMessage());

        return ResponseEntity
                .status(ApiError.AI_PROVIDER_UNAVAILABLE.getStatus())
                .body(Response.error(ApiError.AI_PROVIDER_UNAVAILABLE, exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response<Object>> handleUnexpectedException(
            Exception exception,
            HttpServletRequest request) {
        log.error("Unexpected error at path={}", request.getRequestURI(), exception);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Response.error(ApiError.INTERNAL_ERROR));
    }

    private Response<Object> buildValidationResponse(List<FieldError> fieldErrors) {
        Map<String, String> errors = new LinkedHashMap<>();

        fieldErrors.stream()
                .sorted(Comparator.comparingInt(this::getValidationPriority))
                .forEach(fieldError -> errors.putIfAbsent(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()));

        return Response.error(ApiError.VALIDATION_FAILED)
                .withMeta("errors", errors);
    }

    private int getValidationPriority(FieldError fieldError) {
        return VALIDATION_PRIORITY.getOrDefault(fieldError.getCode(), 100);
    }

    private String extractFieldName(InvalidFormatException exception) {
        if (exception.getPath().isEmpty()) {
            return "value";
        }

        var reference = exception.getPath().get(exception.getPath().size() - 1);

        return reference.getPropertyName() != null
                ? reference.getPropertyName()
                : "value";
    }
}
