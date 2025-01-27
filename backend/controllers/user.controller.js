import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getProfileHandler = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in User getProfile Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
  }
};

export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById({ _id: id });
    const currentUser = await User.findById({ _id: req.user._id });

    if (id === req.user._id) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(
        { _id: id },
        { $pull: { followers: req.user._id } }
      );
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $pull: { following: id } }
      );
      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(
        { _id: id },
        { $push: { followers: req.user._id } }
      );
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $push: { following: id } }
      );

      //send notification
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });
      await newNotification.save();
      res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.log("Error in User followUnFollow Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById({ _id: userId }).select(
      "-password"
    );
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in User getSuggested Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      fullname,
      username,
      email,
      bio,
      link,
      currentpassword,
      newpassword,
    } = req.body;
    let { profileImg, coverImg } = req.body;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (
      (!currentpassword && newpassword) ||
      (currentpassword && !newpassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please enter both current and new password" });
    }
    if (newpassword && currentpassword) {
      const isMatch = await bcrypt.compare(currentpassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current password doesn't match" });
      }

      if (newpassword.length < 6) {
        return res
          .status(401)
          .json({ error: "Password must contain 6 digits" });
      }

      //hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newpassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    //password is null in res
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in User updateUser Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
  }
};
