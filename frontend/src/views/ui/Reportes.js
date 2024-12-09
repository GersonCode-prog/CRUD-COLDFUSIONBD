import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import satImage from '../../assets/images/sat.jpg'; // Importa la imagen desde src

const Reportes = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(
          "http://localhost:8600/crud-app/backend/routes/usuarios.cfm"
        );
        const data = await response.json();
        if (data.SUCCESS) {
          setUsuarios(data.DATA || []);
        } else {
          setUsuarios([]);
        }
      } catch (error) {
        console.error("Error fetching usuarios:", error);
        setUsuarios([]);
      }
    };

    fetchUsuarios();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    const img = new Image();
    doc.addImage(satImage, "JPEG", 10, 8, 40, 40); 

    img.onload = () => {
      // Agregar el logotipo al PDF
      doc.addImage(img, "PNG", 10, 10, 50, 25); // x, y, width, height

      // Título del PDF
      doc.setFontSize(18);
      doc.text("Reporte de Usuarios", 14, 45);

      // Agregando tabla al PDF
      const tableData = usuarios.map((usuario) => [
        usuario.Nombre,
        usuario.Usuario,
      ]);
      doc.autoTable({
        head: [["Nombre", "Usuario"]],
        body: tableData,
        startY: 50,
      });

      // Guardar el PDF
      doc.save("Reporte_Usuarios.pdf");
    };

    img.onerror = (err) => {
      console.error("Error cargando el logotipo:", err);
      alert("No se pudo cargar el logotipo. Verifica la ruta.");
    };
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Reporte de Usuarios</h1>
      
      {/* Botón para descargar PDF */}
      <div className="text-center mb-4">
        <button onClick={downloadPDF} className="btn btn-primary">
          Descargar PDF
        </button>
      </div>
      
      {/* Lista de usuarios */}
      {usuarios && usuarios.length > 0 ? (
        <ul className="list-group">
          {usuarios.map((usuario) => (
            <li key={usuario.ID} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{usuario.Nombre}</span>
              <span>{usuario.Usuario}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">No hay usuarios disponibles</p>
      )}
    </div>
  );
};

export default Reportes;
