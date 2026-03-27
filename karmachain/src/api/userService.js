import api from './api';

/**
 * Login flow: look up user by name.
 * If not found, create a new user with that name.
 */
export const loginOrCreateUser = async (name) => {
  try {
    const res = await api.get(`/users/by-name/${encodeURIComponent(name)}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const createRes = await api.post('/users/create', { name });
      return createRes.data;
    }
    throw err;
  }
};

/**
 * Fetch latest user data by ID — used to refresh stale coins/trustScore after rewards.
 */
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};
