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
});

// 处理login路径的post请求
processRouter.post('/login', function (req, res) {
    console.log("%s", req.body.user);
    connection.query('select * from user where user_name =  ' + req.body.user + ' and password= ' + req.body.pass  ,
        function selectCb(err, results, fields) {
        if (err) {
            console.log(err);
        }
        
        else if (results.length>0) {
            res.json({ pass: 1 , type: results[0].type , area: results[0].area });
        }
        else
            res.json({ pass: 0 });
    }

    );
});

processRouter.get('/login', function(req, res) {
  //res.send('About test');
  var username = req.query.username;
  var password = req.query.password;
  if(username===undefined||password==undefined){
    res.send('参数不正确前端拦截一下好嘛');
    return;
  }
  var errorResult = {errorDescription:'null',error:''};
  // TODO 用来给前端和移动端调用

  var queryString = 'select password from user where user_name="'+username+'"';
  //此处需要添加 引号
  connection.query(queryString,function(err,results,fields){
    //console.dir(arguments);
    if(err){
      console.log(err.code);
      res.send(err.code+'服务器错误');

  }else if(results[0]&&results[0].password&&results[0].password==password){
      //登录成功
      // callback or promise ? callback!
      // callback hell
      connection.query('select * from user where user_name="'+username+'"',function(err,results,fields){
        console.log(results[0]);
        if(err){
          res.send('error');
        }else{
          var metadate = results[0];
          // 删除密码属性 返回给用户元数据
          delete results[0].password;
          res.send(metadate);
        }
})
  }
  })
});


// 匹配 /search 路径的请求
//"search/1"查找工程检查项
processRouter.get('/search/1', function (req, res) {
	var url_info = require('url').parse(req.url, true);
	
	var k = Object.keys(url_info.query);
	if(k[0]=='id')
		var temp = k[0] + '=' + url_info.query[k[0]];
	else
		var temp = k[0] + '="' + url_info.query[k[0]] +'" ';

	for (var i = 1; i < k.length; i++) {
		if(k[i]=='id'){
			temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
		}
		else{
			temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
		}
	}

	
	console.log('SELECT * FROM project_tocheck where ' + temp + ' ORDER BY project_name');
	connection.query('SELECT * FROM project_tocheck where ' + temp + ' ORDER BY end_time',
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		else if (results) {
			if(results.length>0)
				res.send(results);
			}
		}
	)}

);

// 匹配 /search 路径的请求
//"search/2"以进度项id查找进度信息
processRouter.get('/search/2', function (req, res) {
	var url_info = require('url').parse(req.url, true);
	
	var k = Object.keys(url_info.query);
	var temp = k[0] + '=' + url_info.query[k[0]];

	for (var i = 1; i < k.length; i++) {
		if(k[i]=='id' || k[i]=='project_id'){
			temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
		}
		else{
			temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
		}
	}

    console.log('SELECT * FROM project_check_info where ' + temp + ' ORDER BY datetime');
	connection.query('SELECT * FROM project_check_info where ' + temp+ ' ORDER BY datetime',
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		else if (results) {
			if(results.length>0)
				res.send(results);
			}
		}
	);

});

processRouter.get('/search/3', function (req, res)
    {
        connection.query('SELECT * FROM project_tocheck  ORDER BY project_name',
        function selectCb(err, results, fields) {
            if (err) {
                console.log(err);
            }
		
            else if (results) {
                if (results.length > 0)
                    res.send(results);
            }
        }
        );
    });

// 匹配 /add 
processRouter.get('/add/1', function (req, res) {
	res.render('addcheck');
});
//"add/1"添加项目进度检查项
processRouter.post('/add/1', function (req, res) {
    if (req.body.time == '')
        req.body.time = 'NULL';
    else
        req.body.time = '"' + req.body.begin_time + '"';
    if (req.body.begin_time == '')
        req.body.begin_time = 'NULL';
    else
        req.body.begin_time = '"' + req.body.begin_time + '"';
    if (req.body.end_time == '')
        req.body.end_time = 'NULL';
    else
        req.body.end_time = '"' + req.body.end_time + '"';
    console.log('insert into project_tocheck (project_name,time,type,begin_time,end_time,target,target_now,state) values ( "' 
                                                                                    + req.body.project_name + '",' 
                                                                                    + req.body.time + ',"' 
                                                                                    + req.body.type + '",' 
                                                                                    + req.body.begin_time + ',' 
                                                                                    + req.body.end_time + ',"' 
                                                                                    + req.body.target + '","' 
                                                                                    + req.body.target_now + '","' 
                                                                                    + req.body.state + '")');
	connection.query('insert into project_tocheck (project_name,time,type,begin_time,end_time,target,target_now,state) values ( "' 
                                                                                    + req.body.project_name + '",' 
                                                                                    + req.body.time + ',"' 
                                                                                    + req.body.type + '",' 
                                                                                    + req.body.begin_time + ',' 
                                                                                    + req.body.end_time + ',"' 
                                                                                    + req.body.target + '","' 
                                                                                    + req.body.target_now + '","' 
                                                                                    + req.body.state + '")',
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
			res.send(err.code);
		} 
		
		if (results) {
			res.send('添加成功');
		}
	}
	);

});

//"delete/1"删除项目检查项
processRouter.get('/delete/1', function (req, res) {
	var url_info = require('url').parse(req.url, true);
	
	var k = Object.keys(url_info.query);
	if(k[0]=='id')
		var temp = k[0] + '=' + url_info.query[k[0]];
	else
		var temp = k[0] + '="' + url_info.query[k[0]] +'" ';

	for (var i = 1; i < k.length; i++) {
		if(k[i]=='id'){
			temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
		}
		else{
			temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
		}
    }
	
	connection.query('delete FROM project_tocheck where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		else if (results) {
			res.send({ result: results.affectedRows + ' records has been deleted' });
			//由results.affectedRows可以知道删除了多少行
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
		if(k[i]=='detail' || k[i]=='datetime'){
			temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
		}
		else{
			temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
		}
	}
    connection.query('SELECT * FROM project_check_info where ' + temp ,
        function selectCb(err, results, fields) {
        if (err) {
            console.log(err.code);
        }
		
        else if (results) {
            for (var i of results){
                if(i.photo!=null)
                    fs.unlinkSync("./uploads/progress/" + i.project_check_id +'/'+ i.photo);
                if(i.video!=null)
                    fs.unlinkSync("./uploads/progress/" + i.project_check_id +'/'+ i.video);
        }
        }
    });

	connection.query('delete FROM project_check_info where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
			res.send(err.code);
		}
		else if(results){
			if(results.affectedRows==0){
				res.send('no match record');
			}
			else{
                res.send(results.affectedRows + ' records has been deleted' );
			}
			//由results.affectedRows可以知道删除了多少行
		}
	});
});

//“update/1”更新项目检查项
processRouter.post('/update/1', function (req, res) {
    console.log(req.body);
    if (req.body.project_name == '') {
        res.send('项目名不能为空！');
        return;
    }
    else
    if (req.body.time == '')
        req.body.time = 'NULL';
    else
        req.body.time = '"' + req.body.begin_time + '"';
    if (req.body.begin_time == '')
        req.body.begin_time = 'NULL';
    else
        req.body.begin_time = '"' + req.body.begin_time + '"';
    if (req.body.end_time == '')
        req.body.end_time = 'NULL';
    else
        req.body.end_time = '"' + req.body.end_time + '"';
    console.log('update project_tocheck set time=' + req.body.time +  
											',type="' + req.body.type +  
											'",begin_time=' + req.body.begin_time +
											',end_time=' + req.body.end_time +
											',target="' + req.body.target + 
											'",target_now="' + req.body.target_now +
											'",state="' + req.body.state + 
											'" where id=' + req.body.id);
	connection.query('update project_tocheck set time='     + req.body.time +  
											',type="'       + req.body.type +  
											'",begin_time=' + req.body.begin_time +
											',end_time='   + req.body.end_time +
											',target="'     + req.body.target + 
											'",target_now="' + req.body.target_now +
											'",state="'       + req.body.state + 
											'" where id='     + req.body.id,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
		}
		
		else if (results) {
			if(results.affectedRows==0){
				res.send('no match record');
			}
			else{
				res.send(results.affectedRows+' records has been changed');
			}
		}
	}
	);
});

//“update/2”更新进度信息
processRouter.post('/update/2', function (req, res) {
    if (req.body.datetime == '')
        req.body.datetime = 'NULL';
    else
        req.body.datetime = '"' + req.body.datetime + '"';
	console.log('update project_check_info set user="'  + req.body.user +  
											'",detail="'        + req.body.detail +
											'",datetime="'     + req.body.datetime +
											'" where id='      + req.body.id);
	connection.query('update project_check_info set user="'  + req.body.user +  
											'",detail="'        + req.body.detail +
											'",datetime='     + req.body.datetime +
											' where id='      + req.body.id,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
		}
		
		else if (results) {
			if(results.affectedRows==0){
				res.send('no match record');
			}
			else{
				res.send(results.affectedRows+' records has been changed');
			}
		}
	}
	);
});

// 匹配 /upload 路径的请求
//"upload/” 项目进度上传

processRouter.post('/upload', function (req, res) {

	console.log(req.body.id);
	//var pic = req.files[0];
    //console.log(typeof (pic));
    var cq;
    if (req.body.datetime == '')
        req.body.datetime = 'NULL';
    if (req.files != undefined) {
        if (req.files.length == 1)
            cq = 'insert into project_check_info (project_check_id,user,detail,datetime,' + req.files[0].fieldname + ') values ( ' 
        + req.body.project_check_id + ',"' 
        + req.body.user + '","' 
        + req.body.detail + '",NOW(),"' 
        + req.files[0].filename + '")';
        else if (req.files.length == 2)
            cq = 'insert into project_check_info (project_check_id,user,detail,datetime,' + req.files[0].fieldname + ',' + req.files[1].fieldname + ') values ( ' 
        + req.body.project_check_id + ',"' 
        + req.body.user + '","' 
        + req.body.detail + '",NOW(),"' 
        + req.files[0].filename + '","' 
        + req.files[1].filename + '")';
    }
        else
            cq = 'insert into project_check_info (project_check_id,user,detail,datetime) values ( ' 
        + req.body.project_check_id + ',"' 
        + req.body.user + '","' 
        + req.body.detail + '",NOW())';
    
    console.log(cq);
	connection.query(cq, function selectCb(err, results, fields) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		
		if (results) {
			var i;
			var new_path = "./uploads/progress/" + req.body.project_check_id ;
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
			res.send('上传成功');
		}
	}
	);

});
module.exports = processRouter;