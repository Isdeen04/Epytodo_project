const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const sql = require('mysql2');

app.use(express.static('public'));

var db = sql.createConnection ({
    host: 'localhost',
    user: 'hades',
    password: 'jordan',
    database: 'epytodo'
})

db.connect(err =>{
    if(err) {
        console.error('Error of connection with database');
        return;
    } else {
        console.log('Connection sucessfully with database');
    }
})

app.get('/', (req, res) => {
  res.sendFile( 'index.html', {root : __dirname});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
