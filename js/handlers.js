void function(ns) {
  var
    socket = ns.socket,
    fields = [
      'name', 
      'map', 
      'slots-min', 
      'slots-max', 
      'online-min', 
      'online-max',
      'address',
      'port'
    ],
    checkboxes = ['no-bots', 'no-password', 'not-full'];

  // Добавить новый сервер
  $('#add-server-button').click(function() {
    var
      address      = $('#address-field').val(),
      port         = $('#port-field').val(),
      fullGameName = $('#game-select').val();

    if (!address || !port || !fullGameName)
      return alert('Запоните все поля!');

    this.disabled = true;
    socket('addServer', address, port, fullGameName);
  });

  // Сброс фильтра
  $('#filter-reset-button').click(function() {
    fields.forEach(function(field) {
      $('#filter-' + field).val('');
    });
    checkboxes.forEach(function(checkbox) {
      $('#filter-' + checkbox).prop('checked', false);
    });
    mUtils.fillTable('servers', ns.servers);
  });

  // Применение фильтров
  $('#filter-apply-button').click(function() {
    // Считываем параметры фильтрации
    var filter = {};
    fields.forEach(function(field) {
      filter[field] = $('#filter-' + field).val();
    });
    checkboxes.forEach(function(checkbox) {
      filter[checkbox] = $('#filter-' + checkbox).prop('checked');
    });
    mUtils.debug(filter);
    mUtils.fillTable('servers',
      ns.servers.filter(function(server) {
        var online = server.online
          ? server.players + server.bots.length
          : 0;

        return server.online &&
          server.name.indexOf(filter.name) > -1 &&
          server.map.indexOf(filter.map) > -1 &&
          server.ip.indexOf(filter.address) > -1 &&
          server.port.toString().indexOf(filter.port) > -1 &&
          (!filter['slots-min'].length || +filter['slots-min'] <= server.maxPlayers) &&
          (!filter['slots-max'].length || +filter['slots-max'] >= server.maxPlayers) &&
          (!filter['online-min'].length || +filter['online-min'] <= online) &&
          (!filter['online-max'].length || +filter['online-max'] >= online) &&
          (!filter['no-bots'] || !server.bots.length) &&
          (!filter['no-password'] || !server.password) &&
          (!filter['not-full'] || online != server.maxPlayers);
      })
    );
  });

  // Боковые панельки для маленького экрана (скрывающиеся)
  $('.panel').click(function(ev) {
    if (document.body.clientWidth <= 800 && $(ev.target).hasClass('panel-header'))
      $(this).toggleClass('collapsed');
  });

  // Стрелка вперед галереи изображений
  $('#gallery .next').click(function() {
    let
      $gallery = $('#gallery'),
      game = $gallery.attr('game'),
      number = $gallery.attr('number');
    if (!game)
      return;
    number = number < 6 ? +number + 1 : 1;
    $gallery
      .css('background-image', `url(images/gallery/${game}/${number}.jpg)`)
      .attr('number', number);
  });

  // Стрелка назад галереи изображений
  $('#gallery .prev').click(function() {
    let
      $gallery = $('#gallery'),
      game = $gallery.attr('game'),
      number = $gallery.attr('number');
    if (!game)
      return;

    number = number > 1 ? +number - 1 : 6;
    $gallery
      .css('background-image', `url(images/gallery/${game}/${number}.jpg)`)
      .attr('number', number);
  });

  // Скрыть/Показать меню для маленьких экранов
  $('.menu').click(function(ev) {
    let target = ev.target;
    if (target == this) {
      $(this).toggleClass('collapsed');
    }
  });
}(monitoringNamespace);