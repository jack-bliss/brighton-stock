const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, './dist')));

const port = process.env.PORT || 3001;

app.get('/stats', (req, res) => {
    res.redirect('http://jackbliss.co.uk/brighton-glicko');
});
app.get('/league', (req, res) => {
    res.redirect('https://platinum-smash.herokuapp.com/players');
});
app.get('/fb', (req, res) => {
    res.redirect('https://www.facebook.com/BrightonStockSmash/');
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => console.log('Listening on port', port));