const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./config');

var privateKey = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');
var publicKey = fs.readFileSync(path.join(__dirname, 'public.key'), 'utf8');

module.exports = {
	sign: payload => {
		return new Promise((resolve, reject) => {
			jwt.sign(payload, privateKey, config.signOption, (error, token) => {
				if (error) return reject(error);
				return resolve(token);
			})
		});
	},
	verify: token => {
		return new Promise((resolve, reject) => {
			jwt.verify(token, publicKey, config.verifyOption, (error, payload) => {
				if (error) return reject(error);
				return resolve(payload);
			});
		});
	},
}