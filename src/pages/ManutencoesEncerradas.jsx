import { useEffect, useState } from "react";
import Menu from "../components/Menu";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase";

export default function ManutencoesEncerradas() {

  const [manutencoes, setManutencoes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);

  async function carregarVeiculos() {
    const querySnapshot = await getDocs(
      collection(db, "veiculos")
    );

    let lista = [];

    querySnapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setVeiculos(lista);
  }

  async function carregarManutencoesEncerradas() {
    const querySnapshot = await getDocs(
      collection(db, "manutencoes")
    );

    let lista = [];

    querySnapshot.forEach((doc) => {
      const dados = {
        id: doc.id,
        ...doc.data()
      };

      if (dados.status === "encerrada") {
        lista.push(dados);
      }
    });

    setManutencoes(lista);
  }

  function obterVeiculo(id) {
    return veiculos.find(
      (veiculo) => veiculo.id === id
    );
  }

  useEffect(() => {
    carregarVeiculos();
    carregarManutencoesEncerradas();
  }, []);

  return (
    <div>
      <Menu />

      <div className="page">

        <div className="card">
          <h1>Manutenções Encerradas</h1>
          <br />
        </div>

        <div className="manutencoes-grid">

          {manutencoes.length === 0 && (
            <div className="card">
              <p>Nenhuma manutenção encerrada.</p>
            </div>
          )}

          {manutencoes.map((manutencao) => {

            const veiculo =
              obterVeiculo(manutencao.veiculoId);

            return (
              <div
                key={manutencao.id}
                className="manutencao-card"
              >
                <h2>
                  {veiculo?.marca} {veiculo?.modelo}
                </h2>

                <p>
                  <strong>Placa:</strong>{" "}
                  {veiculo?.placa}
                </p>

                <p>
                  <strong>Manutenção:</strong>{" "}
                  {manutencao.tipo}
                </p>

                <p>
                  <strong>Data:</strong>{" "}
                  {manutencao.data}
                </p>

                <p>
                  <strong>KM:</strong>{" "}
                  {manutencao.kmAtual}
                </p>

                <p>
                  <strong>Intervalo:</strong>{" "}
                  {manutencao.intervaloKm} KM
                </p>

                <p>
                  <strong>Observação:</strong>{" "}
                  {manutencao.observacao || "-"}
                </p>

                <br />

                <span
                  style={{
                    color: "#777",
                    fontWeight: "bold"
                  }}
                >
                  ⚫ ENCERRADA
                </span>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}