import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PetDetails.css";
import api from "../../services/api";

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

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const [petResponse, speciesResponse] = await Promise.all([
          api.get(`/pets/${id}`),
          api.get("/species")
        ]);

        const speciesFromApi = (speciesResponse.data || []).map((species) => ({
          value: species.id_species,
          label: species.nome_especie
        }));

        setSpeciesOptions(speciesFromApi);
        setPet(petResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Não foi possível carregar os detalhes do animal.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return <main className="pet-details-container"><p className="pets-empty">A carregar detalhes...</p></main>;
  }

  if (error) {
    return <main className="pet-details-container"><p className="pets-empty">{error}</p></main>;
  }

  if (!pet) {
    return <main className="pet-details-container"><p className="pets-empty">Nenhum animal encontrado.</p></main>;
  }

  return (
    <main className="pet-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
        Voltar
      </button>

      <div className="pet-details-header">
        <img
          src={pet.fotografia || "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80"}
          alt={pet.nome}
          className="pet-details-image"
        />

        <div>
          <h1>{pet.nome}</h1>
          <p>{getSpeciesLabel(pet.id_species, speciesOptions)} • {getBreedLabel(pet)}</p>
          <span>{getAgeLabel(pet.data_nascimento)}</span>
        </div>
      </div>

      <div className="pet-details-content">
        <div className="details-card">
          <h2>
            <i className="bi bi-info-circle"></i>
            Informação Geral
          </h2>

          <div className="details-grid">
            <div>
              <strong>Sexo</strong>
              <p>{pet.sexo || "Não registado"}</p>
            </div>

            <div>
              <strong>Data de nascimento</strong>
              <p>{formatDate(pet.data_nascimento)}</p>
            </div>

            <div>
              <strong>Peso</strong>
              <p>{pet.peso ? `${pet.peso}kg` : "Não registado"}</p>
            </div>

            <div>
              <strong>Porte</strong>
              <p>{pet.porte || "Não registado"}</p>
            </div>

            <div>
              <strong>Cor</strong>
              <p>{pet.cor || "Não registada"}</p>
            </div>

            <div>
              <strong>Microchip</strong>
              <p>{pet.num_chip || "Não registado"}</p>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h2>
            <i className="bi bi-heart-pulse"></i>
            Saúde
          </h2>

          <div className="details-grid">
            <div>
              <strong>Esterilizado</strong>
              <p>{pet.esterilizado ? "Sim" : "Não"}</p>
            </div>

            <div>
              <strong>Alergias</strong>
              <p>{pet.alergias || "Nenhuma"}</p>
            </div>

            <div>
              <strong>Observações</strong>
              <p>{pet.observacoes || "Sem observações"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PetDetails;