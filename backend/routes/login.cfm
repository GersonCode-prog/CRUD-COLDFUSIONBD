<cfparam name="form.usuario" default="">
<cfparam name="form.codigo" default="">

<!-- Verificación de los datos enviados -->
<cfif len(trim(form.usuario)) eq 0 OR len(trim(form.codigo)) eq 0>
    <cfoutput>#serializeJSON({ "success" = false, "message" = "Usuario y código son requeridos." })#</cfoutput>
    <cfabort>
</cfif>

<!-- Consulta para validar el usuario y el código -->
<cfquery name="getUser" datasource="AppPrueba">
    SELECT Usuario, Codigo
    FROM dbo.Usuarios
    WHERE LTRIM(RTRIM(LOWER(Usuario))) = LTRIM(RTRIM(LOWER(<cfqueryparam value="#form.usuario#" cfsqltype="cf_sql_nvarchar">)))
    AND LTRIM(RTRIM(Clave)) = LTRIM(RTRIM(<cfqueryparam value="#form.codigo#" cfsqltype="cf_sql_nvarchar">)))
</cfquery>

<!-- Verificar si el usuario existe -->
<cfif getUser.recordCount GT 0>
    <!-- Usuario válido, generar respuesta de éxito -->
    <cfoutput>#serializeJSON({ "success" = true, "message" = "Inicio de sesión exitoso." })#</cfoutput>
<cfelse>
    <!-- Usuario o código incorrecto -->
    <cfoutput>#serializeJSON({ "success" = false, "message" = "Usuario o código incorrectos." })#</cfoutput>
</cfif>
