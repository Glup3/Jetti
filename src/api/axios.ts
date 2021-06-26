import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
  },
});

export default axiosInstance;
