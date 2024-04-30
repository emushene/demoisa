import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs, familyInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";
import { Add } from "@mui/icons-material";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route index element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/users">
            <Route index element={<RequireAuth><List /></RequireAuth>} />
            {/* Add the route configuration for Single component */}
            <Route path=":id" element={<RequireAuth><Single /></RequireAuth>} />
            <Route
              path="new"
              element={<RequireAuth><New inputs={userInputs} title="Add New User" /></RequireAuth>}
              // path="add"
              // element={<RequireAuth><Add inputs={familyInputs} title="Add New Cover" /></RequireAuth>}
            />
          </Route>
          <Route path="/products">
            <Route index element={<List />} />
            <Route path=":productId" element={<Single />} />
            <Route
              path="new"
              element={<New inputs={productInputs} title="Add New Product" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
