import axios from '../api/axios';
import useAuth from './useAuth';

function UseRefreshToken() {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await axios.get('/users/refreshToken', {
			withCredentials: true,
		});
		setAuth(prev => {
			console.log('use refresh token (prev)', prev);
			console.log('use refresh token (new)', response.data.accessToken);
			return {
				...prev,
				name: response.data.name,
				role: response.data.role,
				accessToken: response.data.accessToken,
				profilePic: response.data.img_url,
			};
		});
		return response.data.accessToken;
	};

	return refresh;
}

export default UseRefreshToken;
