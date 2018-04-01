function webEvents(serverURL, evs) {

    /*
        Если произошёл вызов только с одним аргументом
        - объектом с обработчиками
    */
    if (!evs) {
        evs = serverURL;
        serverURL = null;
    }

    // Версия web-events-client
    var VERSION = '2.2.3';

    /*
        Обёртка над пользовательским событием

        Позволяет выполнять отправку ответа на вызванное событие 
        (обработчиком которого является func с аргументами args) 
        через return самого обработчика. 

        Ответ будет доставлен инициатору события - серверу
    */
    function returnEmit(func, args) {
        var returnValue = func.apply(client, args);

        if (typeof returnValue != "object")
            return; // Если возвращен примитив, игнорируем

        var eventName; // Имя вызываемого на другой стороне события

        if (returnValue instanceof Array) {
            /*
                Из обработчика был возвращён массив => первый его элемент  
                является типом вызываемого события, а остальные - аргументами
            */
            eventName = returnValue[0];
            args = returnValue.slice(1);
            
            /*
                Вызываем событие на другой стороне соединения
                При получении аргументов функция emit оборачивает их в массив.
                Сейчас в args данные уже находятся в виде массива и нужно
                передать их по одному, поэтому вызываем emit через apply.
            */
            emit.apply(client, [eventName].concat(args));
        } else {
            /*
                Из обработчика бы возвращен объект
                В свойстве type этого объекта должен быть указан тип события, 
                а остальные свойства будут именованными аргументами
            */
            eventName = returnValue.type;
            args = returnValue;

            delete args.type; // Убираем свойство type из аргументов
            
            // Вызываем событие на другой стороне соединения
            client.emit(eventName, args);
        }
    }

    /*
        Вызывает событие на стороне сервера

        eventName - название вызываемого события
        n-ое количество аргументов в псевдо-массиве arguments

        Аргументы можно перечислять через зяпятую. В этом случае
        порядок будет сохранён при вызове соответствующего обработчика
        на другой стороне соединения
        Также можно в качестве args передать единственный объект, в этом 
        случае клиент получит один объект целиком
    */
    function emit(eventName) {
        var args = arguments;
        // Если вызов произошёл до того как соединение было установлено
        if (socket.readyState == WebSocket.CONNECTING)
            return setTimeout(function() {
                emit.apply(client, args);
            }, 4);

        // Аргументы вызова, отправляемые серверу
        args = Array.prototype.slice.call(arguments, 1);

        socket.send(JSON.stringify({
            type: eventName,
            args: args
        }));
    }

    /*
        Завершает соединение с сервером
    */
    function disconnect() {
        socket.close();
    }

    /*
        Переподключается к серверу с теми же настройками
        и обработчиками событий
    */
    function reconnect() {
        if (socket.readyState == WebSocket.OPEN)
            socket.close();
        connect();
    }

    var
        // Клиентский сокет
        socket = null,

        // Функциональность клиента (возвращается из функции events)
        client = function() {
            emit.apply(null, arguments);
            return client;
        };

        client.emit = emit;             // Вызвать событие
        client.disconnect = disconnect; // Отключиться
        client.reconnect = reconnect;   // Переподключиться
        client.version = VERSION;       // Версия web-events-client

    /*
        Данная функция подключается к WebSocket серверу
        и устанавливает все необходимые обработчики
    */        
    function connect() {

        // Устанавливаем соединение по WebSocket
        socket = new WebSocket( serverURL == null
            ? 'ws://' + location.hostname
            : serverURL
        );

        // Соединение открыто
        socket.onopen = function() {
            if (evs.connection)
                returnEmit(evs.connection);
        };

        // Получено сообщение
        socket.onmessage = function(message) {
            var data;

            // Предполагается, что данные приходят в JSON-формате
            try {
                data = JSON.parse(message.data);
            } catch(e) { return; }

            // В свойстве type указывается тип события
            if (typeof data.type != 'string')
                return;
            /*
                Формат: от клиента приходит JSON-объект
                data.type - тип события
                data.args - объект аргументов
            */
        
            // Вызываем пользовательское событие, если оно было объявлено
            if (evs[data.type])
                returnEmit(evs[data.type], data.args);
        };

        // Соединение закрыто
        socket.onclose = function() {
            /*
                Вызываем обработчик закрытия соединения,
                если таковой определён
            */
            if (evs.close)
                returnEmit(evs.close);
        };

    }

    // Устанавливаем соединение в первый раз
    connect();

    // Возвращает вызывалку событий
    return client;

}

if (window.events === undefined)
    window.events = webEvents;