const socket = io('http://localhost:3000');

const form = document.getElementById('msg-container');

const msgContainer = document.querySelector('.chat');
const actionContainer = document.querySelector('.actions');

let user;

function createChatContent(side, message, user = 'you') {
    const boxMsg = document.createElement('div');
    boxMsg.className = `${side}-msg`;

    const newDiv = document.createElement('div');
    newDiv.className = 'user';
    newDiv.textContent = user;

    const msgContent = document.createElement('div');
    msgContent.className = 'msg';
    msgContent.textContent = message;

    boxMsg.append(newDiv, msgContent);
    msgContainer.append(boxMsg);
}

socket.on('new user joined', name => {
    const newDiv = document.createElement('div');
    newDiv.textContent = 'New user joined the chat';
    newDiv.className = 'join';

    const newUserCard = document.createElement('div');
    newUserCard.className = 'user-card';

    const newTimeStamp = document.createElement('div')
    newTimeStamp.className = 'time-stamp';
    newTimeStamp.textContent = new Date().toLocaleString('en-US');

    const newUser = document.createElement('h3');
    newUser.textContent = name;

    newUserCard.append(newUser, newTimeStamp);
    actionContainer.append(newDiv, newUserCard);
});

socket.on('recieve', obj => {
    createChatContent('left', obj.message, obj.name);
});

form.addEventListener('submit', e => {
    e.preventDefault();
    const msgInp = e.target.querySelector('#msg-inp');

    createChatContent('right', msgInp.value);
    socket.emit('send', msgInp.value);

    msgInp.value = '';
});

(function () {
    do {
        user = prompt('Enter User');
    } while (!user);

    const userName = document.getElementById('user-name');
    userName.textContent = user;
    socket.emit('user-joined', user);
})()