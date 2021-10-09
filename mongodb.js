const { MongoClient, ObjectId } = require("mongodb");
const id = ObjectId();

console.log(id);
console.log(id.getTimestamp());

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "taks-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect");
    }
    const db = client.db(databaseName);
    // db.collection("users").findOne({ name: "jen" }, (error, user) => {
    //   if(error){
    //     return console.log("unable")
    //   }
    //   console.log(user);
    // });

    // db.collection("users")
    //   .find({ age: 27 })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection("users")
    //   .find({ age: 27 })
    //   .count((error, users) => {
    //     console.log(users);
    //   });

    // db.collection("task").findOne(
    //   {
    //     _id: ObjectId("613383cbc738614cbe42fd48"),
    //   },
    //   (error, user) => {
    //     console.log(user);
    //   }
    // );

    // db.collection("task")
    //   .find({ completed: false })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection("users")
    //   .updateOne(
    //     { name: "rahul" },
    //     {
    //       $set: {
    //         name: "akash",
    //       },
    //     }
    //   )
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));

    // db.collection("task")
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));

    db.collection("users")
      .deleteOne({ name: "akash" })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
);
