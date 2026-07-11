import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PetHistory.css";
import api from "../../services/api";

const formatDate = (value) => {
  if (!value) return "Não disponível";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-PT");
};

const PetHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/medical-records/pet/${id}`);
        setRecords(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Não foi possível carregar o histórico médico.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  return (
    <main className="history-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
        Voltar
      </button>

      <div className="history-header">
        <div>
          <h1>Histórico Médico</h1>
          <p>Consultas e registos clínicos do animal</p>
        </div>
      </div>

      {loading && <p className="pets-empty">A carregar histórico...</p>}
      {!loading && error && <p className="pets-empty">{error}</p>}

      {!loading && !error && records.length === 0 && (
        <p className="pets-empty">Nenhum registo médico encontrado.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="history-list">
          {records.map((record) => (
            <div className="record-card" key={record.id_record}>
              <div className="record-date">
                <i className="bi bi-calendar3"></i>
                <span>{formatDate(record.data_registo)}</span>
              </div>

              <div className="record-info">
                <h3>{record.diagnostico}</h3>

                <div className="record-grid">
                  <div>
                    <strong>Sintomas</strong>
                    <p>{record.sintomas || "Não registados"}</p>
                  </div>

                  <div>
                    <strong>Tratamento</strong>
                    <p>{record.tratamento_receitado || "Não registado"}</p>
                  </div>

                  <div>
                    <strong>Peso</strong>
                    <p>{record.peso ? `${record.peso}kg` : "Não registado"}</p>
                  </div>

                  <div>
                    <strong>Temperatura</strong>
                    <p>{record.temperatura ? `${record.temperatura} ºC` : "Não registada"}</p>
                  </div>

                  <div>
                    <strong>Frequência Cardíaca</strong>
                    <p>{record.frequencia_cardiaca ? `${record.frequencia_cardiaca} bpm` : "Não registada"}</p>
                  </div>

                  <div>
                    <strong>Recomendações</strong>
                    <p>{record.recomendacoes || "Sem recomendações"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default PetHistory;