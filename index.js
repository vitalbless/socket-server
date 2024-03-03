const express = require('express'); // Импорт библиотеки Express для создания сервера
const http = require('http'); // Импорт модуля http для создания HTTP-сервера
const { Server } = require('socket.io'); // Импорт класса Server из библиотеки socket.io для настройки WebSocket-сервера
const cors = require('cors'); // Импорт библиотеки CORS для обработки CORS-запросов
const app = express(); // Создание экземпляра приложения Express

const route = require('./route'); // Импорт маршрута
const { addUser, findUser, getRoomUsers, removeUser } = require('./users'); // Импорт функций для работы с пользователями

app.use(cors({ origin: '*' })); // Использование CORS для обработки запросов от всех источников
app.use(route); // Использование маршрутов приложения

const server = http.createServer(app); // Создание HTTP-сервера с использованием Express приложения

const io = new Server(server, {
  // Создание экземпляра WebSocket-сервера с использованием HTTP-сервера
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // Обработчик события подключения клиента к WebSocket-серверу
  socket.on('join', ({ name, room }) => {
    // Обработчик события присоединения пользователя к комнате
    socket.join(room); // Добавление клиента в комнату

    const { user, isExist } = addUser({ name, room }); // Добавление пользователя в список пользователей

    const userMessage = isExist
      ? `${user.name}, here you go again`
      : `Hey my love ${user.name}`; // Формирование сообщения для нового пользователя

    socket.emit('message', {
      // Отправка сообщения пользователю о присоединении
      data: { user: { name: 'Admin' }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit('message', {
      // Отправка сообщения о присоединении пользователя другим пользователям в комнате
      data: { user: { name: 'Admin' }, message: `${user.name} has joined` },
    });

    io.to(user.room).emit('room', {
      // Отправка информации о пользователях в комнате
      data: { users: getRoomUsers(user.room) },
    });
  });

  socket.on('sendMessage', ({ message, params }) => {
    // Обработчик события отправки сообщения
    const user = findUser(params); // Поиск пользователя по параметрам

    if (user) {
      io.to(user.room).emit('message', { data: { user, message } }); // Отправка сообщения всем пользователям в комнате
    }
  });

  socket.on('leftRoom', ({ params }) => {
    // Обработчик события выхода пользователя из комнаты
    const user = removeUser(params); // Удаление пользователя из списка пользователей

    if (user) {
      const { room, name } = user;

      io.to(room).emit('message', {
        // Отправка сообщения о выходе пользователя
        data: { user: { name: 'Admin' }, message: `${name} has left` },
      });

      io.to(room).emit('room', {
        // Отправка информации о пользователях в комнате
        data: { users: getRoomUsers(room) },
      });
    }
  });

  io.on('disconnect', () => {
    // Обработчик события отключения клиента от WebSocket-сервера
    console.log('Disconnect'); // Вывод сообщения в консоль об отключении
  });
});

server.listen(5000, () => {
  // Запуск HTTP-сервера на порту 5000
  console.log('Server is running'); // Вывод сообщения в консоль о запуске сервера
});
