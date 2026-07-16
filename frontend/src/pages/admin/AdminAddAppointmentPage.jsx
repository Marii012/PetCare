import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./AdminMarkins.css";
import "./AdminAddAppointmentPage.css";

const statusOptions = ["Pendente", "Confirmada", "Concluída", "Cancelada"];

const getPetName = (pet) => pet?.nome || "Animal";
const getOwnerName = (user) =>
  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "Dono não identificado";
const getVetName = (user) =>
  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "Por atribuir";

const initialForm = {
  data: "",
  hora: "",
  motivo: "",
  estado: "Pendente",
  observacoes: "",
  preco_final: "",
  duracao_real: "",
  motivo_cancelamento: "",
  id_pet: "",
  id_veterinario: "",
  id_service: ""
};

const AdminAddAppointmentPage = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({ value: "Pendente", label: "Pendente" });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [petsResponse, usersResponse, servicesResponse] = await Promise.all([
          api.get("/pets"),
          api.get("/users"),
          api.get("/services")
        ]);

        setPets(petsResponse.data || []);
        setUsers(usersResponse.data || []);
        setServices(servicesResponse.data || []);
      } catch (loadError) {
        console.error("Erro ao carregar dados da marcação:", loadError);
        setError("Não foi possível carregar os dados necessários.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const usersById = useMemo(
    () => Object.fromEntries(users.map((user) => [String(user.id_user), user])),
    [users]
  );

  const vetOptions = useMemo(
    () => users.filter((user) => Number(user.id_role) === 2),
    [users]
  );

  const petOptions = useMemo(
    () =>
      pets.map((pet) => ({
        value: String(pet.id_pet),
        label: `${getPetName(pet)} - ${getOwnerName(usersById[String(pet.id_user)])}`
      })),
    [pets, usersById]
  );

  const vetSelectOptions = useMemo(
    () =>
      vetOptions.map((vet) => ({
        value: String(vet.id_user),
        label: getVetName(vet)
      })),
    [vetOptions]
  );

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: String(service.id_service),
        label: service.nome
      })),
    [services]
  );

  const statusSelectOptions = useMemo(
    () => statusOptions.map((status) => ({ value: status, label: status })),
    []
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetChange = (option) => {
    setSelectedPet(option || null);
    setForm((prev) => ({ ...prev, id_pet: option ? option.value : "" }));
  };

  const handleVetChange = (option) => {
    setSelectedVet(option || null);
    setForm((prev) => ({ ...prev, id_veterinario: option ? option.value : "" }));
  };

  const handleServiceChange = (option) => {
    setSelectedService(option || null);
    setForm((prev) => ({ ...prev, id_service: option ? option.value : "" }));
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option || { value: "Pendente", label: "Pendente" });
    setForm((prev) => ({ ...prev, estado: option ? option.value : "Pendente" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.data || !form.hora || !form.motivo.trim() || !form.id_pet || !form.id_veterinario || !form.id_service) {
      setError("Preencha data, hora, motivo, animal, veterinário e serviço.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/appointments", {
        data: form.data,
        hora: form.hora,
        motivo: form.motivo.trim(),
        estado: form.estado,
        observacoes: form.observacoes.trim(),
        preco_final: form.preco_final === "" ? null : Number(form.preco_final),
        motivo_cancelamento: form.motivo_cancelamento.trim(),
        duracao_real: form.duracao_real === "" ? null : Number(form.duracao_real),
        id_pet: Number(form.id_pet),
        id_veterinario: Number(form.id_veterinario),
        id_service: Number(form.id_service)
      });

      await Swal.fire({
        title: "Criada!",
        text: "Marcação criada com sucesso.",
        icon: "success",
        customClass: {
          popup: "vetlumen-swal-popup",
          title: "vetlumen-swal-title",
          htmlContainer: "vetlumen-swal-text",
          confirmButton: "vetlumen-swal-button"
        }
      });

      navigate("/admin/appointments");
    } catch (saveError) {
      console.error("Erro ao criar marcação:", saveError);
      setError("Não foi possível criar a marcação.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-markings dashboard-container admin-add-appointment-page">
      <header className="dashboard-header">
        <div>
          <h1>Nova marcação</h1>
          <p>Crie uma nova marcação numa página dedicada.</p>
        </div>

        <button
          type="button"
          className="dashboard-btn markings-add-btn"
          onClick={() => navigate("/admin/appointments")}
        >
          <i className="bi bi-arrow-left"></i>
          Voltar às marcações
        </button>
      </header>

      {loading ? (
        <section className="dashboard-card admin-appointment-form-card">
          <p className="admin-appointment-form-message">A carregar formulário...</p>
        </section>
      ) : (
        <section className="dashboard-card admin-appointment-form-card">
          <form className="admin-appointment-form" onSubmit={handleSubmit}>
            <label className="admin-appointment-field">
              <span>Data *</span>
              <input name="data" type="date" className="admin-appointment-input" value={form.data} onChange={handleChange} />
            </label>

            <label className="admin-appointment-field">
              <span>Hora *</span>
              <input name="hora" type="time" className="admin-appointment-input" value={form.hora} onChange={handleChange} />
            </label>

            <label className="admin-appointment-field admin-appointment-field--full">
              <span>Motivo *</span>
              <input
                name="motivo"
                className="admin-appointment-input"
                value={form.motivo}
                onChange={handleChange}
                placeholder="Motivo da consulta"
              />
            </label>

            <label className="admin-appointment-field">
              <span>Animal *</span>
              <Select
                options={petOptions}
                value={selectedPet}
                onChange={handlePetChange}
                placeholder="Selecionar animal"
                isSearchable
                isClearable
                maxMenuHeight={220}
                className="admin-appointment-select"
                classNamePrefix="admin-appointment-select"
                noOptionsMessage={() => "Sem animais"}
              />
            </label>

            <label className="admin-appointment-field">
              <span>Veterinário *</span>
              <Select
                options={vetSelectOptions}
                value={selectedVet}
                onChange={handleVetChange}
                placeholder="Selecionar veterinário"
                isSearchable
                isClearable
                maxMenuHeight={220}
                className="admin-appointment-select"
                classNamePrefix="admin-appointment-select"
                noOptionsMessage={() => "Sem veterinários"}
              />
            </label>

            <label className="admin-appointment-field">
              <span>Serviço *</span>
              <Select
                options={serviceOptions}
                value={selectedService}
                onChange={handleServiceChange}
                placeholder="Selecionar serviço"
                isSearchable
                isClearable
                maxMenuHeight={220}
                className="admin-appointment-select"
                classNamePrefix="admin-appointment-select"
                noOptionsMessage={() => "Sem serviços"}
              />
            </label>

            <label className="admin-appointment-field">
              <span>Estado</span>
              <Select
                options={statusSelectOptions}
                value={selectedStatus}
                onChange={handleStatusChange}
                placeholder="Selecionar estado"
                isSearchable
                isClearable={false}
                maxMenuHeight={220}
                className="admin-appointment-select"
                classNamePrefix="admin-appointment-select"
                noOptionsMessage={() => "Sem estados"}
              />
            </label>

            <label className="admin-appointment-field">
              <span>Preço final</span>
              <input
                name="preco_final"
                type="number"
                min="0"
                step="0.01"
                className="admin-appointment-input"
                value={form.preco_final}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label className="admin-appointment-field">
              <span>Duração real (min)</span>
              <input
                name="duracao_real"
                type="number"
                min="0"
                className="admin-appointment-input"
                value={form.duracao_real}
                onChange={handleChange}
                placeholder="Minutos"
              />
            </label>

            <label className="admin-appointment-field admin-appointment-field--full">
              <span>Observações</span>
              <textarea
                name="observacoes"
                className="admin-appointment-input admin-appointment-textarea"
                rows="3"
                value={form.observacoes}
                onChange={handleChange}
              ></textarea>
            </label>

            <label className="admin-appointment-field admin-appointment-field--full">
              <span>Motivo de cancelamento</span>
              <textarea
                name="motivo_cancelamento"
                className="admin-appointment-input admin-appointment-textarea"
                rows="2"
                value={form.motivo_cancelamento}
                onChange={handleChange}
              ></textarea>
            </label>

            {error && <p className="admin-appointment-form-error">{error}</p>}

            <div className="admin-appointment-form-actions">
              <button
                type="button"
                className="dashboard-btn admin-appointment-cancel"
                onClick={() => navigate("/admin/appointments")}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" className="dashboard-btn" disabled={saving}>
                {saving ? "A guardar..." : "Criar marcação"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
};

export default AdminAddAppointmentPage;
