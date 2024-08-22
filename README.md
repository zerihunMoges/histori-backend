# Histori Backend

## Overview

**Histori** is a project that provides a platform to explore historical events through interactive maps. The backend of the application is responsible for serving historical data, managing user requests, and ensuring efficient data retrieval and manipulation.

Frontend - https://github.com/Yared04/Histori

## Features

- **Historical Data Management:** Manage and retrieve historical events data.
- **GeoJSON Integration:** Serve geoJSON data for interactive mapping.
- **API Endpoints:** Provide endpoints for accessing historical events and geoJSON data.

## Technologies

- **Node.js**: JavaScript runtime for building the backend.
- **Express.js**: Web framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for storing historical data, GeoJson Data and user information.
  
## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/zerihunMoges/histori-backend.git
   cd histori-backend

2. **Install Dependencies:**

   ```bash
   npm install

3. **Set Up Environment Variables:**
   Create a .env file in the root directory and add the following variables:
   
   ```bash
   DATABASE_URI=your_mongodb_connection_string
   PORT=your_preferred_port_number
  
4. **Run the Application:**
   The backend server will start on the specified port.
  

