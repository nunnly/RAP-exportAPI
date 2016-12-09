var express = require('express');
var router = express.Router();
var jade = require('jade');
var path = require('path');
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
var path = require('path');
var fs = require('fs');
function tableLine(target,data,pre){
  var fg = '  \t|\t  ';
  var identifier = data.identifier.match(/[^|]+/)[0];
  target.push('| ' + pre + identifier+ fg+ data.name + fg + data.dataType + '  |');
  if(/array/.test(data.dataType)){
    data.parameterList.forEach(function(val){
      tableLine(target,val,pre + '- ');
    });
  }
}
function getMethod(num){
  var method;
  switch (parseInt(num)){
    case 1:
      method = 'GET';
      break;
    case 2:
      method = 'POST';
      break;
    case 3:
      method = 'PUT';
      break;
    case 4:
      method = 'DELETE';
      break;
  }
  return method
}
function parseToMarkDown(data){

  var md = [];
  md.push('# 项目名称: ' + data.name);
  md.push('- 创建时间: ' + data.createDateStr);
  md.push('- 创建人: '+ data.user.name);
  md.push('- 当前版本号: ' + data.version);
  md.push('- 项目简介: ' + data.introduction);
  data.moduleList.forEach(function(mod){
    md.push('## 模块名称: ' + mod.name);
    mod.pageList.forEach(function(page){
      md.push('### 页面名称: ' + page.name);
      page.actionList.forEach(function(action){
        md.push('#### 接口名称:' + action.name);
        md.push('- 接口地址:' + action.requestUrl);
        md.push('- 接口类型:' + getMethod(action.requestType));
        md.push('- 接口描述:' + action.description);
        md.push('##### 请求参数列表:' )
        md.push('| 参数列表 | 参数名称 | 参数类型 |')
        md.push('| ------------- | ------------- | --------------- |');
        action.requestParameterList.forEach(function(val){
          tableLine(md,val,'')
        })
        md.push('##### 响应参数列表:' )
        md.push('| 参数列表 | 参数名称 | 参数类型 |')
        md.push('| ------------- | ------------- | --------------- |');
        action.responseParameterList.forEach(function(val){
          tableLine(md,val,'')
          // md.push('| ' + val.identifier.replace(/\|+./,'')+ fg+ val.name + fg + val.dataType + '  |')
        })
      })
    });
  })
  return md.join('\n')
}
/* GET home page. */
router.get('/', function(req, res) {
  var database = req.seq;
  database.query('SELECT id,name FROM tb_project').spread(function(result,ret){
    res.render('index', { data: result });
  })
});
router.get('/getAPI/:type/:id', function(req,res){
  var id = req.params.id;
  var database= req.seq;
  var queryType = req.params.type;
  database.query('SELECT name,project_data FROM tb_project WHERE id ='+ id).spread(function(result){
    var a = (new Function('return ('+result[0].project_data+')'))();
    var projectName = result[0].name;
    var pre='<!DOCTYPE html><html lang="zh-cn"><head><title>'+projectName+'</title></head><body><div class="markdown-body">';
    var end = '</div></body></html>';
    if(queryType == 'markdown'){
      res.set({
        'Content-Type':'text/plain',
        // 'Content-Disposition': 'attachment; filename=“application.md”'
      })
      res.send(parseToMarkDown(a))
    }else if(queryType === 'json'){
      res.send(a);
    }else if(queryType === 'html'){
      var style = '<style>' + fs.readFileSync(path.join(__dirname + '/../public/stylesheets/markdown.css')) + '</style>';
      res.send(pre + style + md.render(parseToMarkDown(a)) + end);
    }else{
      res.send(666)
    }
  })
});

module.exports = router;
