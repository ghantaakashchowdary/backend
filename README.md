# Task Manager API

## Overview

A scalable REST API built with Node.js, Express.js, MongoDB, JWT Authentication, and Role-Based Access Control.

## Features

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Role-Based Access Control (Admin/User)
* Task CRUD Operations
* MongoDB Database
* Deployed on Render

## Technologies Used

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs
* Render

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Install dependencies:

```bash
npm install
```

Create a .env file:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

Run the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/admin

### Tasks

POST /api/tasks

GET /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

## Deployment

Backend URL:

https://backend-mn9y.onrender.com
