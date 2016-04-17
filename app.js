var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//GIT测试
var routes = require('./routes/index');
var users = require('./routes/users');

var sqlConfig = require('./mysqlConfig');
var app = express();
//引入服务商管理 路由
var serviceRouter = require('./routes/service');
//引入进度管理路由
var processRouter = require('./routes/process');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// console.dir(sqlConfig)
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: sqlConfig.host,
    port: sqlConfig.port,
    user: sqlConfig.user,
    password: sqlConfig.password
});
connection.connect();
//console.dir(connection);

console.log('数据库成功连接');
var query_databaseName = "use "+sqlConfig.database;

connection.query(query_databaseName);
console.log('进入数据库');
//进入 指定的数据库


/*已经在service.js中实现
// 处理login路径的post请求
app.post('/login', function (req, res) {
    console.log("%s",req.body.user_name);
    connection.query('select * from user where user_name =  ' + req.body.user_name + ' and password= ' + req.body.password  ,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }

            if (results) {
                res.json( {pass:1 , type:results[0].type , area: results[0].area } );
            }
            else
                res.json({ pass: 0 });
            }

    );
});
*/
app.get('/', function (req, res) {
    res.send('root');
    //TODO render 首页
});

// 匹配 /about 路径的请求
var ab = {name:"项目管理系统" , dormitory:907 , developer:"bwd" , version:"1.0 beta"};
app.get('/about', function (req, res) {
    res.send(ab);
});

// 匹配 /random.text 路径的请求
app.get('/random.te?xt', function (req, res) {
    res.send('random.text');
});


//connection.end();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由关联
//挂载服务商管理路由句柄
app.use('/s', serviceRouter);
//挂载进度管理路由句柄
app.use('/p',processRouter);
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3030,function(){
  console.log('监听3030端口');
});


module.exports = app;
