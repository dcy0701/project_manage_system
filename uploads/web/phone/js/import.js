function user_import{
  var conn = new ActiveXObject("ADODB.Connection"); 
  conn.Open("Provider=SQLOLEDB.1; Data Source=localhost; User ID=sa; " +"Password=; Initial Catalog=pubs"); 
  var rs = new ActiveXObject("ADODB.Recordset"); 
  var sql="select * from authors"; 
  rs.open(sql, conn); 

  shtml="<table width='100%' border=1>";
  shtml+="<tr><td>工程编号</td><td>工程名称</td><td>建设年度</td><td>项目经理</td><td>建设地点</td><td>投资（万）</td><td>设计单位</td><td>设计负责人</td><td>监理单位</td><td>监理负责人</td><td>施工单位</td><td>施工负责人</td><td>所属区县</td><td>类型</td><td>计划开工</td><td>实际开工</td><td>计划竣工</td><td>实际完工</td><td>经度</td><td>纬度</td><td>签到范围</td><td>项目状态</td></tr>";
  while(!re.EOF)
  {
  	shtml+="<tr><td>"+rs("工程编号")+"</td><td>"+rs("工程名称")+"</td><td>"+rs("建设年度")+"</td><td>"+rs("项目经理")+"</td><td>"+rs("建设地点")+"</td><td>"+rs("投资（万）")+"</td><td>"+rs("设计单位")+"</td><td>"+rs("设计负责人")+"</td><td>"+rs("监理单位")+"</td><td>"+rs("监理负责人")+"</td><td>"+rs("施工负责人")+"</td><td>"+rs("所属区县")+"</td><td>"+rs("类型")+"</td><td>"+rs("计划开工")+"</td><td>"+rs("实际开工")+"</td><td>"+rs("计划竣工")+"</td><td>"+rs("实际完工")+"</td><td>"+rs("经度")+"</td><td>"+rs("纬度")+"</td><td>"+rs("签到范围")+"</td><td>"+rs("项目状态")+"</td></tr>";
    rs.moveNext;
  }
  shtml+="</table>"
  document.write(shtml);
  rs.close();
  rs=null;
  conn.close();
  conn=null;
}