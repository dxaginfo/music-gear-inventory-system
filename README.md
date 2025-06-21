# Music Gear Inventory System

A comprehensive web application for musicians, bands, and music organizations to track, manage, and maintain their musical equipment inventory.

## 🎸 Features

### Equipment Inventory Management
- Add and manage instruments and equipment with detailed information
- Upload photos of equipment for visual reference
- Categorize gear by type (guitars, amplifiers, pedals, etc.)
- Track equipment location (home, studio, on tour)
- Generate QR codes/tags for physical labeling

### Maintenance Tracking
- Log maintenance activities (string changes, setups, repairs)
- Set maintenance schedules based on usage or time intervals
- Receive notifications for upcoming or overdue maintenance
- Document repair history, costs, and warranty information

### Equipment Usage
- Create gig/event-specific equipment lists
- Check-in/check-out functionality for gear tracking
- Missing equipment alerts to prevent loss
- Track equipment usage history

### Rental Management
- Track rental periods and client assignments
- Assess equipment condition before and after rental
- Calculate rental revenue and analytics

### Reports & Analytics
- Calculate total equipment value for insurance purposes
- Track maintenance costs and analyze spending
- Generate custom reports for insurance and tax purposes

## 🚀 Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI for responsive design
- Redux Toolkit for state management
- Formik with Yup for form validation
- Progressive Web App (PWA) capabilities for offline access

### Backend
- Node.js with Express
- JWT authentication with refresh tokens
- Prisma ORM for database interactions
- Swagger/OpenAPI for API documentation

### Database
- PostgreSQL for relational data storage
- Redis for caching and performance optimization

### Infrastructure
- Docker for containerization
- GitHub Actions for CI/CD
- AWS deployment (EC2, RDS, S3)
- Firebase Cloud Messaging for notifications

## 📱 Mobile Experience
- Responsive design for all screen sizes
- PWA for mobile installation
- Camera integration for equipment photos
- QR code scanning for quick equipment identification

## 🔒 Security Features
- JWT-based authentication
- Role-based access control
- Data encryption
- Activity logging
- Two-factor authentication for sensitive operations

## 🏗️ System Architecture

```
[Client Layer]
   |
   | HTTPS
   v
[Load Balancer] --> [CDN] (for static assets, images)
   |
   | HTTP/WebSockets
   v
[Web Server Layer]
   | - Express.js API Server
   | - Authentication Middleware
   | - Request Validation
   |
   v
[Service Layer]
   | - Equipment Service
   | - Maintenance Service
   | - User Service
   | - Notification Service
   | - Report Service
   |
   v
[Data Access Layer]
   | - Prisma ORM
   |
   v
[Database Layer]
   | - PostgreSQL (Primary Data)
   | - Redis (Caching, Session)
   |
   v
[External Services]
   | - AWS S3 (File Storage)
   | - Firebase Cloud Messaging (Notifications)
   | - Email Service (Maintenance Alerts)
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)
- Redis (v6+)
- Docker and Docker Compose (optional for containerized setup)

### Local Development Setup

1. Clone the repository
```bash
git clone https://github.com/dxaginfo/music-gear-inventory-system.git
cd music-gear-inventory-system
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables
```bash
# In the backend directory
cp .env.example .env
# Edit .env with your database credentials and other configuration
```

4. Set up the database
```bash
cd backend
npx prisma migrate dev
```

5. Run the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

6. Access the application
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:5000/api-docs

### Docker Setup

1. Run with Docker Compose
```bash
docker-compose up -d
```

2. Access the application
- Frontend: http://localhost:3000
- API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### AWS Deployment

Detailed deployment instructions are available in the [DEPLOYMENT.md](./docs/DEPLOYMENT.md) file.

## 📋 Project Structure

```
music-gear-inventory-system/
├── backend/                   # Backend API server
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── index.js           # Entry point
│   ├── prisma/                # Database schema and migrations
│   └── tests/                 # Backend tests
├── frontend/                  # React frontend
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client services
│   │   ├── store/             # Redux state management
│   │   ├── styles/            # Global styles
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx            # Root component
│   └── tests/                 # Frontend tests
├── docs/                      # Documentation
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml         # Docker Compose configuration
└── README.md                  # Project documentation
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/dxaginfo/music-gear-inventory-system](https://github.com/dxaginfo/music-gear-inventory-system)

## 🙏 Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Material-UI](https://material-ui.com/)
- [Prisma](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [AWS](https://aws.amazon.com/)