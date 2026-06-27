package com.app.venus.modules.advisor.application;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;

class AdvisorKnowledgeValidatorTests {
    private final AdvisorKnowledgeValidator validator = new AdvisorKnowledgeValidator();

    @Test
    void curatedKnowledgeFilesPassValidation() throws IOException {
        Path knowledgeDir = Path.of("src/main/resources/advisor/knowledge");

        try (var files = Files.list(knowledgeDir)) {
            List<String> errors = files
                    .filter(Files::isRegularFile)
                    .flatMap(file -> validateFile(file).stream())
                    .toList();

            assertThat(errors).isEmpty();
        }
    }

    @Test
    void validationRejectsMissingSourceId() {
        List<String> errors = validator.validate("bad.md", "- id: example\n  claimType: external/legal");

        assertThat(errors).contains("bad.md must include at least one sourceId.");
    }

    @Test
    void validationRejectsExternalClaimWithoutMetadata() {
        String content = """
                - id: example
                  sourceId: VN-LAW-X
                  claimType: external/legal
                """;

        assertThat(validator.validate("bad.md", content))
                .contains("bad.md external legal or market claims must include source metadata.");
    }

    private List<String> validateFile(Path file) {
        try {
            return validator.validate(file.getFileName().toString(), Files.readString(file));
        } catch (IOException ex) {
            return List.of(file + " could not be read: " + ex.getMessage());
        }
    }
}
