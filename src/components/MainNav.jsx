import React, { useState, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';

import LoginPopUp from './LoginPopUp';
import Icon from './Icon';
import LOGO from '../assets/logo.png';

export default function MainNav({ children }) {
	const [isPopUpOpen, setIsPopUpOpen] = useState(false);
	const user = false;
	return (
		<>
			<NavStyle>
				<Icon
					text={user ? user : 'PERSON'}
					to={user || 'login'}
					clickHandler={() => setIsPopUpOpen(true)}
				/>
				{isPopUpOpen && <LoginPopUp blurHandler={() => setIsPopUpOpen(false)} />}
				<Link to='/'>
					<img src={LOGO} alt='logo think fun'></img>
				</Link>
				<Icon text='bar_chart' to='stat' />
			</NavStyle>
			<LayoutStyle>{<Outlet />}</LayoutStyle>
		</>
	);
}

const NavStyle = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 8px;
	img {
		width: 20vw;
	}
`;
const LayoutStyle = styled.main`
	height: 80vh;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-evenly;
`;
