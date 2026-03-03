# OTIS: Online Temple Information System

OTIS is a comprehensive, modern web application designed to streamline temple administration and enhance the devotee experience. Built with React and Vite, this project serves as a centralized platform for managing temple information, sevas, events, donations, and bookings.

## Key Features

*   **User Authentication**: Secure user registration and login system with Two-Factor Authentication (OTP via email). Includes password reset functionality.
*   **Admin Dashboard**: A protected, role-based dashboard for administrators to perform CRUD operations on:
    *   **Temples**: Add, update, or remove temple listings.
    *   **Sevas**: Manage temple-specific services, including price, duration, and ticket limits.
    *   **Users**: View all registered users, manage roles (admin/user), and delete accounts.
    *   **Bookings & Donations**: Monitor all user bookings and donations made through the platform.
*   **Temple Exploration**: Users can browse, search, and view detailed information about various temples, including history, descriptions, and image galleries.
*   **Booking System**:
    *   Book Sevas (Darshan) and Accommodations for specific temples.
    *   Dynamic ticket availability tracking.
*   **Secure Payments**: Integrated with **Stripe** for secure processing of payments for bookings and donations.
*   **Donation Portal**: A dedicated and detailed form for users to make donations to a temple of their choice.
*   **User Profile**: Personalized space for users to view their booking history, donation records, and manage their profile.
*   **Receipt Generation**: Users can view and print an official receipt for their bookings.
*   **Responsive Design**: A clean, modern, and responsive user interface that works seamlessly across devices.

## Technology Stack

*   **Frontend**: React.js, Vite
*   **Routing**: React Router
*   **HTTP Client**: Axios
*   **State Management**: React Context API
*   **Payments**: Stripe.js & React Stripe.js
*   **Styling**: Custom CSS with variables and a mobile-first approach.
*   **Analytics**: Vercel Analytics & Speed Insights

## Backend

This frontend application is designed to work with a corresponding backend API. The API endpoint is configured in `vite.config.js` and `src/utils/axiosConfig.js` to point to the live server: `https://otis-api.onrender.com/api`.

## Getting Started

To run this project locally, follow these steps:

**Prerequisites:**
*   Node.js (v18 or later)
*   npm or yarn

**1. Clone the repository:**
```bash
git clone https://github.com/satyakiran29/otis.git
cd otis
```

**2. Install dependencies:**
```bash
npm install
```

**3. Set up environment variables:**

Create a `.env` file in the root of the project and add your Stripe publishable key.

```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**4. Run the development server:**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the project files using ESLint.
*   `npm run preview`: Serves the production build locally to preview it.

## Project Structure

The project follows a standard React application structure:

```
/src
├── assets/          # Static assets like images
├── components/      # Reusable UI components (Navbar, Footer, Cards, etc.)
├── context/         # React Context for global state (AuthContext)
├── data/            # Static data used in the application
├── pages/           # Top-level page components for each route
└── utils/           # Utility functions (axios configuration)
```

## Acknowledgements

This project was developed by:
*   Pampana Satya Kiran (Full Stack Developer)
*   Kurimina Anuradha (Frontend Developer)
*   Manthini Neelaveni (UI/UX Designer)
*   Kambala Vijaya Sankar (Backend Developer)
*   Palaka Dhanunjaya (Database Engineer)

Under the guidance of **Mrs. G. Nirosha**, Assistant Professor, GMR Computer Science Engineering.
