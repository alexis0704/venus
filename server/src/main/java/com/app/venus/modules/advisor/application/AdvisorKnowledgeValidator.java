package com.app.venus.modules.advisor.application;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public final class AdvisorKnowledgeValidator {
    private static final Pattern SOURCE_ID = Pattern.compile("\\bsourceId\\s*[:\"]");
    private static final Pattern CLAIM_TYPE = Pattern.compile("\\bclaimType\\s*[:\"]");
    private static final Pattern SOURCE_METADATA = Pattern.compile("(?s).*title:\\s*.+\\n\\s*url:\\s*.+\\n\\s*lastReviewed:\\s*.+\\n\\s*sourceType:\\s*.+.*");

    public List<String> validate(String fileName, String content) {
        List<String> errors = new ArrayList<>();
        if (!SOURCE_ID.matcher(content).find()) {
            errors.add(fileName + " must include at least one sourceId.");
        }
        if (fileName.endsWith(".md") && containsExternalClaim(content) && !SOURCE_METADATA.matcher(content).matches()) {
            errors.add(fileName + " external legal or market claims must include source metadata.");
        }
        if (containsInternalClaim(content) && !content.contains("internal/pilot")) {
            errors.add(fileName + " internal hypotheses must be labelled internal/pilot.");
        }
        if ((fileName.endsWith(".json") || content.contains("Knowledge Items")) && !CLAIM_TYPE.matcher(content).find()) {
            errors.add(fileName + " knowledge items must include claimType labels.");
        }
        return errors;
    }

    private boolean containsExternalClaim(String content) {
        return content.contains("external/legal")
                || content.contains("external/market")
                || content.contains("external/market-reporting");
    }

    private boolean containsInternalClaim(String content) {
        return content.toLowerCase().contains("internal")
                || content.toLowerCase().contains("pilot");
    }
}
