import React from 'react';

import 'react-toastify/dist/ReactToastify.css';
import ChooseOptions from './games/ChooseOptions';

export default function Home() {
	return (
		<ChooseOptions
			firstOption={'tic tac toe'}
			secondOption={'matching game'}
			thirdOption={'checkers'}
			setter={'link'}
		/>
	);
}
