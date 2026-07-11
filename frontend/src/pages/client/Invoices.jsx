import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import api from "../../services/api";
import "./Invoices.css";

const options = [
  { value: "all", label: "Todos os estados" },
  { value: "Pago", label: "Pago" },
  { value: "Pendente", label: "Pendente" },
  { value: "Cancelado", label: "Cancelado" }
];

const swalCustomClass = {
  popup: "vetlumen-swal-popup",
  title: "vetlumen-swal-title",
  htmlContainer: "vetlumen-swal-text",
  confirmButton: "vetlumen-swal-button"
};

const normalizeInvoice = (invoice) => {
  const rawStatus = String(invoice.estado_pagamento || "").trim().toLowerCase();
  let uiStatus = "Pendente";

  if (["pago", "paid", "finalizado", "finalizada"].includes(rawStatus)) {
    uiStatus = "Pago";
  } else if (["cancelado", "cancelada", "rejeitado", "rejeitada"].includes(rawStatus)) {
    uiStatus = "Cancelado";
  }

  const total = invoice.total_liquido != null
    ? `${Number(invoice.total_liquido).toFixed(2)}€`
    : "0.00€";

  const items = [];
  if (invoice.total_bruto != null) {
    items.push(`Bruto: ${Number(invoice.total_bruto).toFixed(2)}€`);
  }
  if (invoice.total_impostos != null) {
    items.push(`Impostos: ${Number(invoice.total_impostos).toFixed(2)}€`);
  }

  return {
    id_invoice: invoice.id_invoice,
    number: invoice.num_fatura || `FAT-${invoice.id_invoice}`,
    date: invoice.data_emissao
      ? new Date(invoice.data_emissao).toLocaleDateString("pt-PT")
      : "Não disponível",
    total,
    status: uiStatus,
    items
  };
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(options[0]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async (selectedStatus = status.value) => {
    try {
      setLoading(true);

      const response = await api.get("/invoices", {
        params: {
          status: selectedStatus === "all" ? "all" : selectedStatus
        }
      });
      const data = Array.isArray(response.data) ? response.data : [];
      const normalizedInvoices = data.map(normalizeInvoice);

      setInvoices(normalizedInvoices);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Não foi possível carregar as faturas."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = `${invoice.number || ""} ${invoice.status || ""}`.toLowerCase();
    return searchText.includes(search.toLowerCase());
  });

  const badgeClass = (status) => {
    switch (status) {
      case "Pago":
        return "paid";
      case "Pendente":
        return "pending";
      case "Cancelado":
        return "cancelled";
      default:
        return "";
    }
  };

  const handleViewDetails = (invoice) => {
    Swal.fire({
      title: invoice.number,
      html: `
        <div class="invoice-details-modal">
          <p><strong>Estado:</strong> ${invoice.status}</p>
          <p><strong>Data:</strong> ${invoice.date}</p>
          <p><strong>Total:</strong> ${invoice.total}</p>
          <div class="invoice-details-items">
            ${(invoice.items || []).map((item) => `<span>${item}</span>`).join("")}
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Fechar",
      customClass: swalCustomClass
    });
  };

  return (
    <main className="invoices-container">
      <div className="invoices-header">
        <div>
          <h1>Faturas</h1>
          <p>Consulte as suas faturas e o estado das consultas associadas.</p>
        </div>

        <div className="invoices-filters">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pesquisar por número ou estado"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            options={options}
            value={status}
            onChange={(option) => {
              setStatus(option);
              loadInvoices(option?.value || "all");
            }}
            className="invoice-select"
            classNamePrefix="invoice-select"
            isSearchable={false}
          />
        </div>
      </div>

      <div className="invoice-list">
        {loading && <p>A carregar faturas...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && filteredInvoices.map((invoice) => (
          <div className="invoice-card" key={invoice.id_invoice}>
            <div className="invoice-icon">
              <i className="bi bi-file-earmark-text"></i>
            </div>

            <div className="invoice-info">
              <h3>{invoice.number}</h3>

              <p>
                <i className="bi bi-calendar me-3 fs-5"></i>
                {invoice.date}
              </p>

              <div className="invoice-items">
                {(invoice.items || []).map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </div>

            </div>

            <div className="invoice-right">
              <strong>{invoice.total}</strong>

              <span className={`invoice-status ${badgeClass(invoice.status)}`}>
                {invoice.status}
              </span>

              <button className="details-btn" onClick={() => handleViewDetails(invoice)}>
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Invoices;