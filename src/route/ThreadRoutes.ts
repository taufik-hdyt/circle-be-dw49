import *  as express from  'express'
import ThreadControllers from '../controllers/ThreadControllers'
import { jwtAuth } from '../middlewares/jwtAuth'
import LikeControllers from '../controllers/LikeControllers'
import ReplyControllers from '../controllers/ReplyControllers'
const router = express.Router()

router.get('/threads', ThreadControllers.find)
router.get('/thread/:id', ThreadControllers.findOne)
router.post('/thread',jwtAuth, ThreadControllers.create)
router.patch('/thread/:id',jwtAuth, ThreadControllers.update)
router.delete('/thread/:id',jwtAuth, ThreadControllers.delete)

router.post('/thread/:id/like',jwtAuth, LikeControllers.Like)
router.post("/thread/:id/reply", jwtAuth, ReplyControllers.add);

export default router