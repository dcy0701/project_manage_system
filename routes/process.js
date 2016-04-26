/*
    created by bwd on 2016-04-17
    base on async and promise
*/
var multer = require('multer')
var storage = multer.diskStorage({
	//设置上传后文件路径，uploads文件夹会自动创建。
	destination: function (req, file, cb) {
		cb(null, './uploads/progress/default/')
	}, 
	//给上传文件重命名，获取添加后缀名
	filename: function (req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
});
var upload = multer({
	storage: storage
});
var cpUpload = upload.any();
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
processRouter.use(cpUpload);
processRouter.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
});
// 定义网站主页的路由

processRouter.get('/', function (req, res) {
	res.render('process', { title: '进度管理' });
	res.send('进度管理页面');
});



// 匹配 /search 路径的请求
//"search/2"以工程id查找工程检查项
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
			console.log(err.code);
		} 
		
		if (results) {
			res.json(1);
		}
	}
	);

});

//"delete/1"删除项目检查项
processRouter.get('/delete/1', function (req, res) {
	var url_info = require('url').parse(req.url, true);
	
	var k = Object.keys(url_info.query);
	var temp = k[0] + '=' + url_info.query[k[0]];
	for (var i = 1; i < k.length; i++) {
		temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
	}
	connection.query('delete FROM project_tocheck where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		if (results) {
			res.send('deldete success');
		}
		
	}
	);

});

//"delete/2"删除进度信息
processRouter.get('/delete/2', function (req, res) {
	var url_info = require('url').parse(req.url, true);
	
	var k = Object.keys(url_info.query);
	var temp = k[0] + '=' + url_info.query[k[0]];
	for (var i = 1; i < k.length; i++) {
		temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
	}
	connection.query('delete FROM project_check_info where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		if (results) {
			res.send('deldete success');
		}
		
	}
	);

});

//“update/1”更新项目检查项
processRouter.post('/update/1', function (req, res) {
	
	connection.query('delete FROM project_tocheck where project_id= ' + req.body.project_id,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		if (results) {
			console.log("删除成功");
		}
		
	}

	);
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
			console.log("更新成功");
			res.send('update success');
		}
	}
	);
});

//“update/2”更新进度信息
processRouter.post('/update/2', function (req, res) {
	
	connection.query('delete FROM project_check_info where id= ' + req.body.id,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
		}
		
		if (results) {
			console.log("删除成功");
		}
		
	}

	);
	connection.query('insert into project_check_info values ( ' + req.body.id + ',' 
                                                                                    + req.body.check_id + ',' 
                                                                                    + req.body.user_id + ',' 
                                                                                    + req.body.detail + ',' 
                                                                                    + req.body.datetime + ')',
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		
		if (results) {
			var i;
			var new_path = "./uploads/progress/" + req.body.check_id;
			fs.mkdir(new_path, function (err) {
				if (err)
					console.log(err);
				else
					console.log("目录创建成功");
			});
			for (i in req.files) {
				fs.rename(req.files[i].path, new_path + '/' + req.files[i].filename, function (err) {
					if (err) {
						console.log(err);
					}
					else
						console.log("文件移动成功");

				});
			}
			console.log("更新成功");
			res.send('update success');
		}
	}
	);
});

// 匹配 /upload 路径的请求
//"upload/” 项目进度上传

processRouter.post('/upload', function (req, res) {
	connection.query("use 项目管理系统");
	console.log(req.body.id);
	//var pic = req.files[0];
	//console.log(typeof (pic));
	connection.query('insert into project_check_info values ( ' + req.body.id + ',' 
                                                                                    + req.body.check_id + ',' 
                                                                                    + req.body.user_id + ',' 
                                                                                    + req.body.detail + ',' 
                                                                                    + req.body.datetime + ')',
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		
		if (results) {
			var i;
			var new_path = "./uploads/progress/" + req.body.check_id ;
			fs.mkdir(new_path, function (err) {
				if (err)
					console.log(err);
				else
					console.log("目录创建成功");
			});
			for (i in req.files) {
				fs.rename(req.files[i].path, new_path +'/'+ req.files[i].filename, function (err) {
					if (err) {
						console.log(err);
					}
					else
						console.log("文件移动成功");

				});
			}
			res.json(1);
		}
	}
	);

});
module.exports = processRouter;