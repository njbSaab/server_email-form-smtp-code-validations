
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sendMail = require("./config"); // Импортируем функцию sendMail

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // Для обработки JSON-данных

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Обработка отправки формы
app.post("/api/feedback", (req, res) => {
  const { email, code } = req.body;

  // Выводим данные, полученные с клиента
  console.log("Received from client:", { email, code });

  // Проверка введённых данных
  if (!email || !code) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Используем функцию sendMail из config.js для отправки письма
  sendMail(email, code);

  res.status(200).json({ success: true, message: "Email sent successfully." });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
