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
      if (!server.online) {
        
      } else {
        $('#info-map').text(server.map);
        $('#info-name').text(server.name);
        $('#info-address').text(server.ip + ':' + server.port);
        $('#info-online').text(
          (server.players + server.bots.length) + '/' + server.maxPlayers +
          ' (в том числе ' + server.bots.length + ' ботов)'
        );
        $('#info-status').text('online');
        $('#info-last-update').text(new Date(server.lastUpdate).toLocaleString() + ' (' + Math.floor((Date.now() - server.lastUpdate) / 1000) + ' секунд назад)');
        $('#info-password').text(
          server.password
            ? 'да'
            : 'нет'
        );
        mUtils.fillTable('players', players);
        mUtils.fillTable('bots', server.bots);
      }
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