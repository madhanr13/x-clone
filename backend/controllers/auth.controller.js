import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupHandler = async (req, res) => {
  try {
    const { fullname, username, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    const existingUser = await User.findOne({ username });
    if (existingUser || existingEmail) {
      return res.status(400).json({ error: "user already exists" });
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user to the database
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      //generate a new token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
  }
};

export const loginHandler = async (req, res) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({username})
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
    if(!user || !isPasswordCorrect) {
      return res.status(400).json({error: "Invalid username or password"})
    }
    generateTokenAndSetCookie(user._id, res)
    res.status(201).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    });
  } catch (error) {
    console.log("Error in login Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
    
  }
};

export const logoutHandler = async (req, res) => {
  try {
    res.clearCookie("jwt").status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
  }
};

export const getMeHandler = async(req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id}).select("-password")
    res.status(200).json(user)
  } catch (error) {
    console.log("Error in getMe Controller: ", error.message);
    res.status(500).json({ error: "Internal server error", error });
    
  }
}