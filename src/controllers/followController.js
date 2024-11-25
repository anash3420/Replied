import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { users } from '../models/User.js';

// Send a follow request
export function sendFollowRequest(req, res) { 
    const userId = req.body.toUserName; // The user to follow
    const requestingUserId = req.body.fromUserName; // The user sending the request

    if (!users.has(userId) || !users.has(requestingUserId)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = users.get(userId);
    const requestingUser = users.get(requestingUserId);

    // Check if the requesting user is blocked
    if (user.blockedUsers.find( user => user.userName == requestingUser.userName)) {
        return res.status(403).json({ error: 'You are blocked by this user.' });
    }

    // Check if the follow request already exists
    const existingRequest = user.followRequests.find(
        (req) => req.from === requestingUserId && req.status === 'pending'
    );
    if (existingRequest) {
        return res.status(400).json({ error: 'Follow request already exists!' });
    }

    // Add follow request
    const requestId = uuidv4();
    const followRequest = { id: requestId, from: requestingUserId, status: 'pending' };
    user.followRequests.push(followRequest);

    return res.status(200).json({ message: 'Follow request sent.', requestId });
}

// Get follow requests
export function getFollowRequests(req, res) {
    const { userId } = req.params;

    if (!users.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = users.get(userId);
    return res.status(200).json(user.followRequests);
}

// Accept or reject a follow request
export function respondToFollowRequest(req, res) {
    const userId = req.body.toUserName; // The user to follow
    const requestId = req.body.requestId; // The request ID
    const action = req.body.action; // 'accept' or 'reject'

    if (!users.has(userId)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = users.get(userId);
    const followRequest = user.followRequests.find((req) => req.id === requestId);

    if (!followRequest) {
        return res.status(404).json({ error: 'Follow request not found' });
    }
    if(followRequest.status !== 'pending') {
        return res.status(400).json({ error: 'Follow request is already responded!' });
    }
    
    // check if the user is blocked
    const requestingUser = users.get(followRequest.from);
    if (user.blockedUsers.find( user => user.userName == requestingUser.userName)) {
        return res.status(403).json({ error: 'Could not send follow request. Try again later!' });
    }

    switch (action) {
        case 'accept':
            followRequest.status = 'accepted';
            user.followers.push(followRequest.from);
            users.get(followRequest.from).following.push(userId);
            break;

        case 'reject':
            followRequest.status = 'rejected';
            break;
    
        default:
            return res.status(400).json({ error: 'Invalid action' });
            break;
    }
    console.log(users);
    return res.status(200).json({ message: 'Follow request updated.' });
}
