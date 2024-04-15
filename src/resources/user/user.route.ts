import { Router } from 'express'
import {fetchAllUsers, getUserById, updateUser,
deleteUser, loginUser, registerUser} from './user.controllers'

const userRouter = Router()

userRouter.get('/all', fetchAllUsers)
userRouter.get('/:userId', getUserById)
userRouter.delete('/:userId', deleteUser)
userRouter.put('/:userId', updateUser)
userRouter.post('/login', loginUser)
userRouter.post('/signup', registerUser)

export default userRouter
