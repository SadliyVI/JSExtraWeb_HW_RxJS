const express = require('express');
const faker = require('faker');

const app = express();

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

function generateMessagesOnDemand() {
    const now = Math.floor(Date.now() / 1000);

    if (now - lastFetchedTimestamp >= 3) {
        const count = Math.floor((now - lastFetchedTimestamp) / 3);
        for (let i = 0; i < count; i++) {
            messages.push(generateMessage());
        }
    }
}

app.get('/api/messages/unread', (req, res) => {
    generateMessagesOnDemand();

    const newMessages = messages.filter(
        (m) => m.received > lastFetchedTimestamp
    );

    lastFetchedTimestamp = Math.floor(Date.now() / 1000);

    res.json({
        status: 'ok',
        timestamp: lastFetchedTimestamp,
        messages: newMessages,
    });
});

module.exports = app;
