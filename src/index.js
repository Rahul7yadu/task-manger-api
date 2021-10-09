const express = require("express");
const app = express();
require("./db/mongoose.js");
const taskRouter = require("./routers/tasks");
const userRouter = require("./routers/users");

port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server started on port " + port);
});

// const Task = require("./models/tasks");
// const User = require("./models/users");

// const main = async () => {
//   // const task = await Task.findById("615479198f6d6f481b33b34b");
//   // await task.populate("owner");
//   // console.log(task.owner);

//   const user = await User.findById("61547461598fcb6a8c5fc203");
//   await user.populate("tasks");
//   console.log(user.tasks);
// };
// main();
