const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const contentful = require('contentful');
const app = express();

const eventClient = contentful.createClient({
    space: 'yt3y05y0gcz1',
    accessToken: 'be13469446308b1a256c0dba2ee65e414ff2cbacb95acdf00387ca61aba7d7b3'
});

app.use(bodyParser.json());

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


app.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        fs.readFile(__dirname + '/dist/index.html', 'utf8', (err, index) => {
            resolve(index);
        });
    }).then(index => {
        return Promise.all([Promise.resolve(index), eventClient.getEntries({
            "content_type": "event",
            "order": "fields.date"
        })]);
    }).then(data => {
        let index = data[0];
        let events = data[1].items;
        events = events.sort((ea, eb) => {

        });
        events = events.map(entry => {
            let event = entry.fields;
            let li = "<li>";
            if(event.link){
                li += "<a href='"+event.link+"'>";
            }
            li += event.name;
            if(event.link){
                li += "</a>";
            }
            let date = event.date.split('-');
            console.log(date);
            li += " - " + (date[2].split("T")[0])+"/"+date[1]+"/"+date[0] + " - " + (date[2].split("T")[1]);
            li += "</li>";
            return li;
        });
        index = index.replace("{{event_list}}", events.join(""));
        res.send(index);
    }, (err) => {
        res.send("<h1>ERROR</h1><pre>"+JSON.stringify(err.response.data, null, '\t')+"</pre>");
    });
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/dist/admin.html');
});

app.use(express.static(path.join(__dirname, './dist')));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/404.html');
});

app.listen(port, () => console.log('Listening on port', port));
