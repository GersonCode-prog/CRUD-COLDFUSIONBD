import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import satImage from '../../assets/images/sat.jpg'; 
import { FaFilePdf } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";  
import "./Usuarios.css";

// Configuración para el modal
Modal.setAppElement("#root");

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: "",
    Codigo: "",
    Sueldo: "",
    Usuario: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        "http://localhost:8600/crud-app/backend/routes/usuarios.cfm"
      );
      const data = await response.json();
      if (data.SUCCESS) {
        const usuariosArray = Array.isArray(data.DATA) ? data.DATA : [data.DATA];
        setUsuarios(usuariosArray);
      } else {
        toast.error("Error al obtener los datos");
      }
    } catch (error) {
      toast.error("Error al obtener los usuarios");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        Nombre: user.Nombre,
        Codigo: user.Codigo,
        Sueldo: user.Sueldo,
        Usuario: user.Usuario,
      });
    } else {
      setEditingUser(null);
      setFormData({
        Nombre: "",
        Codigo: "",
        Sueldo: "",
        Usuario: "",
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditingUser(null);
    setFormData({ Nombre: "", Codigo: "", Sueldo: "", Usuario: "" });
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!formData.Nombre || !formData.Codigo || !formData.Sueldo || !formData.Usuario) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8600/crud-app/backend/routes/usuarios.cfm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.SUCCESS) {
        toast.success("Usuario agregado correctamente");
        fetchUsuarios(); 
        closeModal(); 
      } else {
        toast.error("Error al agregar el usuario");
      }
    } catch (error) {
      toast.error("Ocurrió un error al agregar el usuario");
      console.error("Error:", error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!formData.Nombre || !formData.Codigo || !formData.Sueldo || !formData.Usuario) {
      toast.warn("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8600/crud-app/backend/routes/usuarios.cfm?id=${editingUser.ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.SUCCESS) {
        toast.success("Usuario actualizado correctamente");
        fetchUsuarios();
        closeModal(); 
      } else {
        toast.error("Error al actualizar el usuario");
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el usuario");
      console.error("Error:", error);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8600/crud-app/backend/routes/usuarios.cfm?id=${userToDelete.ID}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.SUCCESS) {
        toast.success("Usuario eliminado correctamente");
        fetchUsuarios();
        closeDeleteModal();
      } else {
        toast.error("Error al eliminar el usuario");
      }
    } catch (error) {
      toast.error("Ocurrió un error al eliminar el usuario");
      console.error("Error:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(satImage, "PNG", 10, 10, 50, 25);
    doc.setFontSize(18);
    doc.text("Usuarios Listados", 80, 40);

    const tableData = usuarios.map((user) => [
      user.ID,
      user.Nombre,
      user.Codigo,
      user.Sueldo,
      user.Usuario,
    ]);

    doc.autoTable({
      startY: 50,
      head: [["ID", "Nombre", "Código", "Sueldo", "Usuario"]],
      body: tableData,
    });

    doc.save("usuarios.pdf");
  };

  const filteredUsuarios = usuarios.filter(
    (user) =>
      user.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: "Nombre", selector: (row) => row.Nombre, sortable: true },
    { name: "Código", selector: (row) => row.Codigo, sortable: true },
    { name: "Sueldo", selector: (row) => row.Sueldo, sortable: true },
    { name: "Usuario", selector: (row) => row.Usuario, sortable: true },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Edit
            onClick={() => openModal(row)}
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

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <ToastContainer />
      <h1>Lista de Usuarios</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o código"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input-search"
      />

      <button onClick={() => openModal()} className="btn-agregar">Agregar Usuario</button>
      <button onClick={generatePDF} className="btn-pdf">
        <FaFilePdf /> Generar PDF
      </button>

      <DataTable
      title="Lista de Usuarios"
        columns={columns}
        data={filteredUsuarios}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        highlightOnHover
        striped
      />

      {/* Modal de formulario */}
       {/* Modal de agregar/editar */}
       <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
        <form onSubmit={editingUser ? handleUpdateUser : addUser}>
          <TextField
            label="Nombre"
            name="Nombre"
            value={formData.Nombre}
            onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Código"
            name="Codigo"
            value={formData.Codigo}
            onChange={(e) => setFormData({ ...formData, Codigo: e.target.value })}
            fullWidth
            required
            margin="normal"
          />
                  <TextField
            label="Sueldo"
            name="Sueldo"
            value={formData.Sueldo}
            onChange={(e) => setFormData({ ...formData, Sueldo: e.target.value })}
            fullWidth
            required
            margin="normal"
            type="number"
            inputProps={{ min: "0" }}  // Para asegurar que el valor no sea negativo
          />
          <TextField
            label="Usuario"
            name="Usuario"
            value={formData.Usuario}
            onChange={(e) => setFormData({ ...formData, Usuario: e.target.value })}
            fullWidth
            required
            margin="normal"
          />

          <Button type="submit" color="primary">
            {editingUser ? "Actualizar" : "Agregar"}
          </Button>
          <Button onClick={closeModal} color="secondary">
            Cancelar
          </Button>
        </form>
      </Modal>

      {/* Modal de eliminación */}
      <Dialog open={deleteModalIsOpen} onClose={closeDeleteModal}>
        <DialogTitle>¿Estás seguro?</DialogTitle>
        <DialogContent>
          <p>¿Quieres eliminar al usuario {userToDelete?.Nombre}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} color="primary">Cancelar</Button>
          <Button onClick={deleteUser} color="secondary">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Usuarios;
