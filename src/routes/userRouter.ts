import express from 'express';
import { isAuthorized } from '../middleware/userAuth'
import {
    createUser, verifyUser,
    findAllUsers, loginUser, deleteUser,
    getOneUser, updateUser
} from '../controller/UserController';


const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser)
router.get('/verify/:token', verifyUser);
router.get('/all', findAllUsers);
router.get('/single/:id', isAuthorized, getOneUser);
router.delete('/delete/:id', isAuthorized, deleteUser);
router.put('/update/:id', isAuthorized, updateUser);



export default router;