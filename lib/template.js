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
  List : function (topics) {
    var list = '<ul>'; // 목록 (CSS, HTML, JavaScript, ...)
    var i = 0;
    while(i < topics.length) {
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  },
  authorSelect : function (authors, author_id) {
    // 콤보 상자
    var tag = '';
    var i = 0;
    while(i < authors.length) {
      var selected = '';
      if (authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `;
  }
}
