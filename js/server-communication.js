/**** Тут всё, что касается коммуникации клиента с сервером  ****/
void function(ns) {
  var
    router = ns.router,
    getTime = utils.getTime,
    escape = utils.escape,
    debug = mUtils.debug;

  ns.socket = events(ns.serverURL, {
    connection: function() {
      debug('[' + getTime() + '] Open conntection');
    },
    close: function() {
      debug('[' + getTime() + '] Close conntection');
      ns.socket.reconnect();
    },
    ping: function() {
      debug('[' + getTime() + '] Recieved a ping');
    },
    recieveGameData: function(servers) {
      debug(servers);
      ns.servers = servers;
      mUtils.fillTable('servers', servers);
    },
    recieveServerInfo: function(server, players) {
      let dt = Date.now() - server.lastUpdate;
      if (dt < 0) {
        server.lastUpdate += dt;
      }
      debug(server, players);
      if (server.online) {
        if (!ns.server) {
          let number = 1 + Math.floor(Math.random() * 6);
          $('#gallery')
            .css('background-image', 'url(images/gallery/' + server.shortGameName + '/' + number + '.jpg)')
            .attr('game', server.shortGameName)
            .attr('number', number);
        }
        ns.server = server;
        players.sort(mUtils.sortScoreDESC);
        server.bots.sort(mUtils.sortScoreDESC);
        $('#info-map').text(server.map);
        $('#info-name').text(server.name);
        $('#info-address').text(server.ip + ':' + server.port);
        $('#info-online').text(
          (server.players + server.bots.length) + '/' + server.maxPlayers +
          ' (в том числе ' + server.bots.length + ' ботов)'
        );
        $('#info-status').text('online');
        $('#info-last-update-date').text(new Date(server.lastUpdate).toLocaleString());
        $('#info-last-update-time').text(utils.getAgoTime(server.lastUpdate));
        $('#info-password').text(
          server.password
            ? 'да'
            : 'нет'
        );
        mUtils.fillTable('players', players);
        mUtils.fillTable('bots', server.bots);
        return;
      }
      ns.server = server;
      $('#gallery')
          .css('background-image', 'url(images/gallery/offline.png)')
          .attr('game', '');
      $('#info-map').text('-');
      $('#info-name').text('-');
      $('#info-address').text(server.ip + ':' + server.port);
      $('#info-online').text('- / -');
      $('#info-status').text('offline');
      $('#info-last-update-date').text(new Date(server.lastUpdate).toLocaleString());
      $('#info-last-update-time').text(utils.getAgoTime(server.lastUpdate));
      $('#info-password').text('-');
      mUtils.fillTable('players', []);
      mUtils.fillTable('bots', []);
    },
    error: function(message) {
      $('#add-server-button').prop('disabled', false);
      alert('Ошибка!\n' + message);
    },
    error404: function(message) {
      $('#message-404').text(message);
      ns.views.show('404');
    },
    serverAdded: function(message) {
      $('#add-server-button').prop('disabled', false);
      alert(message);
    },
  });

  // Первичная маршрутизация
  router();
  // Обрабатываем изменение машрута
  window.onhashchange = router;

  (function() {
    // Кешируем изображения для галереи
    ['cs16', 'cscz', 'csgo', 'css', 'garrysmod', 'hldm'].forEach(function(game) {
      
      for (let i = 1; i <= 6; i++) {
        new Image().src = 'images/gallery/' + game + '/' + i + '.jpg';
      }
    });
    new Image().src = 'images/gallery/offline.png';
  })();
  
}(monitoringNamespace);