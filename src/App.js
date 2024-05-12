import { BrowserRouter, Route, Routes } from "react-router-dom";

import Error from "./components/Error";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
