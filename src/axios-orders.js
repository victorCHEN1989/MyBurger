import axios from 'axios';

const instance = axios.create ({
	baseURL: 'https://react-my-burger-8f976.firebaseio.com/'
});

export default instance;