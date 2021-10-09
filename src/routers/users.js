const express = require("express");
const User = require("../models/users");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendCancelationEmail,
} = require("../emails/accounts");
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.send({ user, token }).status(201);
    sendWelcomeEmail(user.email, user.name);
  } catch (e) {
    res.send(e).status(400);
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(500).send({ error: "sorry no user in database" });
    }
    res.send(users).status(200);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return (token.token = !req.token);
    });
    await req.user.save();
    const data = await User.find({});
    console.log(data[1].tokens);
    res.send(req.user);
  } catch (e) {
    res.send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    console.log(req.user);
    res.send(req.user);
  } catch (e) {
    res.send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  console.log(_id);

  try {
    const user = await User.findById(_id);
    res.send(user);
  } catch (e) {
    res.send(e).status(400);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "age", "email", "password"];

  const isUpdateValid = updates.every((update) => {
    return validUpdates.includes(update);
  });
  console.log(isUpdateValid);
  if (!isUpdateValid) {
    return res.status(404).send({
      error: "updates not allowed",
      reason: "can only update " + validUpdates,
    });
  }

  try {
    // const user = await User.findById(_id);

    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.send(e).status(500);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  const id = req.params.id;
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    sendCancelationEmail(req.user.email, req.user.name);
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: "no user found in database" });
  }
});
const upload = multer({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please  only upload jpg , jpeg , png  files"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 250, width: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send({ success: "image uploaded" });
  },
  (error, req, res, next) => {
    res.send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send({ succes: "image removed" });
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error({ error: "no user found or avatar" });
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404);
  }
});

module.exports = router;
