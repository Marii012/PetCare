import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PetVaccines.css";
import api from "../../services/api";

const formatDate = (value) => {
  if (!value) return "Não disponível";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-PT");
};

const PetVaccines = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/vaccines/pet/${id}`);
        setVaccines(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Não foi possível carregar as vacinas.");
      } finally {
        setLoading(false);
      }
    };

    fetchVaccines();
  }, [id]);

  return (
    <main className="vaccines-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
        Voltar
      </button>

      <div className="vaccines-header">
        <div>
          <h1>Vacinas do Animal</h1>
          <p>Lista de vacinas registadas</p>
        </div>
      </div>

      {loading && <p className="pets-empty">A carregar vacinas...</p>}
      {!loading && error && <p className="pets-empty">{error}</p>}

      {!loading && !error && vaccines.length === 0 && (
        <p className="pets-empty">Nenhuma vacina encontrada.</p>
      )}

      {!loading && !error && vaccines.length > 0 && (
        <div className="vaccines-list">
          {vaccines.map((vaccine) => (
            <div className="vaccine-card" key={vaccine.id_vaccine}>
              <div className="vaccine-icon">
                <i className="bi bi-capsule"></i>
              </div>

              <div className="vaccine-info">
                <h3>{vaccine.nome_vacina}</h3>
                <p>
                  Aplicada em: <strong>{formatDate(vaccine.data_administracao)}</strong>
                </p>
                <p>
                  Próxima dose: <strong>{formatDate(vaccine.proxima_dose)}</strong>
                </p>

                {vaccine.fabricante && <p>Fabricante: {vaccine.fabricante}</p>}
                {vaccine.lote_vacina && <p>Lote: {vaccine.lote_vacina}</p>}
                {vaccine.observacoes && <p>Observações: {vaccine.observacoes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default PetVaccines;