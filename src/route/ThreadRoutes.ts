import *  as express from  'express'
import ThreadControllers from '../controllers/ThreadControllers'
import { jwtAuth } from '../middlewares/jwtAuth'
import LikeControllers from '../controllers/LikeControllers'
import ReplyControllers from '../controllers/ReplyControllers'
import uploadImages from '../middlewares/UploadImages'
import { UploadFile } from '../middlewares/UploadFile'
const router = express.Router()

router.get('/threads',jwtAuth, ThreadControllers.find)
router.get('/thread/:id',jwtAuth, ThreadControllers.findOne)
router.post('/thread',jwtAuth, ThreadControllers.create)
router.patch('/thread/:id',jwtAuth, ThreadControllers.update)
router.delete('/thread/:id',jwtAuth, ThreadControllers.delete)
router.post('/thread/:id/like',jwtAuth, LikeControllers.Like)
router.post("/thread/:id/reply", jwtAuth, ReplyControllers.add);

router.post("/thread-post", jwtAuth, UploadFile("image"), ThreadControllers.createThread);


export default router