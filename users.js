const { trimStr } = require('./utils'); // Импорт функции trimStr из файла utils

let users = []; // Инициализация массива пользователей

const findUser = (user) => {
  // Функция поиска пользователя
  const userName = trimStr(user.name); // Получение имени пользователя после обрезки пробелов
  const userRoom = trimStr(user.room); // Получение комнаты пользователя после обрезки пробелов

  return users.find(
    // Поиск пользователя в массиве
    (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
  );
};

const addUser = (user) => {
  // Функция добавления пользователя
  const isExist = findUser(user); // Проверка, существует ли пользователь уже в комнате

  !isExist && users.push(user); // Добавление пользователя в массив, если он не существует

  const currentUser = isExist || user; // Определение текущего пользователя

  return { isExist: !!isExist, user: currentUser }; // Возврат объекта с информацией о добавленном пользователе
};

const getRoomUsers = (room) => users.filter((u) => u.room === room); // Функция получения пользователей в комнате

const removeUser = (user) => {
  // Функция удаления пользователя
  const found = findUser(user); // Поиск пользователя

  if (found) {
    // Если пользователь найден
    users = users.filter(
      // Фильтрация массива пользователей
      ({ room, name }) => room === found.room && name !== found.name
    );
  }

  return found; // Возврат удаленного пользователя
};

module.exports = { addUser, findUser, getRoomUsers, removeUser }; // Экспорт функций для использования в других модулях
