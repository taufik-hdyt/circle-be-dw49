import *  as express from  'express'
import UserControllers from '../controllers/UserControllers'
const router = express.Router()

// users
router.get('/users', UserControllers.find)
router.get('/user/:id', UserControllers.findOne)
router.delete('/user/:id', UserControllers.delete)
router.post('/user', UserControllers.create)
router.patch('/user/:id', UserControllers.update)


export default router