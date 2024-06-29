const express = require("express");
const router = express.Router();
const Session = require("../models/session");
const { z } = require("zod");
const Participant = require("../models/participant");

const participantRatingSchema = z.object({
  participantId: z.string(),
  rating: z.number().min(0.5).max(5),
});

const sessionSchema = z.object({
  name: z.string(),
  startedAt: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  endsAt: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
});

router.post("/", async (req, res) => {
  const result = sessionSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);

  try {
    const session = new Session(result.data);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const result = sessionSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error);

  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      result.data,
      { new: true }
    );
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Session deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/participant", async (req, res) => {
  const { participantId, rating } = req.body;
  if (!participantId || !rating)
    return res.status(400).json({ error: "Missing participantId or rating" });

  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    const participant = Participant.findByIdAndUpdate(participantId, {
      $inc: { nbrOfParticipation: 1 },
    });
    if (!participant)
      return res.status(404).json({ error: "Participant not found" });
    if (
      session.participantsRating.find((participant) =>
        participant.participantId.equals(participantId)
      )
    )
      throw new Error("Participant already rated");
    session.participantsRating.push({ participantId, rating });
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id/participant/:participantId", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    const participantId = req.params.participantId;
    if (!session) return res.status(404).json({ error: "Session not found" });
    const participantIndex = session.participantsRating.findIndex(
      (participant) => participant.participantId.equals(participantId)
    );
    if (participantIndex === -1)
      return res.status(404).json({ error: "Participant not found" });
    session.participantsRating.splice(participantIndex, 1);
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
