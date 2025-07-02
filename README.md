# 📦 Memory Haven

**Memory Haven** is a full-stack web application where users can securely store personal memories (text, images, audio, or video) that are only accessible after a future unlock date. Think of it as a digital time capsule platform!

## 🛠 Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js, Express.js 
- **Database**: MongoDB  
- **Authentication**: JWT (JSON Web Tokens)  

---

## 🚀 Features

- ✅ User Registration and Login  
- ✅ Protected Routes with JWT Authentication  
- ✅ Create Time Capsules with:
  - Future Unlock Date  
  - Optional media uploads (images, audio, video)  
- ✅ View Your Capsules  
- ✅ Capsules stay private until the unlock date  
- ✅ Responsive & clean UI

---

## ⚙️ Setup Instructions

### 📦 Backend

1. Navigate to the backend directory: cd backend
2. Install dependencies: npm install
3. Create a .env file:
    PORT=5000
    MONGO_URI=mongodb+srv://user1:user1%40mongo@cluster-mh.pjjo2.mongodb.net/memory_haven?retryWrites=true&w=majority&appName=Cluster-mh
    JWT_SECRET=khushbuwebdev
5. Start the backend server: node index.js


### 💻 Frontend

1. Navigate to the frontend directory: cd frontend
2. Install dependencies:  npm install
3. Start the frontend app:  npm start
 
## 🔐 Authentication

- JWT token is stored in \`localStorage\` after login.
- Protected routes (like profile and capsule creation) require the token in the \`Authorization\` header.

---

## 📤 File Uploads

- Media files are stored in a local \`/uploads/\` folder.
- Uploaded files are linked directly in capsules.


## 🧠 Future Ideas

- Email reminders when capsule opens  
- Share capsule access with friends  
- Password-protected capsules  
- AI-generated memory summaries  
- Timeline view of capsules  

---

## 👤 Author

**Khushbu Sharma**  
📧 khushbu.sharma7105@gmail.com  
💻 https://github.com/Khushbu710

Open to suggestions and improvements

---


