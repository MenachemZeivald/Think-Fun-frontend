import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../../hooks/useAxiosPrivet';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
// import useLogout from '../../hooks/useLogout';

import Form from './Form';
import InputButton from './InputButton';
import InputField from './InputField';
import InputFile from './InputFile';
import ProfilePic from './ProfilePic';
import LoadingGif from '../games/LoadingGif';
import { BASE_URL } from '../../api/axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

export default function AccountForm() {
	const axiosPrivate = useAxiosPrivate();
	const refresh = useRefreshToken();
	const controller = new AbortController();
	// const logout = useLogout();
	const nav = useNavigate();
	const location = useLocation();

	const { auth, setAuth } = useAuth();
	// const [errMsg, setErrMsg] = useState(''); // TODO: merge with err
	const [info, setInfo] = useState({});
	const [userDetails, setUserDetails] = useState({ name: '', email: '' });
	const [passwordData, setPasswordData] = useState({
		password: '',
		passwordAgain: '',
		oldPassword: '',
	});

	const [expandChangePasswordArea, setExpandChangePasswordArea] = useState(false);
	const [formErr, setFormErr] = useState({
		name: '',
		email: '',
		oldPassword: '',
		password: '',
		passwordAgain: '',
	});

	const validateForm = (name, value) => {
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

	const blurHandler = e => {
		const { name, value } = e.target;
		// TODO: add if value is equal to the context value
		if (!value) {
			setFormErr({ ...formErr, [name]: '' });
			return;
		}

		const errorMessage = validateForm(name, value);
		if (errorMessage) {
			setFormErr({ ...formErr, [name]: errorMessage });
			return;
		}

		if (name === 'password' || name === 'passwordAgain' || name === 'oldPassword') {
			setPasswordData({ ...passwordData, [name]: value });
		} else {
			setUserDetails({ ...userDetails, [name]: value.trim() });
		}
	};

	const submitHandler = event => {
		event.preventDefault();
		console.log(event);
		if (!Object.values(formErr).reduce((a, b) => a + b, '')) {
			if (userDetails.name || userDetails.email) {
				// TODO: check if user change details, send email and name anyway
				console.log(userDetails);
				sendUserDataToServer(userDetails);
			}
			if (Object.values(passwordData).every(field => field !== '')) {
				let { passwordAgain, ...dataToSend } = passwordData;
				console.log(dataToSend);
				sendPasswordDataToServer(dataToSend);
			}
		}
	};

	useEffect(() => {
		myInfoInit();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const myInfoInit = async () => {
		try {
			let url = '/users/myInfo';
			const response = await axiosPrivate.get(url, {
				signal: controller.signal,
			});
			// console.log(response.data);
			setInfo(response.data);
		} catch (error) {
			console.log(error);
			nav('/login', { state: { from: location }, replace: true });
		}
	};

	const sendUserDataToServer = async bodyData => {
		try {
			let url = '/users/';
			const response = await axiosPrivate.put(url, bodyData, {
				signal: controller.signal,
			});
			if (response.data.modifiedCount === 1)
				notify('success', 'Your personal details  has been changed');
			else notify('error', 'You not change nothing');
		} catch (error) {
			notify('error', 'Bad request');
		}
	};

	const sendPasswordDataToServer = async bodyData => {
		try {
			let url = '/users/editPassword';
			const response = await axiosPrivate.put(url, bodyData, {
				signal: controller.signal,
			});
			if (response.data.modifiedCount) {
				notify('success', 'Your password  has been changed');
				setExpandChangePasswordArea(false);
			}
			// console.log(response);
		} catch (error) {
			if (error.response.status === 401)
				notify('error', 'Your password has not been changed. Try again');
			else notify('error', 'Bad request');
			console.log(error.response);
		}
	};

	const sendImageToServer = async e => {
		const formData = new FormData();
		formData.append('image', e.target.files[0]);
		try {
			const url = info.img_url?.[0] !== 'h' ? '/users/editImage' : '/users/uploadImage';
			const headers = { Authorization: `Bearer ${auth.accessToken}` };
			const response = await axios.post(BASE_URL + url, formData, { headers });
			if (response.data.modifiedCount === 1) myInfoInit();
		} catch (error) {
			console.error(error.response);
			if (error.response.status === 403) {
				const url = info.img_url[0] !== 'h' ? '/users/editImage' : '/users/uploadImage';
				const accessToken = await refresh();
				const headers = { Authorization: `Bearer ${accessToken}` };
				const response = await axios.post(BASE_URL + url, formData, { headers });
				if (response.data.modifiedCount === 1) myInfoInit();
				console.log(response.data);
			}
		}
	};

	const deleteImage = async () => {
		try {
			const response = await axiosPrivate.delete('/users/deleteImage', {
				signal: controller.signal,
			});
			if (response.data === 'OK') {
				notify('success', 'Your profile photo has been deleted');
				myInfoInit();
			}
		} catch (error) {
			console.log(error.response);
			notify('error', 'Your profile picture has not been deleted. Try again');
		}
	};

	const deleteAccount = async () => {
		try {
			const response = await axiosPrivate.delete('/users/', {
				signal: controller.signal,
			});
			if (response.data.deletedCount) {
				notify('success', 'Your account has been deleted');
				setAuth({});
				nav('/');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const notify = (status, message) =>
		toast[status](message, {
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'colored',
		});

	// TODO: add info to placeholder
	if (!info._id) {
		return <LoadingGif />;
	}
	return (
		<Form as='form' SubmitHandler={submitHandler} accountFormStyle={true}>
			<ProfilePic
				src={info.img_url?.[0] !== 'h' ? BASE_URL + '/' + info.img_url : info.img_url}
			/>
			<h1>MY ACCOUNT</h1>
			<InputField
				label={'change your name'}
				name={'name'}
				placeholder={info?.name}
				err={formErr.name}
				flexRow={true}
				onBlur={blurHandler}
			/>
			<InputField
				label={'change your email'}
				name={'email'}
				placeholder={info?.email}
				err={formErr.email}
				flexRow={true}
				onBlur={blurHandler}
			/>
			<InputFile onChange={sendImageToServer} btnText={'update profile photo'} />
			{info.img_url?.[0] !== 'h' && (
				<InputButton clickHandler={deleteImage} text={'delete profile photo'} />
			)}
			{expandChangePasswordArea || (
				<InputButton
					clickHandler={() => setExpandChangePasswordArea(true)}
					text='change password'
					border='full'
				/>
			)}
			{expandChangePasswordArea && (
				<>
					<InputField
						label={'your old password'}
						type={'password'}
						name={'oldPassword'}
						err={formErr.oldPassword}
						flexRow={true}
						onBlur={blurHandler}
					/>
					<InputField
						label={'new password'}
						type={'password'}
						name={'password'}
						err={formErr.password}
						flexRow={true}
						onBlur={blurHandler}
					/>
					<InputField
						label={'reenter your password'}
						as={'input'}
						type={'password'}
						name={'passwordAgain'}
						err={formErr.passwordAgain}
						flexRow={true}
						onBlur={blurHandler}
					/>
				</>
			)}
			<InputButton type='submit' text='submit' />

			<button
				style={{
					background: '#ff6392',
					color: '#ffe45e',
					border: 'none',
					borderRadius: '4px',
					height: '32px',
					marginTop: '28px',
				}}
				onClick={() => window.confirm('Are you sure?') && deleteAccount()}
			>
				delete account
			</button>
			<ToastContainer />
		</Form>
	);
}
