void function(ns) {
  var
    $contentContainer = $('.content-container'),
    $serverPageInfo = $('.page-server-info'),
    $infoTable = $('.page-server-info .info table'),
    $playersTable = $('.page-server-info .players table');

  setInterval(function() {
    if (ns.server)
      $('#info-last-update-time').text(utils.getAgoTime(ns.server.lastUpdate));
  }, 1000);
}(monitoringNamespace);