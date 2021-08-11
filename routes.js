require("dotenv").config();
// require("dotenv").config({ path: "./process.env" });
const SpotifyWebApi = require("spotify-web-api-node");
const {
  getRecentPosts,
  updateLikes,
  createPost,
  deleteComment,
  addComment,
  getPost,
  getUser,
  addUser,
  getUserPosts,
  deletePost,
  getTopPosts,
  changePostPhotos,
} = require("./connections");
const express = require("express");
const router = express.Router();

router.get("/topPosts", (req, res) => {
  getTopPosts()
    .then((posts) => {
      console.log(posts);
      res.json({ data: posts });
    })
    .catch((err) => res.sendStatus(400));
});

router.get("/getUserPosts", (req, res) => {
  getUserPosts(req.query.userId)
    .then((posts) => res.json({ data: posts }))
    .catch((err) => res.sendStatus(400));
});

router.get("/lookUpUser", (req, res) => {
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

router.get("/lookUpPost", (req, res) => {
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

router.get("/recentposts", (req, res) => {
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

router.post("/changePostPhotos", (req, res) => {
  changePostPhotos(req.body.userId, req.body.userProfilePic)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

router.post("/deletePost", (req, res) => {
  deletePost(req.body._id)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

router.post("/addUser", (req, res) => {
  addUser(req.body.userId, req.body.user, req.body.userProfilePic, req.body.bio)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

router.post("/addComment", (req, res) => {
  addComment(
    req.body.post_id,
    req.body.user,
    req.body.userId,
    req.body.body,
    req.body.commentId
  )
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

router.post("/deleteComment", (req, res) => {
  deleteComment(req.body.commentId)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

router.post("/updateLikes", (req, res) => {
  updateLikes(req.body._id, req.body.newLikes)
    .then((data) => res.sendStatus(200))
    .catch((err) => res.sendStatus(400));
});

router.post("/createPost", (req, res) => {
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

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  const spotifyAPI = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
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

router.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyAPI = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: "dfe1eb532747437b9b7d84a113a3933f",
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyAPI
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log(
        "/login in server:" + data.body.access_token + "code: " + code
      );
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});
module.exports = router;
