import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./Pets.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const baseSpeciesOptions = [{ value: "all", label: "Todas as espécies" }];

const swalCustomClass = {
  popup: "vetlumen-swal-popup",
  title: "vetlumen-swal-title",
  htmlContainer: "vetlumen-swal-text",
  confirmButton: "vetlumen-swal-button",
  cancelButton: "vetlumen-swal-button"
};

const PetFormModalContent = ({ pet, speciesOptions, onStateChange }) => {
  const speciesChoices = (speciesOptions || []).filter((option) => option.value !== "all");
  const initialSpecies =
    speciesChoices.find((option) => Number(pet?.id_species) === option.value) || null;

  const [formData, setFormData] = useState({
    name: pet?.nome || "",
    sex: pet?.sexo || "",
    birth: pet?.data_nascimento
      ? new Date(pet.data_nascimento).toISOString().split("T")[0]
      : "",
    weight: pet?.peso ?? "",
    color: pet?.cor || "",
    state: pet?.estado || "Ativo",
    photoFile: null
  });
  const [selectedSpecies, setSelectedSpecies] = useState(initialSpecies);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [breedOptions, setBreedOptions] = useState([]);

  useEffect(() => {
    const loadBreeds = async () => {
      if (!selectedSpecies?.value) {
        setBreedOptions([]);
        setSelectedBreed(null);
        onStateChange({ ...formData, species: selectedSpecies, breed: null });
        return;
      }

      try {
        const response = await api.get(`/breeds/species/${selectedSpecies.value}`);
        const options = (response.data || []).map((breed) => ({
          value: breed.id_breed,
          label: breed.nome_raca
        }));

        setBreedOptions(options);

        const matchedBreed = options.find((option) => Number(pet?.id_breed) === option.value) || null;
        setSelectedBreed(matchedBreed);
        onStateChange({ ...formData, species: selectedSpecies, breed: matchedBreed });
      } catch (error) {
        setBreedOptions([]);
        setSelectedBreed(null);
        onStateChange({ ...formData, species: selectedSpecies, breed: null });
      }
    };

    loadBreeds();
  }, [selectedSpecies]);

  useEffect(() => {
    onStateChange({
      ...formData,
      species: selectedSpecies,
      breed: selectedBreed
    });
  }, [formData, selectedSpecies, selectedBreed]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="pet-swal-form">
      <label>
        <span>Nome</span>
        <input
          name="name"
          className="pet-swal-input"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>

      <div className="pet-swal-row">
        <label>
          <span>Espécie</span>
          <Select
            className="pet-swal-select"
            classNamePrefix="pet-swal-select"
            options={speciesChoices}
            value={selectedSpecies}
            onChange={setSelectedSpecies}
            isSearchable={false}
            placeholder="Selecione a espécie"
          />
        </label>

        <label>
          <span>Raça</span>
          <Select
            className="pet-swal-select"
            classNamePrefix="pet-swal-select"
            options={breedOptions}
            value={selectedBreed}
            onChange={setSelectedBreed}
            isSearchable={false}
            placeholder="Selecione a raça"
            isDisabled={!selectedSpecies}
          />
        </label>
      </div>

      <div className="pet-swal-row">
        <label>
          <span>Sexo</span>
          <input
            name="sex"
            className="pet-swal-input"
            value={formData.sex}
            onChange={handleInputChange}
          />
        </label>

        <label>
          <span>Data de nascimento</span>
          <input
            name="birth"
            type="date"
            className="pet-swal-input"
            value={formData.birth}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="pet-swal-row">
        <label>
          <span>Peso (kg)</span>
          <input
            name="weight"
            type="number"
            step="0.1"
            className="pet-swal-input"
            value={formData.weight}
            onChange={handleInputChange}
          />
        </label>

        <label>
          <span>Cor</span>
          <input
            name="color"
            className="pet-swal-input"
            value={formData.color}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <label>
        <span>Estado</span>
        <input
          name="state"
          className="pet-swal-input"
          value={formData.state}
          onChange={handleInputChange}
        />
      </label>

      <label>
        <span>Foto do animal</span>
        <input
          type="file"
          accept="image/*"
          className="pet-swal-input"
          onChange={(event) =>
            setFormData((current) => ({ ...current, photoFile: event.target.files?.[0] || null }))
          }
        />
      </label>
    </div>
  );
};

const getSpeciesLabel = (idSpecies, speciesOptions) => {
  const species = speciesOptions.find((option) => option.value === idSpecies);
  return species ? species.label : "Espécie não definida";
};

const getBreedLabel = (pet) => {
  const breedName = pet?.nome_raca || pet?.Breed?.nome_raca || pet?.breed?.nome_raca;
  return breedName || "";
};

const formatDate = (value) => {
  if (!value) return "Não disponível";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-PT");
};

const getAgeLabel = (birthDate) => {
  if (!birthDate) return "Idade indisponível";

  const birth = new Date(birthDate);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
  }

  return years > 0 ? `${years} ano${years === 1 ? "" : "s"}` : "Menos de 1 ano";
};

const Pets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [speciesOptions, setSpeciesOptions] = useState(baseSpeciesOptions);
  const [breedsOptions, setBreedsOptions] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState(baseSpeciesOptions[0]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const userId = storedUser?.id_user;

      if (!userId) {
        throw new Error("Utilizador não autenticado.");
      }

      const [petsResponse, speciesResponse] = await Promise.all([
        api.get(`/pets/user/${userId}`),
        api.get("/species")
      ]);

      const speciesFromApi = (speciesResponse.data || []).map((species) => ({
        value: species.id_species,
        label: species.nome_especie
      }));

      setSpeciesOptions([{ value: "all", label: "Todas as espécies" }, ...speciesFromApi]);
      setSpeciesFilter({ value: "all", label: "Todas as espécies" });
      setPets(petsResponse.data || []);
      setBreedsOptions([]);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os animais.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadBreeds = async (speciesId) => {
    if (!speciesId) {
      setBreedsOptions([]);
      return;
    }

    try {
      const response = await api.get(`/breeds/species/${speciesId}`);
      const breedsFromApi = (response.data || []).map((breed) => ({
        value: breed.id_breed,
        label: breed.nome_raca
      }));
      setBreedsOptions(breedsFromApi);
    } catch (err) {
      setBreedsOptions([]);
    }
  };

  const handlePetSubmit = async (mode, pet = null) => {
    const isEdit = mode === "edit";
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const userId = storedUser?.id_user;

    let formState = {
      name: pet?.nome || "",
      species: null,
      breed: null,
      sex: pet?.sexo || "",
      birth: pet?.data_nascimento ? new Date(pet.data_nascimento).toISOString().split("T")[0] : "",
      weight: pet?.peso ?? "",
      color: pet?.cor || "",
      state: pet?.estado || "Ativo",
      photoFile: null
    };

    const result = await Swal.fire({
      title: isEdit ? "Editar animal" : "Adicionar animal",
      html: `<div id="pet-swal-root"></div>`,
      showCancelButton: true,
      confirmButtonText: isEdit ? "Guardar" : "Adicionar",
      cancelButtonText: "Cancelar",
      customClass: swalCustomClass,
      didOpen: () => {
        const rootElement = document.getElementById("pet-swal-root");
        if (rootElement) {
          const root = createRoot(rootElement);
          root.render(
            <PetFormModalContent
              pet={pet}
              speciesOptions={speciesOptions}
              onStateChange={(nextState) => {
                formState = nextState;
              }}
            />
          );
        }
      },
      preConfirm: async () => {
        if (!formState.name.trim() || !formState.species?.value) {
          Swal.showValidationMessage("Nome e espécie são obrigatórios.");
          return false;
        }

        let fotografia = pet?.fotografia || "";
        if (formState.photoFile) {
          fotografia = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(formState.photoFile);
          });
        }

        return {
          nome: formState.name.trim(),
          id_species: Number(formState.species.value),
          id_breed: formState.breed?.value ? Number(formState.breed.value) : null,
          sexo: formState.sex || null,
          data_nascimento: formState.birth || null,
          peso: formState.weight ? Number(formState.weight) : null,
          cor: formState.color || null,
          estado: formState.state || "Ativo",
          fotografia,
          id_user: userId
        };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    try {
      if (isEdit && pet?.id_pet) {
        await api.put(`/pets/${pet.id_pet}`, result.value);
      } else {
        await api.post("/pets", result.value);
      }

      await Swal.fire({
        title: isEdit ? "Animal atualizado" : "Animal adicionado",
        text: isEdit ? "As alterações foram guardadas com sucesso." : "O animal foi criado com sucesso.",
        icon: "success",
        customClass: swalCustomClass
      });

      fetchData();
    } catch (err) {
      Swal.fire({
        title: "Erro",
        text: err.response?.data?.message || "Não foi possível guardar o animal.",
        icon: "error",
        customClass: swalCustomClass
      });
    }
  };

  const handleDeletePet = async (pet) => {
    const result = await Swal.fire({
      title: "Eliminar animal",
      text: `Tem a certeza que quer eliminar ${pet.nome}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, eliminar",
      cancelButtonText: "Cancelar",
      customClass: swalCustomClass
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await api.delete(`/pets/${pet.id_pet}`);
      await Swal.fire({
        title: "Animal eliminado",
        text: "O animal foi removido com sucesso.",
        icon: "success",
        customClass: swalCustomClass
      });
      fetchData();
    } catch (err) {
      Swal.fire({
        title: "Erro",
        text: err.response?.data?.message || "Não foi possível eliminar o animal.",
        icon: "error",
        customClass: swalCustomClass
      });
    }
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.nome?.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = speciesFilter.value === "all" || pet.id_species === speciesFilter.value;

    return matchesSearch && matchesSpecies;
  });

  return (
    <main className="pets-container">
      <div className="pets-header">
        <div>
          <h1>Os Meus Animais</h1>
          <p>Consulta e gere toda a informação dos teus animais.</p>
        </div>

        <button className="add-pet-btn" onClick={() => handlePetSubmit("create")}>
          <i className="bi bi-plus-circle"></i>
          Adicionar Animal
        </button>
      </div>

      <div className="pets-filters">
        <div className="search-box">
          <i className="bi bi-search"></i>
          <input
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          classNamePrefix="pets-select"
          options={speciesOptions}
          value={speciesFilter}
          onChange={setSpeciesFilter}
          isSearchable={false}
        />
      </div>

      {loading && <p className="pets-empty">A carregar animais...</p>}
      {!loading && error && <p className="pets-empty">{error}</p>}

      {!loading && !error && filteredPets.length === 0 && (
        <p className="pets-empty">Não foram encontrados animais.</p>
      )}

      {!loading && !error && filteredPets.length > 0 && (
        <div className="pets-grid">
          {filteredPets.map((pet) => (
            <div className="pet-card" key={pet.id_pet}>
              <img
                src={pet.fotografia || "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80"}
                className="pet-image"
                alt={pet.nome}
              />

              <div className="pet-info">
                <h3>{pet.nome}</h3>
                <p>{getSpeciesLabel(pet.id_species, speciesOptions)}</p>
                <span>{getBreedLabel(pet)}</span>
                <small>{getAgeLabel(pet.data_nascimento)} {pet.peso ? `${pet.peso}kg` : "Peso não registado"}</small>

                <div className="pet-extra">
                  <div>
                    <i className="bi bi-shield-check"></i>
                    <strong>Estado</strong>
                    <p>{pet.estado || "Ativo"}</p>
                  </div>

                  <div>
                    <i className="bi bi-calendar3"></i>
                    <strong>Nascimento</strong>
                    <p>{formatDate(pet.data_nascimento)}</p>
                  </div>
                </div>
              </div>

              <div className="pet-actions">
                <button className="details-btn" onClick={() => navigate(`/client/pets/${pet.id_pet}`)}>
                  <i className="bi bi-eye"></i>
                </button>

                <button className="history-btn" onClick={() => navigate(`/client/pets/${pet.id_pet}/history`)}>
                  <i className="bi bi-file-medical"></i>
                </button>

                <button className="vaccine-btn" onClick={() => navigate(`/client/pets/${pet.id_pet}/vaccines`)}>
                  <i className="bi bi-capsule"></i>
                </button>

                <button className="edit-btn" onClick={() => handlePetSubmit("edit", pet)}>
                  <i className="bi bi-pencil-square"></i>
                </button>

                <button className="delete-btn" onClick={() => handleDeletePet(pet)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Pets;