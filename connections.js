const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
// require("dotenv").config({ path: "./process.env" }); // dev

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
      .updateMany({}, { $pull: { comments: { commentId: commentId } } });
    return cursor;
  } catch (err) {
    console.log(err);
  }
}

async function addComment(post_id, user, userId, body, commentId) {
  try {
    await connect();
    const cursor = await client
      .db("JamShare")
      .collection("Posts")
      .updateOne(
        { _id: ObjectId(post_id) },
        { $push: { comments: { user, userId, body, commentId } } },
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

module.exports = {
  connect,
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
};
