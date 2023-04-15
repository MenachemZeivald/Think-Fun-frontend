import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../../hooks/useAxiosPrivet';
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

import Form from './Form';
import InputButton from './InputButton';
import InputField from './InputField';
import InputFile from './InputFile';
import ProfilePic from './ProfilePic';

import DEFAULT_PROFILE_IMG from '../../assets/avataaars.png';
import { BASE_URL } from '../../api/axios';

import axios from 'axios';

export default function AccountForm() {
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const controller = new AbortController();
  const logout = useLogout();
  const nav = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();
  const [errMsg, setErrMsg] = useState(''); // TODO: merge with err
  const [info, setInfo] = useState({});
  const [userDetails, setUserDetails] = useState({ name: 'My name', email: 'lol@LOL.com' });
  const [passwordData, setPasswordData] = useState({
    password: '',
    passwordAgain: '',
    oldPassword: '',
  });

  const [selectedImage, setSelectedImage] = useState(null);
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

  const blurHandler = (e) => {
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

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(event);
    if (!Object.values(formErr).reduce((a, b) => a + b, '')) {
      if (userDetails.name || userDetails.email) {
        // TODO: check if user change details, send email and name anyway
        console.log(userDetails);
        sendUserDataToServer(userDetails);
      }
      if (Object.values(passwordData).every((field) => field !== '')) {
        let { passwordAgain, ...dataToSend } = passwordData;
        console.log(dataToSend);
        sendPasswordDataToServer(dataToSend);
      }
    }
  };

  useEffect(() => {
    myInfoInit();
  }, []);

  const myInfoInit = async () => {
    try {
      let url = '/users/myInfo';
      const response = await axiosPrivate.get(url, {
        signal: controller.signal,
      });
      console.log(response.data);
      setInfo(response.data);
    } catch (error) {
      console.log(error);
      nav('/login', { state: { from: location }, replace: true });
    }
  };

  const sendUserDataToServer = async (bodyData) => {
    try {
      let url = '/users/';
      const response = await axiosPrivate.put(url, bodyData, {
        signal: controller.signal,
      });
      if (response.data.modifiedCount) {
        console.log('item edited');
      }
    } catch (error) {
      console.log('You not change nothing');
      nav('/login', { state: { from: location }, replace: true });
    }
  };

  const sendPasswordDataToServer = async (bodyData) => {
    try {
      let url = '/users/editPassword';
      const response = await axiosPrivate.put(url, bodyData, {
        signal: controller.signal,
      });
      if (response.data.modifiedCount) {
        console.log('item edited');
      }
    } catch (error) {
      console.log('You not change nothing');
      nav('/login', { state: { from: location }, replace: true });
    }
  };

  const sendImageToServer = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const url = info.img_url ? '/users/editImage' : '/users/uploadImage';
      const headers = { Authorization: `Bearer ${auth.accessToken}` };
      const response = await axios.post(BASE_URL + url, formData, { headers });
      if (response.data.modifiedCount === 1) myInfoInit();
    } catch (error) {
      console.error(error.response);
      if (error.response.status === 403) {
        const url = info.img_url ? '/users/editImage' : '/users/uploadImage';
        const accessToken = await refresh();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const response = await axios.post(BASE_URL + url, formData, { headers });
        if (response.data.modifiedCount === 1) myInfoInit();
        console.log(response.data);
      }
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await axiosPrivate.delete('/users/', {
        signal: controller.signal,
      });
      if (response.data.deletedCount) {
        alert('Your account has been successfully deleted');
        nav('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    await logout();
    nav('/');
  };

  // TODO: add info to placeholder
  // TODO: design loader
  return !info._id ? (
    <img src='https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700' />
  ) : (
    <Form as='form' SubmitHandler={submitHandler} accountFormStyle={true}>
      <ProfilePic src={info.img_url ? BASE_URL + '/' + info.img_url : DEFAULT_PROFILE_IMG} />
      <h1>MY ACCOUNT</h1>

      <InputField label={'change your name'} name={'name'} placeholder={info?.name} err={formErr.name} flexRow={true} onBlur={blurHandler} />
      <InputField label={'change your email'} name={'email'} placeholder={info?.email} err={formErr.email} flexRow={true} onBlur={blurHandler} />
      <InputFile onChange={sendImageToServer} btnText={'update profile photo'} />
      {expandChangePasswordArea || <InputButton clickHandler={() => setExpandChangePasswordArea(true)} text='change password' border='full' />}

      {expandChangePasswordArea && (
        <>
          <InputField label={'your old password'} type={'password'} name={'oldPassword'} err={formErr.oldPassword} flexRow={true} onBlur={blurHandler} />
          <InputField label={'new password'} type={'password'} name={'password'} err={formErr.password} flexRow={true} onBlur={blurHandler} />
          <InputField label={'reenter your password'} as={'input'} type={'password'} name={'passwordAgain'} err={formErr.passwordAgain} flexRow={true} onBlur={blurHandler} />
        </>
      )}

      <InputButton type='submit' text='submit' />

      <button style={{ background: '#ff6392', color: '#ffe45e', border: 'none', borderRadius: '4px', height: '28px' }} onClick={signOut}>
        logout
      </button>

      <button
        style={{ background: 'red', color: 'white', border: 'none', borderRadius: '4px', height: '32px', marginTop: '28px' }}
        onClick={() => window.confirm('Are you sure?') && deleteAccount()}
      >
        delete account
      </button>
    </Form>
  );
}
