import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activeSection, setActiveSection] = useState("home");

  const isActive = (path) => currentPath === path;

  const scrollToSection = (sectionId) => {
    if (!sectionId || sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      const offset = 90;
      const top = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleNavClick = (event, sectionId) => {
    event.preventDefault();
    setActiveSection(sectionId);

    if (currentPath !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 120);
      return;
    }

    scrollToSection(sectionId);
  };

  useEffect(() => {
    if (currentPath !== "/") {
      setActiveSection("home");
      return;
    }

    const updateActiveSection = () => {
      const offset = 180;
      const scrollPosition = window.scrollY + offset;
      const sectionIds = ["home", "services", "about", "team", "contact"];
      let currentId = "home";

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (section) {
          const sectionTop = section.offsetTop;

          if (scrollPosition >= sectionTop) {
            currentId = sectionId;
          }
        }
      });

      setActiveSection(currentId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [currentPath]);

  const isSectionActive = (sectionId) => currentPath === "/" && activeSection === sectionId;

  return (
    <header className="shadow-sm sticky-top bg-white">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div className="container">

          <Link 
            className="navbar-brand fw-bold fs-3 text-dark me-5"
            to="/"
          >
            <i className="bi bi-heart-pulse-fill logo-color me-2"></i>VetLumen
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav mx-auto gap-4">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isSectionActive("home") ? "active-link" : "text-secondary"}`}
                  to="/"
                  onClick={(event) => handleNavClick(event, "home")}
                >
                  Início
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isSectionActive("services") ? "active-link" : "text-secondary"}`}
                  to="/"
                  onClick={(event) => handleNavClick(event, "services")}
                >
                  Serviços
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isSectionActive("about") ? "active-link" : "text-secondary"}`}
                  to="/"
                  onClick={(event) => handleNavClick(event, "about")}
                >
                  Sobre Nós
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isSectionActive("team") ? "active-link" : "text-secondary"}`}
                  to="/"
                  onClick={(event) => handleNavClick(event, "team")}
                >
                  Equipa
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isSectionActive("contact") ? "active-link" : "text-secondary"}`}
                  to="/"
                  onClick={(event) => handleNavClick(event, "contact")}
                >
                  Contactos
                </Link>
              </li>
            </ul>

            <div className="d-flex gap-2 ms-lg-4">
              <Link
                className="btn btn-header-login btn-md rounded-pill px-4 py-2 fw-semibold"
                to="/login"
              >
                Entrar
              </Link>
            
              <Link
                className="btn btn-register btn-md rounded-pill px-4 py-2 text-white fw-semibold shadow-sm"
                to="/register"
              >
                Registar
              </Link>
            </div>
          </div>

        </div>
      </nav>

    </header>
  );
}

export default Header;