package com.app.venus.modules.ai.application;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.app.venus.modules.ai.infrastructure.AppAiProperties;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final AppAiProperties properties;
    private final Map<String, AiProvider> providers;
    private final AiProvider mockProvider;

    public AiService(AppAiProperties properties, List<AiProvider> providers) {
        this.properties = properties;
        this.providers = providers.stream()
                .collect(Collectors.toUnmodifiableMap(
                        provider -> provider.name().toLowerCase(Locale.ROOT),
                        Function.identity()));
        this.mockProvider = this.providers.get("mock");
    }

    public AiResult generateText(String prompt) {
        return generateText(prompt, null);
    }

    public AiResult generateText(String prompt, String systemPrompt) {
        return complete(new AiRequest(AiOperation.GENERATE_TEXT, prompt, systemPrompt, null));
    }

    public AiResult summarize(String text) {
        return complete(new AiRequest(AiOperation.SUMMARIZE, text, null, null));
    }

    public AiResult extractStructured(String text, String schemaHint) {
        return complete(new AiRequest(AiOperation.EXTRACT_STRUCTURED, text, null, schemaHint));
    }

    public AiResult classify(String text, String schemaHint) {
        return complete(new AiRequest(AiOperation.CLASSIFY, text, null, schemaHint));
    }

    public String activeProviderName() {
        return normalizeProvider(properties.getProvider());
    }

    public AiProviderStatus status() {
        String configuredProvider = activeProviderName();
        AiProvider provider = providers.getOrDefault(configuredProvider, mockProvider);

        if (provider == null) {
            return new AiProviderStatus(configuredProvider, "none", "none", "Unavailable", false, false,
                    properties.isFallbackToMockOnError());
        }

        boolean connected = false;
        try {
            connected = provider.isAvailable();
        } catch (RuntimeException ex) {
            log.debug("AI provider status check failed. provider={}", provider.name(), ex);
        }

        if (!connected && properties.isFallbackToMockOnError() && mockProvider != null && provider != mockProvider) {
            return new AiProviderStatus(
                    configuredProvider,
                    mockProvider.name(),
                    mockProvider.model(),
                    "Fallback Mode",
                    false,
                    true,
                    true);
        }

        return new AiProviderStatus(
                configuredProvider,
                provider.name(),
                provider.model(),
                connected ? "Connected" : "Unavailable",
                connected,
                "mock".equals(provider.name()),
                properties.isFallbackToMockOnError());
    }

    private AiResult complete(AiRequest request) {
        AiProvider provider = providers.getOrDefault(activeProviderName(), mockProvider);

        if (provider == null) {
            throw new AiProviderException("No AI providers are registered.");
        }

        if (provider != mockProvider && !isProviderAvailable(provider)) {
            return fallbackOrThrow(
                    request,
                    provider,
                    "Configured AI provider is not ready. Check that Ollama is running and the model is pulled.");
        }

        try {
            return provider.complete(request);
        } catch (RuntimeException ex) {
            log.warn(
                    "AI provider request failed. provider={} model={} operation={} reason={}",
                    provider.name(),
                    provider.model(),
                    request.operation(),
                    rootMessage(ex));

            return fallbackOrThrow(
                    request,
                    provider,
                    "The configured AI provider failed, so the app returned a mock response.");
        }
    }

    private boolean isProviderAvailable(AiProvider provider) {
        try {
            return provider.isAvailable();
        } catch (RuntimeException ex) {
            log.warn(
                    "AI provider availability check failed. provider={} model={} reason={}",
                    provider.name(),
                    provider.model(),
                    rootMessage(ex));
            return false;
        }
    }

    private AiResult fallbackOrThrow(AiRequest request, AiProvider provider, String notice) {
        if (properties.isFallbackToMockOnError() && mockProvider != null && provider != mockProvider) {
            log.info(
                    "Using mock AI fallback. configuredProvider={} configuredModel={} operation={}",
                    provider.name(),
                    provider.model(),
                    request.operation());
            return mockProvider.complete(request).asFallback(notice);
        }

        throw new AiProviderException(
                "AI is temporarily unavailable. Check Ollama/OpenAI settings or switch app.ai.provider=mock for local development.");
    }

    private String rootMessage(Throwable throwable) {
        Throwable current = throwable;
        while (current.getCause() != null) {
            current = current.getCause();
        }
        return current.getMessage() == null ? current.getClass().getSimpleName() : current.getMessage();
    }

    private String normalizeProvider(String provider) {
        if (provider == null || provider.isBlank()) {
            return "ollama";
        }
        return provider.trim().toLowerCase(Locale.ROOT);
    }
}
