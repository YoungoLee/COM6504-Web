const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const indexRouter = require('./routes/index');
const userControllerRouter = require('./controllers/user');
const plantControllerRouter = require('./controllers/plant');
const recommendControllerRouter = require('./controllers/recommend');
const commentControllerRouter = require('./controllers/comment');
const dbpediaControllerRouter = require('./controllers/depedia');


const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Plant Recognition API',
      version: '1.0.0'
    },
    servers: [{ url: '/api' }]
  },
  apis: ['./controllers/**/index.js']
});

if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })
}

const app = express();
app.use(session({
  secret: 'Plants Recognition',
  resave: false,
  saveUninitialized: false
}))
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(connectLiveReload());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', userControllerRouter);
app.use('/api/plant', plantControllerRouter);
app.use('/api/recommend', recommendControllerRouter);
app.use('/api/comment', commentControllerRouter);
app.use('/api/dbpedia', dbpediaControllerRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
