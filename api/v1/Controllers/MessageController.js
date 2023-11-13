const tryCatchAsync = require("../../../util/tryCatchAsync");
const apiResponse = require("../../../util/apiResponse");
const Messages = require("../Models/Messages");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const GroupChat = require("../Models/GroupChat");
const AppError = require("../../../util/appError");
const { success, unauthorized } =
  require("../../../util/statusCode").statusCode;

exports.addChat = tryCatchAsync(async (req, res, next) => {
  const { p_user, message } = req.body;

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }

  let decoded_token;
  if (token) {
    decoded_token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  const user_id = decoded_token ? decoded_token.id : "";
  console.log({ user_id, p_user });

  if (user_id !== p_user._id) {
    return next(new AppError("Unauthorized", unauthorized));
  }

  const data = await GroupChat.create({
    message,
    p_user: p_user,
  });

  let response_data = { message: data };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.getChat = tryCatchAsync(async (req, res) => {
  const chat = await GroupChat.find()
    .populate("p_user")
    .select("-password")
    .sort({ updatedAt: 1 });
  let response_data = { messages: chat };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.addMessage = tryCatchAsync(async (req, res, next) => {
  const { from, to, message } = req.body;

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }

  let decoded_token;
  if (token) {
    decoded_token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  const user_id = decoded_token ? decoded_token.id : "";

  if (user_id !== from) {
    return next(new AppError("Unauthorized", unauthorized));
  }

  const data = await Messages.create({
    message: {
      text: message,
    },
    users: [from, to],
    sender: from,
  });

  let response_data = { message: data };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.getAllMessage = tryCatchAsync(async (req, res) => {
  const { from, to } = req.body;
  const messages = await Messages.find({
    users: {
      $all: [from, to],
    },
  }).sort({ updatedAt: 1 });

  const projectMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });

  let response_data = { messages: projectMessages };
  return apiResponse.successResponse(res, response_data, "", success);
});

exports.deleteAllPrivateChat = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }

  let decoded_token;
  if (token) {
    decoded_token = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  const from = decoded_token ? decoded_token.id : "";
  const { to } = req.body;

  await Messages.deleteMany({
    users: {
      $all: [from, to],
    },
  });
  let response_data = { messages: [] };
  return apiResponse.successResponse(
    res,
    response_data,
    "Chat is deleted",
    success
  );
});

exports.updatePublicMessage = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const message = await GroupChat.findOne({ p_user: decoded_token.id });

  message.message = req.body.message;
  await message.save();

  console.log({ message });

  let response_data = { message };
  return apiResponse.successResponse(
    res,
    response_data,
    "User data updated",
    success
  );
});


exports.updatePrivateMessage = tryCatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Unauthorized", unauthorized));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const message = await Messages.findOne({ sender: decoded_token.id });

  message.message = req.body.message;
  await message.save();

  console.log({ message });

  let response_data = { message };
  return apiResponse.successResponse(
    res,
    response_data,
    "User data updated",
    success
  );
});
