# Phonebook App – Full Stack Project

This is a full stack phonebook application built with **Node.js**, **Express**, and a **React frontend**. The backend serves both the API and the static frontend files.

## 📦 Features

- Add, update, and delete contacts
- Show notification messages for actions
- Data validation (name and phone number)
- Full stack deployment on [Fly.io](https://fly.io)
- Request logging with [Morgan](https://www.npmjs.com/package/morgan)

## 🚀 Live App

You can access the deployed version here:  
🔗 **[https://thephonebook-backend.fly.dev](https://thephonebook-backend.fly.dev)**

## 🗂 Project Structure
```
  project-root/
   ├── dist/ # React frontend build (served statically)
   ├── index.js # Express backend entry point
   ├── package.json
   └── README.md
```
> 🧩 The React frontend for this project can be found in the following directory within my main FullStackOpen repository:  
🔗 [Frontend source code](https://github.com/The-Memin/FullStackOpen/tree/main/part2/thePhoneBook)

## 📄 API Endpoints

- `GET /api/persons` – Get all contacts
- `GET /info` – Show total contacts and server time
- `GET /api/persons/:id` – Get a specific contact
- `POST /api/persons` – Add a new contact
- `PUT /api/persons/:id` – Update contact
- `DELETE /api/persons/:id` – Delete contact

## 📥 Installation

1. Clone the backend repo or this folder:
   ```bash
   https://github.com/The-Memin/Fullstackopen-part3.git
   cd Fullstackopen-part3
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Build the frontend (from the linked repo above), then move it to /dist:
   ```bash
   cd path/to/FullStackOpen/part2/thePhoneBook
   npm install
   npm run build
   # Then copy the build folder:
   cp -r build ../path/to/backend/dist
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
## ⚙️ Environment
You can configure a .env file for variables like the port or third-party API keys (if needed).

## 🛠 Dependencies
 - express
 - morgan
 - cors
  
-----
Feel free to improve or extend the app!

Made with ❤️ by Guillermo
---