// Флаг режима отладки
var DEBUG = true;

var monitoringNamespace = {
  // URL-адрес сервера
  serverURL: DEBUG
    ? 'ws://localhost:85'
    : 'wss://game-monitoring-server.herokuapp.com',
  // Список поддерживаемых игр
  games: [
    "Counter-Strike: Source",
    "Counter-Strike 1.6",
    "Garry`s Mod",
    "Half-Life 1 Deathmatch",
    "Counter-Strike: Condition Zero",
    "Counter-Strike: Global Offensive"
  ],
  // Маршрутизирующая функция
  router: null,
  // Сокет для общения с сервером
  socket: null,
  // Текущий массив с информацией о серверах
  servers: [],
  // Объект представлений страницы
  views: null
};

mUtils.debug('Сайт запущен в режиме отладки!');