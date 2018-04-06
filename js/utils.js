/***** Набор полезных утилит для фронта *****/

var utils = {
  // Возвращает хэш без #, не включая строку запроса
  getHash: function() {
    var
      hash = location.hash,
      result = '';
    for (let i = 1; i < hash.length; i++)
      if (hash[i] == '?')
        break;
      else
        result += hash[i];

    return decodeURIComponent(result);
  },

  // Возвращает текущую строку запроса
  getQueryString: function() {
    if (location.search)
      return location.search;
    var queryStart = location.hash.indexOf('?');
    return queryStart > -1
      ? location.hash.slice(queryStart)
      : '';
  },

  // Возвращает местное время в формате "день.месяц.год часы:минуты:секунды"
  getTime: function() {
    var now = new Date;
    return now.getDate().padStart(2, '0') + '.' + 
      now.getMonth().padStart(2, '0') +  '.' + 
      (now.getFullYear() % 100).padStart(2, '0') + ' ' + 
      now.getHours().padStart(2, '0') + ':' + 
      now.getMinutes().padStart(2, '0') + ':' + 
      now.getSeconds().padStart(2, '0');
  },

  // Функция возвращает экранированый HTML
  escape: function(code) {
    return code.replace(/[<>&'"]/g, function(match) {
      switch(match) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case "'": return '&apos;';
        case '"': return '&quot;';
      }
    });
  },

  // Сериализация объекта в строку запроса
  serializeQueryString: function(obj) {
    var result = '?';
    for (var key in obj)
      result += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
    return result.slice(0, result.length - 1);
  },

  // Парсит строку запроса в объект
  parseQueryString: function(string) {
    var
      key = '',
      value = '',
      isKey = true,
      result = {};

    for (var i = 1; i < string.length; i++) {
      var char = string[i];
      if (char == '=') {
        isKey = false;
      } else if (char == '&'){
        result[key] = decodeURIComponent(value);
        key = '';
        value = '';
        isKey = true;
      } else {
        if (isKey) {
          key += char;
        } else {
          value += char;
        }
      }
    }
    result[key] = decodeURIComponent(value);
    return result;
  },
  // Возвращает время, прошедшее с time
  getAgoTime: function(time) {
    var timePassed = Math.floor((Date.now() - time) / 1000);
    return timePassed + ' сек.';
  }
};

/***** Изменение прототипов *****/

// Повторение строки amount раз
if (!String.prototype.repeat) {
  String.prototype.repeat = function(amount) {
    var result = '';
    for (var i = 0; i < amount; i++)
      result += this;
    return result;
  };
}

// Добавление запонителей в начало строки, если она недостаточно длинная
if (!String.prototype.padStart) {
  String.prototype.padStart = function(targetLength, filler) {
    filler = filler || ' ';
    var amountSpaces = targetLength - this.length;
    if (amountSpaces < 1)
      return this;
    var spaces = '';
    for (var i = 0; i < Math.floor(amountSpaces / filler.length); i++)
      spaces += filler;
    return spaces + filler.slice(0, amountSpaces - 
      filler.length * Math.floor(amountSpaces / filler.length)) + this;
  };
}

// Аналог одноименного метода строк для чисел
if (!Number.prototype.padStart) {
  Number.prototype.padStart = function() {
    return String.prototype.padStart.apply(String(this), arguments);
  };
}