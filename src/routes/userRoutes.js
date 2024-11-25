import { Router } from 'express';
const router = Router();
import { createUser, getUser, viewFollowers, viewFollowing, blockUser } from '../controllers/userController.js';

// Routes for Users
router.post('/users/create', createUser);
router.get('/users/:userName', getUser);

router.get('/users/:userName/followers', viewFollowers);
router.get('/users/:userName/following', viewFollowing);

router.post('/users/:userName/block', blockUser);

export default router;
