import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");

      // Limpar dados da sessão
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
    }
  };

  return (
    <aside className="sidebar-container d-flex flex-column justify-content-between p-4">
      <div>
        {/* Perfil */}
        <div className="profile-section mb-5">
          <div className="profile-icon">
            <i className="bi bi-person-fill fs-1"></i>
          </div>
          {user && (
            <div className="profile-info">
              <h6>Olá, {user.first_name}</h6>
              <span>Cliente</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="nav flex-column gap-2">
          <NavLink
            to="/client/dashboard"
            className={({ isActive }) =>
              `custom-nav-link d-flex align-items-center ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className="bi bi-grid-1x2-fill me-3"></i>
            Dashboard
          </NavLink>

          <NavLink
            to="/client/appointments"
            className={({ isActive }) =>
              `custom-nav-link d-flex align-items-center ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className="bi bi-calendar-event me-3"></i>
            Consultas
          </NavLink>

          <NavLink
            to="/client/pets"
            className={({ isActive }) =>
              `custom-nav-link d-flex align-items-center ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className="bi bi-heart me-3"></i>
            Os Meus Animais
          </NavLink>

          <NavLink
            to="/client/profile"
            className={({ isActive }) =>
              `custom-nav-link d-flex align-items-center ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className="bi bi-person me-3"></i>
            Perfil
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-3 border-top">
        <button
          onClick={handleLogout}
          className="logout-btn d-flex align-items-center w-100"
        >
          <i className="bi bi-box-arrow-right me-3"></i>
          Terminar Sessão
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;