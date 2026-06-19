import { useEffect, useState }
from "react";

import Menu from "../components/Menu";

import {
  collection,
 addDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { db }
from "../firebase";

export default function Manutencoes() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [veiculos,
    setVeiculos] =
    useState([]);

  const [veiculoId,
    setVeiculoId] =
    useState("");

  const [tipo,
    setTipo] =
    useState("");

  const [data,
    setData] =
    useState("");

  const [kmAtual,
    setKmAtual] =
    useState("");

  const [intervaloKm,
    setIntervaloKm] =
    useState("");

  const [
    intervaloMeses,
    setIntervaloMeses
  ] = useState("");

  const [observacao,
    setObservacao] =
    useState("");

  const [
    manutencoes,
    setManutencoes
  ] = useState([]);

  const [kmAtualVeiculo,
    setKmAtualVeiculo] =
    useState({});

  const [modalVisualizar,
    setModalVisualizar] =
    useState(false);

  const [
    manutencaoSelecionada,
    setManutencaoSelecionada
  ] = useState(null);

  async function carregarVeiculos() {

    const querySnapshot =
      await getDocs(
        collection(
          db,
          "veiculos"
        )
      );

    let lista = [];

    querySnapshot.forEach(
      (docItem) => {

      lista.push({
        id: docItem.id,
        ...docItem.data()
      });

    });

    setVeiculos(lista);
  }

  async function carregarManutencoes() {

    const querySnapshot =
      await getDocs(
        collection(
          db,
          "manutencoes"
        )
      );

    let lista = [];

    querySnapshot.forEach(
      (docItem) => {

      lista.push({
        id: docItem.id,
        ...docItem.data()
      });

    });

    setManutencoes(lista);
  }

  useEffect(() => {

    carregarVeiculos();

    carregarManutencoes();

  }, []);

  async function cadastrarManutencao(e) {

    e.preventDefault();

    try {

      await addDoc(
        collection(
          db,
          "manutencoes"
        ),
        {
          veiculoId,
          tipo,
          data,
          kmAtual:
            Number(kmAtual),
          intervaloKm:
            Number(intervaloKm),
          intervaloMeses:
            Number(
              intervaloMeses
            ),
          observacao,
          status: "ativa"
        }
      );

      alert(
        "Manutenção cadastrada"
      );

      setVeiculoId("");
      setTipo("");
      setData("");
      setKmAtual("");
      setIntervaloKm("");
      setIntervaloMeses("");
      setObservacao("");

      carregarManutencoes();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  async function finalizarManutencao(id) {

    try {

      const manutencaoRef =
        doc(
          db,
          "manutencoes",
          id
        );

      await updateDoc(
        manutencaoRef,
        {
          status: "encerrada"
        }
      );

      alert(
        "Manutenção finalizada"
      );

      carregarManutencoes();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  function obterVeiculo(id) {

    return veiculos.find(
      (v) => v.id === id
    );
  }

  function calcularStatus(
    manutencao
  ) {

    if (
      manutencao.status ===
      "encerrada"
    ) {

      return {
        cor: "#777",
        texto:
          "Finalizada"
      };
    }

    const atual =
      Number(
        kmAtualVeiculo[
          manutencao.veiculoId
        ] || 0
      );

    const limiteKm =
      manutencao.kmAtual +
      manutencao.intervaloKm;

    const restante =
      limiteKm - atual;

    if (restante <= 0) {

      return {
        cor: "red",
        texto:
          `🔴 Vencido (${Math.abs(
            restante
          )} KM excedidos)`
      };
    }

    if (restante <= 1000) {

      return {
        cor: "#ff9800",
        texto:
          `🟡 Faltam ${restante} KM`
      };
    }

    return {
      cor: "green",
      texto:
        `🟢 OK (${restante} KM restantes)`
    };
  }

  function abrirVisualizacao(
    manutencao
  ) {

    setManutencaoSelecionada(
      manutencao
    );

    setModalVisualizar(true);
  }

  return (

    <div>

      <Menu />

      <div className="page">

        {user.perfil ===
          "administrador" && (

          <div className="card">

            <h1>
              Manutenções
            </h1>

            <br />

            <form
              className="form-padrao"
              onSubmit={
                cadastrarManutencao
              }
            >

              <select
                value={veiculoId}
                onChange={(e) =>
                  setVeiculoId(
                    e.target.value
                  )
                }
                required
              >

                <option value="">
                  Selecione Veículo
                </option>

                {veiculos.map(
                  (veiculo) => (

                  <option
                    key={veiculo.id}
                    value={veiculo.id}
                  >

                    {veiculo.marca}
                    {" - "}
                    {veiculo.modelo}

                  </option>

                ))}

              </select>

              <input
                type="text"
                placeholder="Tipo"
                value={tipo}
                onChange={(e) =>
                  setTipo(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="date"
                value={data}
                onChange={(e) =>
                  setData(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="KM"
                value={kmAtual}
                onChange={(e) =>
                  setKmAtual(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="Intervalo KM"
                value={intervaloKm}
                onChange={(e) =>
                  setIntervaloKm(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="number"
                placeholder="Intervalo Meses"
                value={
                  intervaloMeses
                }
                onChange={(e) =>
                  setIntervaloMeses(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="text"
                placeholder="Observação"
                value={observacao}
                onChange={(e) =>
                  setObservacao(
                    e.target.value
                  )
                }
              />

              <button type="submit">

                Cadastrar

              </button>

            </form>

          </div>

        )}

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
                className="manutencao-card"
                key={manutencao.id}
              >

                <h2>

                  {veiculo?.marca}
                  {" "}
                  {veiculo?.modelo}

                </h2>

                <p>

                  <strong>
                    Tipo:
                  </strong>

                  {" "}
                  {manutencao.tipo}

                </p>

                <p>

                  <strong>
                    Data:
                  </strong>

                  {" "}
                  {manutencao.data}

                </p>

                <p>

                  <strong>
                    Próxima troca:
                  </strong>

                  {" "}

                  {manutencao.kmAtual +
                    manutencao.intervaloKm}

                  {" KM"}

                </p>

                <input
                  type="number"
                  placeholder="KM Atual"
                  value={
                    kmAtualVeiculo[
                      manutencao.veiculoId
                    ] || ""
                  }
                  onChange={(e) =>
                    setKmAtualVeiculo({
                      ...kmAtualVeiculo,

                      [manutencao.veiculoId]:
                        e.target.value
                    })
                  }
                />

                <div
                  style={{
                    marginTop: 10,
                    color:
                      calcularStatus(
                        manutencao
                      ).cor,
                    fontWeight:
                      "bold"
                  }}
                >

                  {
                    calcularStatus(
                      manutencao
                    ).texto
                  }

                </div>

                <div className="acoes-card">

                  <button
                    onClick={() =>
                      abrirVisualizacao(
                        manutencao
                      )
                    }
                  >
                    Ver
                  </button>

                  {user.perfil ===
                    "administrador" &&

                    (
                      manutencao.status ===
                        "ativa"

                      ||

                      !manutencao.status
                    ) && (

                    <button
                      onClick={() =>
                        finalizarManutencao(
                          manutencao.id
                        )
                      }
                    >
                      Finalizar
                    </button>

                  )}

                </div>

              </div>

            );
          })}

        </div>

      </div>

      {modalVisualizar && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Detalhes
            </h2>

            <br />

            <p>

              <strong>
                Tipo:
              </strong>

              {" "}

              {
                manutencaoSelecionada?.tipo
              }

            </p>

            <br />

            <p>

              <strong>
                Observação:
              </strong>

              {" "}

              {
                manutencaoSelecionada?.observacao
              }

            </p>

            <br />

            <div className="modal-buttons">

              <button
                onClick={() =>
                  window.print()
                }
              >
                Imprimir
              </button>

              <button
                onClick={() =>
                  setModalVisualizar(
                    false
                  )
                }
              >
                Fechar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
