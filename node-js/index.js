const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const app = express()
const port = 4000
const routes = require('./Routes/admin')

app.use(cors()) //allow this port open security for other
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser());
app.use(session({
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1h expire
        sameSite: true,
        secure: false
    },
    secret: "this is a secret key",
    name: 'sid'
}));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

// app.post('/upload', (req, res) => {
//     // upload file function
//     let image;
//     let uploadPath;

//     if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).send('No files were uploaded.');
//     }

//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     image = req.files.image;
//     console.log(image);
//     uploadPath = __dirname + '/public/fileUpload/' + image.name;

//     // Use the mv() method to place the file somewhere on your server
//     image.mv(uploadPath, function(err) {
//         if (err)
//             return res.status(500).send(err);

//         res.send('File uploaded!');
//     });
// })

app.use(routes)

mongoose.connect('mongodb+srv://user1:User1234@cluster0.cqgou.mongodb.net/Online_Classroom?retryWrites=true&w=majority', { useFindAndModify: false, useNewUrlParser: true })
    .then(result => {
        console.log("Db is connected");
        app.listen(port);
    }).catch(err => {
        console.log(err);
    })