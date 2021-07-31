var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html'); // Security - Escaping
var cookie = require('cookie');
function authIsLogined(request, response) {
  var isLogined = false;
  var cookies = {};
  if (request.headers.cookie) {
    cookies = cookie.parse(request.headers.cookie);
  }
  // cookie 이해용
  if (cookies.email === 'nodejs' && cookies.password === '111111') {
    isLogined = true;
  }
  return isLogined;
}
function authStatusUI(request, response) {
  var authStatusUI = `<a href="/login">login</a>`;
  if (authIsLogined(request, response)) {
    authStatusUI = `<a href="/logout_process">logout</a>`;
  }
  return authStatusUI;
}

exports.home = function(request, response) {
  db.query(`SELECT * FROM topic`, function(error, topics) {
    var title = 'Welcome'; // 제목
    var description = 'Hello, Node.js'; // 본문
    var list = template.List(topics); // 목록
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`,
      authStatusUI(request, response)
    ); // WEB : create만 표시
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;

  db.query(`SELECT * FROM topic`, function(error, topics) {
    if (error) {
      throw error;
    }
    /* Security - SQL Injection
    // var sql = `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=${db.escape(queryData.id)}`;
    // console.log(sql);
    // var query = db.query(sql, function(error2, topic) {
    */
    var query = db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic) { // 배열의 값이 SQL문의 '?'에 치환되어 자동으로 들어감, 공격 의도의 가능성이 있는 것들은 세탁해주는 기능을 알아서 실행
      if (error2) {
        throw error2;
      }
      var title = topic[0].title; // 제목
      var description = topic[0].description; // 본문
      var list = template.List(topics); // 목록
      var html = template.HTML(title, list,
        `
        <h2>${sanitizeHTML(title)}</h2>
        ${sanitizeHTML(description)}
        <p>by ${sanitizeHTML(topic[0].name)}</p>
        `,
        `
        <a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a>
        <form action="delete_process" method="post" onsubmit="정말로 삭제하시겠습니까?.">
          <input type="hidden" name="id" value=${queryData.id}>
          <input type="submit" value="delete">
        </form>
        `,
        authStatusUI(request, response)
      );
      console.log(query.sql);
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create = function(request, response) {
  if (authIsLogined(request, response) === false) {
    response.end('Login required!!');
    return false;
  }

  db.query(`SELECT * FROM topic`, function(error, topics) {
    db.query(`SELECT * FROM author`, function(error2, authors) {
      var title = 'create'; // 제목
      var list = template.List(topics); // 목록
      var html = template.HTML(sanitizeHTML(title), list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p><input type="submit"></p>
        </form>
        `,
        `<a href="/create">create</a>`,
        authStatusUI(request, response)
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}
exports.create_process = function(request, response) {
  if (authIsLogined(request, response) === false) {
    response.end('Login required!!');
    return false;
  }

  var body = '';
  // request : createServer에서 callback함수의 인자
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`
      INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      function(error, result) {
        if (error) {
          throw error;
        }
        response.writeHead(302, {Location : `/?id=${result.insertId}`});
        response.end();
      }
    );
  });
}

exports.update = function(request, response) {
  if (authIsLogined(request, response) === false) {
    response.end('Login required!!');
    return false;
  }

  var _url = request.url;
  var queryData = url.parse(_url, true).query;

  db.query(`SELECT * FROM topic`, function(error, topics) {
    if (error) {
      throw error;
    }
    db.query(`SELECT * FROM author`, function(error2, authors) {
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic) {
        if (error2) {
          throw error2;
        }
        var list = template.List(topics); // 목록
        var html = template.HTML(sanitizeHTML(topic[0].title), list,
          `
          <form action="/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHTML(topic[0].title)}"></p>
            <p><textarea name="description" placeholder="description">${sanitizeHTML(topic[0].description)}</textarea></p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p><input type="submit"></p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`,
          authStatusUI(request, response)
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  });
}
exports.update_process = function(request, response) {
  if (authIsLogined(request, response) === false) {
    response.end('Login required!!');
    return false;
  }

  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function(error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, {Location : `/?id=${post.id}`});
      response.end();
    });
  });
}

exports.delete_process = function(request, response) {
  if (authIsLogined(request, response) === false) {
    response.end('Login required!!');
    return false;
  }

  var body = '';
  request.on('data', function(data) {
    body = body + data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result) {
      if (error) {
        throw error;
      }
      response.writeHead(302, {Location : `/`});
      response.end();
    });
  });
}
