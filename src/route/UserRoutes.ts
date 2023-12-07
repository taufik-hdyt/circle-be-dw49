import * as express from "express";
import UserControllers from "../controllers/UserControllers";
import { jwtAuth } from "../middlewares/jwtAuth";
const router = express.Router();

// users
router.get("/suggest-users", jwtAuth, UserControllers.suggest);
router.get("/users", jwtAuth, UserControllers.find);
router.get("/user/:id", jwtAuth, UserControllers.findOne);
router.delete("/user/:id", jwtAuth, UserControllers.delete);
router.patch("/user/:id", jwtAuth, UserControllers.update);

// login and register
router.post("/register", UserControllers.register);
router.post("/login", UserControllers.login);
router.get("/auth/check", jwtAuth, UserControllers.authCheck);

export default router;
