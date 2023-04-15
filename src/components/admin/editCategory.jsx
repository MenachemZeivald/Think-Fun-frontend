import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivet";


export default function EditCategory() {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const nav = useNavigate();
  const location = useLocation()
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const params = useParams();

  const [info, setInfo] = useState({});

  useEffect(() => {
    categoriesInit();
  }, []);

  const categoriesInit = async () => {
    try {
      let url = "/categories/single/" + params["id"];
      const response = await axiosPrivate.get(url, {
        signal: controller.signal,
      });
      console.log(response.data);
      setInfo(response.data);
    } catch (error) {
      console.log(error);
      nav("/login", { state: { from: location }, replace: true });
    }
  };

  const editCategory = async (bodyData) => {
    try {
      let url = "/categories/" + params["id"];
      const response = await axiosPrivate.put(url, bodyData,{
        signal: controller.signal,
      });
      if (response.data.modifiedCount) {
        console.log("item edited");
        nav("/admin/categories");
      }
    } catch (error) {
      console.log("You not change nothing");
      nav("/login", { state: { from: location }, replace: true });
    }
  };

  const onSub = (bodyData) => {
    console.log(bodyData);
    editCategory(bodyData);
  };

  return (
    <div className="categories-container">
      <div className="center-container">
        <div className="text-container">
          <h1 className="display-5">Edit category</h1>
        </div>
        <div className="form-container">
          {!info._id ? (
            <img src='https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!bw700' />
          ) : (
            <form onSubmit={handleSubmit(onSub)} id="id_form" className="col-md-12 shadow p-2">
              <label>name</label>
              <input {...register("name", { minLength: 2, required: true })} className="form-control" type="text" defaultValue={info.name} />
              {errors.name && <div className="text-danger">* Enter valid name (min 2 chars)</div>}
              <label>category_id</label>
              <input {...register("category_id", { minLength: 2, required: true })} className="form-control" type="hidden" defaultValue={info.category_id} />
              <input disabled {...register("category_id", { minLength: 2, required: true })} className="form-control" type="text" defaultValue={info.category_id} />
              {errors.category_id && <div className="text-danger">Enter valid category_id (min 2 chars)</div>}
              <div className="button-container">
                <button className="btn add-new">Update</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
