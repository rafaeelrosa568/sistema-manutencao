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

  const [marca, setMarca] =
    useState("");

  const [modelo, setModelo] =
    useState("");

  const [placa, setPlaca] =
    useState("");

  const [cor, setCor] =
    useState("");

  const [tipo, setTipo] =
    useState("");

  const [km, setKm] =
    useState("");

  const [veiculos, setVeiculos] =
    useState([]);

  const [modalEditar, setModalEditar] =
    useState(false);

  const [editandoId, setEditandoId] =
    useState(null);

  const [
    modalDetalhes,
    setModalDetalhes
  ] = useState(false);

  const [
    veiculoSelecionado,
    setVeiculoSelecionado
  ] = useState(null);

  async function carregarVeiculos() {

    const querySnapshot =
      await getDocs(
        collection(db, "veiculos")
      );

    let lista = [];

    querySnapshot.forEach((docItem) => {

      lista.push({
        id: docItem.id,
        ...docItem.data()
      });

    });

    setVeiculos(lista);
  }

  useEffect(() => {

    carregarVeiculos();

  }, []);

  function limparFormulario() {

    setMarca("");
    setModelo("");
    setPlaca("");
    setCor("");
    setTipo("");
    setKm("");

    setEditandoId(null);

    setModalEditar(false);
  }

  async function cadastrarVeiculo(e) {

    e.preventDefault();

    try {

      await addDoc(
        collection(db, "veiculos"),
        {
          marca,
          modelo,
          placa,
          cor,
          tipo,
          km: Number(km),
          ativo: true
        }
      );

      alert(
        "Veículo cadastrado"
      );

      limparFormulario();

      carregarVeiculos();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  function abrirModalEditar(veiculo) {

    setMarca(veiculo.marca);

    setModelo(
      veiculo.modelo
    );

    setPlaca(veiculo.placa);

    setCor(veiculo.cor);

    setTipo(veiculo.tipo);

    setKm(veiculo.km);

    setEditandoId(veiculo.id);

    setModalEditar(true);
  }

  function abrirDetalhes(veiculo) {

    setVeiculoSelecionado(
      veiculo
    );

    setModalDetalhes(true);
  }

  async function salvarEdicao(e) {

    e.preventDefault();

    try {

      const veiculoRef =
        doc(
          db,
          "veiculos",
          editandoId
        );

      await updateDoc(
        veiculoRef,
        {
          marca,
          modelo,
          placa,
          cor,
          tipo,
          km: Number(km)
        }
      );

      alert(
        "Veículo atualizado"
      );

      limparFormulario();

      carregarVeiculos();

    } catch (error) {

      console.log(error);

      alert(error.message);
    }
  }

  async function alterarStatus(
    id,
    status
  ) {

    const veiculoRef =
      doc(
        db,
        "veiculos",
        id
      );

    await updateDoc(
      veiculoRef,
      {
        ativo: status
      }
    );

    carregarVeiculos();
  }

  return (

    <div>

      <Menu />

      <div className="page">

        <h1>
          Veículos
        </h1>

        <br />

        {user.perfil ===
          "administrador" && (

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
              onChange={(e) =>
                setMarca(
                  e.target.value
                )
              }
              required
            />

            <input
              type="text"
              placeholder="Modelo"
              value={modelo}
              onChange={(e) =>
                setModelo(
                  e.target.value
                )
              }
              required
            />

            <input
              type="text"
              placeholder="Placa"
              value={placa}
              onChange={(e) =>
                setPlaca(
                  e.target.value
                )
              }
              required
            />

            <input
              type="text"
              placeholder="Cor"
              value={cor}
              onChange={(e) =>
                setCor(
                  e.target.value
                )
              }
              required
            />

            <input
              type="text"
              placeholder="Tipo"
              value={tipo}
              onChange={(e) =>
                setTipo(
                  e.target.value
                )
              }
              required
            />

            <input
              type="number"
              placeholder="KM Inicial"
              value={km}
              onChange={(e) =>
                setKm(
                  e.target.value
                )
              }
              required
            />

            <button type="submit">
              Cadastrar
            </button>

          </form>

        )}

        <br />
        <br />

        <table className="tabela">

          <thead>

            <tr>

              <th>Marca</th>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Cor</th>
              <th>Tipo</th>
              <th>KM</th>
              <th>Status</th>
              <th>Detalhes</th>

              {user.perfil ===
                "administrador" && (
                <th>Ações</th>
              )}

            </tr>

          </thead>

          <tbody>

            {veiculos.map(
              (veiculo) => (

              <tr
                key={veiculo.id}
              >

                <td>
                  {veiculo.marca}
                </td>

                <td>
                  {veiculo.modelo}
                </td>

                <td>
                  {veiculo.placa}
                </td>

                <td>
                  {veiculo.cor}
                </td>

                <td>
                  {veiculo.tipo}
                </td>

                <td>
                  {veiculo.km}
                </td>

                <td>

                  {veiculo.ativo ? (

                    <span className="status-ativo">
                      Ativo
                    </span>

                  ) : (

                    <span className="status-inativo">
                      Inativo
                    </span>

                  )}

                </td>

                <td>

                  <button
                    onClick={() =>
                      abrirDetalhes(
                        veiculo
                      )
                    }
                  >
                    Ver
                  </button>

                </td>

                {user.perfil ===
                  "administrador" && (

                  <td>

                    <div className="acoes">

                      <button
                        onClick={() =>
                          abrirModalEditar(
                            veiculo
                          )
                        }
                      >
                        Editar
                      </button>

                      {" "}

                      {veiculo.ativo ? (

                        <button
                          onClick={() =>
                            alterarStatus(
                              veiculo.id,
                              false
                            )
                          }
                        >
                          Inativar
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            alterarStatus(
                              veiculo.id,
                              true
                            )
                          }
                        >
                          Ativar
                        </button>

                      )}

                    </div>

                  </td>

                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {modalEditar && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Editar Veículo
            </h2>

            <br />

            <form
              onSubmit={
                salvarEdicao
              }
            >

              <input
                type="text"
                placeholder="Marca"
                value={marca}
                onChange={(e) =>
                  setMarca(
                    e.target.value
                  )
                }
                required
              />

              <br />
              <br />

              <input
                type="text"
                placeholder="Modelo"
                value={modelo}
                onChange={(e) =>
                  setModelo(
                    e.target.value
                  )
                }
                required
              />

              <br />
              <br />

              <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={(e) =>
                  setPlaca(
                    e.target.value
                  )
                }
                required
              />

              <br />
              <br />

              <input
                type="text"
                placeholder="Cor"
                value={cor}
                onChange={(e) =>
                  setCor(
                    e.target.value
                  )
                }
                required
              />

              <br />
              <br />

              <input
                type="text"
                placeholder="Tipo"
                value={tipo}
                onChange={(e) =>
                  setTipo(
                    e.target.value
                  )
                }
                required
              />

              <br />
              <br />

              <input
                type="number"
                placeholder="KM"
                value={km}
                onChange={(e) =>
                  setKm(
                    e.target.value
                  )
                }
                required
              />

              <br />
              <br />

              <div className="modal-buttons">

                <button type="submit">
                  Salvar
                </button>

                {" "}

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

      {modalDetalhes &&
      veiculoSelecionado && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Detalhes Veículo
            </h2>

            <br />

            <p>

              <strong>
                Marca:
              </strong>

              {" "}

              {
                veiculoSelecionado.marca
              }

            </p>

            <br />

            <p>

              <strong>
                Modelo:
              </strong>

              {" "}

              {
                veiculoSelecionado.modelo
              }

            </p>

            <br />

            <p>

              <strong>
                Placa:
              </strong>

              {" "}

              {
                veiculoSelecionado.placa
              }

            </p>

            <br />

            <p>

              <strong>
                Cor:
              </strong>

              {" "}

              {
                veiculoSelecionado.cor
              }

            </p>

            <br />

            <p>

              <strong>
                Tipo:
              </strong>

              {" "}

              {
                veiculoSelecionado.tipo
              }

            </p>

            <br />

            <p>

              <strong>
                KM Cadastro:
              </strong>

              {" "}

              {
                veiculoSelecionado.km
              }

            </p>

            <br />

            <p>

              <strong>
                Status:
              </strong>

              {" "}

              {veiculoSelecionado.ativo
                ? "Ativo"
                : "Inativo"}

            </p>

            <br />

            <button
              onClick={() =>
                setModalDetalhes(false)
              }
            >
              Fechar
            </button>

          </div>

        </div>

      )}

    </div>
  );
}