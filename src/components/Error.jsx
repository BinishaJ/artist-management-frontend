import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, [navigate]);
  return <h1>Error 404! Not Found!</h1>;
};

export default Error;
