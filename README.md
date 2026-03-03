# TutoRoot PDF Q&A Extractor

TutoRoot Extractor is a full-stack web application designed to automatically parse question and answer documents (PDFs) and extract them into correlated, interactive Q&A pairs.

Explanation Video:https://drive.google.com/file/d/1ClLYYaGQn-XJxLWoRxWFF01zwLPrk6t4/view?usp=drive_link

This tool bypasses expensive LLM API calls and avoids rate limits by utilizing robust, native Regular Expression processing via the `pdf2json` engine.

## Features

- **Secure Authentication**: User registration and login protected by JWT-based sessions and bcrypt password hashing.
- **Native Parsing Engine**: Upload strictly formatted `Q` and `A` PDFs and automatically extract the textual content into pairs locally.
- **Interactive Dashboard**: View, sort, search, and manage all your processed documents.
- **Data Export**: Export your generated study pairs as either raw `CSV` data or a beautifully formatted standalone `HTML` document.
- **Single-Service Architecture**: The frontend is built with React/Vite and natively served by the Express.js backend, allowing seamless deployment on a single cloud platform.

## Technology Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, Sequelize ORM, Multer, `pdf2json`
- **Database**: PostgreSQL (hosted on [Neon.tech](https://neon.tech))

## Prerequisites

- **Node.js**: v18 or newer
- **PostgreSQL**: A Neon DB or local Postgres instance.

## Installation & Local Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd TutoRoot
   ```

2. **Install global dependencies**
   Install the necessary modules for both the frontend and backend.

   ```bash
   npm run postinstall
   ```

3. **Configure Environment Variables**
   Create a `.env` file inside the `backend/` directory:

   ```env
   # backend/.env
   PORT=5000
   DATABASE_URL=postgresql://your_db_user:password@hostname.neon.tech/neondb?sslmode=require
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=
   ```

4. **Start the Development Server**
   Start both the React frontend and the Express backend concurrently:

   ```bash
   npm run dev
   ```

   - The React UI will be available at `http://localhost:5173`
   - The Express API will be running on `http://localhost:5000`

## Production Deployment (Render)

This application is configured for a **Single-Service Deployment**. The backend is programmed to compile and serve the frontend statically.

1. Create a **Web Service** on Render connected to this repository.
2. Under "Build Command", use:
   ```bash
   npm run build
   ```
3. Under "Start Command", use:
   ```bash
   npm run production-start
   ```
4. Define the following Environment Variables in the Render Dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

Upon deployment, the entire application will be seamlessly served from your single Render URL.
