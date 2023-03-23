import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivet";

export default function EditMemoryGame() {
  const {register, handleSubmit, formState: { errors }} = useForm();
  const nav = useNavigate();
  const location = useLocation()
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const controller = new AbortController();

  const [info, setInfo] = useState({});

  useEffect(() => {
    memoryGameInit();
  }, []);

  const memoryGameInit = async () => {
    try {
      let url = "/games/memoryGame/single/" + params["id"];
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

  const editMemoryGame = async (bodyData) => {
    try {
      let url = "/games/memoryGame/" + params["id"];
      const response = await axiosPrivate.put(url, bodyData, {
        signal: controller.signal,
      });
      if (response.data.modifiedCount) {
        console.log("item edited");
        nav(-1);
      }
    } catch (error) {
      console.log("You not change nothing");
      nav("/login", { state: { from: location }, replace: true });
    }
  };

  const onSub = (bodyData) => {
    console.log(bodyData);
    editMemoryGame(bodyData);
  };

  return (
    <div className="categories-container">
      <div className="center-container">
        <div className="text-container">
          <h1 className="display-5">Edit category</h1>
        </div>
        <div className="form-container">
          {!info._id ? (
            <img src="https://media.tenor.com/FBeNVFjn-EkAAAAC/ben-redblock-loading.gif" />
          ) : (
            <form onSubmit={handleSubmit(onSub)} id="id_form" className="col-md-12 shadow p-2">
              <label>description</label>
              <input {...register("description", { minLength: 2, required: true })} className="form-control " type="text" defaultValue={info.description} />
              {errors.description && <div className="text-danger">* Enter valid description (min 2 chars)</div>}
              <label>img_url</label>
              <input {...register("img_url", { minLength: 2, required: true })} className="form-control " type="text" defaultValue={info.img_url} />
              {errors.img_url && <div className="text-danger">* Enter valid img_url (min 2 chars)</div>}
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
