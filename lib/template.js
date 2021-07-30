var sanitizeHTML = require('sanitize-html'); // Security - Escaping

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
      <a href="login">login</a>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      <p><a href="/author">author</a></p>
      ${body}
    </body>
    </html>
    `;
  },
  List : function (topics) {
    var list = '<ul>'; // 목록 (CSS, HTML, JavaScript, ...)
    var i = 0;
    while(i < topics.length) {
      list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHTML(topics[i].title)}</a></li>`;
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
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHTML(authors[i].name)}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `;
  },
  authorTable : function (authors) {
    var tag = '<table>';
    var i = 0;
    while (i < authors.length) {
      tag += `
        <tr>
          <td>${sanitizeHTML(authors[i].name)}</td>
          <td>${sanitizeHTML(authors[i].profile)}</td>
          <td><a href="/author/update?id=${authors[i].id}">update</a></td>
          <td>
            <form action="/author/delete_process" method="post">
              <input type="hidden" name="id" value="${authors[i].id}">
              <input type="submit" value="delete">
            </form>
          </td>
        </tr>
      `;
      i++;
    }
    tag += `</table>`;
    return tag;
  }
}
