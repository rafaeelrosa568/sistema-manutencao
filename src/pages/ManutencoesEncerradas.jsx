import { useEffect, useState } from "react";
import Menu from "../components/Menu";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function ManutencoesEncerradas() {
  const [manutencoes, setManutencoes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true); // Trava de segurança para o carregamento

  async function carregarDados() {
    try {
      setCarregando(true);
      
      const manutencoesSnapshot = await getDocs(collection(db, "manutencoes"));
      let listaManutencoes = [];

      manutencoesSnapshot.forEach((docItem) => {
        const dados = docItem.data();
        if (dados.status === "encerrada") {
          listaManutencoes.push({
            id: docItem.id,
            ...dados
          });
        }
      });

      setManutencoes(listaManutencoes);

      const veiculosSnapshot = await getDocs(collection(db, "veiculos"));
      let listaVeiculos = [];

      veiculosSnapshot.forEach((docItem) => {
        listaVeiculos.push({
          id: docItem.id,
          ...docItem.data()
        });
      });

      setVeiculos(listaVeiculos);
    } catch (error) {
      console.error("Erro ao carregar dados do Firebase:", error);
    } finally {
      setCarregando(false); // Libera a tela após carregar tudo
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Função protegida contra ID inexistente ou nulo
  function obterVeiculo(id) {
    if (!id || veiculos.length === 0) return null;
    return veiculos.find((v) => v.id === id) || null;
  }

  return (
    <div>
      <Menu />

      <div className="page">
        <h1>Histórico de Manutenções</h1>
        <br />

        {carregando ? (
          <p>Carregando histórico...</p>
        ) : manutencoes.length === 0 ? (
          <p>Nenhuma manutenção encerrada encontrada.</p>
        ) : (
          <div className="manutencoes-grid">
            {manutencoes.map((manutencao) => {
              const veiculo = obterVeiculo(manutencao.veiculoId);

              return (
                <div className="manutencao-card encerrada" key={manutencao.id}>
                  <h3>{manutencao.tipo || "Tipo não informado"}</h3>
                  
                  <p>
                    <strong>Veículo:</strong>{" "}
                    {veiculo ? `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})` : "Veículo não encontrado"}
                  </p>
                  
                  <p>
                    <strong>Data:</strong> {manutencao.data || "Sem data"}
                  </p>
                  
                  <p>
                    <strong>Observação:</strong> {manutencao.observacao || "Nenhuma"}
                  </p>
                  
                  <br />
                  
                  <span className="status-inativo">ENCERRADA</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
