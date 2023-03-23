import { useState } from 'react';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function LoginPage() {
	const [login, setLogin] = useState(true);

	const setLoginToggle = () => {
		setLogin(() => !login);
	};
	// TODO: user come here from account
	return (
		<>
			{login ? <LoginForm toggle={setLoginToggle} /> : <SignUpForm toggle={setLoginToggle} />}
		</>
	);
}
