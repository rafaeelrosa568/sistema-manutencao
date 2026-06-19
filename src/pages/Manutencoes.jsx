import { useEffect, useState } from "react";

import Menu from "../components/Menu";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

export default function Manutencoes() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [veiculos, setVeiculos] =
    useState([]);

  const [veiculoId, setVeiculoId] =
    useState("");

  const [tipo, setTipo] =
    useState("");

  const [data, setData] =
    useState("");

  const [kmAtual, setKmAtual] =
    useState("");

  const [intervaloKm, setIntervaloKm] =
    useState("");

  const [
    intervaloMeses,
    setIntervaloMeses
  ] = useState("");

  const [observacao, setObservacao] =
    useState("");

  const [
    manutencoes,
    setManutencoes
  ] = useState([]);

  const [kmAtualVeiculo, setKmAtualVeiculo] =
    useState({});

  const [modalDetalhes,
    setModalDetalhes] =
    useState(false);

  const [
    manutencaoSelecionada,
    setManutencaoSelecionada
  ] = useState(null);

  const [modalEditar,
    setModalEditar] =
    useState(false);

  const [editandoId,
    setEditandoId] =
    useState(null);

  async function carregarVeiculos() {

    const querySnapshot =
      await getDocs(
        collection(db, "veiculos")
      );

    let lista = [];

    querySnapshot.forEach((docItem) => {

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
        collection(db, "manutencoes")
      );

    let lista = [];

    querySnapshot.forEach((docItem) => {

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
            Number(intervaloMeses),
          observacao,
          status: "ativa"
        }
      );

      alert(
        "Manutenção cadastrada"
      );

      limparFormulario();

      carregarManutencoes();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  function limparFormulario() {

    setVeiculoId("");
    setTipo("");
    setData("");
    setKmAtual("");
    setIntervaloKm("");
    setIntervaloMeses("");
    setObservacao("");

    setEditandoId(null);

    setModalEditar(false);
  }

  function obterVeiculo(id) {

    return veiculos.find(
      (v) => v.id === id
    );
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

  function calcularStatus(manutencao) {

    if (
      manutencao.status ===
      "encerrada"
    ) {

      return {
        cor: "#777",
        texto: "⚫ Encerrada"
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

  function abrirDetalhes(
    manutencao
  ) {

    setManutencaoSelecionada(
      manutencao
    );

    setModalDetalhes(true);
  }

  function abrirEditar(
    manutencao
  ) {

    setVeiculoId(
      manutencao.veiculoId
    );

    setTipo(
      manutencao.tipo
    );

    setData(
      manutencao.data
    );

    setKmAtual(
      manutencao.kmAtual
    );

    setIntervaloKm(
      manutencao.intervaloKm
    );

    setIntervaloMeses(
      manutencao.intervaloMeses
    );

    setObservacao(
      manutencao.observacao
    );

    setEditandoId(
      manutencao.id
    );

    setModalEditar(true);
  }

  async function salvarEdicao(e) {

    e.preventDefault();

    try {

      const manutencaoRef =
        doc(
          db,
          "manutencoes",
          editandoId
        );

      await updateDoc(
        manutencaoRef,
        {
          veiculoId,
          tipo,
          data,
          kmAtual:
            Number(kmAtual),
          intervaloKm:
            Number(intervaloKm),
          intervaloMeses:
            Number(intervaloMeses),
          observacao
        }
      );

      alert(
        "Manutenção atualizada"
      );

      limparFormulario();

      carregarManutencoes();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  return (

    <div>

      <Menu />

      <div className="page">

        {user.perfil ===
          "administrador" && (

          <div className="card">

            <h1>Manutenções</h1>

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
                      {" - "}
                      {veiculo.placa}

                    </option>

                  )
                )}

              </select>

              <input
                type="text"
                placeholder="Tipo manutenção"
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
                placeholder="KM manutenção"
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
                placeholder="Intervalo meses"
                value={intervaloMeses}
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
                      Manutenção:
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

                  <div>

                    {manutencao.status ===
                    "ativa" ? (

                      <span className="status-ativo">

                        Ativa

                      </span>

                    ) : (

                      <span className="status-finalizada">

                        Encerrada

                      </span>

                    )}

                  </div>

                  <br />

                  <div>

                    <span
                      style={{
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

                    </span>

                  </div>

                  <br />

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

                  <br />
                  <br />

                  <div className="acoes-card">

                    <button
                      onClick={() =>
                        abrirDetalhes(
                          manutencao
                        )
                      }
                    >

                      Ver

                    </button>

                    {user.perfil ===
                      "administrador" && (

                      <button
                        onClick={() =>
                          abrirEditar(
                            manutencao
                          )
                        }
                      >

                        Editar

                      </button>

                    )}

                    {user.perfil ===
                      "administrador" &&

                      manutencao.status ===
                        "ativa" && (

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
            }
          )}

        </div>

      </div>

      {modalDetalhes && (

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

            <p>

              <strong>
                Data:
              </strong>

              {" "}

              {
                manutencaoSelecionada?.data
              }

            </p>

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
                onClick={() => {

                  const texto = `
Manutenção:
${manutencaoSelecionada?.tipo}

Data:
${manutencaoSelecionada?.data}

Observação:
${manutencaoSelecionada?.observacao}
`;

                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(texto)}`
                  );
                }}
              >

                WhatsApp

              </button>

              <button
                onClick={() => {

                  const assunto =
                    "Detalhes Manutenção";

                  const body = `
Tipo:
${manutencaoSelecionada?.tipo}

Data:
${manutencaoSelecionada?.data}

Observação:
${manutencaoSelecionada?.observacao}
`;

                  window.location.href =
                    `mailto:?subject=${assunto}&body=${encodeURIComponent(body)}`;
                }}
              >

                Email

              </button>

              <button
                onClick={() =>
                  setModalDetalhes(false)
                }
              >

                Fechar

              </button>

            </div>

          </div>

        </div>

      )}

      {modalEditar && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Editar Manutenção
            </h2>

            <br />

            <form
              onSubmit={
                salvarEdicao
              }
            >

              <input
                type="text"
                value={tipo}
                onChange={(e) =>
                  setTipo(
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                value={data}
                onChange={(e) =>
                  setData(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                value={kmAtual}
                onChange={(e) =>
                  setKmAtual(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                value={intervaloKm}
                onChange={(e) =>
                  setIntervaloKm(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                value={intervaloMeses}
                onChange={(e) =>
                  setIntervaloMeses(
                    e.target.value
                  )
                }
              />

              <input
                type="text"
                value={observacao}
                onChange={(e) =>
                  setObservacao(
                    e.target.value
                  )
                }
              />

              <div className="modal-buttons">

                <button type="submit">

                  Salvar

                </button>

                <button
                  type="button"
                  onClick={
                    limparFormulario
                  }
                >

                  Cancelar

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
