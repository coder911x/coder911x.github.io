/* Набор полезных утилит конкретно для этого сайта */
/* Зависимость: escape(utils.js), getQueryString(utils.js) */
void function() {
  var escape = utils.escape;

  // Возвращает разметку атрибута, если значение не пусто
  function attr(name, value) {
    return value
      ? name + '="' + value + '"'
      : '';
  }

  // Возвращает разметку одной ячейки таблицы
  function getTableDataMarkup(content, customClass, href) {
    return '<td ' + attr('class', customClass) + '>' +
        (href ? '<a href="#server-info' + utils.serializeQueryString(href) + '">' : '')
          + content + 
        (href ? '</a>' : '') +
      '</td>';
  }

  // Возвращает разметку ряда таблицы
  function createRowMarkup(server) {
    var hrefData = {
      address: server.ip,
      port: server.port,
      game: utils.getHash()
    };
    return '<tr>' +
      getTableDataMarkup(escape(server.name), 'name', hrefData) +
      getTableDataMarkup(escape(server.map), 'map') +
      getTableDataMarkup(
        (server.players + server.bots.length) + '/' + server.maxPlayers,
        'slots'
      ) +
      getTableDataMarkup(escape(server.ip + ':' + server.port), 'socket') +
    '</tr>'
  }

  window.mUtils = {
    fillTable: function(servers) {
      var markup = '';
      servers.forEach(function(server) {
        if (!server.online) return;
        markup += createRowMarkup(server);
      });
      $('.servers-list').html(markup);
    }
  };
}();