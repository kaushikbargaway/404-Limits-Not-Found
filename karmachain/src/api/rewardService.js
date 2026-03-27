import api from './api';

export const getUserTransactions = async (userId) => {
  const res = await api.get(`/rewards/${userId}`);
  return res.data;
};
