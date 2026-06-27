package com.app.venus.modules.ai.infrastructure;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.ai")
public class AppAiProperties {

    private String provider = "ollama";
    private String defaultTextModel = "gemma3:latest";
    private int timeoutSeconds = 60;
    private boolean fallbackToMockOnError = true;
    private boolean multiStageEnabled = false;
    private OpenAi openai = new OpenAi();
    private Ollama ollama = new Ollama();

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getDefaultTextModel() {
        return defaultTextModel;
    }

    public void setDefaultTextModel(String defaultTextModel) {
        this.defaultTextModel = defaultTextModel;
    }

    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public void setTimeoutSeconds(int timeoutSeconds) {
        this.timeoutSeconds = timeoutSeconds;
    }

    public boolean isFallbackToMockOnError() {
        return fallbackToMockOnError;
    }

    public void setFallbackToMockOnError(boolean fallbackToMockOnError) {
        this.fallbackToMockOnError = fallbackToMockOnError;
    }

    public boolean isMultiStageEnabled() {
        return multiStageEnabled;
    }

    public void setMultiStageEnabled(boolean multiStageEnabled) {
        this.multiStageEnabled = multiStageEnabled;
    }

    public OpenAi getOpenai() {
        return openai;
    }

    public void setOpenai(OpenAi openai) {
        this.openai = openai;
    }

    public Ollama getOllama() {
        return ollama;
    }

    public void setOllama(Ollama ollama) {
        this.ollama = ollama;
    }

    public static class OpenAi {
        private String apiKey;
        private String apiKeyEnv = "OPENAI_API_KEY";
        private String baseUrl = "https://api.openai.com/v1";
        private String model = "gemma3:latest";

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getApiKeyEnv() {
            return apiKeyEnv;
        }

        public void setApiKeyEnv(String apiKeyEnv) {
            this.apiKeyEnv = apiKeyEnv;
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }
    }

    public static class Ollama {
        private String baseUrl = "http://localhost:11434";
        private String model;

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }
    }
}
