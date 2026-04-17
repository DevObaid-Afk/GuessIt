import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getActiveSession, getStatus, startGame, submitGuess, useHint } from "../controllers/gameController.js";

const router = Router();

router.use(requireAuth);
router.get("/status", getStatus);
router.get("/active", getActiveSession);
router.post("/start", startGame);
router.post("/guess", submitGuess);
router.post("/hint", useHint);

export default router;
