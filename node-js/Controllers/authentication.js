const bcrypt = require("bcryptjs");
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const secret = "1234567890";

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // Check if email is exist
    User.find({ email: email }).then(result => {
        if (result != "") {
            // if user exist, check given password with the encrypted password
            bcrypt.compare(password, result[0].password, function(err, passwordIsMatch) {
                if (passwordIsMatch) {

                    const myUser = { id: result[0].id, username: result[0].username, email: result[0].email, profile: result[0].profile };
                    //create token for user
                    const token = jwt.sign({
                        data: myUser
                    }, secret, { expiresIn: 60 * 60 * 4 });
                    // store user information to session
                    req.session.userId = result[0]._id;
                    // res.json({ "success": true, "existEmail": false, "token": token });
                    res.json({ "existEmail": false, "user": myUser, "token": token });
                } else {
                    // else return fail
                    res.json({ "existEmail": false, "id": 0 });
                }
            })
        } else {
            res.json({ "existEmail": true, "id": null });
        }
    }).catch(err => {
        res.json({ "existEmail": false, "id": null });
    })
}

exports.register = (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const salt = bcrypt.genSaltSync(10);
    // Check if email is exist
    User.find({ email: email }).then(async result => {
        if (result == "") {
            // create user for database
            const user = new User({
                username: username,
                email: email,
                password: bcrypt.hashSync(password, salt),
            })
            try {
                //save user to database
                const result = await user.save()

                //if save user success res to inform
                if (result) {
                    res.json({ "success": true, "existEmail": false });
                }
            } catch (error) {
                res.json({ "success": false, "existEmail": false })
            }
        } else {
            res.json({ "success": false, "existEmail": true });
        }
    }).catch((err) => {
        console.log(err)
    })
}

exports.logout = (req, res) => {
    // clear session
    req.session.destroy();
}

exports.getUser = (req, res) => {
    const token = req.body.token;

    try {
        const decoded = jwt.verify(token, secret);
        if (decoded) {
            res.json({ "user": decoded });
        }
    } catch (err) {
        console.log(err)
    }
}

exports.getTeacher = (req, res) => {
    const id = req.body.tId;

    User.find({ _id: id }).then(result => {
        if (result != "") {
            res.json({ "teacher": result[0] })
        }
    }).catch((err) => {
        console.log(err)
    })
}

exports.updateProfile = (req, res) => {
    const userId = req.params.userId;
    // upload file function
    let image;
    let uploadPath;

    console.log("=======", req.params);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    image = req.files.newProfile;
    uploadPath = __dirname + '/../public/fileUpload/' + image.name;

    // Use the mv() method to place the file somewhere on your server
    image.mv(uploadPath, function(err) {
        if (err)
            return res.status(500).send(err);

        // res.send('File uploaded!');
        // res.redirect('http://localhost:8080/account')
    });
    const picPath = '../../../node-js/public/fileUpload/' + image.name;
    User.findByIdAndUpdate(userId)
        .then((user) => {
            user.profile = picPath;
            // res.json({ success: true });
            res.redirect('http://localhost:8080/account')
            return user.save();
        })
        .catch(err => {
            console.log(err);
        })
}

exports.updateUser = (req, res) => {
    const userId = req.params.userId;
    // upload file function
    let image;
    let uploadPath;


    User.findByIdAndUpdate(userId)
        .then((user) => {
            user.profile = picPath;
            // res.json({ success: true });
            res.redirect('http://localhost:8080/account')
            return user.save();
        })
        .catch(err => {
            console.log(err);
        })
}