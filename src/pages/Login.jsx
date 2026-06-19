import { useState } from "react";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

import { auth, db } from "../firebase";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [emailReset, setEmailReset] =
    useState("");

  const [modalReset, setModalReset] =
    useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const querySnapshot =
        await getDocs(
          collection(db, "usuarios")
        );

      let usuarioEncontrado = null;

      querySnapshot.forEach((doc) => {

        const dados = doc.data();

        if (
          dados.email === email
        ) {

          usuarioEncontrado = {
            id: doc.id,
            ...dados
          };
        }

      });

      if (!usuarioEncontrado) {

        alert(
          "Usuário não encontrado"
        );

        return;
      }

      if (
        usuarioEncontrado.ativo === false
      ) {

        alert(
          "Usuário inativo"
        );

        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(
          usuarioEncontrado
        )
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Email ou senha inválidos");
    }
  }

  async function resetarSenha() {

    try {

      await sendPasswordResetEmail(
        auth,
        emailReset
      );

      alert(
        "Email enviado com sucesso"
      );

      setEmailReset("");

      setModalReset(false);

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  return (

    <div className="login-container">

      <form
        className="login-form"
        onSubmit={handleLogin}
      >

        <h1>Conecte-se</h1>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />

        <button type="submit">
          Entrar
        </button>

        <button
          type="button"
          className="btn-reset"
          onClick={() =>
            setModalReset(true)
          }
        >
          Esqueci minha senha
        </button>

      </form>

      {modalReset && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Redefinir Senha</h2>

            <br />

            <input
              type="email"
              placeholder="Digite seu email"
              value={emailReset}
              onChange={(e) =>
                setEmailReset(
                  e.target.value
                )
              }
            />

            <div className="modal-buttons">

              <button
                onClick={
                  resetarSenha
                }
              >
                Enviar Email
              </button>

              <button
                onClick={() =>
                  setModalReset(false)
                }
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}