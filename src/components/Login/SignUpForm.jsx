import React, { useState } from 'react';
import Form from './Form';
import ProfilePic from './ProfilePic';
import InputField from './InputField';
import InputFile from './InputFile';
import DEFAULT_PROFILE_IMG from '../../assets/avataaars.png';

import InputButton from './InputButton';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

export default function SignUpForm({ toggle }) {
	const { setAuth } = useAuth();
	const nav = useNavigate();
	const location = useLocation();

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		passwordAgain: '',
	});

	const [err, setErr] = useState({
		name: '',
		email: '',
		password: '',
		passwordAgain: '',
		general: '',
	});
	const [selectedImage, setSelectedImage] = useState();

	const blurHandler = e => {
		const { name, value } = e.target;
		const errorMessage = inputErrorHandler(name, value);

		if (errorMessage) {
			setErr({ ...err, [name]: errorMessage });
		} else {
			setFormData({ ...formData, [name]: value.trim() });
		}
	};

	const submitHandler = event => {
		event.preventDefault();
		console.log(event);
		if (!Object.values(err).reduce((a, b) => a + b, '')) {
			let { passwordAgain, ...dataToSend } = formData;
			sendDataToServer(dataToSend);
		}
	};

	const sendDataToServer = async data => {
		try {
			const response = await axios.post('/users/register', data, {
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

	const inputErrorHandler = (name, value) => {
		switch (name) {
			case 'name':
				return value.length < 2 ? 'Invaild name' : '';
			case 'email':
				let regex = /^\w+@[A-z.]+\.[A-z]{2,4}$/;
				return !value.trim().match(regex) ? 'Invaild email' : '';
			case 'password':
				return value.length < 6 ? 'Invaild password' : '';
			case 'passwordAgain':
				return value !== passwordData.password ? 'Passwords should match' : '';
			default:
				return '';
		}
	};

	function serverErrorHandler({ response }) {
		const errMsg =
			!response || response.status === 500
				? 'No Server Response'
				: response?.status === 401
				? 'Email already registered'
				: 'Sign up Failed';
		setErr({ ...err, general: errMsg });
		console.log(errMsg);
	}

	return (
		<Form SubmitHandler={submitHandler}>
			<ProfilePic
				src={selectedImage ? URL.createObjectURL(selectedImage) : DEFAULT_PROFILE_IMG}
			/>
			<h1>SIGN UP</h1>

			<InputField
				label={'please enter your name'}
				name={'name'}
				err={err.name}
				onBlur={blurHandler}
			/>
			<InputField
				label={'please enter your email'}
				name={'email'}
				err={err.email}
				onBlur={blurHandler}
			/>
			<InputFile
				onChange={event => {
					console.log(event.target.files[0]);
					setSelectedImage(event.target.files[0]);
				}}
				btnText={'upload profile photo'}
			/>
			<InputField
				label={'please enter your password'}
				type={'password'}
				name={'password'}
				err={err.password}
				onBlur={blurHandler}
			/>
			<InputField
				label={'please enter your password'}
				type={'password'}
				name={'passwordAgain'}
				err={err.passwordAgain}
				onBlur={blurHandler}
			/>
			<span>
				{err.name || err.email || err.password || err.passwordAgain || err.general || ''}
			</span>
			<InputButton type='submit' text='submit' />
			<InputButton clickHandler={toggle} text='LOGIN' border='full' />
		</Form>
	);
}
