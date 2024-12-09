<cfcomponent displayname="UsuarioAreaService" output="false">

    <!-- Insertar registro -->
    <cffunction name="insertUsuarioArea" access="remote" returntype="struct">
        <cfargument name="usuarioID" type="numeric" required="true">
        <cfargument name="areaID" type="numeric" required="true">

        <cfset var resultado = {success=false, message="", data={}}>

        <cftry>
            <cfquery datasource="AppPrueba">
                INSERT INTO dbo.UsuarioArea (UsuarioID, AreaID)
                VALUES (
                    <cfqueryparam value="#arguments.usuarioID#" cfsqltype="cf_sql_integer">,
                    <cfqueryparam value="#arguments.areaID#" cfsqltype="cf_sql_integer">
                )
            </cfquery>

            <cfset resultado.success = true>
            <cfset resultado.message = "Registro insertado correctamente">
        <cfcatch type="any">
            <cflog file="app_log" text="Error al insertar: #cfcatch.message#">
            <cfset resultado.message = "Error: #cfcatch.message#">
        </cfcatch>
        </cftry>

        <cfreturn resultado>
    </cffunction>

    <!-- Obtener registros -->
    <cffunction name="getUsuarioAreas" access="remote" returntype="array">
        <cfquery name="qGet" datasource="AppPrueba">
            SELECT 
                UA.UsuarioAreaID,
                U.Nombre AS UsuarioNombre,
                A.NombreArea AS AreaNombre,
                UA.FechaCreacion
            FROM dbo.UsuarioArea UA
            INNER JOIN dbo.Usuarios U ON UA.UsuarioID = U.ID
            INNER JOIN dbo.Areas A ON UA.AreaID = A.AreaID
        </cfquery>

        <cfset resultado = []>
        <cfloop query="qGet">
            <cfset arrayAppend(resultado, {
                UsuarioAreaID = qGet.UsuarioAreaID,
                UsuarioNombre = qGet.UsuarioNombre,
                AreaNombre = qGet.AreaNombre,
                FechaCreacion = qGet.FechaCreacion
            })>
        </cfloop>

        <cfreturn resultado>
    </cffunction>

</cfcomponent>
