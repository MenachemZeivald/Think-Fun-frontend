import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import Form from './Form';
import InputField from './InputField';
import InputButton from './InputButton';
import axios from '../../api/axios';

export default function ForgotPassword() {
  const reRef = useRef();
  const [email, setEmail] = useState('');
  const [oneTimeCode, setOneTimeCode] = useState();
  const [forgotPasswordToken, setForgotPasswordToken] = useState('');
  const [tokenConfirmationCodeVerified, setTokenConfirmationCodeVerified] = useState('');
  const [isSend, setIsSend] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  const [err, setErr] = useState({
    email: '',
    password: '',
    general: '',
  });
console.log(email);
  const sentEmail = async (e) => {
    e.preventDefault();
    const recaptchaToken = await reRef.current.executeAsync();
    reRef.current.reset();
    console.log('send email: ' ,email);
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
      setIsSend(true);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const verifyOneTimeCode = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${forgotPasswordToken}` };
      const response = await axios.post( '/users/verifyOneTimeCode', { oneTimeCode }, { headers });
      console.log(response.data);
      setTokenConfirmationCodeVerified(response.data.setTokenConfirmationCodeVerified);
      setIsSend(true);
    } catch (error) {
      console.log(error.response.data);
    }
  };

//   const changePassword = async (e) => {
//     e.preventDefault();
//     try {
//       const headers = { Authorization: `Bearer ${tokenConfirmationCodeVerified}` };
//       const response = await axios.put( '/users/editPassword/oneTimeCode', formData, { headers });
//       console.log(response.data);
//       setIsSend(true);
//     } catch (error) {
//       console.log(error.response.data);
//     }
//   };

  return !isVerify ? (
    <Form as='form' SubmitHandler={verifyOneTimeCode}>
      <InputField
        label={'please enter your email'}
        name='email'
        err={err.email}
        onBlur={(e) => {
          setEmail(e.target.value);
        }}
      />
      <InputButton clickHandler={sentEmail} type='button'  text='send one time code' />

      <InputField
        label={'verify one time code'}
        name='number'
        //TO DO
        // {!isSend ? disabled : ''}
        err={err.email}
        onBlur={(e) => {
          setOneTimeCode(e.target.value);
        }}
      />
      <InputButton type='submit' text='verify' />
      <ReCAPTCHA sitekey='6LdZHoglAAAAAAKOoJmp6GdSxZ_qub6x1ZzkuH9M' size='invisible' ref={reRef} />
    </Form>
  ) : (
    <Form as='form'>
      {/* <InputField label={'please enter your new password'} type={'password'} name={'password'} err={err.password} onBlur={blurHandler} />
      <InputField label={'please enter your password'} type={'password'} name={'passwordAgain'} err={err.passwordAgain} onBlur={blurHandler} /> */}
      <InputButton type='submit' text='submit' />
    </Form>
  );
}
