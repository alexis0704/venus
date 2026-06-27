package com.app.venus.modules.ai.infrastructure.dto;

import java.util.List;

public record OpenAiChatRequest(
        String model,
        List<Message> messages) {

    public record Message(String role, String content) {
    }
}
