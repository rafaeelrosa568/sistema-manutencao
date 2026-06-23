import { useNavigate } from "react-router-dom";
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
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // <-- Adicionado aqui

  const [veiculos, setVeiculos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [veiculoId, setVeiculoId] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [kmAtual, setKmAtual] = useState("");
  const [intervaloKm, setIntervaloKm] = useState("");
  const [intervaloMeses, setIntervaloMeses] = useState("");
  const [observacao, setObservacao] = useState("");

  // KM digitado para consulta
  const [kmConsulta, setKmConsulta] = useState({});

  const [modalVer, setModalVer] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [manutencaoSelecionada, setManutencaoSelecionada] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  async function carregarVeiculos() {
    const querySnapshot = await getDocs(collection(db, "veiculos"));
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
    const querySnapshot = await getDocs(collection(db, "manutencoes"));
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
    return veiculos.find((v) => v.id === id);
  }

  async function cadastrarManutencao(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "manutencoes"), {
        veiculoId,
        tipo,
        data,
        kmAtual: Number(kmAtual),
        intervaloKm: Number(intervaloKm),
        intervaloMeses: Number(intervaloMeses),
        observacao,
        status: "ativa"
      });
      alert("Manutenção cadastrada com sucesso");
      limparFormulario();
      carregarManutencoes();
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    try {
      const manutencaoRef = doc(db, "manutencoes", editandoId);
      await updateDoc(manutencaoRef, {
        veiculoId,
        tipo,
        data,
        kmAtual: Number(kmAtual),
        intervaloKm: Number(intervaloKm),
        intervaloMeses: Number(intervaloMeses),
        observacao
      });
      alert("Manutenção atualizada");
      limparFormulario();
      carregarManutencoes();
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  // NOVA FUNÇÃO SUBSTITUÍDA AQUI
  async function finalizarManutencao(id) {
    try {
      const manutencaoRef = doc(db, "manutencoes", id);

      await updateDoc(manutencaoRef, {
        status: "encerrada"
      });

      alert("Manutenção finalizada com sucesso");

      navigate("/manutencoesEncerradas");

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  }

  function abrirVisualizacao(manutencao) {
    setManutencaoSelecionada(manutencao);
    setModalVer(true);
  }

  function abrirEditar(manutencao) {
    setVeiculoId(manutencao.veiculoId);
    setTipo(manutencao.tipo);
    setData(manutencao.data);
    setKmAtual(manutencao.kmAtual);
    setIntervaloKm(manutencao.intervaloKm);
    setIntervaloMeses(manutencao.intervaloMeses);
    setObservacao(manutencao.observacao);
    setEditandoId(manutencao.id);
    setModalEditar(true);
  }

  function calcularProximaTroca(manutencao) {
    return Number(manutencao.kmAtual) + Number(manutencao.intervaloKm);
  }

  function calcularKmRestante(manutencao) {
    const kmAtualVeiculo = Number(kmConsulta[manutencao.id] || 0);
    const proximaTroca = Number(manutencao.kmAtual) + Number(manutencao.intervaloKm);
    return proximaTroca - kmAtualVeiculo;
  }

  function calcularDataVencimento(manutencao) {
    if (!manutencao?.data) {
      return "";
    }
    const data = new Date(manutencao.data + "T00:00:00");
    data.setMonth(data.getMonth() + Number(manutencao.intervaloMeses || 0));
    return data.toLocaleDateString("pt-BR");
  }

  function calcularStatus(manutencao) {
    if (manutencao.status === "encerrada") {
      return {
        cor: "#777",
        texto: "⚫ Encerrada"
      };
    }

    const restante = calcularKmRestante(manutencao);

    if (restante <= 0) {
      return {
        cor: "red",
        texto: `🔴 Vencida (${Math.abs(restante)} KM excedidos)`
      };
    }

    if (restante <= 1000) {
      return {
        cor: "#ff9800",
        texto: `🟡 Faltam ${restante} KM`
      };
    }

    return {
      cor: "green",
      texto: `🟢 OK (${restante} KM restantes)`
    };
  }

  return (
    <div>
      <Menu />

      <div className="page">
        {user.perfil === "administrador" && (
          <div className="card">
            <h1>Manutenções</h1>
            <br />
            <form className="form-padrao" onSubmit={cadastrarManutencao}>
              <select
                value={veiculoId}
                onChange={(e) => setVeiculoId(e.target.value)}
                required
              >
                <option value="">Selecione Veículo</option>
                {veiculos.map((veiculo) => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.marca} - {veiculo.modelo} - {veiculo.placa}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Tipo da manutenção"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="KM da manutenção"
                value={kmAtual}
                onChange={(e) => setKmAtual(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Intervalo KM"
                value={intervaloKm}
                onChange={(e) => setIntervaloKm(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Intervalo meses"
                value={intervaloMeses}
                onChange={(e) => setIntervaloMeses(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />

              <button type="submit">Cadastrar</button>
            </form>
          </div>
        )}

        <br />

        <div className="manutencoes-grid">
          {manutencoes.map((manutencao) => {
            const veiculo = obterVeiculo(manutencao.veiculoId);
            const restante = calcularKmRestante(manutencao);

            return (
              <div key={manutencao.id} className="manutencao-card">
                <h2>{veiculo?.marca} {veiculo?.modelo}</h2>
                <p><strong>Manutenção:</strong> {manutencao.tipo}</p>
                <p><strong>Data:</strong> {manutencao.data}</p>
                <p><strong>KM da manutenção:</strong> {manutencao.kmAtual}</p>
                <p>
                  <strong>Próxima troca:</strong>{" "}
                  {calcularProximaTroca(manutencao)} KM
                </p>
                <p>
                  <strong>Vencimento:</strong>{" "}
                  {calcularDataVencimento(manutencao)}
                </p>

                <br />

                <input
                  type="number"
                  placeholder="KM atual do veículo"
                  value={kmConsulta[manutencao.id] || ""}
                  onChange={(e) =>
                    setKmConsulta({
                      ...kmConsulta,
                      [manutencao.id]: Number(e.target.value)
                    })
                  }
                />

                <p style={{ marginTop: 10, fontWeight: "bold" }}>
                  Restante: {restante} KM
                </p>

                <div>
                  <span
                    style={{
                      color: calcularStatus(manutencao).cor,
                      fontWeight: "bold"
                    }}
                  >
                    {calcularStatus(manutencao).texto}
                  </span>
                </div>

                <br />

                <div className="acoes-card">
                  <button onClick={() => abrirVisualizacao(manutencao)}>Ver</button>
                  {user.perfil === "administrador" && (
                    <button onClick={() => abrirEditar(manutencao)}>Editar</button>
                  )}
                  {user.perfil === "administrador" &&
                    manutencao.status !== "encerrada" && (
                      <button onClick={() => finalizarManutencao(manutencao.id)}>
                        Finalizar
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalVer && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Detalhes da Manutenção</h2>
            <br />
            <p><strong>Tipo:</strong> {manutencaoSelecionada?.tipo}</p>
            <p><strong>Data:</strong> {manutencaoSelecionada?.data}</p>
            <p><strong>KM da Manutenção:</strong> {manutencaoSelecionada?.kmAtual}</p>
            <p><strong>Intervalo KM:</strong> {manutencaoSelecionada?.intervaloKm}</p>
            <p><strong>Intervalo Meses:</strong> {manutencaoSelecionada?.intervaloMeses}</p>
            <p>
              <strong>Próxima Troca:</strong>{" "}
              {calcularProximaTroca(manutencaoSelecionada)} KM
            </p>
            <p><strong>Observação:</strong> {manutencaoSelecionada?.observacao}</p>
            <br />
            <div className="modal-buttons">
              <button onClick={() => window.print()}>Imprimir</button>
              <button
                onClick={() => {
                  const texto = `\nMANUTENÇÃO\n\nTipo: ${manutencaoSelecionada?.tipo}\n\nData: ${manutencaoSelecionada?.data}\n\nKM: ${manutencaoSelecionada?.kmAtual}\n\nPróxima Troca:\n${calcularProximaTroca(manutencaoSelecionada)} KM\n\nObservação:\n${manutencaoSelecionada?.observacao}\n`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
                }}
              >
                WhatsApp
              </button>
              <button
                onClick={() => {
                  const assunto = "Detalhes da Manutenção";
                  const body = `\nTipo: ${manutencaoSelecionada?.tipo}\n\nData: ${manutencaoSelecionada?.data}\n\nKM: ${manutencaoSelecionada?.kmAtual}\n\nPróxima Troca:\n${calcularProximaTroca(manutencaoSelecionada)} KM\n\nObservação:\n${manutencaoSelecionada?.observacao}\n`;
                  window.location.href = `mailto:?subject=${assunto}&body=${encodeURIComponent(body)}`;
                }}
              >
                E-mail
              </button>
              <button onClick={() => setModalVer(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {modalEditar && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Manutenção</h2>
            <br />
            <form onSubmit={salvarEdicao}>
              <input
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
              <input
                type="number"
                value={kmAtual}
                onChange={(e) => setKmAtual(e.target.value)}
                required
              />
              <input
                type="number"
                value={intervaloKm}
                onChange={(e) => setIntervaloKm(e.target.value)}
                required
              />
              <input
                type="number"
                value={intervaloMeses}
                onChange={(e) => setIntervaloMeses(e.target.value)}
                required
              />
              <input
                type="text"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
              <div className="modal-buttons">
                <button type="submit">Salvar</button>
                <button type="button" onClick={limparFormulario}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
