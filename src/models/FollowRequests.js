export const followRequests = new Map(); // Maps userId to their follow requests

export const followRequest = (from, to) => ({
  from,
  to,
  status: 'pending',
});