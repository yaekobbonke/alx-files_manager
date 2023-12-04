const express = require('express');
const routes = require('./routes/index');
const app = express();

port = process.env.PORT || 5000;
app.use('/', routes);

app.listen(port, () => {
    console.log(`The express server is running on ${port}`);
})