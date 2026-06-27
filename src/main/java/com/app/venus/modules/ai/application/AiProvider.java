package com.app.venus.modules.ai.application;

public interface AiProvider {
    String name();

    String model();

    AiResult complete(AiRequest request);

    default boolean isAvailable() {
        return true;
    }
}
