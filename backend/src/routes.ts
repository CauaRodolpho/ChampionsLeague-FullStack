import { Router } from "express";
import * as PlayerController from "./controllers/players-controller";
import * as ClubController from "./controllers/clubs-controller";

const router = Router();

// Jogadores
router.get("/players", PlayerController.getPlayer);
router.get("/players/:id", PlayerController.getPlayerById);
router.post("/players", PlayerController.postPlayer);
router.delete("/players/:id", PlayerController.deletePlayer);
router.patch("/players/:id", PlayerController.updatePlayer);

// Clubes
router.get("/clubs", ClubController.getClubs);
router.post("/clubs", ClubController.postClub);
router.delete("/clubs/:id", ClubController.deleteClub);

export default router;
