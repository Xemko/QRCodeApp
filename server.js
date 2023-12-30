// server.js
const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/generate-qr-code', async (req, res) => {
    try {
        const url = req.body.url;
        if (!url) throw "URL parameter is missing";

        const qrCode = await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/verify-password?url=${encodeURIComponent(url)}`);
        res.send(`
        <div style="display: flex; justify-content: center;">
        <img src="${qrCode}" />
    </div>
        `);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/verify-password', (req, res) => {
    res.send(`
        <form action="/verify-password" method="post">
            <input type="hidden" name="url" value="${req.query.url}">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <input type="submit" value="Go to URL">
        </form>
    `);
});

app.post('/verify-password', (req, res) => {
    const url = req.body.url;
    const password = req.body.password;
    if (password !== 'dryk') {
        res.send("Invalid password");
    } else {
        res.redirect(url);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});