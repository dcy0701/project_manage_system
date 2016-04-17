/*
    created by bwd on 2016-04-17
    base on async and promise
*/

var async = require('async');
//async 是一个异步控制的模块 generator原理
var express = require('express');
var fs = require('fs');
var processRouter = express.Router();

//数据库以传递的方式  不再重新连接 TODO
//数据库暂时  再次连接。
var sqlConfig = require('./../mysqlConfig');

var mysql = require('mysql');
console.log(sqlConfig.database);
var connection = mysql.createConnection({
    host: sqlConfig.host,
    port: sqlConfig.port,
    user: sqlConfig.user,
    password: sqlConfig.password,
    databse: sqlConfig.database
});
connection.connect();

connection.query('use ' + sqlConfig.database);
// 该路由使用的中间件
processRouter.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// 定义网站主页的路由

processRouter.get('/', function (req, res) {
    res.send('进度管理页面');
});


// 匹配 /search 路径的请求
//"search/1"以工程id查找工程信息

processRouter.get('/search/1', function (req, res) {
    var url_info = require('url').parse(req.url, true);
    var data = require('querystring').stringify(url_info.query);
    connection.query('SELECT * FROM project_table where project_' + data,
        function selectCb(err, results, fields) {
            if (err) {
                console.log(err.code);
            }

            if (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log("%d", results[i].parent_id);
                    //res.send(results[i]);
                    res.json(results[i]);
                }
            }

        }
    );

});

// 匹配 /search 路径的请求
//"search/2"以工程id查找工程进度信息
processRouter.get('/search/2', function (req, res) {
    connection.query("use 项目管理系统");
    var url_info = require('url').parse(req.url, true);
    var data = require('querystring').stringify(url_info.query);
    connection.query('SELECT * FROM project_tocheck where project_' + data,
        function selectCb(err, results, fields) {
            if (err) {
                console.code(err.code);
            }

            if (results) {
                for (var i = 0; i < results.length; i++) {
                    //res.send(results[i]);
                    res.json(results[i]);
                }
            }
        }
    );

});

// 匹配 /search 路径的请求
//"search/3"以进度项id查找进度信息
processRouter.get('/search/3', function (req, res) {
    connection.query("use 项目管理系统");
    var url_info = require('url').parse(req.url, true);
    var data = require('querystring').stringify(url_info.query);
    connection.query('SELECT * FROM project_check_info where project_check_' + data,
        function selectCb(err, results, fields) {
            if (err) {
                console.code(err.code);
            }

            if (results) {
                for (var i = 0; i < results.length; i++) {
                    //res.send(results[i]);
                    res.json(results[i]);
                }
            }
        }
    );

});

// 匹配 /add 路径的请求
//"add/1"添加项目进度检查项
processRouter.post('/add/1', function (req, res) {
    console.log("%s", req.body.target);
    connection.query("use 项目管理系统");
    connection.query('insert into project_tocheck values ( ' + req.body.id + ','
                                                                                    + req.body.project_id + ','
                                                                                    + req.body.time + ','
                                                                                    + req.body.type + ','
                                                                                    + req.body.begin_time + ','
                                                                                    + req.body.end_time + ','
                                                                                    + req.body.target + ','
                                                                                    + req.body.target_now + ','
                                                                                    + req.body.state + ')',
        function selectCb(err, results, fields) {
            if (err) {
                console.log(err);
            }

            if (results) {
                res.json(1);
            }
        }
    );

});
module.exports =processRouter;