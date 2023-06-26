import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import Form from './Form';
import ProfilePic from './ProfilePic';
import InputField from './InputField';
import InputFile from './InputFile';

import InputButton from './InputButton';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import { useRef } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUpForm({ toggle }) {
  const { setAuth } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const reRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    recaptchaToken: '',
    img_url: '',
  });

  const [err, setErr] = useState({
    name: '',
    email: '',
    password: '',
    passwordAgain: '',
    general: '',
  });
  const [selectedImage, setSelectedImage] = useState();

  const blurHandler = (e) => {
    const { name, value } = e.target;
    const errorMessage = inputErrorHandler(name, value);
	
    setErr({ ...err, [name]: errorMessage });
    setFormData({ ...formData, [name]: value.trim() });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(event);
    if (!Object.values(err).reduce((a, b) => a + b, '')) {
      let { passwordAgain, ...dataToSend } = formData;
      console.log('good form', dataToSend);
      sendDataToServer(dataToSend);
    }
  };

  const sendImageToServer = async (accessToken) => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    console.log('sent image');
    try {
      const url = '/users/uploadImage';
      const headers = { Authorization: `Bearer ${accessToken}` };
      await axios.post(url, formData, { headers });
      // const response = await axios.post(url, formData, { headers });
      // console.log(response.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  const sendDataToServer = async (data) => {
    data.recaptchaToken = await reRef.current.executeAsync();
    reRef.current.reset();
    console.log('sent data', data);
    if (!selectedImage) data.img_url = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${data.name}`;
    try {
      const response = await axios.post('/users/register', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (selectedImage) sendImageToServer(response.data?.accessToken);
      // console.log(selectedImage);
      const { name, role, img_url } = response.data;
      const accessToken = response.data?.accessToken;
      // console.log(response.data);
      setAuth({
        name,
        role,
        profilePic: img_url,
        accessToken,
      });
      notify('success', 'success');
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
        return value !== formData.password ? 'Passwords should match' : '';
      default:
        return '';
    }
  };

  function serverErrorHandler({ response }) {
    const errMsg = !response
      ? notify('error', 'No Server Response')
      : response.status === 400
      ? notify('error', 'Missing info')
      : response?.status === 401
      ? notify('error', 'Email already, try login')
      : notify('error', 'Sign up Failed');
    setErr({ ...err, general: errMsg });
  }

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

  return (
    <Form SubmitHandler={submitHandler}>
      <ProfilePic src={selectedImage ? URL.createObjectURL(selectedImage) : `https://api.dicebear.com/6.x/pixel-art/svg?seed=${formData.name}`} />
      <h1>SIGN UP</h1>

      <InputField label={'please enter your name'} name={'name'} err={err.name} onChange={blurHandler} />
      <InputField label={'please enter your email'} name={'email'} err={err.email} onChange={blurHandler} />
      <InputFile
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
        btnText={'upload profile photo'}
      />
      <InputField label={'please enter your password'} type={'password'} name={'password'} err={err.password} onBlur={blurHandler} />
      <InputField label={'please enter your password'} type={'password'} name={'passwordAgain'} err={err.passwordAgain} onBlur={blurHandler} />
      <span>{Object.values(err).reduce((a, b) => a + ' ' + b, '')}</span>
      <InputButton type='submit' text='submit' />
      <InputButton clickHandler={toggle} text='LOGIN' border='full' />
      <ReCAPTCHA sitekey='6LdZHoglAAAAAAKOoJmp6GdSxZ_qub6x1ZzkuH9M' size='invisible' ref={reRef} />
      <ToastContainer />
    </Form>
  );
}
