/*
    created by bwd on 2016-04-17
    base on async and promise
*/

var async = require('async');
//async ��һ���첽���Ƶ�ģ�� generatorԭ��
var express = require('express');
var fs = require('fs');
var processRouter = express.Router();

//���ݿ��Դ��ݵķ�ʽ  ������������ TODO
//���ݿ���ʱ  �ٴ����ӡ�
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
// ��·��ʹ�õ��м��
processRouter.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
// ������վ��ҳ��·��

processRouter.get('/', function (req, res) {
    res.send('���ȹ���ҳ��');
});


// ƥ�� /search ·��������
//"search/1"�Թ���id���ҹ�����Ϣ

processRouter.get('/search/1', function (req, res) {
    var url_info = require('url').parse(req.url, true);
    var data = require('querystring').stringify(url_info.query);
    connection.query('SELECT * FROM project_table where project_' + data,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
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

// ƥ�� /search ·��������
//"search/2"�Թ���id���ҹ��̽�����Ϣ
processRouter.get('/search/2', function (req, res) {
    connection.query("use ��Ŀ����ϵͳ");
    var url_info = require('url').parse(req.url, true);
    var data = require('querystring').stringify(url_info.query);
    connection.query('SELECT * FROM project_tocheck where project_' + data,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
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

// ƥ�� /search ·��������
//"search/3"�Խ�����id���ҽ�����Ϣ
processRouter.get('/search/3', function (req, res) {
    connection.query("use ��Ŀ����ϵͳ");
    var url_info = require('url').parse(req.url, true);
    var data = require('querystring').stringify(url_info.query);
    connection.query('SELECT * FROM project_check_info where project_check_' + data,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
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

// ƥ�� /add ·��������
//"add/1"�����Ŀ���ȼ����
processRouter.post('/add/1', function (req, res) {
    console.log("%s", req.body.target);
    connection.query("use ��Ŀ����ϵͳ");
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
                res.json(0);
            }

            if (results) {
                res.json(1);
            }
        }
    );

});
module.exports =processRouter;