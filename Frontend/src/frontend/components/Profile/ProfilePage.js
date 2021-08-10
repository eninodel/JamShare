import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MainNav from "../Common/MainNav";
import DisplayPosts from "../Posts/DisplayPosts";

function ProfilePage() {
  const currentUser = useSelector((state) => state.UserReducer.userId);
  const [user, setUser] = useState();
  const [bio, setBio] = useState();
  const [userProfilePic, setUserProfilePic] = useState();
  const [editBio, setEditBio] = useState(false);
  const [displayPosts, setDisplayPosts] = useState(true);

  let { userId } = useParams();

  useEffect(() => {
    const getURL = "/api/lookUpUser?userId=" + userId;
    axios
      .get(getURL)
      .then((res) => {
        setBio(res.data.data.bio);
        setUserProfilePic(res.data.data.userProfilePic);
        setUser(res.data.data.user);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditBio(false);
    if (!userId) return;
    axios
      .post("/api/addUser", {
        userId: userId,
        user: user,
        userProfilePic: userProfilePic,
        bio: bio,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const renderBio = () => {
    if (!bio && !editBio) return <p>(Bio is Empty)</p>;
    if (editBio)
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type bio here"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button type="submit">submit</button>
        </form>
      );
    else {
      return <p>{bio}</p>;
    }
  };

  return (
    <>
      <div className="profile">
        <MainNav />
        <div className="profileTopSection">
          <div className="profileTop">
            <img src={userProfilePic} alt="" />
            <h1>{user}</h1>
          </div>
          <div className="bio">
            {renderBio()}
            {!editBio && userId === currentUser && (
              <button
                type="button"
                onClick={() => {
                  setEditBio(true);
                }}
              >
                Edit bio
              </button>
            )}
          </div>
        </div>

        {displayPosts ? (
          <>
            <h2>User's Recent Posts</h2>
            <DisplayPosts
              extension={"getUserPosts?userId=" + userId}
              setDisplayPosts={setDisplayPosts}
            />
          </>
        ) : (
          <h2>User Has Not Created Any Posts</h2>
        )}
      </div>
      <div className="bottomNav"></div>
    </>
  );
}

export default ProfilePage;
