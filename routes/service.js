/*
    created by dcy on 2016-04-15

*/
var express = require('express');
var serviceRouter = express.Router();

//数据库以传递的方式  不再重新连接 TODO
//数据库暂时  再次连接。
var sqlConfig = require('./../mysqlConfig');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: sqlConfig.host,
    port: sqlConfig.port,
    user: sqlConfig.user,
    password: sqlConfig.password,
    databse: sqlConfig.database
});
connection.connect();

// 该路由使用的中间件
serviceRouter.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// 定义网站主页的路由
serviceRouter.get('/', function(req, res) {
  res.send('服务商管理页面');
});
// 定义 about 页面的路由
serviceRouter.get('/about', function(req, res) {
  res.send('About test');
});

module.exports = serviceRouter;
