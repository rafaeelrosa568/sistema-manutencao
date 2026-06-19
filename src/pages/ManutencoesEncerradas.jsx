import { useEffect, useState }
from "react";

import Menu
from "../components/Menu";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db }
from "../firebase";

export default function
ManutencoesEncerradas() {

  const [manutencoes,
    setManutencoes] =
    useState([]);

  const [veiculos,
    setVeiculos] =
    useState([]);

  async function carregarDados() {

    const manutencoesSnapshot =
      await getDocs(
        collection(
          db,
          "manutencoes"
        )
      );

    let listaManutencoes = [];

    manutencoesSnapshot.forEach(
      (docItem) => {

      const dados =
        docItem.data();

      if (
        dados.status ===
        "encerrada"
      ) {

        listaManutencoes.push({
          id: docItem.id,
          ...dados
        });

      }

    });

    setManutencoes(
      listaManutencoes
    );

    const veiculosSnapshot =
      await getDocs(
        collection(
          db,
          "veiculos"
        )
      );

    let listaVeiculos = [];

    veiculosSnapshot.forEach(
      (docItem) => {

      listaVeiculos.push({
        id: docItem.id,
        ...docItem.data()
      });

    });

    setVeiculos(
      listaVeiculos
    );
  }

  useEffect(() => {

    carregarDados();

  }, []);

  function obterVeiculo(id) {

    return veiculos.find(
      (v) => v.id === id
    );
  }

  return (

    <div>

      <Menu />

      <div className="page">

        <h1>
          Histórico de
          Manutenções
        </h1>

        <br />

        <div className="manutencoes-grid">

          {manutencoes.map(
            (manutencao) => {

              const veiculo =
                obterVeiculo(
                  manutencao.veiculoId
                );

              return (

                <div
                  className="manutencao-card encerrada"
                  key={
                    manutencao.id
                  }
                >

                  <h3>
                    {
                      manutencao.tipo
                    }
                  </h3>

                  <p>

                    <strong>
                      Veículo:
                    </strong>

                    {" "}

                    {
                      veiculo?.marca
                    }
                    {" "}
                    {
                      veiculo?.modelo
                    }

                  </p>

                  <p>

                    <strong>
                      Data:
                    </strong>

                    {" "}

                    {
                      manutencao.data
                    }

                  </p>

                  <p>

                    <strong>
                      Observação:
                    </strong>

                    {" "}

                    {
                      manutencao.observacao
                    }

                  </p>

                  <br />

                  <span
                    className="status-inativo"
                  >
                    ENCERRADA
                  </span>

                </div>

              );
            }
          )}

        </div>

      </div>

    </div>
  );
}
