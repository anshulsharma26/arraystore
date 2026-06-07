# ArrayStore

A premium, full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). Designed with a focus on modern aesthetics, performance, and a seamless user experience.

![ArrayStore Preview](https://via.placeholder.com/1000x500?text=ArrayStore+E-Commerce)

## ✨ Features

- **Modern Architecture:** Robust backend with Express and MongoDB, paired with a dynamic, fast React frontend built on Vite.
- **State Management:** Utilizes Redux Toolkit for efficient, centralized state handling (Cart, Products, Orders, Auth).
- **Secure Authentication:** JWT-based user authentication and role-based access control (Admin vs Customer).
- **Payment Integration:** Secure and reliable checkout flow integrated with Razorpay.
- **Premium UI/UX:** Fully responsive, glassmorphism-inspired design with a seamless Light/Dark mode toggle.
- **Admin Dashboard:** Comprehensive product and order management capabilities for administrators.

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Redux Toolkit, React Router DOM, Vanilla CSS (CSS Variables for dynamic theming).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT).
- **Deployment:** Vercel (Serverless functions for backend, Static hosting for frontend).

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance (Local or MongoDB Atlas)
- Razorpay Account (for testing payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshulsharma26/arraystore.git
   cd arraystore
   ```

2. **Install dependencies:**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup:**
   - In the `server` directory, create a `.env` file:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     ```
   - In the `client` directory, create a `.env` file:
     ```env
     VITE_API_URL=http://localhost:5000
     VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
     ```

4. **Seed the database (Optional):**
   ```bash
   cd server
   npm run seed
   ```
   *Note: This will wipe existing data and populate the database with sample products and an Admin user.*

5. **Start the development servers:**
   ```bash
   # In the server directory
   npm run dev

   # In a new terminal, in the client directory
   npm run dev
   ```

## 🌐 Deployment
This project is configured to be easily deployed on Vercel. 
- The `client/vercel.json` ensures React Router handles client-side routing and proxies API requests.
- The `server/vercel.json` configures the Express app to run as Vercel Serverless Functions.
