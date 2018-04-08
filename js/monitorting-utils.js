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
  function createServerRowMarkup(server) {
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

  // Возвращает разметку ряда таблицы
  function createPlayerRowMarkup(player, isBot) {
    if (isBot == undefined)
      isBot = false;
    return '<tr>' +
      getTableDataMarkup(escape(player.name)) +
      getTableDataMarkup(player.score) +
      (isBot ? '' : getTableDataMarkup(Math.floor(player.time))) +
    '</tr>'
  }

  window.mUtils = {
    // Заполнить таблицу
    fillTable: function(type, entities) {
      var markup = '';
      entities.forEach(function(entity) {
        switch (type) {
          case 'servers':
            if (!entity.online) return;
              markup += createServerRowMarkup(entity);
            break;
          case 'players':
            markup += createPlayerRowMarkup(entity);
            break;
          case 'bots':
            markup += createPlayerRowMarkup(entity, true);
            break;
        }
      });
      $('.' + type + '-list').html(
        !markup
          ? '<tr><td class="empty-table" colspan="10">Таблица пуста</td></tr>'
          : markup
        );
    },
    // Отладочные логи
    debug: function() {
      if (DEBUG)
        console.log.apply(this, arguments);
    },
    // Функция сортировки по убыванию очков
    sortScoreDESC: function(a, b) {
      return b.score - a.score;
    }
  };
}();