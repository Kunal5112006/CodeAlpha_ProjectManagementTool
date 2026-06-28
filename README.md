# 📌 TaskFlow - Project Management Tool

A full-stack Project Management Tool developed as part of my **CodeAlpha Full Stack Development Internship**.

The application allows users to register, log in securely, create projects, manage tasks, update task status, and collaborate through task comments.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT Authentication)
- 👤 Secure User Authentication
- 📁 Create & Delete Projects
- ✅ Create, Update & Delete Tasks
- 📌 Task Status Management
  - Pending
  - In Progress
  - Completed
- 💬 Add Comments to Tasks
- 📱 Responsive Dashboard
- ☁️ MongoDB Atlas Database
- 🔒 Password Encryption using bcrypt.js

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

### Other Tools
- Git
- GitHub
- Postman
- VS Code

---

## 📂 Project Structure

```
CodeAlpha_ProjectManagementTool
│
├── backend
│   ├── models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend
    ├── index.html
    ├── dashboard.html
    ├── style.css
    └── script.js
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Kunal5112006/CodeAlpha_ProjectManagementTool.git
```

### Backend Setup

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the **backend** folder.

```env
PORT=5000
MONGO_URI=Your MongoDB Atlas Connection String
JWT_SECRET=YourSecretKey
```

### Start Backend

```bash
npm run dev
```

### Open Frontend

Open `frontend/index.html` using **Live Server**.

---

## 📸 Screenshots

- Login Page
- Dashboard
- Create Project
- Task Board
- Task Status Update

---

## 📚 What I Learned

- Building Full Stack Applications
- REST API Development
- User Authentication using JWT
- Password Hashing with bcrypt
- MongoDB Atlas Integration
- CRUD Operations
- Responsive UI Design
- Frontend & Backend Communication
- Git & GitHub Version Control

---

## 🎯 Internship

This project was developed during my **CodeAlpha Full Stack Development Internship** to improve practical skills in full-stack web development.

---

## 👨‍💻 Developer

**Kunal Khadke**

GitHub:
https://github.com/Kunal5112006

LinkedIn:
https://www.linkedin.com/in/kunal-khadke/

---

## ⭐ If you like this project, don't forget to give it a Star!
