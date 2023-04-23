import React, { useRef, useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

import Form from './Form';
import InputField from './InputField';
import InputButton from './InputButton';
import axios from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const reRef = useRef();
  const nav = useNavigate();

	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [passwordAgin, setPasswordAgin] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [isCodeSent, setIsCodeSent] = useState(false);
	const [timer, setTimer] = useState(0);
	const [errMsg, setErrMsg] = useState('');
	const [forgotPasswordToken, setForgotPasswordToken] = useState('');
	const [tokenConfirmationCodeVerified, setTokenConfirmationCodeVerified] = useState('');
	const [isVerify, setIsVerify] = useState(false);

	const handleSendCode = async () => {
		const recaptchaToken = await reRef.current.executeAsync();
		reRef.current.reset();
		setIsSending(true);
		try {
			const response = await axios.post(
				'/users/forgotPassword',
				{ email, recaptchaToken },
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);
			console.log(response.data);
			setForgotPasswordToken(response.data.forgotPasswordToken);
			setIsSending(false);
			setIsCodeSent(true);
			setTimer(300);
		} catch (err) {
			setIsSending(false);
			if (!err?.response) {
				notify('error', 'No Server Response');
			} else if (err.response?.status === 400) {
				notify('error', 'Missing Email');
			} else if (err.response?.status === 401) {
				notify('error', 'Email not found');
			} else {
				notify('error', 'Login Failed');
			}
		}
	};

	useEffect(() => {
		let interval = null;
		if (isCodeSent && timer > 0) {
			interval = setInterval(() => {
				setTimer(prevTimer => prevTimer - 1);
			}, 1000);
		} else if (timer === 0) {
			setIsCodeSent(false);
		}
		return () => clearInterval(interval);
	}, [isCodeSent, timer]);

	const handleVerifyCode = async e => {
		e.preventDefault();
		try {
			const headers = { Authorization: `Bearer ${forgotPasswordToken}` };
			const response = await axios.post('/users/verifyOneTimeCode', { code }, { headers });
			console.log(response.data);
			setTokenConfirmationCodeVerified(response.data.tokenConfirmationCodeVerified);
			setIsVerify(true);
		} catch (err) {
			if (!err?.response) {
				notify('error', 'No Server Response');
			} else if (err.response?.status === 401) {
				notify('error', 'Code does not match');
			} else {
				notify('error', 'Failed');
			}
		}
	};

	const changePassword = async e => {
		e.preventDefault();
		try {
			if (password === passwordAgin) {
				const headers = { Authorization: `Bearer ${tokenConfirmationCodeVerified}` };
				console.log(headers);
				const response = await axios.put(
					'/users/editPassword/oneTimeCode',
					{ password },
					{ headers }
				);
				if (response.status === 200) {
					notify('success', 'Your password has been reset');
					setTokenConfirmationCodeVerified(null);
					setTimeout(() => {
						nav('/');
					}, 3000);
				}
			}
		} catch (err) {
			if (!err?.response) {
				notify('error', 'No Server Response');
			} else if (err.response.status === 403) {
				setIsVerify(false);
			} else {
				notify('error', 'edit password Failed');
			}
		}
	};

	const reverseSecondsToMinutes = seconds => {
		return (
			'0' +
			Math.floor(seconds / 60) +
			':' +
			(seconds % 60 < 10 ? '0' : '') +
			(seconds % 60).toString()
		);
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

	return !isVerify ? (
		<Form as='form' SubmitHandler={handleVerifyCode}>
			{!isCodeSent && (
				<>
					<h6>One-Time Code Verification</h6>
					<InputField
						label={'please enter your email'}
						name='email'
						onChange={e => {
							setEmail(e.target.value);
						}}
					/>
					<ToastContainer />
					<ReCAPTCHA
						sitekey='6LdZHoglAAAAAAKOoJmp6GdSxZ_qub6x1ZzkuH9M'
						size='invisible'
						ref={reRef}
					/>
					<InputButton
						clickHandler={handleSendCode}
						type='button'
						text={isSending ? 'Sending...' : 'Send Code'}
						border={'full'}
					/>
				</>
			)}

			{isCodeSent && (
				<>
					<h6>A one-time code has been sent to your email.</h6>
					<h6>Please enter the code below:</h6>
					<InputField
						label={'code'}
						name='number'
						onChange={e => {
							setCode(e.target.value);
						}}
					/>
					<InputButton text='Verify Code' border={'full'} />
					<h6>The code will expire in {reverseSecondsToMinutes(timer)} seconds.</h6>
					<h6 style={{ fontSize: '0.5em' }}>
						Please wait until the timer finishes before requesting a new code.
					</h6>
					<ToastContainer />
				</>
			)}
		</Form>
	) : (
		<Form as='form' SubmitHandler={changePassword}>
			<InputField
				label={'please enter your new password'}
				type={'password'}
				// name={'password'}
				value={password}
				onChange={e => {
					setPassword(e.target.value);
				}}
			/>
			<InputField
				label={'please enter your password agin'}
				type={'password'}
				// name={'password'}
				value={passwordAgin}
				onChange={e => {
					setPasswordAgin(e.target.value);
				}}
			/>
			<ToastContainer />
			<InputButton type='submit' text='submit' />
		</Form>
	);
}

export default ForgotPassword;
