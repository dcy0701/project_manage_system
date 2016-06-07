
	//$("#roleControll").hide();
	$(function(){
   var vars = [], hash;

   var q = document.URL.split('?')[1];

   if(q != undefined){

       q = q.split('&');

       for(var i = 0; i < q.length; i++){
          	

           hash = q[i].split('=');

           vars.push(hash[1]);

           vars[hash[0]] = hash[1];

       }

    }

    var username=vars[0];
    var area=decodeURI(vars[1]);
    var role=decodeURI(vars[2]);
    
    //var user=document.getElementById("user");
    //user[0].innerHTML=username;
    $("u").html(username);

  
    document.getElementById('addBtn').style.display="none";
    document.getElementById('delBtn').style.display="none";
    document.getElementById('updBtn').style.display="none";

   var host =fetch('../../r/searchrole?role='+role).then(function(data){
			return data.json();
			console.log(data);
		}).then(function(json){
			console.log(json);
			if(json[0]!="超级管理员")
				$("#roleControll").hide();
			for (var i in json[1]) {
				//json[i].time1 = String(new Date(parseInt(json[i].time))).slice(4,21);

				switch(json[i]){
					case 'A': 
					case 'B':
					case 'C':
					case 'D':
					     document.getElementById('addBtn').style.display="block";
					case 'E':
					    document.getElementById('delBtn').style.display="block";
					case 'F':
					     document.getElementById('updBtn').style.display="block";
					case 'G':
					case 'H':
					case 'I':
					case 'J':
				}
			}
		})
	});

  function xinxi(){
  	var q = document.URL.split('?')[1];
    window.location.href='xinxi.html?'+q;
  }

  function jindu(){
  	var q = document.URL.split('?')[1];
    window.location.href='selectproject.html?'+q;
  }

  function zhiliang(){
  	var q = document.URL.split('?')[1];
    window.location.href='zhiliang.html?'+q;
  }


  function fuwushang(){
  	var q = document.URL.split('?')[1];
    window.location.href='fuwushang.html?'+q;
  }

  function xiaoguo(){
  	var q = document.URL.split('?')[1];
    window.location.href='xiaoguo.html?'+q;
  }

  function index(){
  	var q = document.URL.split('?')[1];
    window.location.href='index.html?'+q;
  }

  function user(){
  	var q = document.URL.split('?')[1];
    window.location.href='usermodel _delete.html?'+q;
  }

function role(){
  	var q = document.URL.split('?')[1];
    window.location.href='role.html?'+q;
  }



			/*var html = template('test', {"list":json});
			document.getElementById('app').innerHTML = html;
			$('button[sid]').click(function(){
				// var index = $(this).attr('sid');
				console.log(111);
				var index = $(this).attr('sid');
				var st = $(this).attr('st');
				var currentline = json[index];
				console.log(currentline);
				fetch(`../../s/updateChargeman?user=${currentline.user_id}&project_id=${currentline.project_check_id}&flag=1&st=${st}`).then(function(data){
					return;
					console.log(data);
				})
			});
			$('button[hid]').click(function(){
				// var index = $(this).attr('sid');
				console.log(222);
				var index = $(this).attr('hid');
				var currentline = json[index];
				console.log(currentline);
				var $this = $(this);
				fetch(`../../s/updateChargeman?user=${currentline.user_id}&project_id=${currentline.project_check_id}&flag=0&st=${st}`).then(function(data){
					$this.hide();
					return;
					console.log(data);
				})

			});
		})

	});*/
