const express = require("express");
const mongoose = require("mongoose");
const User = require("./usermodel");

const app = express();
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://siva:sivaram262@cluster0.jeugg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(console.log("mongo connected"))
  .catch((err) => console.log(err));

app.post("/", async (req, res) => {
  try {
    const saveUser = new User({
      name: req.body.name,
      email: req.body.email,
    });
    const user = await saveUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    if (typeof req.query.search === "undefined") {
      const { page = 1, limit = 5 } = req.query;
      const users = await User.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
      res.status(200).json(users);
    } else {
      const search = req.query.search;
      const user = await User.find({
        $or: [
          { name: { $regex: RegExp("^" + search + ".*", "i") } },
          { email: { $regex: RegExp("^" + search + ".*", "i") } },
        ],
      });
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(5000, () => console.log("server is running"));
