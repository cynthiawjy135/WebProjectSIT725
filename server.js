const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./db');
const routes = require('./routes');
const passport = require('./middlewares/passport');
const cors = require('cors');
const http = require('http'); // Needed to create server for Socket.IO
const socketIo = require('socket.io');
const validateEnv = require('./helpers/validateEnv');
const secretAngelSocket = require("./sockets/secretAngelSocket");
const likeNotificationSocket = require("./sockets/likeNotificationSocket");
const eventReminderSocker = require("./sockets/eventReminderSocket");
validateEnv();

//for Quiz Admin
const quizAdminRoutes = require('./routes/quizAdminRoutes');

const app = express();
const port = 3000;

const { Server } = require('socket.io');
const { setupSocket } = require('./socket/chat');

const socketio = require('socket.io');
require('dotenv').config();
const flash = require('connect-flash');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));


app.use(cookieParser());
const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "Secure_Secret_Key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false
  }
});

// Use it in Express

app.use(sessionMiddleware,
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(flash());
// Makes messages available in all EJS views
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});



app.use(passport.initialize());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

connectDB();


app.use('/', routes);



const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// === Socket.IO Setup (in socket/chat.js) ===
setupSocket(io, sessionMiddleware);

  
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  likeNotificationSocket(io, socket);
  secretAngelSocket(io, socket);
});

app.set('socketio', io);

module.exports = { app, server, io };


if (require.main === module) {
  server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}
//QuizAdmin
app.use('/quizAdmin', quizAdminRoutes);


