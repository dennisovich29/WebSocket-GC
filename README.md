# WebSocket-GC
A real-time group chat application built using WebSockets, JavaScript, MongoDB, and Tailwind CSS. Users can join chat rooms, send messages, and see who is typing — all in real time.

Features
🧑‍🤝‍🧑 Join and leave chat rooms

💬 Real-time messaging with WebSockets

✍️ Typing indicators

🗃️ Messages stored in MongoDB

🎨 Styled using Tailwind CSS

📱 Works across devices (mobile + desktop)

Tech Stack
Backend: Node.js, Express, WebSocket, Mongoose

Frontend: HTML, JavaScript, Tailwind CSS

Database: MongoDB

Setup Instructions
Clone the repository:

bash
Copy
Edit
git clone https://github.com/<your-username>/WebScoket-GC.git
cd WebScoket-GC
Install dependencies:

nginx
Copy
Edit
npm install
Create a .env file in the root directory and add:

ini
Copy
Edit
MONGO_URI=mongodb://localhost:27017/GroupChat
Start the MongoDB server (if using Homebrew):

sql
Copy
Edit
brew services start mongodb-community
Run the server:

nginx
Copy
Edit
node server.js
Open index.html in your browser to use the app.

To Do
Add user authentication

Add Docker support

Switch frontend to React

Deploy to cloud (Render, Railway, etc.)

Author
Dennis Prathyush Paul
