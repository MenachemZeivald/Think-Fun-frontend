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
				{/* TODO: change to profile pic if user sign in */}
				<Icon
					text={'PERSON'}
					// to={user ? false : 'login'}
					to={false}
					clickHandler={() => setIsPopUpOpen(true)}
				/>
				<LoginPopUp blurHandler={() => setIsPopUpOpen(false)} isOpen={isPopUpOpen} />
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
	position: relative;
	z-index: 10;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 8px;
	img {
		width: 20vw;
	}
`;
const LayoutStyle = styled.main`
	position: relative;
	z-index: 1;
	height: 80vh;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-evenly;
`;
