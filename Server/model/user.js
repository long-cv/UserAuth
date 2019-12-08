const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userEmail: {
		type: String,
		unique: true,
		require: true
	},
	userPassword: {
		type: String,
		unique: true,
		require: true
	},
	userName: {
		type: String,
		require: true,
	},
	userPhoneNumber: {
		type: String
	}
});
module.exports = {
	userModel: mongoose.model('USER', userSchema, 'USER')
}
