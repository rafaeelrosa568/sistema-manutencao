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

  const [manutencoes,
    setManutencoes] =
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

  const [kmConsulta,
    setKmConsulta] =
    useState({});

  const [modalVer,
    setModalVer] =
    useState(false);

  const [modalEditar,
    setModalEditar] =
    useState(false);

  const [
    manutencaoSelecionada,
    setManutencaoSelecionada
  ] = useState(null);

  const [editandoId,
    setEditandoId] =
    useState(null);

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

      }
    );

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

      }
    );

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
        "Manutenção cadastrada com sucesso"
      );

      limparFormulario();

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

  function calcularProximaTroca(
    manutencao
  ) {

    return (
      Number(
        manutencao.kmAtual
      ) +
      Number(
        manutencao.intervaloKm
      )
    );
  }

  function calcularKmRestante(
    manutencao
  ) {

    const kmDigitado =
      Number(
        kmConsulta[
          manutencao.id
        ] || 0
      );

    const proximaTroca =
      calcularProximaTroca(
        manutencao
      );

    return (
      proximaTroca -
      kmDigitado
    );
  }

  function calcularDataVencimento(
    manutencao
  ) {

    const dataBase =
      new Date(
        manutencao.data
      );

    dataBase.setMonth(
      dataBase.getMonth() +
      Number(
        manutencao.intervaloMeses
      )
    );

    return dataBase;
  }
function calcularStatus(
    manutencao
  ) {

    if (
      manutencao.status ===
      "historico"
    ) {

      return {
        cor: "#2196f3",
        texto: "📁 Histórico"
      };
    }

    const restanteKm =
      calcularKmRestante(
        manutencao
      );

    const dataVencimento =
      calcularDataVencimento(
        manutencao
      );

    const hoje =
      new Date();

    if (
      hoje > dataVencimento
    ) {

      return {
        cor: "red",
        texto:
          "🔴 Vencida por data"
      };
    }

    if (
      restanteKm <= 0
    ) {

      return {
        cor: "red",
        texto:
          `🔴 Vencido há ${Math.abs(
            restanteKm
          )} KM`
      };
    }

    if (
      restanteKm <= 1000
    ) {

      return {
        cor: "#ff9800",
        texto:
          `🟡 Faltam ${restanteKm} KM`
      };
    }

    return {
      cor: "green",
      texto:
        `🟢 OK (${restanteKm} KM restantes)`
    };
  }

  function abrirVisualizacao(
    manutencao
  ) {

    setManutencaoSelecionada(
      manutencao
    );

    setModalVer(true);
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

    setModalEditar(
      true
    );
  }

  async function salvarEdicao(
    e
  ) {

    e.preventDefault();

    try {

      const ref =
        doc(
          db,
          "manutencoes",
          editandoId
        );

      await updateDoc(
        ref,
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

  async function finalizarManutencao(
    id
  ) {

    try {

      const ref =
        doc(
          db,
          "manutencoes",
          id
        );

      await updateDoc(
        ref,
        {
          status:
            "historico"
        }
      );

      alert(
        "Manutenção movida para histórico"
      );

      carregarManutencoes();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  function formatarData(
    data
  ) {

    return data.toLocaleDateString(
      "pt-BR"
    );
  }

  return (

    <div>

      <Menu />

      <div className="page">
{user.perfil === "administrador" && (

<div className="card">

<h1>Manutenções</h1>

<br />

<form
className="form-padrao"
onSubmit={
editandoId
? salvarEdicao
: cadastrarManutencao
}
>

<select
value={veiculoId}
onChange={(e)=>
setVeiculoId(
e.target.value
)}
required
>

<option value="">
Selecione o Veículo
</option>

{veiculos.map(
(veiculo)=>(
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
onChange={(e)=>
setTipo(
e.target.value
)}
required
/>

<input
type="date"
value={data}
onChange={(e)=>
setData(
e.target.value
)}
required
/>

<input
type="number"
placeholder="KM da manutenção"
value={kmAtual}
onChange={(e)=>
setKmAtual(
e.target.value
)}
required
/>

<input
type="number"
placeholder="Intervalo KM"
value={intervaloKm}
onChange={(e)=>
setIntervaloKm(
e.target.value
)}
required
/>

<input
type="number"
placeholder="Intervalo em meses"
value={intervaloMeses}
onChange={(e)=>
setIntervaloMeses(
e.target.value
)}
required
/>

<input
type="text"
placeholder="Observação"
value={observacao}
onChange={(e)=>
setObservacao(
e.target.value
)}
/>

<button
type="submit"
>

{editandoId
? "Salvar Alterações"
: "Cadastrar"}

</button>

{editandoId && (

<button
type="button"
onClick={
limparFormulario
}
>

Cancelar

</button>

)}

</form>

</div>

)}

<br />

<div className="manutencoes-grid">

{manutencoes.map(
(manutencao)=>{

const veiculo =
obterVeiculo(
manutencao.veiculoId
);

const status =
calcularStatus(
manutencao
);

const proximaTroca =
calcularProximaTroca(
manutencao
);

const restanteKm =
calcularKmRestante(
manutencao
);

const vencimento =
calcularDataVencimento(
manutencao
);

return(

<div
key={manutencao.id}
className="manutencao-card"
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
KM realizado:
</strong>

{" "}

{manutencao.kmAtual}

</p>

<p>

<strong>
Próxima troca:
</strong>

{" "}

{proximaTroca}
{" KM"}

</p>

<p>

<strong>
Vencimento:
</strong>

{" "}

{formatarData(
vencimento
)}

</p>

<input
type="number"
placeholder="Digite KM atual"
value={
kmConsulta[
manutencao.id
] || ""
}
onChange={(e)=>
setKmConsulta({

...kmConsulta,

[manutencao.id]:
e.target.value

})
}
/>

<br />
<br />

<p>

<strong>
Restante:
</strong>

{" "}

{restanteKm > 0
? `${restanteKm} KM`
: `Vencido ${Math.abs(restanteKm)} KM`
}

</p>

<div
style={{
color:
status.cor,
fontWeight:
"bold"
}}
>

{status.texto}

</div>

<br />

<div
className="acoes-card"
>

<button
onClick={()=>
abrirVisualizacao(
manutencao
)
}
>

Ver

</button>

{user.perfil ===
"administrador" && (

<button
onClick={()=>
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

manutencao.status !==
"historico" && (

<button
onClick={()=>
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

      {modalVer && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Detalhes da Manutenção
            </h2>

            <br />

            <p>
              <strong>Tipo:</strong>
              {" "}
              {manutencaoSelecionada?.tipo}
            </p>

            <p>
              <strong>Data:</strong>
              {" "}
              {manutencaoSelecionada?.data}
            </p>

            <p>
              <strong>KM da Manutenção:</strong>
              {" "}
              {manutencaoSelecionada?.kmAtual}
            </p>

            <p>
              <strong>Intervalo KM:</strong>
              {" "}
              {manutencaoSelecionada?.intervaloKm}
            </p>

            <p>
              <strong>Intervalo Meses:</strong>
              {" "}
              {manutencaoSelecionada?.intervaloMeses}
            </p>

            <p>
              <strong>Próxima Troca:</strong>
              {" "}
              {calcularProximaTroca(
                manutencaoSelecionada
              )}
              {" KM"}
            </p>

            <p>
              <strong>Observação:</strong>
              {" "}
              {manutencaoSelecionada?.observacao}
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
MANUTENÇÃO

Tipo:
${manutencaoSelecionada?.tipo}

Data:
${manutencaoSelecionada?.data}

KM:
${manutencaoSelecionada?.kmAtual}

Próxima Troca:
${calcularProximaTroca(
  manutencaoSelecionada
)} KM

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
                    "Detalhes da Manutenção";

                  const body = `
Tipo:
${manutencaoSelecionada?.tipo}

Data:
${manutencaoSelecionada?.data}

KM:
${manutencaoSelecionada?.kmAtual}

Próxima Troca:
${calcularProximaTroca(
  manutencaoSelecionada
)} KM

Observação:
${manutencaoSelecionada?.observacao}
`;

                  window.location.href =
                    `mailto:?subject=${assunto}&body=${encodeURIComponent(body)}`;

                }}
              >
                E-mail
              </button>

              <button
                onClick={() =>
                  setModalVer(false)
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
                value={observacao}
                onChange={(e) =>
                  setObservacao(
                    e.target.value
                  )
                }
              />

              <div
                className="modal-buttons"
              >

                <button
                  type="submit"
                >
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