<cfsetting enablecfoutputonly="yes" />
<cfheader name="Access-Control-Allow-Origin" value="*" />
<cfheader name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS" />
<cfheader name="Access-Control-Allow-Headers" value="Content-Type" />
<cfheader name="Content-Type" value="application/json" />

<cfscript>
    // Procesar solicitudes
    function processRequest() {
        var usuarioAreaService = createObject("component", "crud-app.backend.crud.usuarioarea");

        // Respuesta JSON
        function jsonResponse(success, message="", data={}) {
            writeOutput(serializeJSON({SUCCESS=success, MESSAGE=message, DATA=data}));
            abort;
        }

        param name="method" default=cgi.request_method;

        try {
            if (method eq "OPTIONS") {
                writeOutput("OK");
                abort;
            }

            if (method eq "GET") {
                var result = usuarioAreaService.getUsuarioAreas();
                jsonResponse(true, "", result);
            } else if (method eq "POST") {
                if (cgi.content_type eq "application/json") {
                    var requestData = getHttpRequestData().content;

                    try {
                        var parsedData = deserializeJSON(requestData);
                    } catch (any e) {
                        jsonResponse(false, "JSON inválido: " & e.message);
                    }

                    if (!structKeyExists(parsedData, "usuarioID") || !structKeyExists(parsedData, "areaID")) {
                        jsonResponse(false, "Faltan datos obligatorios.");
                    }

                    var usuarioID = parsedData.usuarioID;
                    var areaID = parsedData.areaID;

                    var result = usuarioAreaService.insertUsuarioArea(
                        usuarioID = usuarioID,
                        areaID = areaID
                    );

                    jsonResponse(result.success, result.message, result.data);
                } else {
                    jsonResponse(false, "Formato no soportado.");
                }
            } else {
                jsonResponse(false, "Método HTTP no soportado.");
            }
        } catch (any e) {
            jsonResponse(false, "Error interno: " & e.message);
        }
    }

    processRequest();
</cfscript>
