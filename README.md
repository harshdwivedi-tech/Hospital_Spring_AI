# HospitalManagementAi - Complete Project

A Spring Boot 4 + Thymeleaf hospital directory application with REST CRUD APIs, H2 persistence, Swagger UI and a Spring AI assistant powered by OpenRouter.

## Requirements

- Java 21
- Maven 3.9+ (or use the included Maven Wrapper)
- Internet access on first build so Maven can download dependencies
- An OpenRouter API key for AI chat (the rest of the application can be used without it)

## Run in Eclipse / Spring Tool Suite

1. Extract the ZIP.
2. Select **File → Import → Existing Maven Projects**.
3. Choose the extracted `HospitalManagementAiSystem-complete` folder.
4. Finish the import and wait for Maven dependencies to resolve.
5. Set the `OPENROUTER_API_KEY` environment variable in the Run Configuration if you want to use the AI chat.
6. Run `HospitalManagementAiApplication.java` as a Spring Boot application.

## URLs

- Frontend: http://localhost:8080/
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs
- H2 Console: http://localhost:8080/h2-console

H2 console JDBC URL: `jdbc:h2:file:./data/hospitaldb`  
Username: `sa`  
Password: leave blank.

## REST API

| Method | URL | Description |
|---|---|---|
| GET | `/hospital` | List all hospitals |
| GET | `/hospital/{id}` | Get one hospital |
| POST | `/hospital` | Create hospital |
| PUT | `/hospital/{id}` | Update hospital |
| DELETE | `/hospital/{id}` | Delete hospital |
| POST | `/hospital/ai/chat` | Ask the AI assistant |

Example POST/PUT body:

```json
{
  "name": "City Care Hospital",
  "location": "Bhopal",
  "specialization": "Cardiology"
}
```

AI chat request:

```json
{
  "message": "Show me hospitals in Bhopal"
}
```

## OpenRouter key setup

Do not commit API keys to source control. Set an environment variable named `OPENROUTER_API_KEY` before starting the application.

In Eclipse:
1. Run → Run Configurations…
2. Select the Spring Boot application.
3. Open the **Environment** tab.
4. Add `OPENROUTER_API_KEY` with your new OpenRouter key.
5. Apply and Run.

The original uploaded `application.properties` contained a live-looking API key. Revoke/rotate that key in OpenRouter and use a new key only as an environment variable.

## Notes

- Hospital CRUD uses the existing `/hospital` API route.
- The dashboard loads real records from the REST API; it does not use mock hospital data.
- H2 is configured as a file-backed database in `./data`, so records persist across restarts.
- AI chat uses the database-backed Java tools for directory lookup. It is not a medical diagnosis or treatment service.
- Spring Boot and Spring AI versions are retained from the uploaded project. Swagger uses springdoc 3.x, which supports Spring Boot 4.
