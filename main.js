// 모듈을 불러옴
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

// module (lib - template.js)
var template = require('./lib/template.js');

var app = http.createServer(function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) { // WEB
      // filelist를 가져오기 (HTML, CSS, JavaScript, ...)
      fs.readdir('./data', function(error, filelist) {
        var title = 'Welcome'; // 제목
        var description = 'Hello, Node.js'; // 본문
        var list = template.List(filelist); // 목록

        // WEB : create만 표시
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        ); // 링크
        response.writeHead(200);
        response.end(html);
      });
    }
    else { // CSS, HTML, JavaScript, ...
      fs.readdir('./data', function(error, filelist) {
        // 입력정보에 대한 보안
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
          var title = queryData.id; // 제목
          var list = template.List(filelist); // 목록

          // 출력정보에 대한 보안
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags : ['h1']
          });

          // create, update, delete 모두 표시
          var html = template.HTML(title, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `
            <a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="delete_process" method="post" onsubmit="정말로 삭제하시겠습니까?.">
              <input type="hidden" name="id" value=${sanitizedTitle}>
              <input type="submit" value="delete">
            </form>
            `
          ); // 링크
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }
  else if (pathname === '/create') { // WEB, CSS, HTML, JavaScript, ... 등에서 'create'를 누르면 나오는 웹페이지 (title, description 입력 창과 '제출' 버튼이 나타남)
    fs.readdir('./data', function(error, filelist) {
      var title = 'WEB - create'; // 제목
      var list = template.List(filelist); // 목록

      // POST 방식으로 데이터를 전송
      // placeholder : 간단한 설명을 위함 (텍스트를 입력하면 사라짐)
      var html = template.HTML(title, list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form>
        `,
        ``
      ); // 링크
      response.writeHead(200);
      response.end(html);
    });
  }
  else if (pathname === '/create_process') { // create 웹페이지에서 '제출'을 클릭하면 나오는 웹페이지 (현재는 '제출'을 클릭했을 때, 생성된 웹페이지를 나타내도록 설정되어 있음)
    var body = '';
    // request : createServer에서 callback함수의 인자
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;

      // 파일 생성 (Create : '제출'을 클릭하면 data 폴더에 해당 파일이 생성됨)
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location : `/?id=${title}`}); // 302 : redirection (data 폴더에 파일이 생성된 후에, 해당 웹페이지로 이동됨)
        response.end();
      });
    });
  }
  else if (pathname === '/update') { // WEB, CSS, HTML, JavaScript, ... 등에서 'update'를 누르면 나오는 웹페이지
    fs.readdir('./data', function(error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
        var title = queryData.id; // 제목
        var list = template.List(filelist); // 목록

        // 검색 엔진에 수정할 웹페이지의 정보를 표시 (예 : /update?id=CSS)
        var html = template.HTML(title, list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${title}"> <!-- update_process : 수정할 파일의 이름을 받을 수 있음 --!>

            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p><textarea name="description" placeholder="description">${description}</textarea></p>
            <p><input type="submit"></p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  }
  else if (pathname === '/update_process') { // update 웹페이지에서 '제출'을 클릭하면 나오는 웹페이지
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;

      // 파일 수정 (Update)
      fs.rename(`data/${id}`, `data/${title}`, function(err) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          response.writeHead(302, {Location : `/?id=${title}`});
          response.end();
        });
      });
    });
  }
  else if (pathname === '/delete_process') { // delete 웹페이지에서 '제출'을 클릭하면 나오는 웹페이지
    var body = '';
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;

      // 파일 삭제 (Delete)
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(err) {
        response.writeHead(302, {Location : `/`}); // 파일 삭제를 완료하면 홈(WEB)으로 보냄
        response.end();
      });
    });
  }
  else { // 404 Not Found
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(3000); // 3000 : port number (localhost:3000)
