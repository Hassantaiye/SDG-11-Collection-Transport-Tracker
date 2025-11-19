# Waste Collection & Transport Tracker
## 🌐 Live Deployment

| Platform | Status | Link |
|----------|--------|------|
| **Vercel** | ✅ Live | [Visit Site](https://sdg-11-waste-collection-transport-tracker-fpj4ga8we.vercel.app/) |
| **Render** | ✅ Live | [Visit Site](https://waste-tracker-and-collection-api.onrender.com/) |

SDG-11 Waste Collection & Transport Tracker
A comprehensive waste management system built with the MERN stack (MongoDB, Express, React, Node.js) that enables efficient tracking and management of waste collection operations across communities.

🌟 Features
For Residents
Request Pickups: Schedule waste collection with detailed information (address, waste type, date)
Track Pickups: Monitor the status of pickup requests in real-time
Live Map: View driver locations and track collection progress
# SDG-11 Waste Collection & Transport Trackerr

A comprehensive waste management system built with the MERN stack (MongoDB, Express, React, Node.js) that enables efficient tracking and management of waste collection operations across communities.

🌟 Features

## For Residents
- **Request Pickups**: Schedule waste collection with detailed information (address, waste type, date)
- **Track Pickups**: Monitor the status of pickup requests in real-time
- **Live Map**: View driver locations and track collection progress
- **Dashboard**: Personalized overview of all pickup activities

## For Drivers
- **View Assignments**: Access assigned pickup requests
- **Update Location**: Real-time GPS location sharing via Socket.io
- **Profile Management**: Update personal and vehicle information
- **Status Updates**: Mark pickups as completed or in-progress

## For Administrators
- **Analytics Dashboard**: Comprehensive statistics and insights
  - Total pickups, drivers, and residents
  - Completion rates and pending requests
  - Weekly and monthly trend analysis
- **Driver Management**: View and manage driver accounts and vehicle information
- **Pickup Management**: Assign drivers, monitor status, and manage all collection requests
- **Live Tracking**: Real-time driver location heatmap
- **Route Optimization**: Manage collection routes and zones

---

🛠️ Tech Stack

### Frontend
- React 19 — UI framework
- Vite — Build tool
- Tailwind CSS 4 — Styling
- React Router 7 — Navigation
- Axios — HTTP client
- Socket.io Client — Real-time communication
- Leaflet — Interactive maps
- Chart.js — Data visualization
- React Hot Toast — Notifications

### Backend
- Node.js — Runtime environment
- Express 5 — Web framework
- MongoDB — Database
- Mongoose — ODM
- Socket.io — Real-time communication
- JWT — Authentication
- bcryptjs — Password hashing

---

📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── layout/        # Layout components
│   └── public/            # Static assets
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── socket/           # Socket.io handlers
│
└── README.md
```

---

🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

Clone the repository

```bash
git clone https://github.com/yourusername/SDG-11-Collection-Transport-Tracker.git
cd SDG-11-Waste Collection & Transport Tracker
```

### Setup Server

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Setup Client

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running the Application

Start the Backend Server

```bash
cd server
npm start
```

Server runs on http://localhost:5000

Start the Frontend

```bash
cd client
npm run dev
```

Client runs on http://localhost:5173

---

📊 API Endpoints

### Authentication

- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Pickups

- POST `/api/pickups` - Create pickup request (Resident)
- GET `/api/pickups` - Get all pickups (Admin)
- GET `/api/pickups/my` - Get user's pickups
- PUT `/api/pickups/:id/status` - Update pickup status
- DELETE `/api/pickups/:id` - Delete pickup (Admin)

### Drivers

- GET `/api/drivers` - Get all drivers (Admin)
- GET `/api/drivers/:id` - Get driver by ID
- PUT `/api/drivers/profile` - Update driver profile
- PUT `/api/drivers/location` - Update driver location

### Admin Analytics

- GET `/api/admin/analytics/overview` - Get dashboard statistics
- GET `/api/admin/analytics/weekly` - Get weekly statistics
- GET `/api/admin/analytics/monthly` - Get monthly statistics
- GET `/api/admin/analytics/driver-locations` - Get driver locations

---

🔐 User Roles

### Resident
- Request waste pickups
- View personal pickup history
- Track driver locations

### Driver
- View assigned pickups
- Update live location
- Update pickup status

### Admin
- Manage all users
- Assign drivers to pickups
- View analytics and reports
- Monitor system operations

---

🌐 Deployment

See `DEPLOY.md` for detailed deployment instructions for:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

📝 License

This project is licensed under the ISC License.

---

👥 Authors

Your Name - Initial work

---

🙏 Acknowledgments

Built to support SDG 11: Sustainable Cities and Communities
Inspired by the need for efficient waste management systems
Thanks to all contributors and the open-source community

---

📧 Contact

For questions or support, please open an issue on GitHub.

Note: This project is actively maintained and open to contributions. Please check the issues page for current tasks and feature requests.

