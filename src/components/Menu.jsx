import { useNavigate } from "react-router-dom";

export default function Menu() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="menu">

      <div className="menu-top">
        <h2>Controle Frota</h2>
        <div className="menu-user">
          {user?.nome}{" - "}{user?.perfil}
        </div>
      </div>

      <div className="menu-links">

        <button onClick={() => navigate("/dashboard")}>
          Painel
        </button>

        <button onClick={() => navigate("/veiculos")}>
          Veículos
        </button>

        <button onClick={() => navigate("/manutencoes")}>
          Manutenções
        </button>

        {/* Botão novo de Histórico */}
        <button onClick={() => navigate("/manutencoes-encerradas")}>
          Histórico
        </button>

        <button onClick={() => navigate("/alterar-senha")}>
          Alterar Senha
        </button>

        {user?.perfil === "administrador" && (
          <button onClick={() => navigate("/usuarios")}>
            Usuários
          </button>
        )}

        <button className="btn-sair" onClick={logout}>
          Sair
        </button>

      </div>
    </div>
  );
}
