import api from './api';

/**
 * Upload proof of work for a task.
 */
export const uploadProof = async ({ taskId, userId, text, image }) => {
  const res = await api.post('/proofs/upload', {
    taskId,
    userId,
    text,
    image: image || '',
  });
  return res.data;
};

/**
 * Verify a proof (task creator approves/rejects with a 1–5 rating).
 */
export const verifyProof = async (proofId, { isApproved, rating }) => {
  const res = await api.post(`/proofs/verify/${proofId}`, { isApproved, rating });
  return res.data;
};

/**
 * Get all tasks created by this user, each with their submitted proofs.
 * Used for the "My Tasks" inbox page.
 */
export const getMyTasksWithProofs = async (ownerId) => {
  const res = await api.get(`/proofs/my-tasks/${ownerId}`);
  return res.data;
};
