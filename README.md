NexusFlow AI
A full-stack user and administration platform built with React,
Node.js, Express, and MongoDB. NexusFlow AI provides secure
authentication, role-based access control, user management, and profile
management through a responsive web application.
Live Application
- Frontend: https://nexus-flow-ai-psi.vercel.app
- Backend: https://nexusflow-ai-753i.onrender.com
- Health check: https://nexusflow-ai-753i.onrender.com/api/health
Features
Authentication and Authorization
- User registration and login using email and password.
- Password hashing with bcrypt.
- JWT-based authentication.
- Protected API routes.
- Role-based access control for admin and user roles.
- Account activation checks.
Admin
- View dashboard statistics.
- View, search, and filter regular users.
- Create, update, activate, deactivate, and delete users.
- Admin-only operations are protected by backend authorization.
User
- Access a personal dashboard.
- View and update profile information.
- Access protected user features.
How It Works
NexusFlow AI follows a client-server architecture. The React frontend
communicates with the Express backend through REST API requests, while
MongoDB stores user and application data.
1. User Registration
1. A visitor submits their name, email, and password through the
   registration page.
2. The frontend sends the details to POST /api/users/register.
3. The backend validates the input and checks whether the email is
   already registered.
4. The password is hashed with bcrypt before the user is saved in
   MongoDB.
5. The API returns a successful registration response. The user can
   then proceed to the login page.
2. User Login
1. The user submits their email and password on the login page.
2. The frontend sends the credentials to POST /api/users/login.
3. The backend finds the account and compares the submitted password
   with the stored bcrypt hash.
4. If the credentials are valid and the account is active, the backend
   creates a signed JWT.
5. The frontend stores the token for the authenticated session and uses
   it for protected API requests.
3. Accessing Protected Routes
1. The frontend sends the JWT in the HTTP Authorization header as a
   Bearer token.
2. Authentication middleware verifies the token using the backend's
   JWT_SECRET.
3. The middleware retrieves the corresponding user from MongoDB and
   checks the account status.
4. The authenticated user's database ID, email, and role are attached
   to the request.
5. The request continues only when authentication succeeds.
4. Role-Based Access
- User: Can access their own dashboard and profile features.
- Admin: Can access administrative endpoints and user-management
  features.
- The backend checks the user's role before allowing admin-only
  operations. Frontend route protection improves navigation, but
  backend authorization is the security boundary.
5. User and Dashboard Management
- Admin requests can retrieve user lists, search and filter users,
  view dashboard statistics, update user details or status, and delete
  regular user accounts.
- Users can retrieve and update their own profile through protected
  endpoints.
- MongoDB stores account details, password hashes, roles, account
  status, and timestamps.
System Flow
Visitor
   |
   v
React Frontend
   |
   | REST API request
   v
Express / Node.js Backend
   |
   +--> Input validation
   |
   +--> JWT authentication middleware
   |
   +--> Role authorization (where required)
   |
   v
MongoDB Database
   |
   v
API response
   |
   v
React UI updates
Technology Stack
  Area              Technologies
  Frontend          React, JavaScript, Tailwind CSS
Backend           Node.js, Express.js
Database          MongoDB, Mongoose
Authentication    JSON Web Tokens (JWT), bcrypt
API security      Helmet, CORS, express-rate-limit
Validation        Zod
Deployment        Vercel (frontend), Render (backend)
Version control   Git, GitHub
Project Structure
NexusFlow-AI/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── validators/
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── config/
        ├── context/
        ├── pages/
        └── services/
API Overview
The backend API is hosted at:
https://nexusflow-ai-753i.onrender.com
  Method   Endpoint                Purpose
  GET      /api/health           Check backend health
POST     /api/users/register   Register a user
POST     /api/users/login      Log in
GET      /api/users/me         Get the authenticated user's profile
PUT      /api/users/me         Update the authenticated user's profile

Additional user-management and dashboard endpoints are protected and
intended for authorized administrators.
Local Development
Prerequisites
- Node.js and npm
- MongoDB database
- Git
1. Clone the repository
git clone https://github.com/shivaniverma2002/NexusFlow-AI.git
cd NexusFlow-AI
2. Set up the backend
cd backend
npm install
Create a backend environment file using the variable names expected by
the backend configuration. At minimum, configure:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
Start the backend using the development or start script defined in
backend/package.json.
3. Set up the frontend
Open a second terminal:
cd frontend
npm install
Create the frontend environment file:
VITE_API_URL=http://localhost:5000
Start the frontend using the development script defined in
frontend/package.json.
Keep secrets and environment files out of Git. Never commit your
MongoDB connection string, JWT secret, or other credentials.

Security Notes
- Passwords are stored as bcrypt hashes, not plain text.
- JWT secrets must be stored in backend environment variables.
- Admin authorization is enforced by backend middleware; hiding
  frontend pages alone is not sufficient.
- Do not expose credentials or commit .env files.
- Use HTTPS for deployed environments.
Deployment
- Deploy the frontend from the frontend application using Vercel.
- Deploy the backend from the backend application using Render.
- Configure environment variables separately in each hosting platform.
- Set the frontend VITE_API_URL to the deployed backend base URL.
- Configure backend CORS to allow the deployed frontend origin.
Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a descriptive message.
5. Open a pull request.
License
Add a license file and update this section if you intend to distribute
the project under a specific open-source license.


