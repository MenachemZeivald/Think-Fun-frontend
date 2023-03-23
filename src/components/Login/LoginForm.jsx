import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

import Form from './Form';
import InputField from './InputField';
import InputButton from './InputButton';

import DEFAULT_PROFILE_IMG from '../../assets/avataaars.png';

export default function LoginForm({ toggle }) {
	const { setAuth, persist, setPersist } = useAuth();
	const nav = useNavigate();
	const location = useLocation();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [err, setErr] = useState({
		email: '',
		password: '',
		general: '',
	});

	useEffect(() => {
		localStorage.setItem('persist', persist);
	}, [persist]);

	const blurHandler = e => {
		const { name, value } = e.target;
		let errMsg = inputErrorHandler(name, value);
		if (errMsg) {
			setErr({ ...err, [name]: errMsg });
		} else {
			setFormData({ ...formData, [name]: value.trim() });
		}
	};

	const SubmitHandler = event => {
		event.preventDefault();
		let goodForm = formData.email && formData.password && !err.email && !err.password;
		if (goodForm) {
			sendDataToServer();
		}
	};

	const sendDataToServer = async () => {
		try {
			const response = await axios.post('/users/login', formData, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
			});
			const { name, role, img_url } = response.data;
			const accessToken = response.data?.accessToken;
			console.log(response.data);
			setAuth({
				name,
				role,
				profilePic: img_url || DEFAULT_PROFILE_IMG,
				accessToken,
			});
			const prevWebPage = location.state?.from?.pathname || '/';
			nav(prevWebPage, { replace: true });
		} catch (err) {
			serverErrorHandler(err);
		}
	};

	function inputErrorHandler(name, value) {
		let errMsg = '';
		if (name === 'password') {
			errMsg = value.length >= 6 ? '' : 'Invalid password';
		} else if (name === 'email') {
			let regex = /^\w+@[A-z]+\.[A-z]{2,4}/;
			errMsg = value.trim().match(regex) ? '' : 'Invalid email';
		}
	}

	function serverErrorHandler({ response }) {
		const errMsg =
			!response?.status || response.status === 500
				? 'No Server Response'
				: response.status === 400
				? 'Missing Email or Password'
				: response.status === 401
				? 'Email or Password not much'
				: 'Login Failed';
		setErr({ ...err, general: errMsg });
		console.log(err);
	}

	return (
		<Form as='form' SubmitHandler={SubmitHandler}>
			<h1>LOGIN</h1>
			<InputField
				label={'please enter your email'}
				name='email'
				err={err.email}
				onBlur={blurHandler}
			/>
			<InputField
				label={'please enter your password'}
				type='password'
				name='password'
				err={err.password}
				onBlur={blurHandler}
			/>
			<span>{err.email || err.password || err.general || ''}</span>
			<label htmlFor='persist'>Trust this Device </label>
			<input
				type='checkbox'
				id='persist'
				onChange={setPersist(prev => !prev)}
				checked={persist}
			/>
			<InputButton type='submit' text='submit' />
			<InputButton clickHandler={toggle} text={'SIGN UP'} border={'full'} />
		</Form>
	);
}
