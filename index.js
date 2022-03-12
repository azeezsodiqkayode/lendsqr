
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const displayRoutes = require('express-routemap')
const winston = require('winston')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const userRoutes = require('./routes/users.routes')
const authRoutes = require('./routes/auth.routes')
const fundingRoutes = require('./routes/funding.routes')
const withdrawalRoutes = require('./routes/withdrawal.routes')
const transferRoutes = require('./routes/transfer.routes')
// const AppRoutes = require('./routes')
const port = process.env.PORT
const logger = require('./logger')




// parse application/json
app.use(bodyParser.json());

app.listen(port, async() => {
	console.log('i am listening on ', port);
	logger.info('i am listening on %s ', port)
	displayRoutes(app)
	// mySqlConnection.connect(err => {

	// 	if (err) throw err.stack
	// 	// connected!
	//    logger.info('successfully connected: %d ' , mySqlConnection.threadId)
	//   })


  
})




app.use(morgan('tiny'))
app.use("/api/v1",userRoutes)
app.use("/api/v1", authRoutes)
app.use("/api/v1",fundingRoutes)
app.use("/api/v1",withdrawalRoutes)
app.use("/api/v1",transferRoutes)

app.get('/', (req, res) => {
	res.status(200).send({
		status: 'error',
		message: 'Welcome guys',
		data: [],
	});
});



const swaggerDefinition = {
	"openapi": '3.0.0',
	info: {
			title: 'Lendsqr assessment',
			version: '1.0.0',
			description: 'API Docs for Lendsqr',
			license: {
			name: 'Azeez-Sodiq',
			url: '',
			},
			contact: {
			name: '',
			url: '',
			},
	  },
	  servers: [
		{
		  url: `https://localhost:${port}/api/v1`,
		  description: 'Development server',
		},
		{
		  url: '',
		  description: 'Production server',
		},
	  ],
	
};
  
const options = {
	swaggerDefinition,
	apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



/*
    Error 404
*/
app.use((req, res, next) => {
	logger.info('Seems you got lost. so sorry') 
	res.status(404).send({
		status: 'error',
		message: 'Seems you got lost. so sorry',
	});
});


module.exports = app