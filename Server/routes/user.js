const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('../services/jwt');
const model = require('../model/model');
const userModel = require('../model/user');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const config = require('../config/config')

const router = express.Router();
const avatarUpload = multer({dest: path.join(__dirname, '../public/avatar')}).single('avatar');

isAuthorized = async (request, response, next) => {
	if (!request.headers.authorization) return response.status(401).json({success: false, messeage: "access denied!"});
	let [, userToken] = request.headers.authorization.split(' ');
	try {
		let payload = await jwt.verify(userToken);
		request.userPayload = payload;
		return next();
	} catch(error) {
		response.status(401).json({success: false, message: error});
	}
}
router.get('/', isAuthorized, async (request, response, next) => {
	try {
		let emailObj = {userEmail: request.userPayload.email};
		let user = await model.dbReadOne(userModel.userModel, emailObj);
		response.status(200).json({success: true, user: user});
	} catch(error) {
		response.status(404).json({success: false, message: error});
	}
});
router.post('/register', async (request, response, next) => {
	let httpStatusCode = 400;
	try {
		// check user exist or not
		let emailObj = {
			userEmail: request.body.userEmail
		}
		let user = await model.dbReadOne(userModel.userModel, emailObj);
		if (user) return response.status(406).json({success: false, message: "email in using"});
		
		// create new user
		let password = request.body.userPassword;
		let salt = await bcrypt.genSalt(10);
		let hashPassword = await bcrypt.hash(password, salt);
		let newUser = {
			userEmail: request.body.userEmail,
			userPassword: hashPassword,
			userName: request.body.userName,
			userPhoneNumber: request.body.userPhoneNumber,
			userAvatar: config.avatarDefault
		}
		await model.dbCreate(userModel.userModel, newUser);
		httpStatusCode = 201;
		
		// create jwt for user
		let payload = {
			email: request.body.userEmail
		};
		let token = await jwt.sign(payload);
		console.log(token);
		response.status(httpStatusCode).json({success: true, jwt: token, user: newUser});
	} catch(error) {
		response.status(httpStatusCode).json({success: false, message: error});
	}
});
router.post('/login', async (request, response, next) => {
	try {		
		let emailObj = {userEmail: request.body.userEmail};
		let user = await model.dbReadOne(userModel.userModel, emailObj);
		if (!user) return response.status(404).json({success: false, message: "email has not registered yet!!"});
		let password = request.body.userPassword;
		let isMatch = await bcrypt.compare(password, user.userPassword);
		if (!isMatch) return response.status(404).json({success: false, message: "wrong password!"});

		let payload = {email: request.body.userEmail};
		let token = await jwt.sign(payload);
		response.status(200).json({success: true, jwt: token, user: user});
	} catch (error) {
		response.status(404).json({success: false, message: error});
	}
});
router.put('/update', isAuthorized, async (request, response, next) => {
	let httpStatusCode = 400;
	try {
		let filter = {userEmail: request.body.email};
		let doc = request.body.newUser;
		let options = {upsert: true};
		if (doc.userPassword) {
			let salt = await bcrypt.genSalt(10);
			let password = await bcrypt.hash(doc.userPassword, salt);
			doc.userPassword = password;
		}
		console.log(filter);
		console.log(doc);
		let result = await model.dbUpdate(userModel.userModel, filter, doc, options);
		console.log(result);
		if (result) {
			httpStatusCode = 201;
			if (doc.userEmail) {
				let payload = {email: doc.userEmail};
				let token = await jwt.sign(payload);
				return response.status(httpStatusCode).json({success: true, jwt: token});
			}
			return response.status(httpStatusCode).json({success: true});
		}
		return response.status(httpStatusCode).json({success: false, message: 'update failed'});
	} catch(error) {
		response.status(httpStatusCode).json({success: false, message: error});
	}
});

router.post('/avatar', isAuthorized, avatarUpload, async (request, response, next) => {
	//console.log(request);
	if (!request.body.userEmail) return response.status(400).json({success: false, message: "need an email for identifying user."});
	if (!request.file) return response.status(400).json({success: false, message: "no avatar uploaded."});
	try {
		let emailObj = {userEmail: request.body.userEmail};
		let user = await model.dbReadOne(userModel.userModel, emailObj);
		if (!user) return response.status(400).json({success: false, message: "can't identify user."});
		
		let newName = user._id + Date.now();
		let newAvatarPath = request.file.destination + '\\' + newName;
		fs.rename(request.file.path, newAvatarPath, error => {
			if (error) return response.status(400).json({success: false, message: error});
		});
		
		let newUserAvatar = config.avatarFolder + '/' + newName;
		let result = await model.dbUpdate(userModel.userModel, emailObj, {userAvatar: newUserAvatar}, {});
		if (result) {
			user.userAvatar = newUserAvatar;
			return response.status(201).json({success: true, message: "uploading avatar is done.", user: user});
		}
		
		response.status(400).json({success: false, message: "updating avatar failed."});
	} catch(error) {
		response.status(400).json({success: false, messeage: error ? error : "an error occurred when updating avatar."});
	}
});

module.exports = router;