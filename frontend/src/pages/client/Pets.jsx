import React from "react";
import "./DashboardClient.css";

const Dashboard = () => {
  return (
    <main className="dashboard-container">

      {/* Cabeçalho */}
      <header className="dashboard-header">
        <div>
          <h1>Bem-vindo de volta, João</h1>
          <p>
            Aqui tens um resumo da saúde e acompanhamento dos teus animais.
          </p>
        </div>

        <div className="date-box">
          <span>Hoje, 10 Julho</span>
        </div>
      </header>


      {/* Banner principal */}
      <section className="welcome-card">

        <div className="welcome-content">

          <h2>
            Tudo em dia com os teus animais
          </h2>

          <p>
            Consulta marcações, acompanha o histórico médico e recebe
            lembretes importantes para garantir o melhor cuidado.
          </p>


          <button className="dashboard-btn">
            <i className="bi bi-calendar-plus"></i>
            Marcar Consulta
          </button>

        </div>


        <div className="welcome-circle">
          <i className="bi bi-heart-pulse-fill"></i>
        </div>

      </section>



      {/* Estatísticas */}
      <section className="stats-grid">


        <div className="stat-card">

          <div className="stat-icon">
            <i className="bi bi-heart-fill"></i>
          </div>

          <div>
            <h3>3</h3>
            <p>Animais</p>
          </div>

        </div>



        <div className="stat-card">

          <div className="stat-icon">
            <i className="bi bi-calendar-check"></i>
          </div>

          <div>
            <h3>2</h3>
            <p>Consultas</p>
          </div>

        </div>



        <div className="stat-card">

          <div className="stat-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <div>
            <h3>95%</h3>
            <p>Saúde geral</p>
          </div>

        </div>



      </section>



      <div className="dashboard-grid">


        {/* Gráfico */}
        <section className="dashboard-card chart-card">

          <div className="card-title">
            <h3>
              Histórico de Consultas
            </h3>
          </div>


          <div className="chart">

            <div className="bar">
              <span style={{height:"40%"}}></span>
              <small>Jan</small>
            </div>


            <div className="bar">
              <span style={{height:"70%"}}></span>
              <small>Fev</small>
            </div>


            <div className="bar">
              <span style={{height:"55%"}}></span>
              <small>Mar</small>
            </div>


            <div className="bar">
              <span style={{height:"90%"}}></span>
              <small>Abr</small>
            </div>


            <div className="bar">
              <span style={{height:"65%"}}></span>
              <small>Mai</small>
            </div>


          </div>


        </section>




        {/* Próxima consulta */}
        <section className="dashboard-card">


          <div className="card-title">
            <h3>
              Próxima Consulta
            </h3>
          </div>



          <div className="appointment-card">


            <div className="appointment-icon">
              <i className="bi bi-calendar2-week"></i>
            </div>


            <div>

              <h4>
                Max
              </h4>

              <p>
                Consulta de rotina
              </p>


              <span>
                12 Maio • 15:30
              </span>


            </div>


          </div>


        </section>



      </div>




      {/* Parte inferior */}

      <div className="dashboard-grid">


        {/* Animais */}

        <section className="dashboard-card">


          <div className="card-title">
            <h3>
              Os meus animais
            </h3>
          </div>



          <div className="pet-row">

            <div className="pet-avatar">
            </div>

            <div>
              <strong>
                Max
              </strong>

              <p>
                Cão • 5 anos
              </p>
            </div>

            <span className="status">
              Saudável
            </span>

          </div>



          <div className="pet-row">

            <div className="pet-avatar">
            </div>

            <div>
              <strong>
                Luna
              </strong>

              <p>
                Gato • 3 anos
              </p>
            </div>

            <span className="status">
              Saudável
            </span>


          </div>



        </section>




        {/* Atividade */}

        <section className="dashboard-card">


          <div className="card-title">
            <h3>
              Atividade Recente
            </h3>
          </div>



          <div className="activity">

            <i className="bi bi-check-circle-fill"></i>

            <div>

              <strong>
                Consulta realizada
              </strong>

              <p>
                Max foi consultado recentemente.
              </p>

            </div>


          </div>



          <div className="activity">

            <i className="bi bi-capsule"></i>

            <div>

              <strong>
                Medicação atualizada
              </strong>

              <p>
                Novo registo adicionado.
              </p>

            </div>


          </div>


        </section>



      </div>


    </main>
  );
};


export default Dashboard;