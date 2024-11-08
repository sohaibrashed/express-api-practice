# Express API with MongoDB, Mongoose, Authentication & Authorization

This project is a RESTful API built using Express, MongoDB, and Mongoose. It includes authentication and authorization with JWT, role-based access control, and middleware for validation and error handling.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Requirements

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sohaibrashed/express-api-practice.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your MongoDB instance (local or cloud) and note the connection URI.

## Configuration

1. Create a `.env` file in the root directory and add your environment variables:

   ```env
   NODE_ENV=
   PORT=
   LIMIT=
   DB_USER_NAME=
   DB_PASSWORD=
   MONGODB_URI=
   JWT_SECRET=
   ```

2. Update the `MONGODB_URI` with your actual MongoDB connection string.

## Running the Application

To start the server in development mode, use:

```bash
npm run server
```
