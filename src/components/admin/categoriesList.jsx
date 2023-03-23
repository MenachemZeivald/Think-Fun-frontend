import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivet";

export default function CategoriesList() {
  const nav = useNavigate();
  const location = useLocation()
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

  const [arr, setArr] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getCategories();
  }, [search]);

  const getCategories = async () => {
    try {
      const response = await axiosPrivate.get(`/categories/?s=${search}`, {
        signal: controller.signal,
      });
      // console.log(response.data);
      setArr(response.data);
    } catch (error) {
      console.log(error);
      nav("/login", { state: { from: location }, replace: true });
    }
  };

  const deletion = async (idDel) => {
    try {
      let url = "/categories/" + idDel;
      const response = await axiosPrivate.delete(url, {
        signal: controller.signal,
      });
      if (response.data.deletedCount) {
        console.log("Category delete");
        getCategories();
      }
    } catch (error) {
      console.log(error);
      nav("/login", { state: { from: location }, replace: true });
    }
  };

  const editing = (idEdit) => {
    nav("/admin/categories/edit/" + idEdit);
  };

  return (
    <div className="categories-container">
      <div className="center-container">
        <div className="text-container">
          <h1 className="display-6">List of categories:</h1>
        </div>
        <div className="sort-container">
        <div className="search-container">
            <input placeholder="search..." className="form-control search" type="text" onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>category_id</th>
                <th>del/edit</th>
              </tr>
            </thead>
            <tbody>
              {arr.map((item, i) => {
                return (
                  <tr className="tr" key={item._id}>
                    <td>{i + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category_id}</td>
                    <td className="del-edit">
                      <button className="btn del-btn" onClick={() => window.confirm("Delete item?") && deletion(item._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button className="btn  edit-btn ms-2" onClick={() => editing(item._id)}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="button-container">
          <Link className="btn add-new" to="/admin/categories/new">
            add new category
          </Link>
        </div>
      </div>
    </div>
  );
}
