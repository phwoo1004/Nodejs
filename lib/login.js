var fs = require('fs');
var qs = require('querystring');
var template = require('./template');

exports.login = function(request, response) {
  fs.readdir('./data', function(error, filelist) {
    var title = 'Login';
    var list = template.List(filelist);
    var html = template.HTML(title, list,
      `
      <form action="login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>
      `,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
}
exports.login_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    if (post.email === 'nodejs' && post.password === '111111') {
      response.writeHead(302, {
        'Set-Cookie':[
          `email=${post.email}`,
          `password=${post.password}`,
          'nickname=nodejs'
        ],
        Location: '/'
      });
      response.end();
    }
    else {
      response.end('Who?');
    }
  });
}

exports.logout_process = function(request, response) {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    response.writeHead(302, {
      'Set-Cookie':[
        `email=; Max-Age=0`,
        `password=; Max-Age=0`,
        `nickname=; Max-Age=0`
      ],
      Location: '/'
    });
    response.end();
  });
}
