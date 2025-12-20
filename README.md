# AI Background Remover

A full-stack application that uses AI to remove backgrounds from images. This project features a React frontend, a Node.js/Express backend, and integrates with Clerk for authentication and Razorpay for payments.

## Project Structure

- **frontend**: React application built with Vite and TailwindCSS.
- **backend**: Node.js and Express server with MongoDB integration.

## Features

- **AI Background Removal**: Upload images and remove backgrounds instantly using the ClipDrop API.
- **User Authentication**: Secure sign-up and sign-in using Clerk.
- **Credit System**: Users can purchase credits to process images.
- **Payment Integration**: Secure payments via Razorpay.
- **History**: View previously processed images.

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- Clerk (Authentication)
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Razorpay
- Clerk Webhooks
- ClipDrop API

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB database (local or Atlas)
- Clerk account
- Razorpay account
- ClipDrop API key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Bg-remove
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ../backend
    npm install
    ```

### Environment Variables

Create a `.env` file in both `frontend` and `backend` directories with the following variables:

#### Frontend (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_BACKEND_URL=http://localhost:4000
```

#### Backend (`backend/.env`)
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLIPDROP_API_KEY=your_clipdrop_api_key
CURRENCY=INR
```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm run dev
    ```
    The server will start on `http://localhost:4000`.

2.  **Start the Frontend Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Deployment

### Frontend
The frontend is configured for deployment on Vercel. A `vercel.json` file is included to handle client-side routing.

### Backend
The backend can be deployed to platforms like Render, Railway, or Heroku. Ensure all environment variables are set in your deployment environment.
