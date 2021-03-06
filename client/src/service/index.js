import axios from 'axios';

export default () => {
  const options = {};
  options.baseURL = process.env.VUE_APP_BASE_URL;
  options.headers = { 'Content-Type': 'application/json' };
  // axios.defaults.params = { page: 1 }
  const instance = axios.create(options);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  }, function (error) {
    console.log(error.message);
  })

  return instance;
};