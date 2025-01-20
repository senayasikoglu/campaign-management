# Campaign Dashboard

A full-stack application for managing marketing campaigns with real-time budget tracking.

## Features

- User authentication (login/register)
- Campaign management (CRUD operations)
- Real-time campaign budget tracking
- Responsive design
- Docker support for easy deployment

## Tech Stack

**Frontend:**
- React.js
- Context API for state management
- Axios for API calls
- CSS for styling

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Database Choice: MongoDB

### Why MongoDB?

For this campaign management application, MongoDB was chosen as the database solution for several key reasons:

1. **Schema Flexibility**
   - MongoDB's flexible document model allows easy addition of new fields without migrations

2. **Query Performance**
   - Good performance for read-heavy operations
   - Native support for pagination

3. **Ease of Setup**
   - Simple installation process (both locally and with Docker)
   - Reviewers can get started quickly with minimal database knowledge

4. **JSON-like Documents**
   - Natural fit for JavaScript/Node.js and reduces data transformation overhead

5. **Scalability**
   - Horizontal scaling capabilities for future growth

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- Docker and Docker Compose (you can also run manuelly)
- MongoDB (if running locally without Docker)

## Quick Start with Docker

Start the application using Docker Compose:

 ```bash
 docker compose up --build
```
The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Manual Setup

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required environment variables:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campaign-dashboard
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

4. Start the backend server:
```bash
npm run dev  
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get specific campaign
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

## Testing

Run backend tests:
```bash
cd backend
npm test
```
