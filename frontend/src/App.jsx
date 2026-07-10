import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import ClientLayout from "./layouts/ClientLayout";
import Dashboard from "./pages/client/DashboardClient";
import Pets from "./pages/client/Pets";

function App() {
  const location = useLocation();

  const hideLayout = ["/login", "/register", "/client/dashboard", "/client/pets"  ].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Cliente */}
        <Route element={<ClientLayout />}>
          <Route path="/client/dashboard" element={<Dashboard />} />
          <Route path="/client/pets" element={<Pets />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;