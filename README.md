<img width="1897" height="859" alt="image" src="https://github.com/user-attachments/assets/6a92a7a9-aea6-49df-8d67-5df414954951" />

# EventX-A FireBase-Powered,Campus-Connected

<p align="center">
  <a href="https://eventxnitk.vercel.app/app">Demo Link</a>
</p>

## Overview

EventX transforms campus life into a connected digital ecosystem. Instead of scattered posters, WhatsApp groups, or word-of-mouth, EventX centralizes every college event into one dynamic platform. It visualizes
events on a 3D Google Maps view with location-based beacons, bridging the gap between student clubs and attendees through a unified, campus-centric experience.

### Key Features

- ** Paste-to-Add Events**: Using Gemini, pasted events details are parsed
- ** Secure NITK only Google Authentication**: using Firebase Auth
- ** Filter Events**: Based on clubs,food availability and Time(Upcoming,Present and Past Events)
- ** Maps**: A 3D map with beacons guiding you to every campus event
- ** Notification**:Timely reminders before every event begins
- ** Clickable Marker**: Showing full event details
- ** User Dashboard**: A centralized space where signed‑in users can view, delete(any upcoming event), and track the events they’ve posted.

### Architecture

<img width="1600" height="951" alt="image" src="https://github.com/user-attachments/assets/608f9baf-a98f-4593-9c7a-ef6648a87d87" />

### Use Case Diagram

### Technology Stack

####  Frontend
- **React**: Component‑based library for building dynamic and interactive UIs.  
- **Vite**: Lightning‑fast build tool for modern frontend development.  
- **Tailwind CSS**: Utility‑first CSS framework for rapid and responsive styling.

####  Used Firebase (BaaS)
- **Firebase Auth**:For authentication
- **Firestore**: Cloud‑hosted NoSQL database for real‑time data storage and synchronization.
- **Firebase Cloud Messaging**: for sending real‑time push notifications across web

####  Google Maps Platform

####  Gemini API

##  Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Create a Project on Firebase

### Installation

1.**Clone the repository**
  ```bash
  git clone https://github.com/M4yankkkk/eventhopper.git
  ```
2.**Install the dependencies**
  ```bash
  npm install
  ```
3.**Enviroment Setup**
  Create `.env` file in the current directory
  ```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_GOOGLE_MAPS_MAP_ID=your_map_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_api_key
  ```
4.**Firebase Setup**
- Enable Firebase auth and add Google Sign-in provider
- Enable Firestore Database (Check out the [documentation]([https://example.com/docs](https://firebase.google.com/docs/firestore/quickstart)) for more details.)

5.**Start Development Server**
  ```bash
  npm run dev
  ```

##  User Interface

### Key Pages & Components

- ** Landing Page**:Serves as the entry point with platform overview and user authentication.
- ** Dashboard**:Provides signed‑in users with an overview of their events, with time‑based filters (upcoming, ongoing, past) and the ability to delete upcoming events.
- ** Event Input**:Allows signed‑in users to create posts, parsed intelligently by Gemini, ensuring only unique events are added.
- ** Event Display**: Shows all events (upcoming, ongoing, past) with filters by time, food availibility and clubs, plus an integrated map view of event locations.
- ** 3D Map-component**:Displays events based on selected filters, with interactive beacon markers that reveal event details when clicked.


<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/2f0bc3f8-a63b-45c6-9bd3-226d1b780dea" />
<img width="1907" height="908" alt="image" src="https://github.com/user-attachments/assets/ebaf7241-29b6-465a-8538-226d401d2530" />
<img width="1907" height="902" alt="image" src="https://github.com/user-attachments/assets/5ccf53eb-864d-4c45-a36e-6563fe9033fa" />
<img width="1604" height="836" alt="image" src="https://github.com/user-attachments/assets/96f132d5-2f08-4a2f-b54f-acd04428f365" />

