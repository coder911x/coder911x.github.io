/**** Тут всё, что касается коммуникации клиента с сервером  ****/
void function(ns) {
  var
    router = ns.router,
    getTime = utils.getTime;

  ns.socket = events(ns.serverURL, {
    connection: function() {
      if (DEBUG)
        console.log('[' + getTime() + '] Open conntection');
    },
    close: function() {
      if (DEBUG)
        console.log('[' + getTime() + '] Close conntection');
      ns.socket.reconnect();
    },
    ping: function() {
      if (DEBUG)
        console.log('[' + getTime() + '] Recieved a ping');
    },
    recieveGameData: function(servers) {
      console.log(servers);
      ns.servers = servers;
      mUtils.fillTable(servers);
    },
    recieveServerInfo: function(server, players) {
      console.log(server, players);
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