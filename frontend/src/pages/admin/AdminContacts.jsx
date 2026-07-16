import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./AdminContacts.css";

const rowsPerPageOptions = [10, 20, 50];

const formatDate = (value) => {
  if (!value) return "Sem data";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";

  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const getStatusClass = (status) => {
  const normalized = String(status || "Pendente").trim().toLowerCase();

  if (normalized === "respondido" || normalized === "resposta enviada") return "contact-badge answered";
  if (normalized === "em progresso" || normalized === "em análise") return "contact-badge in-progress";
  return "contact-badge pending";
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/contacts");
      setContacts(response.data || []);
    } catch (loadError) {
      console.error("Erro ao carregar contactos:", loadError);
      setError("Não foi possível carregar os contactos recebidos.");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, pageSize]);

  const filteredContacts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const contactText = `${contact.nome_tutor || ""} ${contact.email || ""} ${contact.telefone || ""} ${contact.mensagem || ""} ${contact.estado || ""}`.toLowerCase();
      const matchesSearch = !searchValue || contactText.includes(searchValue);
      const matchesStatus = statusFilter === "all" || String(contact.estado || "Pendente").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [contacts, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const paginatedContacts = filteredContacts.slice(pageStart, pageStart + pageSize);

  const stats = useMemo(() => ({
    total: contacts.length,
    pendentes: contacts.filter((contact) => String(contact.estado || "Pendente").trim().toLowerCase() !== "respondido").length,
    respondidos: contacts.filter((contact) => String(contact.estado || "Pendente").trim().toLowerCase() === "respondido").length
  }), [contacts]);

  const handleMarkAsAnswered = async (contact) => {
    const result = await Swal.fire({
      title: "Marcar como respondido?",
      text: `Pretende marcar o contacto de ${contact.nome_tutor || "este utilizador"} como respondido?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, marcar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "vetlumen-swal-popup",
        title: "vetlumen-swal-title",
        htmlContainer: "vetlumen-swal-text",
        confirmButton: "vetlumen-swal-button"
      }
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/contacts/${contact.id_contact}`, { estado: "Respondido", notas: contact.notas || "Respondido pelo painel administrativo." });
      await loadContacts();

      Swal.fire({
        title: "Atualizado!",
        text: "O contacto foi marcado como respondido.",
        icon: "success",
        customClass: {
          popup: "vetlumen-swal-popup",
          title: "vetlumen-swal-title",
          htmlContainer: "vetlumen-swal-text",
          confirmButton: "vetlumen-swal-button"
        }
      });
    } catch (updateError) {
      console.error("Erro ao atualizar contacto:", updateError);
      Swal.fire({
        title: "Erro",
        text: "Não foi possível atualizar o estado do contacto.",
        icon: "error",
        customClass: {
          popup: "vetlumen-swal-popup",
          title: "vetlumen-swal-title",
          htmlContainer: "vetlumen-swal-text",
          confirmButton: "vetlumen-swal-button"
        }
      });
    }
  };

  return (
    <main className="admin-contacts dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Contactos recebidos</h1>
          <p>Mensagens enviadas através do formulário de contacto da página inicial.</p>
        </div>

        <button className="dashboard-btn" onClick={() => window.location.assign("/admin/dashboard")}>
          <i className="bi bi-arrow-left me-2"></i>
          Voltar ao painel
        </button>
      </header>

      <section className="stats-grid contacts-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-envelope-paper"></i>
          </div>
          <div>
            <h3>{stats.total}</h3>
            <p>Total de contactos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <div>
            <h3>{stats.pendentes}</h3>
            <p>Pendentes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-check2-circle"></i>
          </div>
          <div>
            <h3>{stats.respondidos}</h3>
            <p>Respondidos</p>
          </div>
        </div>
      </section>

      <section className="dashboard-card">
        <div className="contacts-card">
          <div className="card-title">
            <h3>Mensagens recebidas</h3>
          </div>

          <div className="contacts-filters">
            <label className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar por nome, email ou mensagem"
              />
            </label>

            <label className="contacts-select-field">
              <span>Estado</span>
              <select className="contacts-filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">Todos os estados</option>
                <option value="Pendente">Pendentes</option>
                <option value="Respondido">Respondidos</option>
              </select>
            </label>

            <label className="contacts-select-field">
              <span>Por página</span>
              <select className="contacts-filter-select" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                {rowsPerPageOptions.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>

          {loading ? (
            <div className="contacts-empty-state">
              <i className="bi bi-arrow-clockwise"></i>
              <p>A carregar contactos...</p>
            </div>
          ) : error ? (
            <div className="contacts-empty-state">
              <i className="bi bi-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="contacts-empty-state">
              <i className="bi bi-envelope-open"></i>
              <p>Não foram encontrados contactos para os filtros aplicados.</p>
            </div>
          ) : (
            <div className="contacts-list">
              {paginatedContacts.map((contact) => (
                <article className="contact-card" key={contact.id_contact}>
                  <div className="contact-card-content">
                    <div className="contact-card-header">
                      <div>
                        <h4>{contact.nome_tutor || "Contacto sem nome"}</h4>
                        <p className="contact-meta">
                          <i className="bi bi-envelope me-2"></i>
                          {contact.email || "Sem email"}
                        </p>
                        <p className="contact-meta">
                          <i className="bi bi-telephone me-2"></i>
                          {contact.telefone || "Sem telefone"}
                        </p>
                      </div>

                      <span className={getStatusClass(contact.estado)}>{contact.estado || "Pendente"}</span>
                    </div>

                    <div className="contact-details">
                      <p className="contact-detail-row">
                        <span className="contact-label">Animal:</span>
                        {contact.nome_animal || "Não indicado"}
                      </p>
                      <p className="contact-detail-row">
                        <span className="contact-label">Enviado em:</span>
                        {formatDate(contact.data_envio)}
                      </p>
                    </div>

                    <div className="contact-message-block">
                      <p className="contact-message">{contact.mensagem || "Sem mensagem registada."}</p>
                    </div>

                    {contact.notas ? (
                      <div className="contact-notes">
                        <span className="contact-label">Notas:</span>
                        <p>{contact.notas}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="contact-actions">
                    <button
                      className="dashboard-btn contact-action-btn"
                      onClick={() => handleMarkAsAnswered(contact)}
                      disabled={String(contact.estado || "Pendente").trim().toLowerCase() === "respondido"}
                    >
                      <i className="bi bi-check2-circle me-2"></i>
                      {String(contact.estado || "Pendente").trim().toLowerCase() === "respondido" ? "Respondido" : "Marcar como respondido"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && filteredContacts.length > 0 ? (
            <div className="pagination-row">
              <span>
                Mostrando {Math.min(pageSize, filteredContacts.length)} de {filteredContacts.length} contactos
              </span>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                  disabled={safePage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <span className="pagination-page">{safePage} / {totalPages}</span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                  disabled={safePage === totalPages}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export default AdminContacts;
