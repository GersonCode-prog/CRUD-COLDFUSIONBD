import { lazy } from "react";
import { Navigate } from "react-router-dom";

const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const Starter = lazy(() => import("../views/Starter.js"));
const Login = lazy(() => import("../views/Login")); // Importa correctamente el componente por defecto
const About = lazy(() => import("../views/About.js"));
const Usuarios = lazy(() => import("../views/ui/Usuarios.js"));
const Areas = lazy(() => import("../views/ui/Areas.js"));
const Asignatura = lazy(() => import("../views/ui/Asignatura.js"));
const Reportes = lazy(() => import("../views/ui/Reportes.js"));
const Tables = lazy(() => import("../views/ui/Tables.js"));

const isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));

const ThemeRoutes = [
  {
    path: "/",
    element: isAuthenticated ? <FullLayout /> : <Navigate to="/login" replace />,
    children: [
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/about", exact: true, element: <About /> },
      { path: "/Usuarios", exact: true, element: <Usuarios /> },
      { path: "/Areas", exact: true, element: <Areas /> },
      { path: "/Asignatura", exact: true, element: <Asignatura /> },
      { path: "/Reportes", exact: true, element: <Reportes /> },
      { path: "/table", exact: true, element: <Tables /> },
    ],
  },
  { path: "/login", exact: true, element: <Login /> },
];

export default ThemeRoutes;
