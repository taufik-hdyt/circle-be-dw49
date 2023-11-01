import { Response } from 'express';
import { Request } from 'express';
import *  as express from  'express'
import UserControllers from '../controllers/UserControllers'
import { jwtAuth } from '../middlewares/jwtAuth';
const router = express.Router()

// users
router.get('/suggest-users', UserControllers.suggest)
router.get('/users', UserControllers.find)
router.get('/user/:id', UserControllers.findOne)
router.delete('/user/:id', UserControllers.delete)
router.patch('/user/:id', UserControllers.update)

// login and register
router.post('/register', UserControllers.register)
router.post('/login', UserControllers.login )
router.get('/auth/check', jwtAuth, UserControllers.authCheck)


export default router