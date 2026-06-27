package com.app.venus.modules.provider.interfaces.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.venus.modules.provider.application.ProviderVerificationService;
import com.app.venus.modules.provider.interfaces.dto.response.ProviderVerificationResponse;
import com.app.venus.shared.web.ApiPaths;

@RestController
public class ProviderVerificationController {
    private final ProviderVerificationService providerVerificationService;

    public ProviderVerificationController(ProviderVerificationService providerVerificationService) {
        this.providerVerificationService = providerVerificationService;
    }

    @PostMapping(path = ApiPaths.API_V1 + "/me/provider/verify-licence", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProviderVerificationResponse> verifyLicence(@RequestPart(name = "file", required = false) MultipartFile file) {
        ProviderVerificationResponse response = ProviderVerificationResponse.from(providerVerificationService.verifyLicence(file));
        return ResponseEntity
                .status(response.verified() ? HttpStatus.OK : HttpStatus.ACCEPTED)
                .body(response);
    }
}
