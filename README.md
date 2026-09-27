# 🎓 Student Blog Hub – A MERN Stack Blogging Platform

A clean, modern, and beginner-friendly **MERN Stack College Mini Project** created for academic demonstration, student knowledge sharing, and viva examinations.

---

## 📌 Project Overview

**Student Blog Hub** provides an intuitive, collaborative blogging space designed specifically for college students. Students can register accounts, log in securely with JWT authentication, publish educational blogs, view campus project write-ups, filter by topic, search by title, and interact with peers via likes and real-time comments.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Single Page Application (SPA) User Interface |
| **Routing** | React Router v6 | Client-side page navigation |
| **HTTP Client**| Axios | REST API communication with JWT interceptors |
| **Styling** | Vanilla Modern CSS | Clean, responsive, student-friendly layout |
| **Backend** | Node.js & Express.js | REST API server and middleware |
| **Database** | MongoDB & Mongoose | Document-based data storage and object modeling |
| **Security** | JWT & bcryptjs | Password hashing and stateless authentication |

---

## 📂 Project Structure

```
Mini project MERN/
├── server/                      # Express & Node.js Backend
│   ├── config/
│   │   └── db.js                # MongoDB connection handler
│   ├── controllers/
│   │   ├── authController.js    # Register, login, user profile logic
│   │   └── blogController.js    # CRUD, like/unlike, and comments logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # Student user schema
│   │   ├── Blog.js              # Blog post schema
│   │   └── Comment.js           # Comment schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   └── blogRoutes.js        # /api/blogs endpoints
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Example environment configuration
│   ├── package.json
│   └── server.js                # Main server entry point
│
├── client/                      # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation bar with auth status
│   │   │   └── BlogCard.jsx     # Reusable blog card component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global user authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Feed, Search & Category filters
│   │   │   ├── Login.jsx        # Student login page
│   │   │   ├── Register.jsx     # Student registration page
│   │   │   ├── CreateBlog.jsx   # Blog creation form
│   │   │   ├── EditBlog.jsx     # Edit own blog page
│   │   │   ├── BlogDetails.jsx  # Full blog, like button, comments
│   │   │   └── Profile.jsx      # Student profile & My Blogs management
│   │   ├── services/
│   │   │   └── api.js           # Axios instance with auth headers
│   │   ├── App.jsx              # Main router and layout
│   │   ├── index.css            # Responsive CSS stylesheet
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md                    # Setup and viva documentation
└── COLLEGE_REPORT.md            # Complete college project report template
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (version 18 or higher)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed locally **OR** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.

---

### 2. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create or verify the `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/student_blog_hub
   JWT_SECRET=student_blog_hub_super_secret_key_2026
   ```
   > **Note for MongoDB Atlas users**: If using MongoDB Atlas in the cloud, replace `MONGO_URI` with your connection string:
   > `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/student_blog_hub?retryWrites=true&w=majority`

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run at **http://localhost:5000**.

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will open at **http://localhost:5173**.

---

## 📡 REST API Reference

### Authentication APIs (`/api/auth`)
* `POST /api/auth/register` - Registers a new student user (hashes password with bcrypt)
* `POST /api/auth/login` - Authenticates user and returns JWT token
* `GET /api/auth/me` - Retrieves authenticated student profile

### Blog Management APIs (`/api/blogs`)
* `GET /api/blogs` - Returns all blogs (supports `?category=...` and `?search=...`)
* `GET /api/blogs/user/my-blogs` - Returns blogs written by the logged-in user
* `GET /api/blogs/:id` - Returns single blog post details
* `POST /api/blogs` - Creates a new blog (Protected)
* `PUT /api/blogs/:id` - Updates existing blog (Protected: Author only)
* `DELETE /api/blogs/:id` - Deletes blog and its comments (Protected: Author only)

### Interaction APIs
* `POST /api/blogs/:id/like` - Toggles like/unlike on a blog post (Protected)
* `POST /api/blogs/:id/comments` - Adds a comment to a blog post (Protected)
* `GET /api/blogs/:id/comments` - Fetches all comments for a blog post

---

## 🎓 Viva Voce Preparation (College Q&A)

Here are the most common questions asked during external lab/viva evaluations:

1. **What is MERN stack?**
   * **MongoDB**: NoSQL document database storing data in JSON-like BSON format.
   * **Express.js**: Minimalist web application framework for Node.js.
   * **React.js**: Front-end JavaScript library for building component-based user interfaces.
   * **Node.js**: JavaScript runtime engine executing JavaScript on the server.

2. **How does JWT Authentication work?**
   * When a user logs in, the server generates a JSON Web Token (JWT) signed with a secret key.
   * The client stores this token in `localStorage`.
   * On subsequent requests to protected endpoints, Axios automatically attaches the token in the `Authorization: Bearer <token>` header.
   * The `authMiddleware` verifies the token before granting access.

3. **How are passwords stored securely?**
   * Passwords are never stored in plain text. We use `bcryptjs` to generate a cryptographic salt and hash the password before saving it into MongoDB.

4. **How are unauthorized edits/deletions prevented?**
   * In `blogController.js`, before performing update or delete operations, the server compares `blog.author.toString()` with `req.user.id`. If they do not match, a `403 Forbidden` response is returned.

5. **What is the SDG Goal associated with this project?**
   * **SDG 4: Quality Education** — Student Blog Hub promotes open knowledge exchange, peer-to-peer technical learning, and project collaboration among college students.

---

## 📄 Academic Project Report

A complete 20–25 page college mini-project report template containing Abstract, Software/Hardware requirements, System Architecture, Selected Code Snippets, Test Cases, and Conclusion is provided in [COLLEGE_REPORT.md](COLLEGE_REPORT.md).
