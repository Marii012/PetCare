import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";

import ClientLayout from "./layouts/ClientLayout";
import Dashboard from "./pages/client/DashboardClient";
import Pets from "./pages/client/Pets";
import Appointments from "./pages/client/Appointments";
import MedicalRecord from "./pages/client/MedicalRecord";
import Invoices from "./pages/client/Invoices";
import PetVaccines from "./pages/client/PetVaccines";
import PetHistory from "./pages/client/PetHistory";
import PetDetails from "./pages/client/PetDetails";
import Profile from "./pages/client/Profile";

function App() {
  const location = useLocation();

  const hideLayout =
  location.pathname.startsWith("/client") ||
  location.pathname === "/login" ||
  location.pathname === "/register";

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
          <Route path="/client/appointments" element={<Appointments />} />
          <Route path="/client/medical-records" element={<MedicalRecord />} />
          <Route path="/client/invoices" element={<Invoices />} />
          <Route path="/client/pets/:id" element={<PetDetails />} />
          <Route path="/client/pets/:id/history" element={<PetHistory />} />
          <Route path="/client/pets/:id/vaccines" element={<PetVaccines />} />
          <Route path="/client/profile" element={<Profile />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;