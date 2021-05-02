import axios from 'axios';

export default () => {
  const options = {};
  options.baseURL = 'https://technotes-api-dev.herokuapp.com/api/';
  const instance = axios.create(options);
  return instance;
};