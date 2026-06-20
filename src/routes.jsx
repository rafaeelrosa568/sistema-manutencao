import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Veiculos from "./pages/Veiculos";
import Manutencoes from "./pages/Manutencoes";
import ManutencoesEncerradas from "./pages/ManutencoesEncerradas";
import AlterarSenha from "./pages/AlterarSenha";

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/veiculos"
          element={
            <ProtectedRoute>
              <Veiculos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manutencoes"
          element={
            <ProtectedRoute>
              <Manutencoes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manutencoesEncerradas"
          element={
            <ProtectedRoute>
              <ManutencoesEncerradas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alterar-senha"
          element={<AlterarSenha />}
        />

      </Routes>
    </BrowserRouter>
  );
}