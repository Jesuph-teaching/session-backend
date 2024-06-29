const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startedAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  participantsRating: [
    {
      participantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true,
      },
      rating: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Session", sessionSchema);
