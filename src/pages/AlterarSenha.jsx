import { useState } from "react";

import Menu from "../components/Menu";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";

import { auth } from "../firebase";

export default function AlterarSenha() {

  const [senhaAtual,
    setSenhaAtual] =
    useState("");

  const [novaSenha,
    setNovaSenha] =
    useState("");

  const [confirmarSenha,
    setConfirmarSenha] =
    useState("");

  async function alterarSenha(e) {

    e.preventDefault();

    try {

      if (
        novaSenha !==
        confirmarSenha
      ) {

        alert(
          "As senhas não coincidem"
        );

        return;
      }

      const user =
        auth.currentUser;

      const credential =
        EmailAuthProvider
          .credential(
            user.email,
            senhaAtual
          );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        novaSenha
      );

      alert(
        "Senha alterada com sucesso"
      );

      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");

    } catch (error) {

      console.log(error);

      alert(
        "Erro ao alterar senha"
      );
    }
  }

  return (

    <div>

      <Menu />

      <div className="page">

        <div className="card">

          <h1>
            Alterar Senha
          </h1>

          <br />

          <form
            className="form-padrao"
            onSubmit={
              alterarSenha
            }
          >

            <input
              type="password"
              placeholder="Senha atual"
              value={senhaAtual}
              onChange={(e) =>
                setSenhaAtual(
                  e.target.value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) =>
                setNovaSenha(
                  e.target.value
                )
              }
              required
            />

            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(
                  e.target.value
                )
              }
              required
            />

            <button type="submit">

              Alterar Senha

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
