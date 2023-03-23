import { API_URL, doApiGet } from "../services/apiService";
import { useNavigate } from "react-router-dom";

function useCheckToken() {
  const nav = useNavigate();

  const doApi = async () => {
    try {
      const url = API_URL + "/users/checkToken";
      const data = await doApiGet(url);
      if (data.role != "admin") {
        nav("/admin");
      }
    } catch (error) {
      nav("/admin");
    }
  };

  doApi();

  return null;
}

export default useCheckToken;
