const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const WebSocket = require('ws');
const chatRoutes = require('./routes/chat');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const usersRoutes = require('./routes/users');


const app = express();
const PORT = 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());


app.use('/api/messages', chatRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', usersRoutes);



wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (data) => {
        const newMessage = JSON.parse(data);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(newMessage));
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});