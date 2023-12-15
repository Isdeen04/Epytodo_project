// index.js
const express = require('express');
const app = express();
const port = 3000;
const authRouter = require('./routes/auth/auth');
const userRouter = require('./routes/user/user.query');
const todoRouter = require('./routes/todos/todo.query');
const cors = require('cors');

app.use(cors());
app.use(express.static('./public'));
app.use(express.json());

app.use("/", userRouter);

app.use("/", authRouter);

app.use("/", todoRouter);

app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
