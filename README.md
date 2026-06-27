# Spring Boot Hackathon Starter

A minimal reusable Spring Boot starter with H2, shared API infrastructure, static frontend assets, and a provider-swappable AI wrapper.

## What This Starter Includes

* Spring Boot web API with static frontend hosting.
* H2 in-memory database and H2 console for local development.
* Shared response wrapper and consistent error format.
* Global exception handling for validation, malformed JSON, app errors, AI provider errors, and unexpected failures.
* JPA auditing base class and auditing configuration.
* Generic AI module with Ollama, mock fallback, and OpenAI-compatible provider support.
* Minimal starter UI for health and AI wrapper testing.
* Clean module-oriented package structure for adding product features.

## Tech Stack

* Java 17
* Spring Boot
* Maven
* Spring Web MVC
* Spring Data JPA
* H2 Database
* Bean Validation
* Lombok
* Static HTML/CSS/JavaScript
* Ollama or OpenAI-compatible AI provider

## Project Structure

```text
src/main/java/com/app/venus
├── VenusApplication.java
├── modules
│   └── ai
│       ├── application
│       ├── infrastructure
│       └── interfaces
└── shared
    ├── auditing
    ├── exception
    └── web

src/main/resources
├── application.properties
└── static
    ├── index.html
    ├── app.js
    └── styles.css
```

## How To Run

```bash
./mvnw spring-boot:run
```

The app runs on:

```text
http://localhost:8080
```

If port 8080 is busy:

```bash
SERVER_PORT=8081 ./mvnw spring-boot:run
```

## H2 Console

The H2 console is enabled for local development:

```text
http://localhost:8080/h2-console
```

Default connection:

```text
JDBC URL: jdbc:h2:mem:venus
User: username
Password: password
```

## AI Provider Setup

The generic AI endpoint is:

```text
POST /api/ai
```

Request body:

```json
{
  "prompt": "Write a short product idea summary.",
  "systemPrompt": "Optional instruction for generation mode.",
  "mode": "generate"
}
```

Supported modes:

```text
generate
summarize
extract_structured
classify
```

## Ollama Setup

Ollama is the default provider:

```bash
ollama serve
ollama pull gemma3
```

Default config:

```properties
app.ai.provider=ollama
app.ai.default-text-model=gemma3
app.ai.ollama.model=gemma3
app.ai.ollama.base-url=http://localhost:11434
app.ai.timeout-seconds=60
app.ai.fallback-to-mock-on-error=true
```

## Mock Fallback Behavior

When `app.ai.fallback-to-mock-on-error=true`, the app returns a deterministic mock response if the configured provider is unavailable. This keeps local development usable without a running model.

To force mock mode:

```properties
app.ai.provider=mock
```

## OpenAI-Compatible Provider

Set the provider and configure a compatible chat completions endpoint:

```properties
app.ai.provider=openai
app.ai.openai.base-url=https://api.openai.com/v1
app.ai.openai.api-key-env=OPENAI_API_KEY
app.ai.openai.model=gpt-4.1-mini
```

The API key is read from the environment variable named by `app.ai.openai.api-key-env`.

## Current Generic Endpoints

```text
GET  /api/health
GET  /api/ai/status
POST /api/ai
```

All API responses use the shared response wrapper.

## Building A Product Module

Add new product code under `src/main/java/com/app/venus/modules/<module-name>` and keep the same internal shape:

```text
application/     business services and use cases
domain/          domain models when useful
infrastructure/  persistence, clients, provider adapters
interfaces/      REST controllers and DTOs
```

Keep shared cross-cutting code in `shared` only when it is reusable across modules.

## Next Planned Product

EV Charging Space Rental for Grab Drivers.

Future modules may include:

* charging spaces
* reservations
* driver recommendations
* host pricing optimizer
* demand forecast

These modules are intentionally not implemented yet. This cleanup keeps the foundation ready for that pivot.
