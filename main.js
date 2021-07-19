// 모듈을 불러옴
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db'); // 정리정돈 - db접속
var topic = require('./lib/topic'); // 정리정돈 - SQL
var author = require('./lib/author');

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) { // WEB
      topic.home(request, response);
    }
    else { // CSS, HTML, JavaScript, ...
      topic.page(request, response);
    }
  }
  else if (pathname === '/create') { // WEB, CSS, HTML, JavaScript, ... 등에서 'create'버튼을 클릭하면 나오는 웹페이지
    topic.create(request, response);
  }
  else if (pathname === '/create_process') { // create 웹페이지에서 '제출'을 클릭 (생성된 웹페이지를 표시)
    topic.create_process(request, response);
  }
  else if (pathname === '/update') { // WEB, CSS, HTML, JavaScript, ... 등에서 'update'버튼을 클릭하면 나오는 웹페이지
    topic.update(request, response);
  }
  else if (pathname === '/update_process') { // update 웹페이지에서 '제출'을 클릭 (수정된 웹페이지를 표시)
    topic.update_process(request, response);
  }
  else if (pathname === '/delete_process') { // delete 웹페이지에서 '제출'을 클릭 (삭제가 완료되면 home을 표시)
    topic.delete_process(request, response);
  }

  else if (pathname === '/author') {
    author.home(request, response);
  }
  else if (pathname === '/author/create_process') {
    author.create_process(request, response);
  }
  else if (pathname === '/author/update') {
    author.update(request, response);
  }
  else if (pathname === '/author/update_process') {
    author.update_process(request, response);
  }
  else if (pathname === '/author/delete_process') {
    author.delete_process(request, response);
  }

  else { // 404 Not Found
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000); // 3000 : port number (localhost:3000)
