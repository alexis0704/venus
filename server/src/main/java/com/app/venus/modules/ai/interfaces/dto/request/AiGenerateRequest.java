package com.app.venus.modules.ai.interfaces.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AiGenerateRequest(
        @NotBlank @Size(max = 8000) String prompt,
        @Size(max = 2000) String systemPrompt,
        @Size(max = 80) String mode) {
}
