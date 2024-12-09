import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";


import "./Usuarios.css"; // Importar el CSS personalizado

const API_BASE_URL = "http://localhost:8600/crud-app/backend/routes/Areas.cfm";

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [newArea, setNewArea] = useState({ NombreArea: "", Descripcion: "", Activo: true });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const getAreas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?method=getAreas`);
      const data = await response.json();

      if (data.SUCCESS && Array.isArray(data.DATA)) {
        setAreas(data.DATA);
      } else {
        toast.error("Error al cargar las áreas.");
        setAreas([]);
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
      setAreas([]);
    }
  };

  const addArea = async (area) => {
    try {
      const response = await fetch(`${API_BASE_URL}?method=addArea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(area),
      });

      if (response.ok) {
        toast.success("Área creada correctamente.");
        return true;
      } else {
        toast.error("Error al crear el área.");
        return false;
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
      return false;
    }
  };

  const updateArea = async (area) => {
    try {
      if (!area.AreaID) {
        toast.error("ID de área no encontrado.");
        return false;
      }

      const response = await fetch(`${API_BASE_URL}?method=updateArea&id=${area.AreaID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(area),
      });

      const result = await response.json();

      if (response.ok && result.SUCCESS) {
        toast.success("Área actualizada correctamente.");
        return true;
      } else {
        toast.error("Error al actualizar el área.");
        return false;
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
      return false;
    }
  };

  const deleteArea = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}?method=deleteArea`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Área eliminada correctamente.");
        return true;
      } else {
        toast.error("Error al eliminar el área.");
        return false;
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
      return false;
    }
  };

  useEffect(() => {
    getAreas();
  }, []);

  const handleEdit = (area) => {
    setSelectedArea(area);
    setNewArea(area);
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newArea.NombreArea === "" || newArea.Descripcion === "") {
      toast.error("Por favor, complete todos los campos.");
      return;
    }

    if (selectedArea) {
      const updatedArea = { ...selectedArea, ...newArea };
      const success = await updateArea(updatedArea);

      if (success) {
        setAreas(areas.map((area) => (area.AreaID === selectedArea.AreaID ? updatedArea : area)));
      }
    } else {
      const success = await addArea(newArea);
      if (success) {
        setAreas([...areas, { ...newArea, AreaID: areas.length + 1 }]);
      }
    }

    setShowFormModal(false);
    setNewArea({ NombreArea: "", Descripcion: "", Activo: true });
    setSelectedArea(null);
  };

  const confirmDeleteArea = async () => {
    if (selectedArea) {
      const success = await deleteArea(selectedArea.AreaID);
      if (success) {
        setAreas(areas.filter((area) => area.AreaID !== selectedArea.AreaID));
      }
      setShowDeleteModal(false);
      setSelectedArea(null);
    }
  };

  const columns = [
    {
      name: "Nombre del Área",
      selector: (row) => row.NombreArea,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.Descripcion,
    },
    {
      name: "Estado",
      cell: (row) => (
        <span className={row.Activo ? "activo" : "inactivo"}>
          {row.Activo ? "Activo" : "Inactivo"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
        <Edit
          onClick={() => handleEdit(row)}
          style={{ cursor: "pointer", color: "#1976d2" }}
        />
        <Delete
          onClick={() => openDeleteModal(row)}
          style={{ cursor: "pointer", color: "#d32f2f" }}
        />
      </div>
      ),
    },
  ];

  const openDeleteModal = (area) => {
    setSelectedArea(area);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <h1>Áreas</h1>
      <button onClick={() => setShowFormModal(true)} className="btn-agregar">
        Nueva Área
      </button>
      <DataTable
        title="Lista de Áreas"
        columns={columns}
        data={areas}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        highlightOnHover
        striped
      />

      {/* Modal para formulario */}
        {showFormModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{selectedArea ? "Editar Área" : "Nueva Área"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFormModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre del Área</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newArea.NombreArea}
                    onChange={(e) => setNewArea({ ...newArea, NombreArea: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newArea.Descripcion}
                    onChange={(e) => setNewArea({ ...newArea, Descripcion: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-footer">
                  <Button type="submit" color="primary">
                    {selectedArea ? "Actualizar" : "Agregar"}
                  </Button>
                  <Button onClick={() => setShowFormModal(false)} color="secondary">
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Modal de confirmación de eliminación */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogContent>
          <p>¿Quieres eliminar el área {selectedArea?.NombreArea}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDeleteArea} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default Areas;
