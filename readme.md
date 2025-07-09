---------------------------------------------------------------------------------------------------------

# 🎬 YouTube Clone – Full Stack Project

A full-featured YouTube Clone built with the **MERN Stack** – MongoDB, Express.js, React, and Node.js.  
Includes user authentication, channel creation, video upload/playback, commenting, liking/disliking, and responsive UI.  
Media (videos, thumbnails, profile pictures) is managed using **Cloudinary**.



---------------------------------------------------------------------------------------------------------


## 🔗 GitHub

- **GitHub Repo**: ----   https://github.com/pushpendra2553/youtube-clone
---

---------------------------------------------------------------------------------------------------------

## 🎥 Demo Video

Attachend in only folder---------> Demo Video.mp4

Demo Video Link ------ https://drive.google.com/file/d/1vxmqBYox3HNV4MIElkRE6atw7QosG29b/view?usp=sharing

---------------------------------------------------------------------------------------------------------

## 📦 Tech Stack

### 🌐 Frontend

- **React** (with Vite)
- **Redux Toolkit** – Global state management
- **Tailwind CSS** – Utility-first styling
- **Axios** – HTTP requests


---------------------------------------------------------------------------------------------------------


### 🔧 Backend

- **Node.js + Express** – RESTful APIs
- **MongoDB + Mongoose** – NoSQL database
- **Cloudinary** – Video, thumbnail, and image storage
- **Multer + Streamifier** – Media upload handlers
- **JWT & bcrypt** – Secure authentication
- **dotenv** – Environment configuration

--------------------------------------------------------------------------------------------------------



## ✨ Features

- 🔐 **Authentication:** Register/Login with JWT
- 🎦 **Video Uploading and Streaming**
- 👤 **Channel Management** (Create/Edit/Delete)
- 💬 **Comment System** (Add/Edit/Delete)
- 👍 **Like/Dislike Functionality**
- 🔎 **Video Search and Filter**
- 📱 **Responsive Design**
- 📂 **My Channel Dashboard**
- 🔁 **Subscriptions**


--------------------------------------------------------------------------------------------------------



## 📁 Folder Structure

yotube-clone/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── commentController.js
│   │   └── videoController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── multer.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   ├── Video.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── commentRoutes.js
│   │   └── videoRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── react.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChannelInfo.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── CommentsToggle.jsx
│   │   │   ├── CreateChannelForm.jsx
│   │   │   ├── DescriptionToggle.jsx
│   │   │   ├── EditChannelModal.jsx
│   │   │   ├── EditVideoForm.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LikeDislikeButtons.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SuggestedVideos.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── VideoCardWithActions.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── authAPI.js
│   │   │   │   └── authSlice.js
│   │   │   ├── channel/
│   │   │   │   ├── channelAPI.js
│   │   │   │   └── channelSlice.js
│   │   │   ├── comments/
│   │   │   │   ├── commentAPI.js
│   │   │   │   └── commentSlice.js
│   │   │   ├── search/
│   │   │   │   ├── searchAPI.js
│   │   │   │   └── searchSlice.js
│   │   │   ├── ui/
│   │   │   │   └── uiSlice.js
│   │   │   └── video/
│   │   │       ├── videoAPI.js
│   │   │       └── videoSlice.js
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── ChannelPage.jsx
│   │   │   ├── CreateChannel.jsx
│   │   │   ├── EditVideoPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UploadVideo.jsx
│   │   │   └── VideoWatchPage.jsx
│   │   ├── router/
│   │   │   └── AppRouter.jsx
│   │   ├── utils/
│   │   │   ├── axiosInstance.js
│   │   │   └── formatDuration.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── store.js
│   ├── .gitignore
│   ├── eslint.config.js
│   └── index.html
```


--------------------------------------------------------------------------------------------------------

## 🚀 Getting Started

### 🖥️ Backend Setup

```bash
# Clone repo & navigate
git clone https://github.com/pushpendra2553/youtube-clone.git
cd YouTube-Clone/backend

# Install dependencies
npm install

# Configure .env file
# Add MongoDB URI, JWT_SECRET, Cloudinary credentials, etc.

# Start server
npm run start
# Runs on http://localhost:5000
```

### 💻 Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:5173
```

--------------------------------------------------------------------------------------------------------

## 🔌 API Routes

### 🔐 Auth Routes – `/api/auth`

| Method | Endpoint  | Description                                     |
| ------ | --------- | ----------------------------------------------- |
| POST   | /register | Register a new user (with profile image upload) |
| POST   | /login    | Login a user                                    |
| GET    | /me       | Get logged-in user info (protected)             |

### 📺 Video Routes – `/api/videos`

| Method | Endpoint     | Description                                 |
| ------ | ------------ | ------------------------------------------- |
| GET    | /search      | Search videos                               |
| GET    | /            | Get all videos                              |
| GET    | /user        | Get videos uploaded by logged-in user       |
| GET    | /:id         | Get a single video by ID                    |
| POST   | /upload      | Upload a new video (with thumbnail + video) |
| PUT    | /:id         | Update a video (protected, with new files)  |
| DELETE | /:id         | Delete a video (protected)                  |
| POST   | /:id/like    | Like or unlike a video                      |
| POST   | /:id/dislike | Dislike or remove dislike                   |
| PATCH  | /:id/views   | Increase view count                         |

### 💬 Comment Routes – `/api/videos/:videoId/comments`

| Method | Endpoint                                 | Description                  |
| ------ | ---------------------------------------- | ---------------------------- |
| POST   | /api/videos/:videoId/comments            | Add a comment (protected)    |
| GET    | /api/videos/:videoId/comments            | Get comments on a video      |
| PUT    | /api/videos/:videoId/comments/:commentId | Edit a comment (protected)   |
| DELETE | /api/videos/:videoId/comments/:commentId | Delete a comment (protected) |

✅ Comments are nested under videos, using `mergeParams: true`.

### 📡 Channel Routes – `/api/channels`

| Method | Endpoint       | Description                       |
| ------ | -------------- | --------------------------------- |
| POST   | /              | Create a channel (with banner)    |
| GET    | /:id           | Get a channel by ID               |
| PUT    | /:id           | Update channel info (with banner) |
| DELETE | /:id           | Delete a channel                  |
| POST   | /:id/subscribe | Toggle subscription to a channel  |

-----------------------------------------------------------------------------------------------------

## 🛠 Scripts

### Backend

| Script        | Description               |
| ------------- | ------------------------- |
| npm run start | Start server with Nodemon |

### Frontend

| Script        | Description                   |
| ------------- | ----------------------------- |
| npm run dev   | Start Vite dev server         |
| npm run build | Build frontend for production |

------------------------------------------------------------------------------------------------------

## 📦 Notable Packages

### Backend

express, mongoose, jsonwebtoken, bcrypt, cloudinary, multer, streamifier, dotenv, cors, nanoid, express-async-handler

### Frontend

react, redux-toolkit, axios, react-router-dom, tailwindcss, vite, react-icons, react-hot-toast

---------------------------------------------------------------------------------------------------------

## 🙋‍♂️ Author

Pushpendra kumar Sharma

GitHub: pushpendra2553

Github Link --- https://github.com/pushpendra2553/youtube-clone

---------------------------------------------------------------------------------------------------------
