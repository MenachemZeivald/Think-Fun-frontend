import axios from '../api/axios';
import useAuth from './useAuth';

function useLogout() {
	const { setAuth } = useAuth();
	const logout = async () => {
		setAuth({});
		try {
			await axios('/users/logout', {
				withCredentials: true,
			});
		} catch (err) {
			console.error(err);
		}
	};
	return logout;
}

export default useLogout;
