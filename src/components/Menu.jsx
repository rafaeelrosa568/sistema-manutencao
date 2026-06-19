import { useNavigate } from "react-router-dom";

export default function Menu() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  function logout() {

    localStorage.removeItem("user");

    navigate("/");
  }

  return (

    <div className="menu">

      <h2>Sistema</h2>

      <div className="menu-links">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard
        </button>

          <button
  onClick={() =>
    navigate("/veiculos")
  }
>
  Veículos
</button>


<button
  onClick={() =>
    navigate("/manutencoes")
  }
>
  Manutenções
</button>

        {user.perfil ===
          "administrador" && (

          <button
            onClick={() =>
              navigate("/usuarios")
            }
          >
            Usuários
          </button>

        )}

        <button onClick={logout}>
          Sair
        </button>

      </div>

      <div className="menu-user">

        {user.nome}
        {" - "}
        {user.perfil}

      </div>

    </div>
  );
}