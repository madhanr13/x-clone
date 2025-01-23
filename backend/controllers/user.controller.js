import User from "../models/user.model.js";

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
