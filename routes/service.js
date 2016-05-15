/*
    created by dcy on 2016-04-15
    base on async and promise
*/

var async = require('async');
//async 是一个异步控制的模块 generator原理
var express = require('express');

var sleep = require('sleep');
var fs = require('fs');
var serviceRouter = express.Router();

var fetch = require('fetch').fetchUrl;

var request = require('request');
//formData 中间件
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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

connection.query('use '+sqlConfig.database);
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
//  修改密码接口
serviceRouter.get('/modify', function(req, res) {
  var username = req.query.user;
  var password = req.query.new;

  var queryString = `update user set password='${password}' where user_name='${username}'`;
  connection.query(queryString,function(err,results,fields){
    //console.dir(arguments);
    if(err){
      console.log(err.code);
      res.json({status:'err'});
    }else{
      res.json({status:'ok'});
    }
  });
});


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
      //res.send('success');

      // TODO 返回 用户的元数据

    }else{
      //console.log(Object.getOwnPropertyNames(results[0]));
      //console.log([].slice.call(results));
      //账号密码错误
      res.json({error:'账号密码错误'});

    }
  });
});
//定位api
//接收参数 1：经纬度 2：照片（写入数据库照片地址） 3：工程和子工程 4：当前用户的id

// 坐标转换api
// 工程和子工程更新api

serviceRouter.post('/location',multipartMiddleware,function(req, res){
  //TODO

  console.log(req.body);//body里面是post的信息  已经被中间件编译过的
  console.log(req.files.photo);
  var user = req.body.user;
  var location = req.body.location;
  var TimeStamp = new Date().getTime();
  //还有这个参数是子工程的id  这个将在更新的时候传递给前端  这个值是可以拿到的
  var project_id = decodeURIComponent(req.body.project_id);
  //var photo = req.body.photo;
  if(user===undefined||location===undefined||project_id===undefined){
    res.send('error param');
    return;//此处需要return  不然会重复调用res
  }
  var photoUrl = 'null'
  //此处为base64 数据  我们将其还原为文件
  //base64 图片的格式为 data:image/JPG;base64,
  // 目前我们仅仅考虑 apple手机  都是jpg的格式


  //console.log(photo);

// /*
// test
// */
// fs.writeFile('./routes/message.txt', 'Hello Node', function (err) {
//   if (err) throw err;
//   console.log('It\'s saved!');
// });
    var photo = req.files.photo.path;
  if(photo!==undefined){
    var imageBuf = fs.readFileSync(photo);
    //同步读入
    var photo_base64 = imageBuf.toString("base64");
    var buffer = photo_base64.replace(/^data:image\/\w+;base64,/, "");
    //将buffer写入文件中
    console.log(buffer);
    photoUrl = './uploads/'+user+'-'+TimeStamp+'.jpg';
    fs.writeFile(photoUrl, buffer, 'base64', function(err) {
      if(err) console.log(err);
      console.log('saved in '+ photoUrl);
    });
  }
  //校验人员一致性
  var error_flag = 0;


  var promise_check = new Promise(function(resolve, reject){
    connection.query('select project_check_id from project_check_info where user_id="'+user+'"',function(err,results,fields){
      var result_arr = [];

      for(var j of results){
        result_arr.push(j.project_check_id);
      }
      console.log(result_arr);
      // console.log(result_arr.indexOf(parseInt(project_id)));
      // if(Array.prototype.includes!==undefined){
      //   result_arr.includes(project_id)
      // }

      if(result_arr.indexOf(project_id)==-1){
        error_flag='-1'
        console.log('负责人出错');
        reject('-1');
      }else{
        resolve();
      }
    })
  });

  //然后将数据写入到 数据库
  var promise_insert = new Promise(function(resolve,reject){
    var insert_query = `insert into golocation (date,user,project_id,location,photo_url) values("${TimeStamp}","${user}","${project_id}","${location}","${photoUrl}")`;
    console.log(insert_query);

    connection.query(insert_query,function(err,results,fields){
      //console.dir(arguments);
      if(err){
        console.log('插入出错');
        error_flag='1'
        reject(err);
        //res.send(err.code+'服务器错误');

      }else{
        resolve();
        //登录成功
        //res.send('success');
        //
      }
    });
  });

  // 查询定位区域的并未加入到主逻辑中 TODO
  // function caculate(location1,location2,diff){
  //   //前端传的时候 $分割
  //   var location_req = location1.split('$');
  //   var location_res = location2.split('$');
  //   if(Math.pow(location_req[0]-location_res[0],2)+Math.pow(location_req[1]-location_res[1],2)<=diff){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }
  //
  // var promise_location_filedcheck = new Promise(function(resolve,reject){
  //   connection.query('select gps_lat gps_lon from project_table where project_id='+project_id,function(err,results,fields){
  //     if (err){
  //       reject(err);
  //     }else{
  //       console.log(results);
  //       var location_temp = results[0].gps_lat+'$'+results[0].gps_lon;
  //       var result = caculate(location_temp,location,100);
  //       if(result){
  //         resolve();
  //       }else{
  //         error_flag=2;
  //         reject();
  //       }
  //     }
  //   });
  // });

  //这个查询 暂时未添加
  var errorDescription={};
  Promise.all([promise_check,promise_insert/*,promise_location_filedcheck*/]).then(function (posts){
    errorDescription.status='s';
    res.json(errorDescription);
  }).catch(function(reason){
      console.log(error_flag);
    if(error_flag==1){
        errorDescription.status='1';
        errorDescription.text='服务器错误';
        res.json(errorDescription);
    }else if(error_flag==-1){
        errorDescription.status='-1';
        //尽管不是负责人，此时还是签到了,所以我们会另外加个标志 表示他是代签到。connection.query('')
        connection.query('UPDATE golocation SET flag = 1 WHERE photo_url="'+photoUrl+'"');
        errorDescription.text='您不是此项目的负责人';
        res.json(errorDescription);
    }else{
        errorDescription.status='2';
        errorDescription.text='您定位的地址不准确';
        res.json(errorDescription);
    }
});
  //在此处 我们会将 这个文件转存到一个文件夹下，并且，我们会将图片的相对地址存入数据库中。
  //以上是我们从参数里拿到的所有数据
  });



serviceRouter.get('/updateChargeman',function(req,res){
  //TODO
  var project_id = decodeURIComponent(req.query.project_id);
  var user_id = req.query.user;
  var flag = req.query.flag;
  var st = req.query.st;
  if(project_id===undefined||user_id===undefined){
    res.send('param error');
    return ;
    //出口优先
  }
  if(flag==1){
    connection.query('update project_check_info set user_id="'+user_id+'" where project_check_id ="'+project_id+'"',function(err,results,fields){
      //console.log(results.length);
      if(err){
        console.log(err);
      }else{
      }
    });
  }
  connection.query(`delete from project_apply where user_id="${user_id}" AND project_check_id="${project_id}" AND time="${st}"`,function(err,results,fields){
    //console.log(results.length);
    if(err){
      console.log(err);
    }else{
    }
  });
  res.json({status:'ok'});

});

serviceRouter.get('/updateChargeman1',function(req,res){
  //TODO
  var p_id = decodeURIComponent(req.query.project_id);
  var u_id = req.query.user;
  var date = new Date().getTime();
  if(p_id===undefined||u_id===undefined){
    res.send('param error');
    return ;
    //出口优先
  }
  connection.query('insert into project_apply (project_check_id,user_id,date) values ("'+p_id+'","'+u_id+'","'+date+'") ',function(err,results,fields){
    //console.log(results.length);
    if(err){
      console.log(err);
      res.send('apply error');
    }else{
      res.send('apply success');
    }
  });
});

serviceRouter.get('/getRecent',function(req,res){
  //TODO
  var u_id = req.query.user;
  if(u_id===undefined){
    res.send('param error');
    return ;
    //出口优先
  }
  if(u_id=='all'){
    connection.query(`select * from golocation limit 100`,function(err,results,fields){
      //console.log(results.length);
      if(err){
        //console.log(err);
        res.send('apply error');
      }else{
        var resu = [];
        var index = 0;
        // results.map(function(val,index,arr){
        //   val
        // })
        var GEOCODER_API= 'http://apis.map.qq.com/ws/geocoder/v1/?key=WEGBZ-JPQK4-R53U5-DGPG2-UIAHF-AOBRL&coord_type=1&location=';
        async.eachSeries(results, function(item,callback){
          //console.log(item);
          resu[index]=JSON.parse(JSON.stringify(item));
          // deep clone
          var latitude = item.location.split('$')[0];
          var longitude = item.location.split('$')[1];
          request(GEOCODER_API+latitude+','+longitude,function(error,response,body){
            if (!error && response.statusCode == 200) {
              body = JSON.parse(body);
              console.log(body);
              if(body.result!==undefined){
                resu[index].address = body.result.address;
              }
              index++;
              sleep.usleep(95000);//微秒
              callback(null, item);
            }
          })
          // XXX 为啥不支持fetch协议？？？？
          // fetch(GEOCODER_API+latitude+','+longitude).then(function(data){
          //   return data.json();
          // }).then(function(result){
          //   if(result.message=="query ok"){
          //     resu[index].address = result.result.address;
          //   }else{
          //     console.log('转换出错了');
          //   }
          //   index++;
          //   callback(null, item);
          // })
        },function(err){
          res.json(resu.reverse());
        })
      }
    });
  }else{
    connection.query(`select * from golocation where user='${u_id}' limit 20`,function(err,results,fields){
      //console.log(results.length);
      if(err){
        //console.log(err);
        res.send('apply error');
      }else{
        var resu = [];
        var index = 0;
        // results.map(function(val,index,arr){
        //   val
        // })
        var GEOCODER_API= 'http://apis.map.qq.com/ws/geocoder/v1/?key=WEGBZ-JPQK4-R53U5-DGPG2-UIAHF-AOBRL&coord_type=1&location=';
        async.eachSeries(results, function(item,callback){
          //console.log(item);
          resu[index]=JSON.parse(JSON.stringify(item));
          // deep clone
          var latitude = item.location.split('$')[0];
          var longitude = item.location.split('$')[1];
          request(GEOCODER_API+latitude+','+longitude,function(error,response,body){
            if (!error && response.statusCode == 200) {
              body = JSON.parse(body);
              console.log(body);
              if(body.result!==undefined){
                resu[index].address = body.result.address;
              }
              index++;
              sleep.usleep(95000);//微秒
              callback(null, item);
            }
          })
          // XXX 为啥不支持fetch协议？？？？
          // fetch(GEOCODER_API+latitude+','+longitude).then(function(data){
          //   return data.json();
          // }).then(function(result){
          //   if(result.message=="query ok"){
          //     resu[index].address = result.result.address;
          //   }else{
          //     console.log('转换出错了');
          //   }
          //   index++;
          //   callback(null, item);
          // })
        },function(err){
          res.json(resu.reverse());
        })
      }
    });
  }

});


serviceRouter.get('/updateProject',function(req, res){
  //res.send(工程和子工程)
  var result_json = {};
  connection.query('select distinct father_id from project_id',function(err,results,fields){
    //console.log(results.length);
    var father_id_array=[];

    // console.log(father_id_array);

    //
    //   connection.query('select id from project_id where father_id='+4,function(err,resultss,fields){
    //     console.log(resultss);
    //     //result_json[i.father_id] = resultss;
    //     //debugger;
    //   });
//此处async写法
    for(var j of results){
      father_id_array.push(j.father_id);
    }
    console.log(father_id_array);
    //如果中途出错，则马上把错误传给最终的callback，还未执行的不再执行。

    //TODO 记住一定加上callback 回调函数
    async.eachSeries(father_id_array, function(item,callback){
      console.log('当前操作'+item);
      connection.query(`select id from project_id where father_id="${item}"`,function(err,resultss,fields){
        //console.log(resultss);
        var temp = [];
        for(var j of resultss){
            temp.push(j.id);
        }
        result_json[item] = temp;
        //debugger;
        //console.log(result_json);
        //此时 如果item是最后的
        // if(father_id_array[-1]===item){
        //   callback('error')
        // }else{
        //
        // }
        callback(null, item);
      });
    },function(err){
      //最后一定会执行，在此处。
      res.json(result_json);
      console.log(err);
    });


    // for(var i of results){
    //   //console.log(i.father_id);
    //   //console.log('querystring:'+'select id from project_id where father_id='+i.father_id);
    //   connection.query('select id from project_id where father_id='+i.father_id,function(err,resultss,fields){
    //     console.log(resultss);
    //     var temp;
    //     if(resultss.length>1){
    //       temp = [];
    //       for(var j of resultss){
    //         temp.push(j.id);
    //       }
    //     }else{
    //       temp = resultss[0].id;
    //     }
    //     result_json[i.father_id] = temp;
    //     //debugger;
    //   });
    // }
    // //

  });
  //TODO

});

  serviceRouter.get('/getapply',function(req,res){
    connection.query(`select * from project_apply`,function(err,results,fields){
      if(err){
        res.send({status:'error',message:'错误'});
        return;
      }
      console.log(results);
      res.json(results);
    })

  })

  serviceRouter.get('/distance',function(req,res){
    var project_id = decodeURIComponent(req.query.project_id);
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    connection.query(`select gps_lat,gps_lon from project_table where project_id="${project_id}"`,function(err,results,fields){

      if(err){
        res.send({status:'error',distance:{message:'无此工程号'}});
        return;
      }
      if(results.length===0){
        res.json({status:'error',distance:'无此工程号'});
        return;
      }
      console.log(results)
      //如果结果是null 说明数据库未记录此ID
      var gps_lat = results[0].gps_lat;
      console.log(gps_lat);
      if(String(gps_lat)==='null'){
        res.json({status:'ok1',distance:'此工程号未记录定位地点，所以在此处不判断'});
        return;
      }
      var gps_lon = results[0].gps_lon;
      var GEOCODER_API = `http://apis.map.qq.com/ws/distance/v1/?mode=walking&from=${gps_lat},${gps_lon}&to=${latitude},${longitude}&key=WEGBZ-JPQK4-R53U5-DGPG2-UIAHF-AOBRL`;
      console.log(GEOCODER_API);
      request(GEOCODER_API,function(error,response,body){

        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          console.log(body);
          if(body.result!==undefined&&body.status===0){
            var distance = body.result.elements[0].distance;
            res.json({status:'ok',distance:distance});
          }else{
            res.json({status:'error',distance:body});
          }
        }
        else{
          res.json({status:'error',distance:body});
        }
      })
    });
  });

  serviceRouter.post('/location1',function(req, res){
    res.send('just for test');
    }
  );

module.exports = serviceRouter;
