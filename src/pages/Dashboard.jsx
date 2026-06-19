import { useEffect, useState }
from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db }
from "../firebase";

import Menu
from "../components/Menu";

export default function Dashboard() {

  const [usuarios,
    setUsuarios] =
    useState([]);

  const [veiculos,
    setVeiculos] =
    useState([]);

  const [manutencoes,
    setManutencoes] =
    useState([]);

  async function carregarDados() {

    const usuariosSnap =
      await getDocs(
        collection(
          db,
          "usuarios"
        )
      );

    const veiculosSnap =
      await getDocs(
        collection(
          db,
          "veiculos"
        )
      );

    const manutencoesSnap =
      await getDocs(
        collection(
          db,
          "manutencoes"
        )
      );

    let listaUsuarios = [];
    let listaVeiculos = [];
    let listaManutencoes = [];

    usuariosSnap.forEach((doc) => {

      listaUsuarios.push({
        id: doc.id,
        ...doc.data()
      });

    });

    veiculosSnap.forEach((doc) => {

      listaVeiculos.push({
        id: doc.id,
        ...doc.data()
      });

    });

    manutencoesSnap.forEach((doc) => {

      listaManutencoes.push({
        id: doc.id,
        ...doc.data()
      });

    });

    setUsuarios(listaUsuarios);

    setVeiculos(listaVeiculos);

    setManutencoes(
      listaManutencoes
    );
  }

  useEffect(() => {

    carregarDados();

  }, []);

  const manutencoesAtivas =
    manutencoes.filter(
      (m) =>
        m.status !==
        "encerrada"
    );

  const manutencoesFinalizadas =
    manutencoes.filter(
      (m) =>
        m.status ===
        "encerrada"
    );

  return (

    <div>

      <Menu />

      <div className="page">

        <h1>
          Dashboard
        </h1>

        <br />

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <h2>
              Usuários
            </h2>

            <h1>
              {usuarios.length}
            </h1>

          </div>

          <div className="dashboard-card">

            <h2>
              Veículos
            </h2>

            <h1>
              {veiculos.length}
            </h1>

          </div>

          <div className="dashboard-card">

            <h2>
              Manutenções Ativas
            </h2>

            <h1>
              {
                manutencoesAtivas.length
              }
            </h1>

          </div>

          <div className="dashboard-card">

            <h2>
              Finalizadas
            </h2>

            <h1>
              {
                manutencoesFinalizadas.length
              }
            </h1>

          </div>

        </div>

        <br />

        <div className="card">

          <h2>
            Próximas Manutenções
          </h2>

          <br />

          {manutencoesAtivas.length ===
          0 ? (

            <p>
              Nenhuma manutenção
            </p>

          ) : (

            <div className="dashboard-alertas">

              {manutencoesAtivas.map(
                (item) => (

                <div
                  className="alerta-item"
                  key={item.id}
                >

                  <strong>
                    {item.tipo}
                  </strong>

                  <br />

                  KM Troca:
                  {" "}

                  {item.kmAtual +
                    item.intervaloKm}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
