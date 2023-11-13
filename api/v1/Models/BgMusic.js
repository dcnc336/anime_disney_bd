const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bgMusicSchema = new mongoose.Schema(
  {
    music: {
      type: String,
      default: "",
    },
    outfit: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const BgMusic = mongoose.model("BgMusic", bgMusicSchema);

module.exports = BgMusic;
