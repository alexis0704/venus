const healthStatus = document.querySelector("#healthStatus");
const healthMeta = document.querySelector("#healthMeta");
const aiStatus = document.querySelector("#aiStatus");
const aiMeta = document.querySelector("#aiMeta");
const aiForm = document.querySelector("#aiForm");
const generateButton = document.querySelector("#generateButton");
const outputText = document.querySelector("#outputText");
const outputMeta = document.querySelector("#outputMeta");

async function loadJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || `Request failed with ${response.status}`);
  }

  return body;
}

async function loadHealth() {
  try {
    const body = await loadJson("/api/health");
    healthStatus.textContent = body.data.status;
    healthMeta.textContent = body.message;
  } catch (error) {
    healthStatus.textContent = "Unavailable";
    healthMeta.textContent = error.message;
  }
}

async function loadAiStatus() {
  try {
    const body = await loadJson("/api/ai/status");
    const data = body.data;
    aiStatus.textContent = data.status;
    aiMeta.textContent = `${data.provider} / ${data.model}`;
  } catch (error) {
    aiStatus.textContent = "Unavailable";
    aiMeta.textContent = error.message;
  }
}

aiForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(aiForm);
  const payload = {
    prompt: String(formData.get("prompt") || "").trim(),
    systemPrompt: String(formData.get("systemPrompt") || "").trim() || null,
    mode: String(formData.get("mode") || "generate")
  };

  if (!payload.prompt) {
    outputMeta.textContent = "Prompt required";
    outputText.textContent = "Enter a prompt before generating.";
    return;
  }

  generateButton.disabled = true;
  outputMeta.textContent = "Generating...";
  outputText.textContent = "";

  try {
    const body = await loadJson("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = body.data;
    outputMeta.textContent = `${data.provider} / ${data.model}${data.fallback ? " / fallback" : ""}`;
    outputText.textContent = data.notice ? `${data.notice}\n\n${data.text}` : data.text;
    await loadAiStatus();
  } catch (error) {
    outputMeta.textContent = "Request failed";
    outputText.textContent = error.message;
  } finally {
    generateButton.disabled = false;
  }
});

loadHealth();
loadAiStatus();
