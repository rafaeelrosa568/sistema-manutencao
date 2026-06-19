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

  const [
    kmAtualVeiculo,
    setKmAtualVeiculo
  ] = useState({});

  const [
    modalDetalhes,
    setModalDetalhes
  ] = useState(false);

  const [
    manutencaoSelecionada,
    setManutencaoSelecionada
  ] = useState(null);

  const [modalEditar, setModalEditar] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState("");

  const [editarTipo, setEditarTipo] =
    useState("");

  const [editarData, setEditarData] =
    useState("");

  const [editarKm, setEditarKm] =
    useState("");

  const [
    editarIntervaloKm,
    setEditarIntervaloKm
  ] = useState("");

  const [
    editarIntervaloMeses,
    setEditarIntervaloMeses
  ] = useState("");

  const [
    editarObservacao,
    setEditarObservacao
  ] = useState("");

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

  function abrirDetalhes(manutencao) {

    setManutencaoSelecionada(
      manutencao
    );

    setModalDetalhes(true);
  }

  function abrirEditar(manutencao) {

    setEditandoId(
      manutencao.id
    );

    setEditarTipo(
      manutencao.tipo
    );

    setEditarData(
      manutencao.data
    );

    setEditarKm(
      manutencao.kmAtual
    );

    setEditarIntervaloKm(
      manutencao.intervaloKm
    );

    setEditarIntervaloMeses(
      manutencao.intervaloMeses
    );

    setEditarObservacao(
      manutencao.observacao || ""
    );

    setModalEditar(true);
  }

  async function salvarEdicao() {

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
          tipo: editarTipo,

          data: editarData,

          kmAtual:
            Number(
              editarKm
            ),

          intervaloKm:
            Number(
              editarIntervaloKm
            ),

          intervaloMeses:
            Number(
              editarIntervaloMeses
            ),

          observacao:
            editarObservacao
        }
      );

      alert(
        "Manutenção atualizada"
      );

      setModalEditar(false);

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

  function calcularStatus(manutencao) {

    if (
      manutencao.status ===
      "encerrada"
    ) {

      return {
        cor: "#999",
        texto: "Finalizada"
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

  function imprimirDetalhes() {

    window.print();
  }

  function enviarWhatsApp() {

    const texto = `
Manutenção Veículo

Tipo:
${manutencaoSelecionada.tipo}

Data:
${manutencaoSelecionada.data}

KM:
${manutencaoSelecionada.kmAtual}

Observação:
${manutencaoSelecionada.observacao}
`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(texto)}`,
      "_blank"
    );
  }

  function enviarEmail() {

    const assunto =
      "Detalhes da manutenção";

    const corpo = `
Tipo:
${manutencaoSelecionada.tipo}

Data:
${manutencaoSelecionada.data}

KM:
${manutencaoSelecionada.kmAtual}

Observação:
${manutencaoSelecionada.observacao}
`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  }

  return (

    <div>

      <Menu />

      <div className="page">

        <h1>Manutenções</h1>

        <br />

        {user.perfil ===
          "administrador" && (

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
              placeholder="Tipo da manutenção"
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
              placeholder="KM da manutenção"
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

        )}

        <br />
        <br />

        <table className="tabela">

          <thead>

            <tr>

              <th>Veículo</th>
              <th>Manutenção</th>
              <th>Data</th>
              <th>KM</th>
              <th>KM Atual</th>
              <th>Próxima Troca</th>
              <th>Situação</th>
              <th>Status</th>
              <th>Detalhes</th>

              {user.perfil ===
                "administrador" && (
                <th>Ações</th>
              )}

            </tr>

          </thead>

          <tbody>

            {manutencoes.map(
              (manutencao) => {

                const veiculo =
                  obterVeiculo(
                    manutencao.veiculoId
                  );

                return (

                  <tr
                    key={manutencao.id}
                  >

                    <td>
                      {veiculo?.marca}
                      {" "}
                      {veiculo?.modelo}
                    </td>

                    <td>
                      {manutencao.tipo}
                    </td>

                    <td>
                      {manutencao.data}
                    </td>

                    <td>
                      {manutencao.kmAtual}
                    </td>

                    <td>

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

                    </td>

                    <td>

                      {manutencao.kmAtual +
                        manutencao.intervaloKm}
                      {" KM"}

                    </td>

                    <td>

                      {(
                        manutencao.status ===
                        "ativa" ||

                        !manutencao.status
                      ) ? (

                        <span
                          className="status-ativo"
                        >
                          Ativa
                        </span>

                      ) : (

                        <span
                          className="status-inativo"
                        >
                          Encerrada
                        </span>

                      )}

                    </td>

                    <td>

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

                    </td>

                    <td>

                      <button
                        onClick={() =>
                          abrirDetalhes(
                            manutencao
                          )
                        }
                      >
                        Ver
                      </button>

                    </td>

                    {user.perfil ===
                      "administrador" && (

                      <td>

                        <button
                          onClick={() =>
                            abrirEditar(
                              manutencao
                            )
                          }
                        >
                          Editar
                        </button>

                        {" "}

                        {(manutencao.status ===
                          "ativa" ||

                          !manutencao.status) && (

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

                      </td>

                    )}

                  </tr>

                );
              }
            )}

          </tbody>

        </table>

      </div>

      {modalDetalhes &&
      manutencaoSelecionada && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Detalhes Manutenção
            </h2>

            <br />

            <p>
              <strong>Tipo:</strong>
              {" "}
              {
                manutencaoSelecionada.tipo
              }
            </p>

            <br />

            <p>
              <strong>Data:</strong>
              {" "}
              {
                manutencaoSelecionada.data
              }
            </p>

            <br />

            <p>
              <strong>KM:</strong>
              {" "}
              {
                manutencaoSelecionada.kmAtual
              }
            </p>

            <br />

            <p>
              <strong>
                Intervalo KM:
              </strong>
              {" "}
              {
                manutencaoSelecionada.intervaloKm
              }
            </p>

            <br />

            <p>
              <strong>
                Intervalo Meses:
              </strong>
              {" "}
              {
                manutencaoSelecionada.intervaloMeses
              }
            </p>

            <br />

            <p>
              <strong>
                Observação:
              </strong>
            </p>

            <br />

            <div className="box-observacao">

              {
                manutencaoSelecionada.observacao ||
                "Sem observações"
              }

            </div>

            <br />

            <button
              onClick={
                imprimirDetalhes
              }
            >
              Imprimir
            </button>

            {" "}

            <button
              onClick={
                enviarWhatsApp
              }
            >
              WhatsApp
            </button>

            {" "}

            <button
              onClick={
                enviarEmail
              }
            >
              Email
            </button>

            {" "}

            <button
              onClick={() =>
                setModalDetalhes(false)
              }
            >
              Fechar
            </button>

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

            <input
              type="text"
              placeholder="Tipo"
              value={editarTipo}
              onChange={(e) =>
                setEditarTipo(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <input
              type="date"
              value={editarData}
              onChange={(e) =>
                setEditarData(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="KM"
              value={editarKm}
              onChange={(e) =>
                setEditarKm(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Intervalo KM"
              value={
                editarIntervaloKm
              }
              onChange={(e) =>
                setEditarIntervaloKm(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <input
              type="number"
              placeholder="Intervalo Meses"
              value={
                editarIntervaloMeses
              }
              onChange={(e) =>
                setEditarIntervaloMeses(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <textarea
              placeholder="Observação"
              value={
                editarObservacao
              }
              onChange={(e) =>
                setEditarObservacao(
                  e.target.value
                )
              }
            />

            <br />
            <br />

            <button
              onClick={
                salvarEdicao
              }
            >
              Salvar
            </button>

            {" "}

            <button
              onClick={() =>
                setModalEditar(false)
              }
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

    </div>
  );
}