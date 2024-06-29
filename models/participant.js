const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nbrOfParticipation: { type: Number, default: 0 },
  birthDate: { type: Date, required: true },
});

module.exports = mongoose.model("Participant", participantSchema);
