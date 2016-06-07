var express = require('express');
var rootRouter = express.Router();
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
/* GET home page. */
rootRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
rootRouter.use(cpUpload);

rootRouter.get('/searchuser',function (req, res, next) {
  	var url_info = require('url').parse(req.url, true);
    
    var k = Object.keys(url_info.query);
    if(k[i]=='id')
      var temp = k[0] + '=' + url_info.query[k[0]];
    else
      var temp = k[0] + '="' + url_info.query[k[0]]+'"';

    for (var i = 1; i < k.length; i++) {
      if(k[i]=='id'){
        temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
      }
      else{
        temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
      }
    }
    console.log('SELECT * FROM user where ' + temp);
    connection.query('SELECT * FROM user where ' + temp,
          function selectCb(err, results, fields) {
      if (err) {
        console.log(err);
      }
      
      else if (results) {
        if(results.length>0)
          res.send({results:results});
        }
      }
    )
})

rootRouter.post('/adduser', function (req, res) {
	connection.query('insert into user (user_name,password,area,role) values ( "' 
                                                                                    + req.body.user_name + '","' 
                                                                                    + req.body.password + '","' 
                                                                                    + req.body.area + '","' 
                                                                                    + req.body.role + '")',
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

rootRouter.get('/deleteuser', function (req, res) {
  	var url_info = require('url').parse(req.url, true);
    
    var k = Object.keys(url_info.query);
    if(k[i]=='id')
      var temp = k[0] + '=' + url_info.query[k[0]];
    else
      var temp = k[0] + '="' + url_info.query[k[0]]+'"';

    for (var i = 1; i < k.length; i++) {
      if(k[i]=='id'){
        temp += ' and ' + k[i] + '=' + url_info.query[k[i]];
      }
      else{
        temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
      }
    }
	
	connection.query('delete FROM user where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		else if (results) {
			res.send(results.affectedRows+' records has been deleted');
			//由results.affectedRows可以知道删除了多少行
		}
		
	}
	);

});

rootRouter.post('/updateuser', function (req, res) {

	connection.query('update user set user_name="'     + req.body.user_name +  
									           		'",password="'       + req.body.password +  
										                 '",area="'      + req.body.area +
											              '",role="'       + req.body.role +
                                    '" where id='    + req.body.id,
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

rootRouter.get('/searchrole',function (req, res, next) {
  	var url_info = require('url').parse(req.url, true);
    
    var k = Object.keys(url_info.query);
    var temp = k[0] + '="' + url_info.query[k[0]]+'"';

    for (var i = 1; i < k.length; i++) 
        temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';

    connection.query('SELECT * FROM root_role where ' + temp,
          function selectCb(err, results, fields) {
      if (err) {
        console.log(err);
      }
      
      else if (results) {
        if(results.length>0)
          res.send({results:results});
        }
      }
    )
})

rootRouter.post('/addrole', function (req, res) {
	connection.query('insert into root_role values ( "' 
                                            + req.body.role + '","' 
                                            + req.body.root + '","' 
                                            + req.body.leader + '")',
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

rootRouter.get('/deleterole', function (req, res) {
  	var url_info = require('url').parse(req.url, true);
    
    var k = Object.keys(url_info.query);
    var temp = k[0] + '="' + url_info.query[k[0]]+'"';

    for (var i = 1; i < k.length; i++) 
        temp += ' and ' + k[i] + '="' + url_info.query[k[i]]+'"';
	
	connection.query('delete FROM root_role where ' + temp,
        function selectCb(err, results, fields) {
		if (err) {
			console.log(err.code);
		}
		
		else if (results) {
			res.send(results.affectedRows+' records has been deleted');
			//由results.affectedRows可以知道删除了多少行
		}
		
	}
	);

});

rootRouter.post('/updaterole', function (req, res) {

	connection.query('update root_role set root="'     + req.body.root +  
									           		'",leader="'       + req.body.leader +  
                              '" where role="'    + req.body.role +'"',
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

module.exports = rootRouter;
