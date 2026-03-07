# OTIS: Online Temple Information System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success.svg?style=flat-square)

OTIS is a comprehensive, modern web application designed to streamline temple administration and enhance the devotee experience. Serving as a centralized platform, it efficiently manages temple information, sevas, events, donations, and bookings.

## 🌟 Why the project is useful

OTIS simplifies the interaction between temples and devotees by offering a robust feature set:

* **User Authentication**: Secure user registration and login system with Two-Factor Authentication (OTP via email) and password reset.
* **Admin Dashboard**: A role-based dashboard for administrators to manage temples, sevas (services, prices, limits), users, and monitor bookings/donations.
* **Temple Exploration**: Browse, search, and view detailed information including history, descriptions, and galleries.
* **Booking System**: Book Sevas (Darshan) and Accommodations with dynamic ticket availability tracking.
* **Secure Payments**: Integrated with **Stripe** for processing bookings and donations securely.
* **Donation Portal**: Dedicated portals for user donations and transparent receipt generation.

## 🚀 How users can get started

To run the OTIS frontend locally, follow these steps:

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later)
* npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satyakiran29/otis.git
   cd otis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add your Stripe publishable key:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Usage Snippet

If you need to define new API endpoints or adjust connection details, modify the Axios configuration in `src/utils/axiosConfig.js`, which currently points to the live server.

## 🤝 Where users can get help

- **Issue Tracker**: If you find any bugs or have feature requests, please use the [GitHub Issues](https://github.com/satyakiran29/otis/issues) page.
- **API Reference**: The frontend relies on the `otis-api` backend. Please refer to separate backend documentation if hosting the API locally.

## 🛠️ Who maintains and contributes

This project was developed and is maintained by:

*   **Pampana Satya Kiran** (Full Stack Developer)
*   **Kurimina Anuradha** (Frontend Developer)
*   **Manthini Neelaveni** (UI/UX Designer)
*   **Kambala Vijaya Sankar** (Backend Developer)
*   **Palaka Dhanunjaya** (Database Engineer)

Developed under the guidance of **Mrs. G. Nirosha**, Assistant Professor, GMRIT Computer Science Engineering.

### Contribution Guidelines

We welcome contributions! Please refer to our [Contributing Guide](docs/CONTRIBUTING.md) for details on how to get started with contributing code, reporting issues, or suggesting enhancements.
