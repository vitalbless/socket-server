const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Определение обработчика GET-запроса для пути '/'
  res.setHeader('Access-Control-Allow-Origin', '*'); // Установка заголовка CORS для разрешения доступа из любого источника

  res.setHeader(
    // Установка заголовка для разрешения определенных методов запросов
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  res.setHeader(
    // Установка заголовка для разрешения определенных типов данных в запросах
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  res.send('Это только мой мир.'); // Отправка ответа клиенту с текстом "Это только мой мир."
});

module.exports = router; // Экспорт маршрутизатора для использования в других частях приложения
