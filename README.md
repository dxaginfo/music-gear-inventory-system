# 🎸 Musician Gear Tracker

A comprehensive web application for musicians, bands, and music organizations to track, manage, and maintain their musical equipment inventory.

![License](https://img.shields.io/github/license/dxaginfo/music-gear-inventory-system)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 🎯 Features

- **Equipment Inventory Management**
  - Detailed equipment cataloging with specifications
  - Photo uploads and management
  - Equipment categorization and tagging
  - QR code generation for physical labeling
  - Location tracking

- **Maintenance Tracking**
  - Maintenance scheduling and notifications
  - Service history logging
  - Repair cost tracking
  - Warranty information management

- **Equipment Usage**
  - Event-specific equipment lists
  - Check-in/check-out functionality
  - Missing equipment alerts
  - Usage history and analytics

- **Rental Management**
  - Rental periods and client assignments
  - Equipment condition assessment
  - Rental revenue tracking

- **Reports & Analytics**
  - Total value calculation for insurance
  - Maintenance cost analysis
  - Custom report generation
  - Data visualization dashboards

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Material-UI, Redux Toolkit
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Caching**: Redis
- **File Storage**: AWS S3
- **Authentication**: JWT
- **Deployment**: Docker, Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- AWS Account (for S3 storage)
- PostgreSQL

### Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/dxaginfo/music-gear-inventory-system.git
   cd music-gear-inventory-system
   ```

2. **Environment Setup**

   Create a `.env` file in the backend directory:

   ```bash
   # Database
   DATABASE_URL=postgresql://postgres:postgres@db:5432/music_gear_inventory

   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d

   # AWS S3
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   AWS_S3_URL=https://your-bucket-name.s3.amazonaws.com

   # Redis
   REDIS_URL=redis://redis:6379

   # App
   PORT=5000
   NODE_ENV=development
   APP_URL=http://localhost:3000
   ```

   Create a `.env` file in the frontend directory:

   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will start:
   - Frontend on http://localhost:3000
   - Backend API on http://localhost:5000
   - PostgreSQL database on port 5432
   - Redis on port 6379
   - Adminer (DB management) on http://localhost:8080

4. **Run Database Migrations**

   ```bash
   docker-compose exec backend npm run migrate
   ```

5. **Seed Initial Data (Optional)**

   ```bash
   docker-compose exec backend npm run seed
   ```

### Development Setup

1. **Backend Development**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Development**

   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📱 Mobile Responsive Design

The application is built with a mobile-first approach using Material-UI, ensuring optimal usability on all devices:

- Responsive grid layouts
- Touch-friendly UI components
- Progressive Web App capabilities
- Offline functionality
- Camera integration for scanning QR codes and taking photos

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Data encryption for sensitive information
- Input validation and sanitization
- Cross-site scripting (XSS) protection
- Cross-site request forgery (CSRF) protection
- Rate limiting to prevent abuse
- Comprehensive logging and monitoring

## 🔄 Integration Capabilities

The system is designed to integrate with:

- Accounting software
- Calendar services
- Music platforms (Spotify, SoundCloud, Bandcamp)
- Insurance providers
- Cloud storage services

## 📊 Deployment

### Production Deployment

1. Configure environment variables for production
2. Build Docker images
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```
3. Deploy using Docker Compose or to a cloud service (AWS, GCP, Azure)
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### CI/CD Pipeline

The repository includes GitHub Actions workflows for:
- Running tests
- Building Docker images
- Deploying to staging/production environments

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

DX AG - [dxag.info@gmail.com](mailto:dxag.info@gmail.com)

Project Link: [https://github.com/dxaginfo/music-gear-inventory-system](https://github.com/dxaginfo/music-gear-inventory-system)