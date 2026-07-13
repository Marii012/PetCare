import React, { useEffect, useState } from "react";
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
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível carregar os animais.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePet = () => {
    navigate("/client/pets/add");
  };

  const handleEditPet = (petId) => {
    navigate(`/client/pets/${petId}/edit`);
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

        <button className="add-pet-btn" onClick={handleCreatePet}>
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

                <button className="edit-btn" onClick={() => handleEditPet(pet.id_pet)}>
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