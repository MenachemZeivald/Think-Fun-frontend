import { createContext, useState } from 'react';

import PHOTO from '../assets/avataaars.png';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	// const [auth, setAuth] = useState({});
	const [auth, setAuth] = useState({
		name: 'Menachem',
		role: 'user',
		profilePic: PHOTO,
		accessToken: 12345,
	});
	const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist') || false));

	return (
		<AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
