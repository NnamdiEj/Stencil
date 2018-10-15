// ================ Import Modules ================ //
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const socket = require('socket.io');
const session = require('express-session');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');
const User = require('./models/user');
const mid = require('./public/javascripts/middleware');
//const sassMiddleware = require('node-sass-middleware');

// Create express app
const app = express();
const server = app.listen(3000, function() {
    console.log('Express app listening on port 3000');
});

// Setup socket.io on express server with adapter
const io = socket(server);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

// Use sessions for tracking login status
app.use(session({
    secret: 'Stencil better than DS',
    resave: true,
    saveUninitialized: false
}));

// Favicon Middleware
app.use(favicon(path.join(__dirname,'public','images','favicon3.jpg')));

// Setup MongoDB Connection
mongoose.connect("mongodb://localhost:27017/Stencil", { useNewUrlParser: true });
var db = mongoose.connection;
// On Mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Apply logging middleware
app.use(logger('dev'));

// JSON Body Parsing Middleware
// TODO: Get rid of one of these
app.use(express.json());
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route handling
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);

const Room = require('./public/javascripts/game-components/Room');

const room1 = new Room("Default Room 1", false, '', io);
const room2 = new Room("Default Room 2", false, '', io);
const room3 = new Room("Default Room 3", false, '', io);
const room4 = new Room("Default Room 4", false, '', io);

app.locals.rooms = [
    room1,
    room2,
    room3,
    room4
];

// New socket connection event handler
io.on('connection', function(socket) {

    // Log id of new socket
    console.log('New connection!', socket.id);

    // ========= Event Handlers ========= //

    // "Chat" Event
    socket.on('chat', function(data) {
        io.sockets.to(data.roomName).emit('chat', data);
    });

    // "Typing" Event
    socket.on('typing', function(data) {
        socket.to(data.roomName).broadcast.emit('typing', data);
    });

    // "Drawing" Event
    socket.on('draw', function(data) {
        socket.broadcast.to(data.roomName).emit('draw', data);
    });

    // "Join Room" Event
    socket.on('joinRoom', function(data) {
        socket.join(data.roomName);
        console.log("Joined room:", data.roomName)
    });

    // Log out current rooms and clients in rooms
    // TODO: Get rid of this.
    io.of('/').adapter.allRooms((err, rooms) => {
        console.log('These are the rooms: ', rooms); // an array containing all rooms (across every node)
        for (let i=0; i < rooms.length; i++) {
            io.in(rooms[i]).clients((err, clients) => {
                console.log('These are the clients in room ' + i + ':', clients);
            });
        }
    });

});

// Game room GET route
app.get('/gamerooms/room/:roomName', mid.requiresLogin, function(req, res, next) {

    // Use user id to find user information
    User.findById(req.session.userID)
        .exec(function (error, user) {
            if (error) { // Send any errors to error handler
                return next(error);
            } else { // Log rooms and clients and update number of players in each room
                for (let i = 0; i < app.locals.rooms.length; i++) {
                    const roomName = app.locals.rooms[i].getRoomName();
                    io.in(roomName).clients((err, clients) => {
                        console.log(clients);
                        console.log(app.locals.rooms);
                        app.locals.rooms[i].numberOfPlayers = clients.length;
                    });
                }

                // Render game template with needed variables
                return res.render('game', {
                    roomName: req.params.roomName,
                    username: user.username,
                    loggedin: true
                });
            }
        });
});

/* GET home page. */
app.get('/', function(req, res, next) {

    // Initialize total players
    let totalPlayers = 0;

    // Update number of players in each room
    for (let i = 0; i < app.locals.rooms.length; i++) {
        console.log(app.locals.rooms[i]);
        const roomName = app.locals.rooms[i].getRoomName();
        io.in(roomName).clients((err, clients) => {
            console.log(clients);
            app.locals.rooms[i].numberOfPlayers = clients.length;
            console.log(clients.length);
            totalPlayers += clients.length;
        });
    }

    console.log(totalPlayers);

    // Render index template with needed variables
    res.render('index', {
        loggedin: req.session.userID,
        home: true,
        rooms: app.locals.rooms,
        totalPlayers: totalPlayers
    });
});

// Home POST route
// Handles Room Creation
// TODO: Change this route so that it handles guest players
// TODO: Implement room creation through socket.io
app.post('/', function(req, res, next) {
    // Ensure the roomname field has been filled
    if (req.body.roomname) {

        // Create new room object to be pushed into "rooms" array
        let newRoom = {
            name: req.body.roomname,
            private: req.body.private === 'checked',
            password: req.body.roomPassword
        };

        // Add new room and redirect user to created room
        app.locals.rooms.push(newRoom);
        res.redirect('/gamerooms/room/' + req.body.roomname)
    } else { // Send error to error handlers
        const err = new Error('Room Name Required');
        err.status = 400;
        return next(err);
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});