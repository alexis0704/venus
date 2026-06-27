package com.app.venus.modules.provider.interfaces.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ProviderVerificationControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void verifiesSupportedLicenceFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "licence.pdf",
                "application/pdf",
                "demo".getBytes());

        mockMvc.perform(multipart("/api/v1/me/provider/verify-licence").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true))
                .andExpect(jsonPath("$.verifiedAt").isNotEmpty());
    }

    @Test
    void canReturnManualReviewAccepted() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "needs-review.pdf",
                "application/pdf",
                "demo".getBytes());

        mockMvc.perform(multipart("/api/v1/me/provider/verify-licence").file(file))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.verified").value(false))
                .andExpect(jsonPath("$.message").value("Document submitted for manual review. You will be notified within 24 hours."));
    }

    @Test
    void rejectsMissingAndUnsupportedFiles() throws Exception {
        mockMvc.perform(multipart("/api/v1/me/provider/verify-licence"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error").value("UNPROCESSABLE_ENTITY"));

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "licence.txt",
                "text/plain",
                "demo".getBytes());

        mockMvc.perform(multipart("/api/v1/me/provider/verify-licence").file(file))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error").value("UNPROCESSABLE_ENTITY"));
    }
}
