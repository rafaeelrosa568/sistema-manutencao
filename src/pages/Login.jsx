import { useState, useEffect } from "react";

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

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [emailReset, setEmailReset] =
    useState("");

  const [modalReset, setModalReset] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {

    const temaSalvo =
      localStorage.getItem("tema");

    if (temaSalvo === "dark") {

      setDarkMode(true);

      document.body.classList.add(
        "dark"
      );

    }

  }, []);

  function trocarTema() {

    const novoTema = !darkMode;

    setDarkMode(novoTema);

    if (novoTema) {

      document.body.classList.add(
        "dark"
      );

      localStorage.setItem(
        "tema",
        "dark"
      );

    } else {

      document.body.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "tema",
        "light"
      );
    }
  }

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

      alert(
        "Email ou senha inválidos"
      );
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

    <div className="login-page">

      <div className="theme-button">

        <button onClick={trocarTema}>

          {darkMode
            ? "☀️ Claro"
            : "🌙 Escuro"}

        </button>

      </div>

      <div className="login-box">

        <div className="login-header">

          <h1>
            Gestão de Frotas
          </h1>

          <p>
            Sistema de gerenciamento
            de veículos e manutenções
          </p>

        </div>

        <form
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Digite seu email"
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
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
            required
          />

          <button
            type="submit"
            className="btn-login"
          >
            Entrar no Sistema
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

      </div>

      {modalReset && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Redefinir Senha
            </h2>

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
