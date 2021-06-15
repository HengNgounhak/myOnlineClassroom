const express = require("express");
const router = express.Router();
const authenController = require("../Controllers/authentication");
const myClass = require("../Controllers/class");

router.post('/register', authenController.register);
router.post('/login', authenController.login);
router.post('/logout', authenController.logout);
router.post('/getUser', authenController.getUser);
router.post('/getTeacher', authenController.getTeacher);
router.post('/updateProfile/:userId', authenController.updateProfile);
router.post('/updateUser/:userId', authenController.updateUser);

router.post('/create', myClass.create);
router.put('/join', myClass.join);
router.post('/getClass', myClass.getClass);
router.put('/renameClass/:classId', myClass.renameClass);
router.delete('/deleteClass/:classId', myClass.deleteClass);
router.put('/leaveClass/:classId', myClass.leaveClass);

module.exports = router;