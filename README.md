# OTIS: Online Temple Information System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)

## What the project does

**OTIS (Online Temple Information System)** is a comprehensive, modern frontend web application designed to streamline temple administration and enhance the devotee experience. Serving as a centralized platform, it efficiently manages temple information, sevas (services), events, donations, and bookings, offering a unified portal for both administrators and regular users. 

Built with React and Vite, the platform features a responsive UI, real-time map integration with Leaflet, interactive charts with Recharts, and secure payment processing capabilities through Stripe.

## Why the project is useful

OTIS simplifies the interaction between temples and devotees by offering a robust feature set, eliminating manual paperwork and fragmented communication channels.

### Key Features

* **User Authentication**: Secure user registration, login, profile management, and Two-Factor Authentication (OTP via email).
* **Role-based Access**: Dedicated Admin Dashboard for administrators to manage temples, sevas (services, prices, limits), users, and monitor bookings/donations with visual charts.
* **Temple Exploration & Maps**: Browse, search, and view detailed information including history, descriptions, and galleries. Built-in interactive map support for locating temples.
* **Booking System**: Seamlessly book Sevas (Darshan) and Accommodations with dynamic ticket availability tracking.
* **Secure Payments**: Integrated with **Stripe** for processing bookings and donations securely.
* **Donation Portal**: Dedicated portals for transparent user donations and automated receipt generation.
* **Customer Support Chatbot**: Integrated conversational interface to quickly assist users with standard inquiries and routing.

## How users can get started

To run the OTIS frontend locally for development or testing, follow these steps:

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satyakiran29/OTIS.git
   cd OTIS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and provide the necessary API keys:
   ```env
   # Stripe key for processing payments
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Geoapify key for map autocomplete and geocoding
   VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Usage Snippet

The application uses an Axios instance for making API requests. If you are running the backend locally or need to change the API server URI, you can update the configuration in `src/utils/axiosConfig.js`:

```javascript
// src/utils/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  // Change to your local backend URL for local backend development
  // baseURL: 'http://localhost:5000/api', 
  baseURL: 'https://api.your-production-server.com/api',
});

export default instance;
```

## Where users can get help

- **Issue Tracker**: If you find any bugs or have feature requests, please use the [GitHub Issues](https://github.com/satyakiran29/OTIS/issues) page.
- **Backend API**: The frontend relies on the OTIS backend application. Please refer to the [OTIS_API Backend Repository](https://github.com/satyakiran29/OTIS_API) for API payload references and backend setup instructions.
- **Discussions**: For general questions, setup aid, and project planning, check out the repository's discussions tab or open a new thread.

## Who maintains and contributes

This project was developed by undergraduate engineering students and relies on community contributions for continued maintenance.

**Core Team:**
* **Pampana Satya Kiran** (Full Stack Developer)
* **Kurimina Anuradha** (Frontend Developer)
* **Manthini Neelaveni** (UI/UX Designer)
* **Kambala Vijaya Sankar** (Backend Developer)
* **Palaka Dhanunjaya** (Database Engineer)

Special thanks to **Mrs. G. Nirosha** (Assistant Professor, GMRIT Computer Science Engineering) for project supervision and guidance.

### Contributing

We welcome contributions from the open-source community! Whether it's adding new features, fixing bugs, or improving documentation, your help is appreciated.

Please refer to our [Contributing Guide](docs/CONTRIBUTING.md) for detailed guidelines on how to submit pull requests, report issues, and respect community standards. For formatting rules, please see the `.eslintrc` configuration inside the project root.
