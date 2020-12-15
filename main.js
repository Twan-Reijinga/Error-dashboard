// express
const express = require('express');
// app.use(express.static(__dirname + '/public'));
const app = express();
const port = 3000;
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

// push bullet
var PushBullet = require('pushbullet');
var pusher = new PushBullet('o.54uk4fUMADmnbbR0qm7w945yXef7Fkvw'); // sent API voor PushBullet
var bulletResevers = ['o.54uk4fUMADmnbbR0qm7w945yXef7Fkvw']; // ontvangers PushBullet

// E-Mail
var nodemailer = require('nodemailer');
const pass = require('./pass.js').pass;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'twan.reijinga@gmail.com', // sent Mailaddress 
      pass: pass
    }
});
var mailResevers = ['twan.reijinga@coderclass.nl', 'twan.reijinga@outlook.com']; // Mailaddres van ontvangers 

var fs = require('fs');


app.post('/error', (req, res) => {
    title = req.body.title;
    message = req.body.message;
    sentBulletMessage(title, message);
    console.log("pushBullet message sent!");
    for (i = 0; i < mailResevers.length; i++) {
        console.log("Sending email to: " + mailResevers[i]);
        let options = mailSetup(title, message, mailResevers[i]);
        sendMail(options); 
    };
    saveMessage(title, message);
    res.send("completed!")
});



//Dashboard
function saveMessage(title, message) {
    fs.readFile("./dashboard/errors.js", 'utf8', function (err,data) {
        var formatted = data.replace(/{/g, '{"' + title + '":"' + message + '",');
        fs.writeFile("./dashboard/errors.js", formatted, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/dashboard/styles.css');
})
app.get('/errors.js', (req, res) => {
    res.sendFile(__dirname + '/dashboard/errors.js');
})
app.get('/app.js', (req, res) => {
    res.sendFile(__dirname + '/dashboard/app.js');
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dashboard/index.html');
})

function sentBulletMessage(title, message) {
    for (i = 0; i < bulletResevers.length; i++) {
        console.log("Sending message to: " + bulletResevers[i]);
        let receiver = new PushBullet(bulletResevers[i]);
        pusher.note(receiver, title, message, function() {});
    };
}

function mailSetup(subject, text, mailAddress) {
    var html = "<H1 style = 'color: green;'>" + subject + "</H1><br><span>" + text + "</span>"; // HTML opmaak voor de mail
    var options = {
    from: 'twan.reijinga@gmail.com',
    to: mailAddress,
    subject: subject,
    html: html
    };
    return options;
};

function sendMail(options){
    transporter.sendMail(options, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent successfully!');
        };
      });
}

app.listen(port, () => {
    console.log(`running at http://localhost:${port}`)
});
