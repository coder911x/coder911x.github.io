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
      debug(server, players);
      if (server.online) {
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
      $('#info-map').text('-');
      $('#info-name').text(server.name);
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
  
}(monitoringNamespace);