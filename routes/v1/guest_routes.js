const express = require("express");
const multer = require("multer");
const router = express.Router();
// const mongoose = require('mongoose');

const guest_controller = require("../../api/v1/Controllers/GuestController");
const image_controller = require("../../api/v1/Controllers/ImageController");
const message_controller = require("../../api/v1/Controllers/MessageController");

router.get("/users", guest_controller.getAllUsers);
router.get("/user/:id", guest_controller.getUser);
router.get("/background", guest_controller.background);
// router.post("/addSocketUser", guest_controller.addSocketUser);
router.patch("/updateBackground", guest_controller.updateBackground);

router.patch("/outfit", guest_controller.outfit);
router.patch("/bgMusic", guest_controller.bgMusic);
router.get("/bgMusic", guest_controller.getBgMusic);

router.post("/music", guest_controller.addMusic);
router.get("/musics", guest_controller.getAllMusics);
router.patch("/music", guest_controller.updateMusic);
router.patch("/music", guest_controller.updateMusic);
router.delete("/music/:id", guest_controller.deleteMusic);
router.get("/deleteAllMusics", guest_controller.deleteAllMusics);

router.post("/gif", guest_controller.addGif);
router.get("/gifs", guest_controller.getAllGifs);
router.patch("/gif", guest_controller.updateGif);
router.delete("/gif/:id", guest_controller.deleteGif);
router.get("/deleteAllGifs", guest_controller.deleteAllGifs);

router.post("/picture", guest_controller.addPicture);
router.patch("/picture", guest_controller.updatePicture);
router.get("/pictures", guest_controller.getAllPictures);
router.delete("/picture/:id", guest_controller.deletePicture);
router.get("/deleteAllPictures", guest_controller.deleteAllPictures);

router.post("/video", guest_controller.addVideo);
router.patch("/video", guest_controller.updateVideo);
router.get("/videos", guest_controller.getAllVideos);
router.delete("/video/:id", guest_controller.deleteVideo);
router.get("/deleteAllVideos", guest_controller.deleteAllVideos);

router.get("/getChat/", message_controller.getChat);
router.post("/addChat/", message_controller.addChat);
router.post("/addMsg/", message_controller.addMessage);
router.post("/getMsg/", message_controller.getAllMessage);
router.delete("/deleteAllChat", guest_controller.deleteAllChat);
router.post("/deleteAllPrivateChat", message_controller.deleteAllPrivateChat);


function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghjlkuemxjuenbjkhkahkshdfkhaskjdhfAABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads`);
    // /${new Date().toISOString() + randomString(10)}
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/upload", upload.single("image"), image_controller.imageUpload);

module.exports = router;
