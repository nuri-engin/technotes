import axios from 'axios';

export default () => {
  const options = {};
  options.baseURL = process.env.VUE_APP_BASE_URL;
  options.headers = {'Content-Type': 'application/json'};
  const instance = axios.create(options);

  // Set the AUTH tokenm for any request
  instance.interceptors.request.use(function(config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  })
  return instance;
};