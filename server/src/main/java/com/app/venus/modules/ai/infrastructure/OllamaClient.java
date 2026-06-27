package com.app.venus.modules.ai.infrastructure;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.app.venus.modules.ai.application.AiProvider;
import com.app.venus.modules.ai.application.AiProviderException;
import com.app.venus.modules.ai.application.AiRequest;
import com.app.venus.modules.ai.application.AiResult;
import com.app.venus.modules.ai.infrastructure.dto.OllamaGenerateRequest;
import com.app.venus.modules.ai.infrastructure.dto.OllamaGenerateResponse;

import tools.jackson.databind.ObjectMapper;

@Component
public class OllamaClient implements AiProvider {

    private final AppAiProperties properties;
    private final PromptBuilder promptBuilder;
    private final ObjectMapper objectMapper;

    public OllamaClient(
            AppAiProperties properties,
            PromptBuilder promptBuilder,
            ObjectMapper objectMapper) {
        this.properties = properties;
        this.promptBuilder = promptBuilder;
        this.objectMapper = objectMapper;
    }

    @Override
    public String name() {
        return "ollama";
    }

    @Override
    public String model() {
        String configured = properties.getOllama().getModel();
        if (configured != null && !configured.isBlank()) {
            return configured.trim();
        }
        return properties.getDefaultTextModel();
    }

    @Override
    public boolean isAvailable() {
        try {
            byte[] response = restClient().get()
                    .uri("/api/tags")
                    .retrieve()
                    .body(byte[].class);
            if (response == null) {
                return false;
            }
            String tags = new String(response, StandardCharsets.UTF_8);
            return tags.contains(model());
        } catch (RuntimeException ex) {
            return false;
        }
    }

    @Override
    public AiResult complete(AiRequest request) {
        OllamaGenerateRequest body = new OllamaGenerateRequest(
                model(),
                promptBuilder.build(request),
                false,
                request.operation().name().equals("EXTRACT_STRUCTURED") ? "json" : null,
                Map.of(
                        "num_predict", 450,
                        "temperature", 0.3));

        try {
            byte[] responseBody = restClient().post()
                    .uri("/api/generate")
                    .body(body)
                    .retrieve()
                    .body(byte[].class);
            OllamaGenerateResponse response = responseBody == null
                    ? null
                    : objectMapper.readValue(new String(responseBody, StandardCharsets.UTF_8), OllamaGenerateResponse.class);

            if (response == null || response.response() == null || response.response().isBlank()) {
                throw new AiProviderException("Ollama returned an empty response.");
            }

            return AiResult.success(response.response().trim(), name(), model(), false);
        } catch (Exception ex) {
            throw new AiProviderException("Ollama request failed.", ex);
        }
    }

    private RestClient restClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        Duration timeout = Duration.ofSeconds(Math.max(1, properties.getTimeoutSeconds()));
        requestFactory.setConnectTimeout(timeout);
        requestFactory.setReadTimeout(timeout);
        return RestClient.builder()
                .baseUrl(properties.getOllama().getBaseUrl())
                .requestFactory(requestFactory)
                .build();
    }
}
