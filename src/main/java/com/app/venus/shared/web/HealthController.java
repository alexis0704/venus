package com.app.venus.shared.web;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ResponseEntity<Response<Map<String, String>>> health() {
        return ResponseEntity.ok(Response.ok(
                Map.of(
                        "status", "UP",
                        "application", "venus"),
                "Health check passed."));
    }
}
