const mongoose = require('mongoose');
const dbConfig = require('./config');

module.exports = {
	dbConnect: async () => {
		return await mongoose.connect(dbConfig.DB_URL, {useNewUrlParser: true});
	},
	dbDisconnect: async () => {
		return await mongoose.disconnect();
	},
	dbCreate: async (model, doc) => {
		return await model.create(doc);
	},
	dbReadOne: async (model, conditions) => {
		return await model.findOne(conditions);
	},
	dbRead: async (model, conditions) => {
		return await model.find(conditions);
	},
	dbUpdate: async (model, filter, doc, options) => {
		return await model.update(filter, doc, options);
	}
}
