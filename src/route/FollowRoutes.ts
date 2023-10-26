import { Router } from "express";
import { jwtAuth } from "../middlewares/jwtAuth";
import FollowController from "../controllers/FollowController";

const FollowRoutes = Router();

FollowRoutes.post("/follow/:id", jwtAuth, FollowController.follow);

export default FollowRoutes;