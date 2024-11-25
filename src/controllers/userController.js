import { users, createUserSchema } from '../models/User.js';

// Create a new user
export function createUser(req, res) {
    // assign a random birthdate and username
    const userName = `user${users.size + 1}`;
    const birthdate = new Date(
      Math.floor(Math.random() * 100) + 1900,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    ).toISOString();

    // create a new user
    const newUser = createUserSchema(userName, birthdate);
    users.set(userName, newUser);
    console.log(users);

    res.status(201).json(newUser);
}

// Get a user details
export function getUser(req, res) {
    const { userName } = req.params;
    if (!users.has(userName)) {
        return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(users.get(userName));
}

// View followers
export function viewFollowers(req, res) {
    const { userName } = req.params;
    if (!users.has(userName)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = users.get(userName);
    const followers = user.followers.map((followerId) => {
        const mappedUser = users.get(followerId);
        return {
            id: mappedUser.id,
            userName: mappedUser.userName,
            birthdate: user.followers.find((followerId) => followerId === followerId) && mappedUser.birthdate,
        };
    });
    return res.status(200).json(followers);
}

// View the users that the user is following
export function viewFollowing(req, res) {
    const { userName } = req.params;
    if (!users.has(userName)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = users.get(userName);
    const following = user.following.map((followingId) => {
        const mappedUser = users.get(followingId);
        return {
            id: mappedUser.id,
            userName: mappedUser.userName,
            birthdate: user.followers.find((followerId) => followerId === followingId) && mappedUser.birthdate,
        };
    });
    return res.status(200).json(following);
}

// Block a user
export function blockUser(req, res) {
    const { userName } = req.params;
    const { blockedUserName } = req.body;

    if (!users.has(userName) || !users.has(blockedUserName)) {
        return res.status(404).json({ error: 'User not found' });
    }

    const user = users.get(userName);
    const blockedUser = users.get(blockedUserName);

    if (user.blockedUsers.includes(blockedUser.userName)) {
        return res.status(400).json({ error: 'User is already blocked' });
    }

    // remove the user from the followers and following list
    const followers = user.followers.filter((follower) => follower !== blockedUserName);
    const following = user.following.filter((followed) => followed !== blockedUserName);
    user.followers = followers;
    user.following = following;

    // remove the user from the blocked user's followers and following list
    const blockedUserFollowers = blockedUser.followers.filter((follower) => follower !== userName);
    const blockedUserFollowing = blockedUser.following.filter((followed) => followed !== userName);
    blockedUser.followers = blockedUserFollowers;
    blockedUser.following = blockedUserFollowing;

    user.blockedUsers.push(blockedUserName);
    return res.status(200).json({ message: 'User blocked' });
}