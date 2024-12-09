import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";


import "./Usuarios.css";

const UsuarioAreas = () => {
  const [usuarioAreas, setUsuarioAreas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: "",
    area: "",
  });
  const [cargando, setCargando] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        "http://localhost:8600/crud-app/backend/routes/usuarios.cfm"
      );
      const data = await response.json();
      if (data.SUCCESS) setUsuarios(data.DATA);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error al obtener usuarios"); 
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(
        "http://localhost:8600/crud-app/backend/routes/areas.cfm"
      );
      const data = await response.json();
      if (data.SUCCESS) setAreas(data.DATA);
    } catch (error) {
      console.error("Error al obtener áreas:", error);
      toast.error("Error al obtener áreas"); 
    }
  };

  const fetchUsuarioAreas = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        "http://localhost:8600/crud-app/backend/routes/usuarioarea.cfm"
      );
      const data = await response.json();
      if (data.SUCCESS) setUsuarioAreas(data.DATA);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error al obtener usuario-áreas"); 
    }
    setCargando(false);
  };

  useEffect(() => {
    fetchUsuarios();
    fetchAreas();
    fetchUsuarioAreas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoUsuario.usuario || !nuevoUsuario.area) {
      toast.error("Por favor, complete todos los campos."); 
      return;
    }

    const requestData = {
      usuarioID: nuevoUsuario.usuario,
      areaID: nuevoUsuario.area,
    };

    try {
      const response = await fetch(
        "http://localhost:8600/crud-app/backend/routes/usuarioarea.cfm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );
      const textResponse = await response.text();
      const data = JSON.parse(textResponse);

      if (data.SUCCESS) {
        toast.success("Asignación exitosa"); 
        fetchUsuarioAreas();
        setShowFormModal(false);
      } else {
        toast.error("Error al asignar usuario a área"); 
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un error al enviar la solicitud."); 
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.USUARIOAREAID, sortable: true },
    { name: "Usuario", selector: (row) => row.USUARIONOMBRE, sortable: true },
    { name: "Área", selector: (row) => row.AREANOMBRE, sortable: true },
    { name: "Fecha de Creación", selector: (row) => row.FECHACREACION },
  ];

  return (
    <div className="container">
      <h2 className="titulo">Gestión de Usuario y Área</h2>
      <button 
        className="btn-agregar" 
        onClick={() => setShowFormModal(true)}
      >
        Asignar Usuario a Área
      </button>

      {showFormModal && (
        <Dialog open={showFormModal} onClose={() => setShowFormModal(false)}>
          <DialogTitle>Asignar Usuario a Área</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <TextField
                  label="Usuario"
                  select
                  name="usuario"
                  fullWidth
                  margin="normal"
                  value={nuevoUsuario.usuario}
                  onChange={handleInputChange}
                  SelectProps={{
                    native: true,
                  }}
                  required
                >
                  <option value="">Seleccionar Usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.ID} value={usuario.ID}>
                      {usuario.Nombre}
                    </option>
                  ))}
                </TextField>
              </div>
              <div className="form-group">
                <TextField
                  label="Área"
                  select
                  name="area"
                  fullWidth
                  margin="normal"
                  value={nuevoUsuario.area}
                  onChange={handleInputChange}
                  SelectProps={{
                    native: true,
                  }}
                  required
                >
                  <option value="">Seleccionar Área</option>
                  {areas.map((area) => (
                    <option key={area.AreaID} value={area.AreaID}>
                      {area.NombreArea}
                    </option>
                  ))}
                </TextField>
              </div>
              <DialogActions>
                <Button type="submit" color="primary">
                  Agregar
                </Button>
                <Button onClick={() => setShowFormModal(false)} color="secondary">
                  Cancelar
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <DataTable
          columns={columns}
          data={usuarioAreas}
          pagination
          highlightOnHover
          striped
          responsive
          className="table table-striped"
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default UsuarioAreas;
