# AI-Powered Product Review Platform

A full-stack application where users can ask AI-powered questions about products and get answers generated from real user reviews.

---

## Tech Stack

### Frontend
- React + Vite
- Axios
- React Router DOM
- Plain CSS

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcryptjs

### AI Service
- Python + FastAPI
- Google Gemini 2.5 Flash
- google-genai

---

## Architecture
React Frontend (port 5173)

↓

Express Backend (port 5000)

↓

MongoDB Atlas

↓

FastAPI AI Service (port 8000)

↓

Google Gemini API



---

## Features

- User registration and login with JWT auth
- Browse products
- Ask AI questions about any product
- AI answers generated from real user reviews
- View supporting reviews used by AI
- Submit your own reviews (one per product)
- View and delete chat history

---

## Project Structure
ai-review-platform/

├── frontend/          # React + Vite

├── backend/           # Node.js + Express

├── ai_service/        # Python + FastAPI

└── README.md




---



## Setup Guide

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB Atlas account
- Google Gemini API key

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-review-platform.git
cd ai-review-platform
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
```

Seed the database:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

---

### 3. AI Service Setup

```bash
cd ai_service
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the service:

```bash
uvicorn main:app --reload --port 8000
```

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Running the Project

Open 3 terminals:

**Terminal 1:**
```bash
cd backend && npm run dev
```

**Terminal 2:**
```bash
cd ai_service && venv\Scripts\activate && uvicorn main:app --reload --port 8000
```

**Terminal 3:**
```bash
cd frontend && npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | Get all products |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /reviews | Submit a review |
| GET | /reviews/:productId | Get reviews for a product |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /chat/ask | Ask AI a question |
| GET | /chat/history | Get chat history |
| DELETE | /chat/history/:id | Delete a chat |

### AI Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /analyze | Analyze reviews with Gemini |

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| PORT | Express server port |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT signing |
| AI_SERVICE_URL | FastAPI service URL |

### AI Service `.env`
| Variable | Description |
|----------|-------------|
| GEMINI_API_KEY | Google Gemini API key |

---

## Future Enhancements

- Sentiment analysis per review
- Product search and filtering
- User profile page
- Admin dashboard
- Deployment on Render + Vercel
- Rate limiting on AI requests