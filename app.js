require("dotenv").config();
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var { auth } = require('./middlewares/auth');
var { logs, graphqlLogs } = require('./middlewares/logs');
const schema = require('./graphql/schema');
var { graphqlHTTP } = require('express-graphql');

var subscriptionRouter = require("./routes/subscription");

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/subscription", subscriptionRouter);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
  }));
  
  app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

module.exports = app;
