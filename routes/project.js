var multer = require('multer')
var storage = multer.diskStorage({
	//设置上传后文件路径，uploads文件夹会自动创建。
	destination: function (req, file, cb) {
		cb(null, './uploads/123/')
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
var express = require('express');
var fs = require('fs');
var projectRouter = express.Router();
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
projectRouter.use(cpUpload);
projectRouter.use(function timeLog(req, res, next) {
	console.log('Time: ', Date.now());
	next();
});
// 定义网站主页的路由

projectRouter.get('/', function (req, res) {
	res.send('信息管理页面');
});

// 匹配 /search 路径的请求
//"search"以接收信息查找工程信息
var async = require('async');
projectRouter.get('/search', function (req, res) {
    var url_info = require('url').parse(req.url, true);
    
    var k = Object.keys(url_info.query);
    if (k[0] == 'user_name')
        var temp = ' manager="' + req.query.user_name + '" or designer_incharge="' + req.query.user_name + '" or supervision_incharge="' + req.query.user_name + '" or constructor_incharge="' + req.query.user_name + '"';
    else
        var temp = k[0] + '="' + url_info.query[k[0]] + '" ';
    
    for (var i = 1; i < k.length; i++) {
        if(k[i]=='user_name')
            temp += ' manager="' + req.query.user_name + '" or designer_incharge="' + req.query.user_name + '" or supervision_incharge="' + req.query.user_name + '" or constructor_incharge="' + req.query.user_name + '"';
        else
            temp += ' and ' + k[i] + '="' + url_info.query[k[i]] + '"';
    }
    console.log('SELECT * FROM project_table where ' + temp);
	connection.query('SELECT * FROM project_table where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
		}
		
		if (results) {
			var tempres=[];
			async.eachSeries(results, function(item,callback){
				connection.query('select sum(target_now)*100/sum(target) as percent from project_tocheck where project_name="'+item.name+'"',
				function selectCb(err,result2,fields) {
					if(err){
						console.log(err);
					}
					if(result2){
						console.log(result2);
						item.percent=result2[0].percent;
						tempres.push(item);
						console.log(tempres);
						callback(null, item);
					}

				})			
			},function(err) {
				if(err)
					console.log(err);
				else{
				console.log(tempres);
				res.send(tempres);
				}
			}); 
			
		}
		
	}
	);

});

projectRouter.get('/searchall', function (req, res) {

    connection.query('SELECT * FROM project_table ',
        function selectCb(err, results, fields) {
        if (err) {
            console.log(err.code);
        }
        
        if (results) {
            /*for (var i = 0; i < results.length; i++) {
				console.log("%d", results[i].parent_id);
				//res.send(results[i]);
				res.json(results[i]);
			
			} */
			res.send(results);
        }
		
    }
    );

});
projectRouter.get('/delete', function (req, res) {
	var url_info = require('url').parse(req.url, true);
	//console.log(typeof(url_info.query));

	var k = Object.keys(url_info.query);
	var temp = k[0]+ '=' + url_info.query[k[0]];
	for (var i = 1;i<k.length;i++) {
		temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
	}
	//var data = require('querystring').stringify(url_info.query);
	connection.query('delete FROM project_table where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		if (results) {
			/*for (var i = 0; i < results.length; i++) {
				console.log("%d", results[i].parent_id);
				//res.send(results[i]);
				res.json(results[i]);
			
			} */
			res.send({ result: 'deldete success' });
		}
		
	}
	);

});
projectRouter.post('/update', function (req, res) {
    if (req.body.plan_start_time == '')
        req.body.plan_start_time = 'NULL';
    else
        req.body.plan_start_time = '"' + req.body.plan_start_time + '"';
    if (req.body.real_start_time == '')
        req.body.real_start_time = 'NULL';
    else {

        req.body.real_start_time = '"' + req.body.real_start_time + '"';
    }
    if (req.body.plan_end_time == '')
        req.body.plan_end_time = 'NULL';
    else
        req.body.plan_end_time = '"' + req.body.plan_end_time + '"';
    if (req.body.real_end_time == '')
        req.body.real_end_time = 'NULL';
    else
        req.body.real_end_time = '"' + req.body.real_end_time + '"';

    temp = 'update project_table set parent_id="' + req.body.parent_id + '",code="' +
		                                                   req.body.code + '",name="' + req.body.name + '",year_create="' + req.body.year_create + '",manager="' +
														   req.body.manager + '",location="' + req.body.location + '",investment="' + req.body.investment + '",designer="' +
														   req.body.designer + '",designer_incharge="' + req.body.designer_incharge + '",supervision_incharge="' + req.body.supervision_incharge + '",constructor="' +
														   req.body.constructor + '",constructor_incharge="' + req.body.constructor_incharge + '",district="' + req.body.district + '",type="' +
														   req.body.type + '",plan_start_time=' + req.body.plan_start_time + ',real_start_time=' + req.body.real_start_time + ',plan_end_time=' + 
														   req.body.plan_end_time + ',real_end_time=' + req.body.real_end_time + ',gps_lat="' + req.body.gps_lat + '",gps_lon="' + 
														   req.body.gps_lon + '",state="' + req.body.state + '"where project_id="' + req.body.project_id + '"'
	connection.query(temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
		}
		
		if (results) {
			/*for (var i = 0; i < results.length; i++) {
				console.log("%d", results[i].parent_id);
				//res.send(results[i]);
				res.json(results[i]);
			
			} */
			res.send('update success');
		}
	}
	);
});
projectRouter.post('/insert/1', function (req, res) {
    
    if (req.body.plan_start_time == '')
        req.body.plan_start_time = 'NULL';
    else
        req.body.plan_start_time = '"' + req.body.plan_start_time + '"';
    if (req.body.real_start_time == '')
        req.body.real_start_time = 'NULL';
    else {
        
        req.body.real_start_time = '"' + req.body.real_start_time + '"';
    }
    if (req.body.plan_end_time == '')
        req.body.plan_end_time = 'NULL';
    else
        req.body.plan_end_time = '"' + req.body.plan_end_time + '"';
    if (req.body.real_end_time == '')
        req.body.real_end_time = 'NULL';
    else
        req.body.real_end_time = '"' + req.body.real_end_time + '"';
	connection.query('insert into project_table  values ("' + req.body.project_id + '","' + req.body.parent_id + '","' +
		                                                   req.body.code + '","' + req.body.name + '","' + req.body.year_create + '","' +
														   req.body.manager + '","' + req.body.location + '","' + req.body.investment + '","' +
														   req.body.designer + '","' + req.body.designer_incharge + '","' + req.body.supervision_incharge + '","' +
														   req.body.constructor + '","' + req.body.constructor_incharge + '","' + req.body.district + '","' +
														   req.body.type + '",' + req.body.plan_start_time + ',' + req.body.real_start_time + ',' + 
														   req.body.plan_end_time + ',' + req.body.real_end_time + ',"' + req.body.gps_lat + '","' + 
														   req.body.gps_lon + '","' + req.body.state + '")',
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
		}
		
		if (results) {
			/*for (var i = 0; i < results.length; i++) {
				console.log("%d", results[i].parent_id);
				//res.send(results[i]);
				res.json(results[i]);
			
			} */
			res.send('insert success');
		}
		
	}
	);

});

projectRouter.get('/countpercent', function (req, res) {
    var m;
    var data = req.query.location;
    connection.query('SELECT location, count(location) as num FROM project_table group by location;',
        function selectCb(err, results, fields) {
        if (err) {
            console.log(err.code);
        }
        
        if (results) {
            /*for (var i = 0; i < results.length; i++) {
				console.log("%d", results[i].parent_id);
				//res.send(results[i]);
				res.json(results[i]);
			
			} */
            res.send(results);
        }

		
    }
    );


});

module.exports = projectRouter;