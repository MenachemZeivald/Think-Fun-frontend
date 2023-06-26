import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

import Form from './Form';
import InputField from './InputField';
import InputButton from './InputButton';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm({ toggle }) {
  const { setAuth, persist, setPersist } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const reRef = useRef();
  // const [errMsg, setErrMsg] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    recaptchaToken: '',
  });

  const [err, setErr] = useState({
    email: '',
    password: '',
    general: '',
  });

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  const blurHandler = (e) => {
    const { name, value } = e.target;
    let errMsg = inputErrorHandler(name, value);
    setErr({ ...err, [name]: errMsg });
    setFormData({ ...formData, [name]: value.trim() });
  };

  const SubmitHandler = (event) => {
    event.preventDefault();
    let goodForm = formData.email && formData.password && !err.email && !err.password;
    if (goodForm) {
      console.log('good form', formData);
      sendDataToServer();
    }
  };

  const sendDataToServer = async () => {
    formData.recaptchaToken = await reRef.current.executeAsync();
    reRef.current.reset();
    try {
      const response = await axios.post('/users/login', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setAuth({
        name: response.data?.name,
        role: response.data?.role,
        profilePic: response.data?.img_url,
        accessToken: response.data?.accessToken,
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
    return errMsg;
  }

  function serverErrorHandler({ response }) {
    console.log('server error', response);
    const errMsg = !response?.status
      ? 'No Server Response'
      : response.status === 400
      ? 'Missing Email or Password'
      : response.status === 401
      ? 'Email or Password not much'
      : 'Login Failed';
    setErr({ ...err, general: errMsg });
    notify('error', errMsg);
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
    <Form as='form' SubmitHandler={SubmitHandler}>
      <h1>LOGIN</h1>
      <InputField label={'please enter your email'} name='email' err={err.email} onChange={blurHandler} />
      <InputField label={'please enter your password'} type='password' name='password' err={err.password} onChange={blurHandler} />
      {/* TO DO check with Menachem */}
      {/* <a style={{ border: '2px solid var(--pink)', padding: '.2rem', borderRadius: '.5em' }}>forget password{err.email || err.password || err.general || ''}</a> */}
      <div>
        <label htmlFor='persist'>Trust this Device </label>
        <input style={{ margin: '14px 8px' }} type='checkbox' id='persist' defaultChecked={persist} onChange={() => setPersist((prev) => !prev)} />
      </div>

      <InputButton type='submit' text='submit' />
      <InputButton clickHandler={toggle} text={'SIGN UP'} border={'full'} />

      <Link to={'/forgotPassword'} style={{ color: '#4f92c5', margin: '24px 0 0 0' }}>
        forgot password
      </Link>
      <ReCAPTCHA sitekey='6LdZHoglAAAAAAKOoJmp6GdSxZ_qub6x1ZzkuH9M' size='invisible' ref={reRef} />
      <ToastContainer />
    </Form>
  );
}
