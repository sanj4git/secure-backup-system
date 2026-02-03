import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  const logs = await Log.find().populate("userId", "email role");

  res.json({
    msg: "Audit logs fetched successfully",
    logs
  });
};