import Sidebar from "../components/Client/Sidebar";
import { Outlet } from "react-router-dom";
import "./ClientLayout.css";

const ClientLayout = () => {
  return (
    <div className="client-layout">
      <Sidebar />

      <main className="client-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;