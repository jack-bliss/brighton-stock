const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const redis = require('redis').createClient(process.env.REDIS_URL);
const wwwhisper = require('connect-wwwhisper');

app.use('/admin_page', wwwhisper());
app.use(bodyParser.json());
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

app.get('/moment.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/moment/min/moment.min.js');
});

app.get('/events', (req, res) => {
    res.sendFile(__dirname + '/events.json');
});

app.post('/add_event', (req, res) => {
    new Promise((resolve, reject) => {
        fs.readFile(__dirname + '/events.json', 'utf8', data => {
            resolve(JSON.parse(data));
        });
    }).then(events => {
        events.push(req.body.event);
        return new Promise((resolve, reject) => {
            fs.writeFile(__dirname + '/events.json', JSON.stringify(events), data => {
                resolve(true);
            });
        });
    }).then(() => {
        res.send(JSON.stringify({
            "success": true
        }));
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});
app.get('/admin', (req, res) => {
    res.redirect('https://brighton-stock.herokuapp.com/admin_page');
});
app.get('/admin_age', (req, res) => {
    res.sendFile(__dirname + '/dist/admin.html');
});
/*app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/404.html');
});*/

app.listen(port, () => console.log('Listening on port', port));