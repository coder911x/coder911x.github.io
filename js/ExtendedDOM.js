/**
 * Ядро для работы с DOM
 */ 
var $ = function(selector) {
  return new ExtendedDOM(
    selector instanceof Node
      ? [selector]
      : document.querySelectorAll(selector)
  );
}

function ExtendedDOM(elements) {
  this.elements = elements;
}

// Фильтрует выборку по тексту
ExtendedDOM.prototype.ifText = function(text) {
  var filtered = [];
  Array.prototype.forEach.call(this.elements, function(element) {
    if (element.textContent == text)
      filtered.push(element)
  });
  return new ExtendedDOM(filtered);
};

// Удаляет у всех элементов выборки класс(ы)
ExtendedDOM.prototype.removeClass = function(names) {
  names = names.split(' ');
  var len = names.length;
  Array.prototype.forEach.call(this.elements, function(element) {
    for (var i = 0; i < len; i++)
      element.classList.remove(names[i]);
  });
  return this;
};

// Добавляет ко всем элементам выборки класс
ExtendedDOM.prototype.addClass = function(name) {
  Array.prototype.forEach.call(this.elements, function(element) {
    element.classList.add(name);
  });
  return this;
};

// Переключает у всех элементов выборки класс
ExtendedDOM.prototype.toggleClass = function(name) {
  Array.prototype.forEach.call(this.elements, function(element) {
    element.classList.toggle(name);
  });
  return this;
};

// Определяет имеет ли первый элемент выборки класс с указанным именем
ExtendedDOM.prototype.hasClass = function(name) {
  return this.elements[0] === undefined
    ? undefined
    : this.elements[0].classList.contains(name);
  return this;
};

/*
  Функция установки всем элементам выборки внутренней разметки,
  если передаётся 1 параметр. Если же аргументов нет, то возвращается
  разметка первого элемента выборки, если таковой имеется
*/
ExtendedDOM.prototype.html = function(markup) {
  if (markup === undefined)
    return this.elements[0]
      ? this.elements[0].innerHTML
      : undefined;
  Array.prototype.forEach.call(this.elements, function(element) {
    element.innerHTML = markup;
  });
  return this;
};

/*
  Функция установки всем элементам выборки внутреннего текста,
  если передаётся 1 параметр. Если же аргументов нет, то возвращается
  текстовое содержимое первого элемента выборки, если таковой имеется
*/
ExtendedDOM.prototype.text = function(text) {
  if (text === undefined)
    return this.elements[0]
      ? this.elements[0].textContent
      : undefined;
  Array.prototype.forEach.call(this.elements, function(element) {
    element.textContent = text;
  });
  return this;
};

// Устанавливает всем элементам выборки обработчик клика
ExtendedDOM.prototype.click = function(callback) {
  Array.prototype.forEach.call(this.elements, function(element) {
    element.addEventListener('click', callback);
  });
  return this;
};

/*
  Функция установки всем элементам выборки значения value,
  если передаётся 1 параметр. Если же аргументов нет, то возвращается
  value первого элемента выборки, если таковой имеется
*/
ExtendedDOM.prototype.value = function(data) {
  if (data === undefined)
    return this.elements[0]
      ? this.elements[0].value
      : undefined;
  Array.prototype.forEach.call(this.elements, function(element) {
    element.value = data;
  });
  return this;
};

/*
  Функция аналогичная value, однако к её результату применяется trim()
*/
ExtendedDOM.prototype.val = function(data) {
  var ret = this.value(data);
  return ret === undefined
    ? undefined
    : ret == this
      ? this
      : ret.trim();
};

/*
  Функция установки всем элементам выборки значения value,
  если передаётся 1 параметр. Если же аргументов нет, то возвращается
  value первого элемента выборки, если таковой имеется
*/
ExtendedDOM.prototype.prop = function(name, value) {
  if (value === undefined)
    return this.elements[0]
      ? this.elements[0][name]
      : undefined;
  Array.prototype.forEach.call(this.elements, function(element) {
    element[name] = value;
  });
  return this;
};

/*
  Функция аналогичная value, однако к её результату применяется trim()
*/
ExtendedDOM.prototype.width = function() {
  return this.elements[0] === undefined
    ? undefined
    : this.elements[0].clientWidth
};