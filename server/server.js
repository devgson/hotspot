const express = require("express");
const path = require('path');
const routes = require('./routes/routes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'))

app.use(express.static(path.join(__dirname + '/../public')));

app.use('/', routes);

app.use((req, res, next) => {
  res.render('404');
})

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});