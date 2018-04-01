/**** Роутинг ****/
void function(ns) {
  var
    updateServersInfo = ns.updateServersInfo,
    games = ns.games;

  function router() {
    if (!location.hash)
      return location.hash = "#home";

    var route = utils.getHash();
    
    $('.menu a').removeClass('active');
    $('.menu a[href="#' + route + '"]').addClass('active');
    $('#message-404').text('Запрашиваемая страница не найдена!');

    if (route == 'home') {
      views.show('home');
    } else if (route == 'server-info') {
      let query = utils.parseQueryString(utils.getQueryString());
      console.log(query);
      if (!query.address || !query.port || !query.game) {
        views.show('404');
      } else {
        ns.socket('getServerInfo', query.address, query.port, query.game);
        views.show('server-info');
      }
    } else if (games.indexOf(route) > -1) {
      ns.socket('getGameData', route);
      $('#game-select').val(route);
      views.show('servers');
    } else {
      views.show('404');
    }
  }

  /* Объект представлений (страниц) сайта */
  var views = {
    pages: ['home', 'servers', '404', 'server-info'],
    show: function(target) {
      $('.page-' + this.pages.join(', .page-')).addClass('hidden');
      $('.page-' + target).removeClass('hidden');
      ~['home', '404', 'server-info'].indexOf(target)
        ? $('.content-container').addClass('centeredContent')
        : $('.content-container').removeClass('centeredContent');
    }
  };

  ns.router = router;
  ns.views = views;
}(monitoringNamespace);