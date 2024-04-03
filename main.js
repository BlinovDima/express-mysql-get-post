const express = require("express");
const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  database: "nodejs",
  password: "root",
});

const app = express();

app.get("/", function (req, res) {
  pool.query("SELECT * FROM cars").then(function (data) {
    const carMas = data[0];
    res.send(`<DOCTYPE html>
            <html>
            <head>
<style>
body{
  padding:30px;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 80%;
  margin: 0 auto;
  margin-top:50px;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
h1{
  text-align: center;
  font-size:40px;
}
a{
  padding: 10px;
  margin:10px;
  font-size: 30px;
  color:blue;
  text-decoration: none;
  border: 1px solid black;
  border-radius:5px;
}
a:hover{
  background:green;
  color:white;
}
</style>
</head>
                <body>
                <h1>Телефоная книга</h1>
                <a href="http://localhost:5000/add">Добавить</a>
                <a href="http://localhost:5000/del">Удалить по (id_user)</a>
                <a href="http://localhost:5000/delAll">Очистить всё</a>
                <table>
                <tr>
                  <th>№ строки</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>ID_user</th>
                </tr>
                  ${carMas
                    .map(
                      (item) => `
                <tr>
                  <td>${item.id}</td> 
                  <td>${item.name}</td> 
                  <td>${item.num}</td>
                  <td>${item.id_user}</td>
                  `
                    )
                    .join("")}
                </tr>
              </table>
                </body>
            </html>
            `);
  });
});
// =====================================================
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({ extended: false });

app.get("/add", function (_, response) {
  response.sendFile(__dirname + "/add.html");
});

app.post("/add", urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  const { name, num, id_user } = req.body;
  await pool.query("INSERT INTO cars SET ?", {
    name,
    num,
    id_user,
  });
  res.redirect("/");
});
// ===============================================================
app.get("/del", function (_, response) {
  response.sendFile(__dirname + "/del.html");
});

app.post("/del", urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id_user } = req.body;
  await pool.query("DELETE FROM cars WHERE id_user = ?", id_user);
  res.redirect("/win");
});
// ===============================================================

app.get("/win", function (req, res) {
  res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Сообщение</title>
        <style>
          .win {
            width: 100%;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
          }
          a {
            padding: 10px;
            font-size: 30px;
            color: blue;
            text-decoration: none;
            border: 1px solid black;
            border-radius: 5px;
            position: relative;
            left: 390px;
            top: 50px;
          }
          a:hover {
            background: green;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="win">
          <h1>Удаление прошло успешно!</h1>
          <a href="/">Вернуться к базе данных!</a>
        </div>
      </body>
    </html>
    
            `);
});

app.get("/delAll", async function (req, res) {
  await pool.query("TRUNCATE TABLE cars");
  res.redirect("/");
});

app.listen(5000, function () {
  console.log("server started!");
});
