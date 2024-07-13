const express = require("express");
const router = express.Router();
const Participant = require("../models/participant");
const { z } = require("zod");

const participantSchema = z.object({
  name: z.string(),
  birthDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
});

router.post("/", async (req, res) => {
  const result = participantSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);

  try {
    const participant = new Participant(result.data);
    await participant.save();

    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
function waitSeconds(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done");
    }, seconds * 1000);
  });
}
router.get("/", async (req, res) => {
  try {
    const participants = await Participant.find();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant)
      return res.status(404).json({ error: "Participant not found" });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const result = participantSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);

  try {
    const participant = await Participant.findByIdAndUpdate(
      req.params.id,
      result.data,
      { new: true }
    );
    if (!participant)
      return res.status(404).json({ error: "Participant not found" });
    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(req.params.id);
    if (!participant)
      return res.status(404).json({ error: "Participant not found" });
    await waitSeconds(5);

    res.json({ message: "Participant deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
