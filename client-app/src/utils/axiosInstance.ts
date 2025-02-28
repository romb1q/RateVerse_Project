import axios from 'axios';

const API_URL = 'http://localhost:5000';


const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  delete axios.defaults.headers.common['Authorization'];
}
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axiosInstance.post('/auth/refresh-token');
        const newAccessToken = data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Ошибка обновления токена", err);
        localStorage.removeItem('accessToken');
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
