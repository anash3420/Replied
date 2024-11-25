import { Router } from 'express';
const router = Router();
import { sendFollowRequest, getFollowRequests, respondToFollowRequest } from '../controllers/followController.js';

// Routes for Follow functionality
//Requests
router.post('/requests/followRequest', sendFollowRequest);
router.get('/requests/:userId', getFollowRequests);

// Response
router.post('/requests/respond', respondToFollowRequest);
export default router;
