import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./AdminInvoices.css";
import "./AdminAddInvoicePage.css";

const paymentOptions = ["Pago", "Pendente", "Cancelado"];

const getUserName = (user) =>
  `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email || "Utilizador";

const getPetName = (pet) => pet?.nome || "Animal";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-PT");
};

const formatTime = (value) => {
  if (!value) return "";
  if (typeof value === "string") {
    return value.includes(":") ? value.slice(0, 5) : value;
  }
  return String(value);
};

const initialForm = {
  num_fatura: "",
  data_emissao: "",
  total_bruto: "",
  total_impostos: "",
  total_liquido: "",
  estado_pagamento: "Pendente",
  id_user: "",
  id_appointment: ""
};

const AdminAddInvoicePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersResponse, appointmentsResponse, petsResponse] = await Promise.all([
          api.get("/users"),
          api.get("/appointments"),
          api.get("/pets")
        ]);

        setUsers(usersResponse.data || []);
        setAppointments(appointmentsResponse.data || []);
        setPets(petsResponse.data || []);
      } catch (loadError) {
        console.error("Erro ao carregar dados da fatura:", loadError);
        setError("Não foi possível carregar os dados necessários.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const petsById = useMemo(
    () => Object.fromEntries(pets.map((pet) => [String(pet.id_pet), pet])),
    [pets]
  );

  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        value: String(user.id_user),
        label: `${getUserName(user)} (${user.email || "-"})`
      })),
    [users]
  );

  const appointmentOptions = useMemo(() => {
    if (!form.id_user) return [];

    return appointments
      .map((item) => {
        const pet = petsById[String(item.id_pet)];
        const ownerId = pet?.id_user ? String(pet.id_user) : "";

        return {
          id: String(item.id_appointment),
          ownerId,
          label: `${getPetName(pet)} - ${formatDate(item.data)} ${formatTime(item.hora)}`
        };
      })
      .filter((item) => item.ownerId === String(form.id_user))
      .map((item) => ({ value: item.id, label: item.label }));
  }, [appointments, form.id_user, petsById]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "id_user") {
        next.id_appointment = "";
      }
      return next;
    });
  };

  const handleUserChange = (option) => {
    setSelectedUser(option || null);
    setSelectedAppointment(null);
    setForm((prev) => ({ ...prev, id_user: option ? option.value : "", id_appointment: "" }));
  };

  const handleAppointmentChange = (option) => {
    setSelectedAppointment(option || null);
    setForm((prev) => ({ ...prev, id_appointment: option ? option.value : "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.num_fatura.trim() || !form.id_user || form.total_bruto === "" || form.total_impostos === "" || form.total_liquido === "") {
      setError("Preencha número, utilizador, totais e estado.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.post("/invoices", {
        num_fatura: form.num_fatura.trim(),
        data_emissao: form.data_emissao || new Date().toISOString(),
        total_bruto: Number(form.total_bruto),
        total_impostos: Number(form.total_impostos),
        total_liquido: Number(form.total_liquido),
        estado_pagamento: form.estado_pagamento,
        id_user: Number(form.id_user),
        id_appointment: form.id_appointment ? Number(form.id_appointment) : null
      });

      await Swal.fire({
        title: "Criada!",
        text: "Fatura criada com sucesso.",
        icon: "success",
        customClass: {
          popup: "vetlumen-swal-popup",
          title: "vetlumen-swal-title",
          htmlContainer: "vetlumen-swal-text",
          confirmButton: "vetlumen-swal-button"
        }
      });

      navigate("/admin/invoices");
    } catch (saveError) {
      console.error("Erro ao criar fatura:", saveError);
      setError("Não foi possível criar a fatura.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="admin-invoices dashboard-container admin-add-invoice-page">
      <header className="dashboard-header">
        <div>
          <h1>Nova fatura</h1>
          <p>Crie uma nova fatura numa página dedicada.</p>
        </div>

        <button
          type="button"
          className="dashboard-btn invoices-add-btn"
          onClick={() => navigate("/admin/invoices")}
        >
          <i className="bi bi-arrow-left"></i>
          Voltar às faturas
        </button>
      </header>

      {loading ? (
        <section className="dashboard-card admin-invoice-form-card">
          <p className="admin-invoice-form-message">A carregar formulário...</p>
        </section>
      ) : (
        <section className="dashboard-card admin-invoice-form-card">
          <form className="admin-invoice-form" onSubmit={handleSubmit}>
            <label className="admin-invoice-field">
              <span>Número da fatura *</span>
              <input
                name="num_fatura"
                className="admin-invoice-input"
                value={form.num_fatura}
                onChange={handleChange}
                placeholder="FT-2026-001"
              />
            </label>

            <label className="admin-invoice-field">
              <span>Data de emissão</span>
              <input
                name="data_emissao"
                type="date"
                className="admin-invoice-input"
                value={form.data_emissao}
                onChange={handleChange}
              />
            </label>

            <label className="admin-invoice-field admin-invoice-field--full">
              <span>Utilizador *</span>
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={handleUserChange}
                placeholder="Selecionar utilizador"
                isSearchable
                isClearable
                maxMenuHeight={220}
                className="admin-invoice-select"
                classNamePrefix="admin-invoice-select"
                noOptionsMessage={() => "Sem utilizadores"}
              />
            </label>

            <label className="admin-invoice-field admin-invoice-field--full">
              <span>Consulta (opcional)</span>
              <Select
                options={appointmentOptions}
                value={selectedAppointment}
                onChange={handleAppointmentChange}
                placeholder="Sem consulta"
                isSearchable
                isClearable
                isDisabled={!form.id_user}
                maxMenuHeight={220}
                className="admin-invoice-select"
                classNamePrefix="admin-invoice-select"
                noOptionsMessage={() => (form.id_user ? "Sem consultas para este utilizador" : "Selecione primeiro um utilizador")}
              />
            </label>

            <label className="admin-invoice-field">
              <span>Total bruto *</span>
              <input
                name="total_bruto"
                type="number"
                min="0"
                step="0.01"
                className="admin-invoice-input"
                value={form.total_bruto}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label className="admin-invoice-field">
              <span>Impostos *</span>
              <input
                name="total_impostos"
                type="number"
                min="0"
                step="0.01"
                className="admin-invoice-input"
                value={form.total_impostos}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label className="admin-invoice-field">
              <span>Total líquido *</span>
              <input
                name="total_liquido"
                type="number"
                min="0"
                step="0.01"
                className="admin-invoice-input"
                value={form.total_liquido}
                onChange={handleChange}
                placeholder="0.00"
              />
            </label>

            <label className="admin-invoice-field">
              <span>Estado</span>
              <select
                name="estado_pagamento"
                className="admin-invoice-input"
                value={form.estado_pagamento}
                onChange={handleChange}
              >
                {paymentOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {error && <p className="admin-invoice-form-error">{error}</p>}

            <div className="admin-invoice-form-actions">
              <button
                type="button"
                className="dashboard-btn admin-invoice-cancel"
                onClick={() => navigate("/admin/invoices")}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" className="dashboard-btn" disabled={saving}>
                {saving ? "A guardar..." : "Criar fatura"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
};

export default AdminAddInvoicePage;
