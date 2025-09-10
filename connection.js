const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "omah",
});


connection.connect((err) => {
  if (err) {
    console.log("error to connecting the database", err);
  } else {
    console.log("Connected the successfully");
  }
});

module.exports = connection.promise();
