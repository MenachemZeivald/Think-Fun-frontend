import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setAuth, persist, setPersist } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [errMsg, setErrMsg] = useState("");

  const onSub = async (bodyData) => {
    try {
      const response = await axios.post("/users/login", bodyData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const accessToken = response.data?.accessToken;
      console.log(response.data);
      setAuth({
        name: response.data.name,
        role: response.data.role,
        accessToken,
      });
      nav(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Email or Password not much");
      } else {
        setErrMsg("Login Failed");
      }
      console.log(errMsg);
    }
  };
  const togglePersist = () =>{
    setPersist(prev => !prev)
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="container">
      <h1 className="text-center">Login to admin</h1>
      <form onSubmit={handleSubmit(onSub)} className="col-md-6 mx-auto p-2">
        <label>Email:</label>
        <input
          {...register("email", {
            required: true,
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          })}
          type="text"
          className="form-control"
        />
        {errors.email && <div className="text-danger">Enter valid email</div>}
        <label>Password:</label>
        <input {...register("password", { required: true, minLength: 3 })} type="text" className="form-control" />
        {errors.password && <div className="text-danger">Enter valid password (min 3 chars)</div>}
        <div className="mt-4">
          <button className="btn btn-dark">Log in</button>
        </div>
        <label htmlFor="persist">Trust this Device </label>
        <input type="checkbox" className="form-check-input ml-3"  id="persist" onChange={togglePersist} checked={persist} />
      </form>
    </div>
  );
}
