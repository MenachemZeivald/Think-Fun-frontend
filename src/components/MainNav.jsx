import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';

import LoginPopUp from './LoginPopUp';
import Icon from './Icon';
import useAuth from '../hooks/useAuth';
import LOGO from '../assets/logo.png';

export default function MainNav() {
	const [isPopUpOpen, setIsPopUpOpen] = useState(false);
	const { auth } = useAuth();
	const user = auth.name;

	return (
		<>
			<NavStyle>
				<Icon
					text={'PERSON'}
					link={user ? false : 'login'}
					pic={auth?.profilePic}
					clickHandler={() => (user ? setIsPopUpOpen(true) : '')}
				/>
				<LoginPopUp blurHandler={() => setIsPopUpOpen(false)} isOpen={isPopUpOpen} />
				<Link to='/'>
					<img src={LOGO} alt='logo think fun'></img>
				</Link>
				<Icon text='bar_chart' link='/LeaderBoard' />
			</NavStyle>
			<LayoutStyle>{<Outlet />}</LayoutStyle>
		</>
	);
}

const NavStyle = styled.nav`
	position: relative;
	z-index: 10;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 8px;
	img {
		height: 50px;
		transform: translateY(-5px) scale(1.5);
		transform-origin: top;
	}
	@media (max-device-width: 768px) {
		img {
			height: 40px;
		}
	}
`;
const LayoutStyle = styled.main`
	position: relative;
	z-index: 1;
	height: calc(100vh - 78px);
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-evenly;
`;
