import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import api from "../../services/api";
import "./Pets.css";
import "./Profile.css";

const EditPetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    sexo: "",
    data_nascimento: "",
    peso: "",
    cor: "",
    estado: "Ativo",
    observacoes: "",
    fotoFile: null,
    fotografiaAtual: "",
  });
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [breedOptions, setBreedOptions] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBreedsBySpecies = async (speciesId) => {
    if (!speciesId) {
      setBreedOptions([]);
      return [];
    }

    try {
      const response = await api.get(`/breeds/species/${speciesId}`);
      const options = (response.data || []).map((breed) => ({
        value: breed.id_breed,
        label: breed.nome_raca,
      }));
      setBreedOptions(options);
      return options;
    } catch (err) {
      setBreedOptions([]);
      return [];
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const [speciesResponse, petResponse] = await Promise.all([
          api.get("/species"),
          api.get(`/pets/${id}`),
        ]);

        const species = (speciesResponse.data || []).map((item) => ({
          value: item.id_species,
          label: item.nome_especie,
        }));

        const pet = petResponse.data;

        setSpeciesOptions(species);

        const defaultSpecies = species.find((option) => Number(option.value) === Number(pet?.id_species)) || null;
        setSelectedSpecies(defaultSpecies);

        let breeds = [];
        if (defaultSpecies?.value) {
          breeds = await fetchBreedsBySpecies(defaultSpecies.value);
        }

        const defaultBreed = breeds.find((option) => Number(option.value) === Number(pet?.id_breed)) || null;
        setSelectedBreed(defaultBreed);

        setFormData((prev) => ({
          ...prev,
          nome: pet?.nome || "",
          sexo: pet?.sexo || "",
          data_nascimento: pet?.data_nascimento ? new Date(pet.data_nascimento).toISOString().split("T")[0] : "",
          peso: pet?.peso ?? "",
          cor: pet?.cor || "",
          estado: pet?.estado || "Ativo",
          observacoes: pet?.observacoes || "",
          fotografiaAtual: pet?.fotografia || "",
          fotoFile: null,
        }));
      } catch (err) {
        setError(err.response?.data?.message || "Não foi possível carregar os dados do animal.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id]);

  const handleSpeciesChange = async (option) => {
    setSelectedSpecies(option);
    setSelectedBreed(null);

    if (!option?.value) {
      setBreedOptions([]);
      return;
    }

    await fetchBreedsBySpecies(option.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = storedUser?.id_user;

      if (!userId) {
        setError("Não foi possível identificar o utilizador autenticado.");
        setSaving(false);
        return;
      }

      if (!formData.nome.trim() || !selectedSpecies?.value) {
        setError("Nome e espécie são obrigatórios.");
        setSaving(false);
        return;
      }

      let fotografia = formData.fotografiaAtual || "";
      if (formData.fotoFile) {
        fotografia = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.fotoFile);
        });
      }

      await api.put(`/pets/${id}`, {
        nome: formData.nome.trim(),
        id_species: Number(selectedSpecies.value),
        id_breed: selectedBreed?.value ? Number(selectedBreed.value) : null,
        sexo: formData.sexo || null,
        data_nascimento: formData.data_nascimento || null,
        peso: formData.peso ? Number(formData.peso) : null,
        cor: formData.cor || null,
        estado: formData.estado || "Ativo",
        observacoes: formData.observacoes || null,
        fotografia,
        id_user: userId,
      });

      navigate("/client/pets");
    } catch (err) {
      console.error("Erro ao atualizar animal:", err);
      setError(err.response?.data?.message || "Não foi possível guardar as alterações do animal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="appointments-container">
      <div className="appointments-header">
        <div>
          <h1>Editar Animal</h1>
          <p>Atualize os dados do animal selecionado.</p>
        </div>

        <button type="button" className="dashboard-btn" onClick={() => navigate("/client/pets")}>
          <i className="bi bi-arrow-left"></i>
          Voltar
        </button>
      </div>

      {loading ? (
        <div className="profile-card">
          <p>A carregar dados do animal...</p>
        </div>
      ) : (
        <form className="add-pet-form" onSubmit={handleSubmit}>
          {error && <p className="profile-error full-width">{error}</p>}

          <div className="profile-item add-pet-name-field">
            <label htmlFor="nome">Nome</label>
            <input id="nome" name="nome" value={formData.nome} onChange={handleChange} className="profile-input" required />
          </div>

          <div className="profile-item add-pet-species-field">
            <label htmlFor="species">Espécie</label>
            <Select
              inputId="species"
              className="pet-form-select"
              classNamePrefix="pet-form-select"
              options={speciesOptions}
              value={selectedSpecies}
              onChange={handleSpeciesChange}
              isSearchable={false}
              placeholder="Selecione a espécie"
            />
          </div>

          <div className="profile-item add-pet-breed-field">
            <label htmlFor="breed">Raça</label>
            <Select
              inputId="breed"
              className="pet-form-select"
              classNamePrefix="pet-form-select"
              options={breedOptions}
              value={selectedBreed}
              onChange={setSelectedBreed}
              isSearchable={false}
              placeholder="Selecione a raça"
              isDisabled={!selectedSpecies}
            />
          </div>

          <div className="profile-item add-pet-sex-field">
            <label htmlFor="sexo">Sexo</label>
            <input id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} className="profile-input" />
          </div>

          <div className="add-pet-inline-row add-pet-metrics-row">
            <div className="profile-item add-pet-birth-field">
              <label htmlFor="data_nascimento">Data de nascimento</label>
              <input id="data_nascimento" name="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} className="profile-input" />
            </div>

            <div className="profile-item add-pet-weight-field">
              <label htmlFor="peso">Peso (kg)</label>
              <input id="peso" name="peso" type="number" step="0.1" value={formData.peso} onChange={handleChange} className="profile-input" />
            </div>
          </div>

          <div className="add-pet-inline-row add-pet-status-row">
            <div className="profile-item add-pet-color-field">
              <label htmlFor="cor">Cor</label>
              <input id="cor" name="cor" value={formData.cor} onChange={handleChange} className="profile-input" />
            </div>

            <div className="profile-item add-pet-state-field">
              <label htmlFor="estado">Estado</label>
              <input id="estado" name="estado" value={formData.estado} onChange={handleChange} className="profile-input" />
            </div>
          </div>

          <div className="profile-item full-width">
            <label htmlFor="observacoes">Observações</label>
            <textarea id="observacoes" name="observacoes" value={formData.observacoes} onChange={handleChange} className="profile-input" rows="4" />
          </div>

          <div className="profile-item full-width">
            <label htmlFor="foto">Foto do animal</label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              className="profile-input"
              onChange={(event) => setFormData((previous) => ({ ...previous, fotoFile: event.target.files?.[0] || null }))}
            />
          </div>

          <div className="profile-edit-actions full-width">
            <button type="button" className="password-btn" onClick={() => navigate("/client/pets")} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="edit-profile-btn" disabled={saving}>
              {saving ? "A guardar..." : "Guardar Alterações"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default EditPetPage;
