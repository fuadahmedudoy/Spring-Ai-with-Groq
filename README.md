# Spring Boot AI Chat Application with React Frontend

This project is a conversational AI application that uses:
- Spring Boot backend with Spring AI for OpenAI integration
- React/TypeScript frontend with Tailwind CSS
- Groq API for LLM access

## Project Structure

- **demo/** - Spring Boot backend
- **frontend/** - React/TypeScript frontend

## Setup and Run

### Backend (Spring Boot)

1. Navigate to the `demo` directory
2. Set your API key in `src/main/resources/application.properties`
3. Run the application:
   ```
   ./mvnw spring-boot:run
   ```

### Frontend (React)

1. Navigate to the `frontend` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```

## Deployment on Render
frontend = https://spring-ai-with-groq.onrender.com
backend = https://spring-ai-with-groq-1.onrender.com

This project is configured for deployment on Render.

### Backend Service
- **Build Command**: `./mvnw clean package -DskipTests`
- **Start Command**: `java -jar target/demo-0.0.1-SNAPSHOT.jar`

### Frontend Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`

## Environment Variables

Backend:
- `SPRING_AI_OPENAI_API_KEY` - Your API key
- `SPRING_AI_OPENAI_BASE_URL` - API endpoint (https://api.groq.com/openai)
- `SPRING_AI_OPENAI_CHAT_OPTIONS_MODEL` - LLM model (llama3-70b-8192) 
