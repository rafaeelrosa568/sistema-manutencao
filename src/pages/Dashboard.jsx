import { useEffect, useState } from "react";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase";

import Menu from "../components/Menu";

export default function Dashboard() {

  const [veiculos, setVeiculos] =
    useState([]);

  const [manutencoes, setManutencoes] =
    useState([]);

  const [alertas, setAlertas] =
    useState([]);

  useEffect(() => {

    carregarDados();

  }, []);

  async function carregarDados() {

    const veiculosSnap =
      await getDocs(
        collection(db, "veiculos")
      );

    const manutencoesSnap =
      await getDocs(
        collection(db, "manutencoes")
      );

    let listaVeiculos = [];

    let listaManutencoes = [];

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

    setVeiculos(listaVeiculos);

    setManutencoes(listaManutencoes);

    gerarAlertas(
      listaVeiculos,
      listaManutencoes
    );
  }

  function gerarAlertas(
    listaVeiculos,
    listaManutencoes
  ) {

    let lista = [];

    listaManutencoes.forEach(
      (manutencao) => {

        if (
          manutencao.status ===
          "encerrada"
        ) return;

        const veiculo =
          listaVeiculos.find(
            (v) =>
              v.id ===
              manutencao.veiculoId
          );

        const proximaTroca =
          manutencao.kmAtual +
          manutencao.intervaloKm;

        const restante =
          proximaTroca -
          manutencao.kmAtual;

        if (restante <= 1000) {

          lista.push({

            id: manutencao.id,

            texto:
              `${manutencao.tipo} do veículo ${veiculo?.marca} ${veiculo?.modelo} está próxima do vencimento`

          });
        }
      }
    );

    setAlertas(lista);
  }

  const vencidas =
    manutencoes.filter(
      (m) =>
        m.status ===
        "encerrada"
    ).length;

  return (

    <div>

      <Menu />

      <div className="page">

        <h1>
          Dashboard
        </h1>

        <br />

        <div className="cards-dashboard">

          <div className="card-dashboard">

            <h3>
              Veículos
            </h3>

            <h1>
              {
                veiculos.length
              }
            </h1>

          </div>

          <div className="card-dashboard">

            <h3>
              Manutenções
            </h3>

            <h1>
              {
                manutencoes.length
              }
            </h1>

          </div>

          <div className="card-dashboard">

            <h3>
              Alertas
            </h3>

            <h1>
              {
                alertas.length
              }
            </h1>

          </div>

          <div className="card-dashboard">

            <h3>
              Encerradas
            </h3>

            <h1>
              {vencidas}
            </h1>

          </div>

        </div>

        <br />
        <br />

        <div className="box-alertas">

          <h2>
            Próximas do vencimento
          </h2>

          <br />

          {alertas.length === 0 && (

            <p>
              Nenhum alerta
            </p>

          )}

          {alertas.map(
            (alerta) => (

              <div
                key={alerta.id}
                className="alerta-item"
              >

                ⚠ {alerta.texto}

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}