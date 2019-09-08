import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb, display) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.on('data', data => display(data))
    socket.emit('subscribeToTimer', 1000);
}

const sendMessage = (message)=> {
    socket.send(message);
};

export { subscribeToTimer , sendMessage};