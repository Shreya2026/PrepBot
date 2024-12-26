# PrepBot
Prepbot is an AI-based mock interview platform that is built on Gemini and helps users to practice for their upcoming interviews while allowing them to review their previous interviews and gets ratings for each interview they give.

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_DRIZZLLE_DB_URL=your_database_connection_string
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=5

NEXT_PUBLIC_INFORMATION="Enable Video Cam and Microphone to start the interview. It has 5 questions and at last you will get the report on the basis of your answer. Good Luck! Please allow the browser to access the camera and microphone."
