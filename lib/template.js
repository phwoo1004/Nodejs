// refactoring : 'template' 객체를 생성하여 함수를 정리
module.exports = {
  // body : 제목과 본문
  // control : create, update
  HTML : function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>

    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  List : function (filelist) {
    var list = '<ul>'; // 목록 (CSS, HTML, JavaScript, ...)
    var i = 0;
    while(i < filelist.length) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }
}
