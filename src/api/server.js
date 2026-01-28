const express = require('express');
const faker = require('faker');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); 

let messages = [];
let lastFetchedTimestamp = Math.floor(Date.now() / 1000);

function generateMessage() {
    return {
        id: faker.datatype.uuid(),
        from: faker.internet.email(),
        subject: faker.lorem.words(3),
        body: faker.lorem.paragraph(),
        received: Math.floor(Date.now() / 1000),
    };
}

setInterval(() => {
    const newMessage = generateMessage();
    messages.push(newMessage);
    // console.log('New message generated:', newMessage);
}, 3000);

app.get('/messages/unread', (req, res) => {
    const newMessages = messages.filter(message => message.received > lastFetchedTimestamp);

    lastFetchedTimestamp = Math.floor(Date.now() / 1000);

    res.json({
        status: 'ok',
        timestamp: lastFetchedTimestamp,
        messages: newMessages,
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});