import { useEffect, useState }
from "react";

import Menu
from "../components/Menu";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import {
  auth,
  db
} from "../firebase";

export default function Usuarios() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [perfil, setPerfil] =
    useState("motorista");

  const [usuarios,
    setUsuarios] =
    useState([]);

  const [modalEditar,
    setModalEditar] =
    useState(false);

  const [editandoId,
    setEditandoId] =
    useState(null);

  async function carregarUsuarios() {

    const querySnapshot =
      await getDocs(
        collection(
          db,
          "usuarios"
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

    setUsuarios(lista);
  }

  useEffect(() => {

    carregarUsuarios();

  }, []);

  function limparFormulario() {

    setNome("");
    setEmail("");
    setSenha("");
    setPerfil("motorista");

    setEditandoId(null);

    setModalEditar(false);
  }

  async function cadastrarUsuario(e) {

    e.preventDefault();

    try {

      const response =
        await createUserWithEmailAndPassword(
          auth,
          email,
          senha
        );

      const uid =
        response.user.uid;

      await addDoc(
        collection(
          db,
          "usuarios"
        ),
        {
          uid,
          nome,
          email,
          perfil,
          ativo: true
        }
      );

      alert(
        "Usuário cadastrado"
      );

      limparFormulario();

      carregarUsuarios();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  function abrirModalEditar(
    usuario
  ) {

    setNome(usuario.nome);

    setEmail(usuario.email);

    setPerfil(usuario.perfil);

    setEditandoId(
      usuario.id
    );

    setModalEditar(true);
  }

  async function salvarEdicao(e) {

    e.preventDefault();

    try {

      const userRef =
        doc(
          db,
          "usuarios",
          editandoId
        );

      await updateDoc(
        userRef,
        {
          nome,
          email,
          perfil
        }
      );

      alert(
        "Usuário atualizado"
      );

      limparFormulario();

      carregarUsuarios();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  async function alterarStatus(
    id,
    status
  ) {

    const userRef =
      doc(
        db,
        "usuarios",
        id
      );

    await updateDoc(
      userRef,
      {
        ativo: status
      }
    );

    carregarUsuarios();
  }

  async function redefinirSenha(
    email
  ) {

    try {

      await sendPasswordResetEmail(
        auth,
        email
      );

      alert(
        "Email de redefinição enviado"
      );

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  if (
    user.perfil !==
    "administrador"
  ) {

    return (

      <div>

        <Menu />

        <div className="page">

          <h2>
            Sem permissão
          </h2>

        </div>

      </div>
    );
  }

  return (

    <div>

      <Menu />

      <div className="page">

        <div className="card">

          <h1>
            Usuários
          </h1>

          <br />

          <form
            className="form-padrao"
            onSubmit={
              cadastrarUsuario
            }
          >

            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              required
            />

            <select
              value={perfil}
              onChange={(e) =>
                setPerfil(
                  e.target.value
                )
              }
            >

              <option value="motorista">
                Motorista
              </option>

              <option value="administrador">
                Administrador
              </option>

            </select>

            <button type="submit">

              Cadastrar

            </button>

          </form>

        </div>

        <br />

        <div className="usuarios-grid">

          {usuarios.map(
            (usuario) => (

            <div
              className="usuario-card"
              key={usuario.id}
            >

              <h2>
                {usuario.nome}
              </h2>

              <p>

                <strong>
                  Email:
                </strong>

                {" "}

                {usuario.email}

              </p>

              <p>

                <strong>
                  Perfil:
                </strong>

                {" "}

                {usuario.perfil}

              </p>

              <p>

                <strong>
                  Status:
                </strong>

                {" "}

                {usuario.ativo ? (

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
                  onClick={() =>
                    abrirModalEditar(
                      usuario
                    )
                  }
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    redefinirSenha(
                      usuario.email
                    )
                  }
                >
                  Reset Senha
                </button>

                <button
                  onClick={() =>
                    alterarStatus(
                      usuario.id,
                      !usuario.ativo
                    )
                  }
                >

                  {usuario.ativo
                    ? "Inativar"
                    : "Ativar"}

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {modalEditar && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Editar Usuário
            </h2>

            <br />

            <form
              onSubmit={
                salvarEdicao
              }
            >

              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) =>
                  setNome(
                    e.target.value
                  )
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />

              <select
                value={perfil}
                onChange={(e) =>
                  setPerfil(
                    e.target.value
                  )
                }
              >

                <option value="motorista">
                  Motorista
                </option>

                <option value="administrador">
                  Administrador
                </option>

              </select>

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
