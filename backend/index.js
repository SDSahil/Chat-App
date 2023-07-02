const { Server } = require("socket.io");

const express = require('express');

const app = express();

const path = require('path');

const http = require('http').createServer(app);


const PORT = 3000;
const rootPath = path.join(__dirname, '..');

http.listen(PORT, () => {
    console.log('--------', path.join(__dirname, '/..'));
    console.log(`running on PORT ${PORT}`);
});

app.use(express.static(rootPath + '/styles'));
app.use(express.static(rootPath + '/scripts'));
app.use(express.static(rootPath + '/assets'));

app.get('/', (req, res) => {
    res.sendFile(rootPath + '/index.html');
});


const io = new Server(http, {});

const users = {};

io.on("connection", socket => {
    console.log('A user connected with id =', socket.id);

    socket.on('user-joined', name => {
        console.log(`new user joined: ${name}`);
        users[socket.id] = name;
        socket.broadcast.emit('new user joined', name);
    });

    socket.on('send', message => {
        console.log('message sent by me:', message);
        socket.broadcast.emit('recieve', { message, name: users[socket.id] });
    });
});