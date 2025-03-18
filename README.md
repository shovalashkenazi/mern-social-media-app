# mern-social-media-app - Project Description

A full-stack web application that combines Backend and Frontend with support for a variety of modern technologies.

## Project Structure

The project is divided into two main parts:

```
/WebApp project
├── /frontend - Client-side, based on React and TypeScript
└── /backend - Server-side, based on Node.js, Express and TypeScript
```

## Technologies

### Frontend

- **Framework**: React 19 with TypeScript
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **User Interface**: Chakra UI, React Icons, Framer Motion
- **Animations**: React Lottie
- **Firebase Integration**: Authentication
- **Testing**: Jest, React Testing Library

### Backend

- **Programming Language**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT (JSON Web Tokens), bcryptjs
- **File Upload**: Multer
- **API Documentation**: Swagger (swagger-ui-express)
- **Form and Request Management**: CORS, Express middleware
- **Firebase Integration**: Firebase Admin SDK
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Testing**: Jest, Supertest, MongoDB Memory Server

## Key Features

- **Complete Authentication System**: Registration, login, user management
- **Post Management**: Creation, editing, deletion, and display of posts
- **Image Upload**: Support for uploading and storing images
- **User Profile**: Customized profile page with user details editing
- **Documented API Interface**: REST API documentation using Swagger
- **AI Integration**: Integration with OpenAI API for answers and recommendations

## Installation and Running

### Prerequisites

- Node.js (version 18 and above)
- MongoDB (local or cloud service)
- Firebase account (for authentication and storage services)
- OpenAI API key (optional, for AI functions)

### Installation Steps

#### Backend

```bash
cd backend
npm install
```

Set up a `.env` file with the following environment variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/database
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend

```bash
cd frontend
npm install
```

### Running the Project

#### Backend

For development:

```bash
npm run dev
```

For building and running in production environment:

```bash
npm run build
npm start
```

#### Frontend

```bash
npm start
```

## Testing

### Backend

```bash
npm test
```

### Frontend

```bash
npm test
```

## API Documentation

API is documented using Swagger and available at:

```
http://localhost:5000/api-docs
```

## Developers
