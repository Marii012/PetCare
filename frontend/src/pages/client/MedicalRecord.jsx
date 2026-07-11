import React, { useState } from "react";
import Select from "react-select";
import "./MedicalRecord.css";

const records = [
  {
    id: 1,
    pet: "Max",
    diagnosis: "Otite",
    date: "15 Julho 2026",
    vet: "Dr. João Martins",
    weight: "18.5 kg",
    temperature: "38.4 ºC",
    treatment: "Antibiótico durante 7 dias",
    recommendations: "Limpeza semanal dos ouvidos.",
  },
  {
    id: 2,
    pet: "Luna",
    diagnosis: "Vacinação Anual",
    date: "02 Julho 2026",
    vet: "Dra. Ana Silva",
    weight: "4.2 kg",
    temperature: "38.2 ºC",
    treatment: "Vacina administrada.",
    recommendations: "Próxima dose daqui a 12 meses.",
  },
  {
    id: 3,
    pet: "Max",
    diagnosis: "Consulta Geral",
    date: "20 Junho 2026",
    vet: "Dr. Pedro Costa",
    weight: "18 kg",
    temperature: "38.5 ºC",
    treatment: "Sem tratamento.",
    recommendations: "Continuar alimentação habitual.",
  },
];

const options = [
  { value: "all", label: "Todos os animais" },
  { value: "Max", label: "Max" },
  { value: "Luna", label: "Luna" },
];

const MedicalHistory = () => {
  const [search, setSearch] = useState("");
  const [pet, setPet] = useState(options[0]);

  const filtered = records.filter((record) => {
    const searchMatch =
      record.pet.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase());

    const petMatch = pet.value === "all" || record.pet === pet.value;

    return searchMatch && petMatch;
  });

  return (
    <main className="medical-history-container">

      <div className="medical-header">

        <div>
          <h1>Histórico Clínico</h1>
          <p>Consulta todos os registos médicos dos teus animais.</p>
        </div>

      </div>

      <div className="medical-stats">

        <div className="medical-stat-card">
          <i className="bi bi-file-medical"></i>
          <div>
            <h3>{records.length}</h3>
            <p>Registos</p>
          </div>
        </div>

        <div className="medical-stat-card">
          <i className="bi bi-heart-pulse"></i>
          <div>
            <h3>{options.length - 1}</h3>
            <p>Animais</p>
          </div>
        </div>

      </div>

      <div className="medical-filters">

        <div className="medical-search">

          <i className="bi bi-search"></i>

          <input
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <Select
          options={options}
          value={pet}
          onChange={setPet}
          className="medical-select"
          classNamePrefix="medical-select"
          isSearchable={false}
        />

      </div>

      <div className="medical-list">

        {filtered.map((record) => (

          <div className="medical-card" key={record.id}>

            <div className="medical-top">

              <div>

                <h3>{record.pet}</h3>

                <span>{record.diagnosis}</span>

              </div>

              <div className="medical-date">

                <i className="bi bi-calendar-event"></i>

                {record.date}

              </div>

            </div>

            <div className="medical-info">

              <p><strong>Veterinário:</strong> {record.vet}</p>

              <p><strong>Peso:</strong> {record.weight}</p>

              <p><strong>Temperatura:</strong> {record.temperature}</p>

              <p><strong>Tratamento:</strong> {record.treatment}</p>

              <p><strong>Recomendações:</strong> {record.recommendations}</p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
};

export default MedicalHistory;