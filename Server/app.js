const express = require('express');
const config = require('./config/config');
const userRouter = require('./routes/user');
const model = require('./model/model');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/user', userRouter);

model.dbConnect()
.then(() => {
	console.log("connect db successfully!!");
})
.catch((error) => {
	console.log("connect db failed");
	console.log(error);
});

app.use('/', (request, response) => {
	response.send("Index Route!!");
});

// error handler
app.use((error, request, response, next) => {
	// set locals, only providing error in development
	response.locals.message = error.message;
	response.locals.error = request.app.get('env') === 'development' ? error : {};
	
	// for response status
	response.status(error.status || 500);
});

app.listen(config.port, () => {
	console.log('server is listening on port ' + config.port);
});