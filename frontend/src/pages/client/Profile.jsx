import React from "react";
import "./Profile.css";

const user = {
  firstName: "João",
  lastName: "Silva",
  email: "joao@email.pt",
  phone: "912345678",
  createdAt: "12 Janeiro 2026",
  photo:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
};

const Profile = () => {
  return (
    <main className="profile-container">

      <div className="profile-header">

        <div>
          <h1>O Meu Perfil</h1>
          <p>Consulta e atualiza os teus dados pessoais.</p>
        </div>

        <button className="edit-profile-btn">
          <i className="bi bi-pencil-square"></i>
          Editar Perfil
        </button>

      </div>

      <div className="profile-card">

        <div className="profile-avatar-section">

          <img
            src={user.photo}
            alt="Perfil"
            className="profile-avatar"
          />

          <h2>
            {user.firstName} {user.lastName}
          </h2>

          <span>Cliente</span>

        </div>

        <div className="profile-details">

          <div className="profile-item">
            <label>Nome</label>
            <p>{user.firstName} {user.lastName}</p>
          </div>

          <div className="profile-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="profile-item">
            <label>Telefone</label>
            <p>{user.phone}</p>
          </div>

          <div className="profile-item">
            <label>Membro desde</label>
            <p>{user.createdAt}</p>
          </div>

        </div>

      </div>

      <div className="profile-security">

        <h3>Segurança</h3>

        <button className="password-btn">
          <i className="bi bi-shield-lock"></i>
          Alterar Palavra-passe
        </button>

      </div>

    </main>
  );
};

export default Profile;