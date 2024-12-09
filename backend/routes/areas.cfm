<cfsetting enablecfoutputonly="yes" />
<cfheader name="Access-Control-Allow-Origin" value="*" />
<cfheader name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS" />
<cfheader name="Access-Control-Allow-Headers" value="Content-Type" />
<cfheader name="Content-Type" value="application/json" />

<cfscript>

if (cgi.request_method eq "OPTIONS") {
    writeOutput("");
    abort;
}

// Carga el componente de áreas
areasService = createObject("component", "crud-app.backend.crud.areas");

try {
    if (cgi.request_method neq "GET" && cgi.request_method neq "DELETE") {
        rawData = ToString(getHttpRequestData().content);
        requestData = IsJSON(rawData) ? DeserializeJSON(rawData) : {};
    }

    // Rutas según el método HTTP
    switch (cgi.request_method) {
        case "GET":
            // Obtener la lista de áreas
            areas = areasService.getAreas();
            writeOutput(serializeJSON({ success = true, data = areas }));
            break;

        case "POST":
            // Valida los datos necesarios para crear un área
            if (!structKeyExists(requestData, "NombreArea") || 
                !structKeyExists(requestData, "Descripcion") || 
                !structKeyExists(requestData, "Activo")) {
                writeOutput(serializeJSON({ success = false, message = "Faltan datos necesarios para crear el área" }));
                abort;
            }
            // Crear un área nueva
            areasService.addArea(
                NombreArea = requestData.NombreArea,
                Descripcion = requestData.Descripcion,
                Activo = requestData.Activo
            );
            writeOutput(serializeJSON({ success = true, message = "Área creada exitosamente" }));
            break;

        case "PUT":
            // Validar el ID desde la URL
            id = url.id;
            if (!id) {
                writeOutput(serializeJSON({ success = false, message = "El ID del área es necesario" }));
                abort;
            }
            // Validar los datos necesarios para actualizar el área
            if (!structKeyExists(requestData, "NombreArea") || 
                !structKeyExists(requestData, "Descripcion") || 
                !structKeyExists(requestData, "Activo")) {
                writeOutput(serializeJSON({ success = false, message = "Faltan datos necesarios para actualizar el área" }));
                abort;
            }
            // Actualizar el área
            areasService.updateArea(
                AreaID = id,
                NombreArea = requestData.NombreArea,
                Descripcion = requestData.Descripcion,
                Activo = requestData.Activo
            );
            writeOutput(serializeJSON({ success = true, message = "Área actualizada exitosamente" }));
            break;

        case "DELETE":
            // Validar el ID desde la URL
            id = url.id;
            if (!id) {
                writeOutput(serializeJSON({ success = false, message = "El ID del área es necesario" }));
                abort;
            }
            // Eliminar el área
            result = areasService.deleteArea(AreaID = id);
            writeOutput(serializeJSON(result));
            break;

        default:
            // Manejo para métodos no soportados
            writeOutput(serializeJSON({ success = false, message = "Método no permitido" }));
            abort;
    }
} catch (any e) {
    // Manejo de errores
    writeOutput(serializeJSON({ success = false, message = "Ocurrió un error: " & e.message }));
    abort;
}
</cfscript>
