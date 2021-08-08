const express = require("express");
const spotifyWebAPI = require("spotify-web-api-node");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
// require("dotenv").config({ path: "./process.env" });
require("dotenv").config();

const port = process.env.PORT || 8000;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  try {
    await client.connect();
  } catch (err) {
    console.log(err);
  }
}

async function getRecentPosts() {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .find({})
      .sort({ _id: -1 })
      .limit(8);
    const results = await cursor.toArray();
    return results;
  } catch (err) {
    console.log(err);
  }
}

async function updateLikes(_id, likes) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .updateOne({ _id: ObjectId(_id) }, { $set: { likes: likes } });
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function createPost(
  user,
  userId,
  userProfilePic,
  body,
  uri,
  date,
  image,
  name
) {
  try {
    await connect();
    const cursor = await client.db("JamShare").collection("Posts").insertOne({
      body,
      uri,
      userProfilePic,
      likes: [],
      comments: [],
      user,
      userId,
      date,
      image,
      name,
    });
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function deleteComment(commentId) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .updateMany(
        {},
        { $pull: { comments: { commentId: ObjectId(commentId) } } }
      );
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function addComment(_id, user, userId, body) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .updateOne(
        { _id: ObjectId(_id) },
        { $push: { comments: { user, userId, body, commentId: ObjectId() } } },
        { upsert: true }
      );
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function getPost(_id) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .find({ _id: ObjectId(_id) });
    const results = await cursor.toArray();
    return results;
  } catch (err) {
    console.log(err);
  }
}

async function getUser(userId) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Profiles")
      .find({ userId: userId });
    const result = cursor.toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

async function addUser(userId, user, userProfilePic, bio) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Profiles")
      .updateOne(
        { userId: userId },
        { $set: { userId, user, userProfilePic, bio } },
        { upsert: true }
      );
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function getUserPosts(userId) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .find({ userId: userId })
      .sort({ _id: -1 });
    const results = await cursor.toArray();
    return results;
  } catch (err) {
    console.log(err);
  }
}

async function deletePost(_id) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .deleteMany({ _id: ObjectId(_id) });
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function getTopPosts() {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .aggregate([
        {
          $project: {
            body: 1,
            uri: 1,
            userProfilePic: 1,
            comments: 1,
            user: 1,
            userId: 1,
            date: 1,
            likes: 1,
            image: 1,
            name: 1,
            likes_count: { $size: "$likes" },
          },
        },
        { $sort: { likes_count: -1 } },
      ]);
    const results = await cursor.toArray();
    return results;
  } catch (err) {
    console.log(err);
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "Frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "build", "index.html"));
});

app.get("/topPosts", (req, res) => {
  getTopPosts()
    .then((posts) => {
      console.log(posts);
      res.json({ data: posts });
    })
    .catch((err) => res.sendStatus(400));
});

app.get("/getUserPosts", (req, res) => {
  getUserPosts(req.query.userId)
    .then((posts) => res.json({ data: posts }))
    .catch((err) => res.sendStatus(400));
});

app.get("/lookUpUser", (req, res) => {
  getUser(req.query.userId)
    .then((user) => {
      const actualUser = user[0];
      if (!actualUser) {
        res.json({
          data: {},
        });
      } else {
        res.json({
          data: {
            user: actualUser.user,
            userId: actualUser.userId,
            bio: actualUser.bio,
            userProfilePic: actualUser.userProfilePic,
          },
        });
      }
    })
    .catch((err) => res.sendStatus(400));
});

app.get("/lookUpPost", (req, res) => {
  getPost(req.query._id)
    .then((post) => {
      const actualPost = post[0];
      res.json({
        data: {
          body: actualPost.body,
          comments: actualPost.comments,
        },
      });
    })
    .catch((err) => res.sendStatus(400));
});

app.get("/recentposts", (req, res) => {
  getRecentPosts()
    .then((posts) => {
      res.json({
        data: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/deletePost", (req, res) => {
  deletePost(req.body._id)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

app.post("/addUser", (req, res) => {
  addUser(req.body.userId, req.body.user, req.body.userProfilePic, req.body.bio)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

app.post("/addComment", (req, res) => {
  addComment(req.body._id, req.body.user, req.body.userId, req.body.body)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

app.post("/deleteComment", (req, res) => {
  deleteComment(req.body.commentId)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

app.post("/updateLikes", (req, res) => {
  updateLikes(req.body._id, req.body.newLikes)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

app.post("/createPost", (req, res) => {
  createPost(
    req.body.user,
    req.body.userId,
    req.body.userProfilePic,
    req.body.body,
    req.body.uri,
    req.body.date,
    req.body.image,
    req.body.name
  )
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyAPI = new SpotifyWebApi({
    redirectUri: "https://sharejams.herokuapp.com/",
    clientId: "dfe1eb532747437b9b7d84a113a3933f",
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyAPI
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyAPI = new spotifyWebAPI({
    redirectUri: "https://sharejams.herokuapp.com/",
    clientId: "dfe1eb532747437b9b7d84a113a3933f",
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyAPI
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.listen(port, () => {
  console.log(port);
});
