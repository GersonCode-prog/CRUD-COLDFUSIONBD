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


usuariosService = createObject("component", "crud-app.backend.crud.usuarios");

try {
  
    if (cgi.request_method neq "GET" && cgi.request_method neq "DELETE") {
        rawData = ToString(getHttpRequestData().content);
        requestData = IsJSON(rawData) ? DeserializeJSON(rawData) : {};
    }

    // Rutas según el método HTTP
    switch (cgi.request_method) {
        case "GET":
            // Obtenie la lista de usuarios
            usuarios = usuariosService.obtenerUsuarios();  
            writeOutput(serializeJSON({ success = true, data = usuarios }));
            break;

        case "POST":
            // Validar que se reciban todos los datos necesarios para crear un usuario
            if (!structKeyExists(requestData, "nombre") || 
                !structKeyExists(requestData, "codigo") || 
                !structKeyExists(requestData, "sueldo") || 
                !structKeyExists(requestData, "usuario")) {
                writeOutput(serializeJSON({ success = false, message = "Faltan datos necesarios para crear el usuario" }));
                abort;
            }
            // Llama al servicio para crear el usuario
            usuariosService.crearUsuario(
                requestData.nombre,
                requestData.codigo,
                requestData.sueldo,
                requestData.usuario
            );
            writeOutput(serializeJSON({ success = true, message = "Usuario creado exitosamente" }));
            break;

        case "PUT":
            // Obtener el ID desde la URL
            id = url.id;
            if (!id) {
                writeOutput(serializeJSON({ success = false, message = "El ID del usuario es necesario" }));
                abort;
            }
            // Valida que se reciban los datos para actualizar el usuario
            if (!structKeyExists(requestData, "nombre") || 
                !structKeyExists(requestData, "codigo") || 
                !structKeyExists(requestData, "sueldo") || 
                !structKeyExists(requestData, "usuario")) {
                writeOutput(serializeJSON({ success = false, message = "Faltan datos necesarios para actualizar el usuario" }));
                abort;
            }
            // Llama al servicio para actualizar el usuario (sin fecha y hora actual)
            usuariosService.actualizarUsuario(
                id,
                requestData.nombre,
                requestData.codigo,
                requestData.sueldo,
                requestData.usuario
            );
            writeOutput(serializeJSON({ success = true, message = "Usuario actualizado exitosamente" }));
            break;

        case "DELETE":
            // Obteniene el ID desde la URL para eliminar el usuario
            id = url.id;
            if (!id) {
                writeOutput(serializeJSON({ success = false, message = "El ID del usuario es necesario" }));
                abort;
            }
            // Llama al servicio para eliminar el usuario
            usuariosService.eliminarUsuario(id);
            writeOutput(serializeJSON({ success = true, message = "Usuario eliminado exitosamente" }));
            break;

        default:
            // Si el método no es uno de los permitidos
            writeOutput(serializeJSON({ success = false, message = "Método no permitido" }));
            abort;
    }
} catch (any e) {
    // Manejo de errores si ocurre alguna excepción
    writeOutput(serializeJSON({ success = false, message = "Ocurrió un error: " & e.message }));
    abort;
}
</cfscript>
