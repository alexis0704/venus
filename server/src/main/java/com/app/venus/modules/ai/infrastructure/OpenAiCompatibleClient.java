package com.app.venus.modules.ai.infrastructure;

import java.time.Duration;
import java.util.List;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.app.venus.modules.ai.application.AiProvider;
import com.app.venus.modules.ai.application.AiProviderException;
import com.app.venus.modules.ai.application.AiRequest;
import com.app.venus.modules.ai.application.AiResult;
import com.app.venus.modules.ai.infrastructure.dto.OpenAiChatRequest;

import tools.jackson.databind.JsonNode;

@Component
public class OpenAiCompatibleClient implements AiProvider {

    private final AppAiProperties properties;
    private final PromptBuilder promptBuilder;

    public OpenAiCompatibleClient(
            AppAiProperties properties,
            PromptBuilder promptBuilder) {
        this.properties = properties;
        this.promptBuilder = promptBuilder;
    }

    @Override
    public String name() {
        return "openai";
    }

    @Override
    public String model() {
        String configured = properties.getOpenai().getModel();
        if (configured != null && !configured.isBlank()) {
            return configured.trim();
        }
        return properties.getDefaultTextModel();
    }

    @Override
    public boolean isAvailable() {
        String apiKey = apiKey();
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public AiResult complete(AiRequest request) {
        String apiKey = apiKey();
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiProviderException("OpenAI-compatible API key is not configured.");
        }

        OpenAiChatRequest body = new OpenAiChatRequest(
                model(),
                List.of(
                        new OpenAiChatRequest.Message("system", systemPrompt(request)),
                        new OpenAiChatRequest.Message("user", promptBuilder.build(request))));

        try {
            JsonNode response = restClient(apiKey).post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);
            String text = response == null
                    ? null
                    : response.at("/choices/0/message/content").asText(null);

            if (text == null || text.isBlank()) {
                throw new AiProviderException("OpenAI-compatible provider returned an empty response.");
            }

            return AiResult.success(text.trim(), name(), model(), false);
        } catch (RuntimeException ex) {
            throw new AiProviderException("OpenAI-compatible request failed.", ex);
        }
    }

    private RestClient restClient(String apiKey) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        Duration timeout = Duration.ofSeconds(Math.max(1, properties.getTimeoutSeconds()));
        requestFactory.setConnectTimeout(timeout);
        requestFactory.setReadTimeout(timeout);
        return RestClient.builder()
                .baseUrl(properties.getOpenai().getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .requestFactory(requestFactory)
                .build();
    }

    private String apiKey() {
        String configured = properties.getOpenai().getApiKey();
        if (configured != null && !configured.isBlank()) {
            return configured.trim();
        }

        String envName = properties.getOpenai().getApiKeyEnv();
        if (envName == null || envName.isBlank()) {
            envName = "OPENAI_API_KEY";
        }
        return System.getenv(envName.trim());
    }

    private String systemPrompt(AiRequest request) {
        if (request.systemPrompt() != null && !request.systemPrompt().isBlank()) {
            return request.systemPrompt().trim();
        }

        return switch (request.operation()) {
            case EXTRACT_STRUCTURED -> "Return only valid JSON. Do not wrap JSON in markdown.";
            case CLASSIFY -> "Return a compact classification. Prefer comma-separated labels unless a JSON schema is requested.";
            case SUMMARIZE -> "You write concise, accurate summaries.";
            case GENERATE_TEXT -> "You are a helpful assistant for a reusable Spring Boot hackathon starter.";
        };
    }
}
