/*
    created by dcy on 2016-04-15

*/
var express = require('express');
var fs = require('fs');
var serviceRouter = express.Router();

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

connection.query('use '+sqlConfig.database)
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

serviceRouter.get('/login', function(req, res) {
  //res.send('About test');
  var username = req.query.user;
  var password = req.query.pass;
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

    }else if(results[0].password==password){
      //登录成功
      res.send('success');
      // TODO 返回 用户的元数据

    }else{
      //console.log(Object.getOwnPropertyNames(results[0]));
      //console.log([].slice.call(results));
      //账号密码错误
      res.send('账号密码错误')

    }
  });
});
//定位api
//接收参数 1：经纬度 2：照片（写入数据库照片地址） 3：工程和子工程 4：当前用户的id

// 坐标转换api
// 工程和子工程更新api

serviceRouter.post('/location',function(req, res){
  //TODO

  console.log(req.body);//body里面是post的信息  已经被中间件编译过的

  var user = req.body.user;
  var location = req.body.location;
  var TimeStamp = new Date().getTime();
  //还有这个参数是子工程的id  这个将在更新的时候传递给前端  这个值是可以拿到的
  var project_id = req.body.project_id;
  var photo = req.body.photo;
  if(user===undefined||location===undefined||project_id===undefined){
    res.send('error param');
    return;//此处需要return  不然会重复调用res
  }
  var photoUrl = 'null'
  //此处为base64 数据  我们将其还原为文件
  //base64 图片的格式为 data:image/JPG;base64,
  // 目前我们仅仅考虑 apple手机  都是jpg的格式
  console.log(photo);

// /*
// test
// */
// fs.writeFile('./routes/message.txt', 'Hello Node', function (err) {
//   if (err) throw err;
//   console.log('It\'s saved!');
// });

  if(photo!==undefined){
    var buffer = photo.replace(/^data:image\/\w+;base64,/, "");
    //将buffer写入文件中
    console.log(buffer);
    photoUrl = './uploads/'+user+'#'+TimeStamp+'.jpg';
    fs.writeFile(photoUrl, buffer, 'base64', function(err) {
      if(err) console.log(err);
      console.log('saved in '+ photoUrl);
    });
  }
  //然后将数据写入到 数据库
  var insert_query = 'insert into golocation (date,user,project_id,location,photo_url) values("'+TimeStamp+'","'+user+'",'+project_id+',"'+location+'","'+photoUrl+'")';
  console.log(insert_query);
  connection.query(insert_query,function(err,results,fields){
    //console.dir(arguments);
    if(err){
      console.log(err.code);
      res.send(err.code+'服务器错误');

    }else{
      //登录成功
      res.send('签到成功');
      //
    }
  });


  //在此处 我们会将 这个文件转存到一个文件夹下，并且，我们会将图片的相对地址存入数据库中。

  //以上是我们从参数里拿到的所有数据
  });

serviceRouter.get('/updateProject',function(req, res){
  //res.send(工程和子工程)
  //TODO
});
serviceRouter.post('/location1',function(req, res){
  res.send('这是get请求暂时不支持啊');

})

module.exports = serviceRouter;
