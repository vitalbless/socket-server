const trimStr = (str) => {
  if (typeof str !== 'string') {
    return ''; // Возвращаем пустую строку или другое значение по умолчанию
  }
  return str.trim().toLowerCase();
};

exports.trimStr = trimStr;
