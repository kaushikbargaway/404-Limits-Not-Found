import api from './api';

export const getTasks = async () => {
  const res = await api.get('/tasks');
  return res.data;
};

export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTask = async ({ title, description, reward, minTrustScore, ownerId }) => {
  const res = await api.post('/tasks/create', {
    title,
    description,
    reward,
    minTrustScore,
    ownerId,
  });
  return res.data;
};

export const acceptTask = async (taskId, userId) => {
  const res = await api.post(`/tasks/accept/${taskId}`, { userId });
  return res.data;
};

export const cancelTask = async (taskId, ownerId) => {
  const res = await api.delete(`/tasks/delete/${taskId}`, { data: { ownerId } });
  return res.data;
};
