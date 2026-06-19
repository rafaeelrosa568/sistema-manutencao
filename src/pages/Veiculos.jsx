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

export default function Veiculos() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [marca,setMarca]=useState("");
  const [modelo,setModelo]=useState("");
  const [placa,setPlaca]=useState("");
  const [cor,setCor]=useState("");
  const [tipo,setTipo]=useState("");
  const [km,setKm]=useState("");

  const [veiculos,setVeiculos]=
    useState([]);

  const [modalVer,setModalVer]=
    useState(false);

  const [modalEditar,
    setModalEditar]=
    useState(false);

  const [veiculoSelecionado,
    setVeiculoSelecionado]=
    useState(null);

  const [editandoId,
    setEditandoId]=
    useState(null);


  async function carregarVeiculos(){

    const querySnapshot=
      await getDocs(
        collection(
          db,
          "veiculos"
        )
      );

    let lista=[];

    querySnapshot.forEach(
      (docItem)=>{

      lista.push({
        id:docItem.id,
        ...docItem.data()
      });

    });

    setVeiculos(lista);
  }

  useEffect(()=>{

    carregarVeiculos();

  },[]);


  async function cadastrarVeiculo(e){

    e.preventDefault();

    try{

      await addDoc(
        collection(
          db,
          "veiculos"
        ),
        {
          marca,
          modelo,
          placa,
          cor,
          tipo,
          km:Number(km),
          ativo:true
        }
      );

      limparFormulario();

      carregarVeiculos();

      alert(
        "Veículo cadastrado"
      );

    }catch(error){

      console.log(error);

      alert(
        error.message
      );
    }

  }


  function limparFormulario(){

    setMarca("");
    setModelo("");
    setPlaca("");
    setCor("");
    setTipo("");
    setKm("");

    setEditandoId(null);

    setModalEditar(false);

  }


  function abrirModalVisualizar(
    veiculo
  ){

    setVeiculoSelecionado(
      veiculo
    );

    setModalVer(true);

  }


  function abrirModalEditar(
    veiculo
  ){

    setMarca(
      veiculo.marca
    );

    setModelo(
      veiculo.modelo
    );

    setPlaca(
      veiculo.placa
    );

    setCor(
      veiculo.cor
    );

    setTipo(
      veiculo.tipo
    );

    setKm(
      veiculo.km
    );

    setEditandoId(
      veiculo.id
    );

    setModalEditar(
      true
    );

  }


  async function salvarEdicao(
    e
  ){

    e.preventDefault();

    try{

      const ref=
      doc(
        db,
        "veiculos",
        editandoId
      );

      await updateDoc(
        ref,
        {
          marca,
          modelo,
          placa,
          cor,
          tipo,
          km:Number(km)
        }
      );

      alert(
        "Veículo atualizado"
      );

      limparFormulario();

      carregarVeiculos();

    }catch(error){

      console.log(error);

      alert(
        error.message
      );

    }

  }


  async function alterarStatus(
    id,
    status
  ){

    const ref=
    doc(
      db,
      "veiculos",
      id
    );

    await updateDoc(
      ref,
      {
        ativo:status
      }
    );

    carregarVeiculos();

  }

  return(

<div>

<Menu/>

<div className="page">

{user.perfil==="administrador"&&(

<div className="card">

<h1>Veículos</h1>

<br/>

<form
className="form-padrao"
onSubmit={
cadastrarVeiculo
}
>

<input
type="text"
placeholder="Marca"
value={marca}
onChange={(e)=>
setMarca(
e.target.value
)}
required
/>

<input
type="text"
placeholder="Modelo"
value={modelo}
onChange={(e)=>
setModelo(
e.target.value
)}
required
/>

<input
type="text"
placeholder="Placa"
value={placa}
onChange={(e)=>
setPlaca(
e.target.value
)}
required
/>

<input
type="text"
placeholder="Cor"
value={cor}
onChange={(e)=>
setCor(
e.target.value
)}
required
/>

<input
type="text"
placeholder="Tipo"
value={tipo}
onChange={(e)=>
setTipo(
e.target.value
)}
required
/>

<input
type="number"
placeholder="KM"
value={km}
onChange={(e)=>
setKm(
e.target.value
)}
required
/>

<button type="submit">

Cadastrar

</button>

</form>

</div>

)}

<br/>

<div className="veiculos-grid">

{veiculos.map(
(veiculo)=>(

<div
key={veiculo.id}
className="veiculo-card"
>

<h2>

{veiculo.marca}
{" "}
{veiculo.modelo}

</h2>

<p>

<strong>Placa:</strong>

{" "}

{veiculo.placa}

</p>

<p>

<strong>Tipo:</strong>

{" "}

{veiculo.tipo}

</p>

<p>

<strong>KM:</strong>

{" "}

{veiculo.km}

</p>

<p>

<strong>Status:</strong>

{" "}

{veiculo.ativo ? (

<span className="status-ativo">

Ativo

</span>

) : (

<span className="status-inativo">

Inativo

</span>

)}

</p>


<div className="acoes-card">

<button
onClick={()=>abrirModalVisualizar(
veiculo
)}
>

Ver

</button>

{user.perfil==="administrador"&&(

<>

<button
onClick={()=>abrirModalEditar(
veiculo
)}
>

Editar

</button>


<button
onClick={()=>alterarStatus(
veiculo.id,
!veiculo.ativo
)}
>

{veiculo.ativo
?"Inativar"
:"Ativar"}

</button>

</>

)}

</div>

</div>

))}

</div>

</div>

{modalVer&&(

<div className="modal-overlay">

<div className="modal">

<h2>

Detalhes do Veículo

</h2>

<br/>

<p><strong>Marca:</strong> {veiculoSelecionado?.marca}</p>

<p><strong>Modelo:</strong> {veiculoSelecionado?.modelo}</p>

<p><strong>Placa:</strong> {veiculoSelecionado?.placa}</p>

<p><strong>Cor:</strong> {veiculoSelecionado?.cor}</p>

<p><strong>Tipo:</strong> {veiculoSelecionado?.tipo}</p>

<p><strong>KM:</strong> {veiculoSelecionado?.km}</p>

<br/>

<button
onClick={()=>
setModalVer(false)
}
>

Fechar

</button>

</div>

</div>

)}

{modalEditar&&(

<div className="modal-overlay">

<div className="modal">

<h2>

Editar Veículo

</h2>

<br/>

<form
onSubmit={
salvarEdicao
}
>

<input
value={marca}
onChange={(e)=>
setMarca(
e.target.value
)}
/>

<input
value={modelo}
onChange={(e)=>
setModelo(
e.target.value
)}
/>

<input
value={placa}
onChange={(e)=>
setPlaca(
e.target.value
)}
/>

<input
value={cor}
onChange={(e)=>
setCor(
e.target.value
)}
/>

<input
value={tipo}
onChange={(e)=>
setTipo(
e.target.value
)}
/>

<input
type="number"
value={km}
onChange={(e)=>
setKm(
e.target.value
)}
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
