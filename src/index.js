const express = require("express");
require("./db/mongoose");
const router = require('./routes/index')
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(router);


app.listen(port, () => {
  console.log("Server is up on" + port);
});


