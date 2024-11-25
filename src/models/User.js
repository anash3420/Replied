
import { v4 as uuidv4 } from 'uuid';
export const users = new Map(); // Maps userId to user objects

// User Schema
export const createUserSchema = (userName, birthDate) => ({
  id: uuidv4(),
  userName,
  birthDate,
  followers: [],
  following: [],
  blockedUsers: [],
  followRequests: [],
});