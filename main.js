const express = require("express");
const mysql2 = require("mysql2/promise");

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  database: "nodejs",
  password: "root",
});

const app = express();

// app.get("/", function (req, res) {
//   pool.query("SELECT * FROM cars").then(function (data) {
//     const carMas = data[0];
//     res.send(`<DOCTYPE html>
//             <html>
//                 <body>
//                     <ul>
//                         ${carMas
//                           .map(
//                             (item) => `
//                         <li>${item.id} ${item.car} ${item.year}</li><hr>
//                         `
//                           )
//                           .join("")}
//                     </ul>
//                 </body>
//             </html>
//             `);
//   });
// });

app.get("/", function (req, res) {
  pool.query("SELECT * FROM cars").then(function (data) {
    const carMas = data[0];
    res.send(`<DOCTYPE html>
            <html>
            <head>
<style>

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
a{
  width: 150px;
  font-size: 30px;
}
</style>
</head>
                <body>
                <a href="http://localhost:5000/add">Форма добавления данных!</a>
                <table>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Number</th>
                </tr>
                  ${carMas
                    .map(
                      (item) => `
                <tr>
                  <td>${item.id}</td> 
                  <td>${item.name}</td> 
                  <td>${item.num}</td>
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
  response.sendFile(__dirname + "/index.html");
});

app.post("/add", urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { name, num } = req.body;
  await pool.query("INSERT INTO cars SET ?", {
    name,
    num,
  });
  res.redirect("/");
});
// ===============================================================

app.listen(5000, function () {
  console.log("server started!");
});
