<cfcomponent>
  <!-- Método para obtener todas las áreas -->
  <cffunction name="getAreas" access="remote" returntype="array">
    <cfquery name="areas" datasource="AppPrueba">
      SELECT AreaID, NombreArea, Descripcion, Activo
      FROM Areas
      ORDER BY AreaID
    </cfquery>
    <cfset data = []>
    <cfloop query="areas">
      <cfset arrayAppend(data, {
        "AreaID": AreaID,
        "NombreArea": NombreArea,
        "Descripcion": Descripcion,
        "Activo": (Activo EQ 1)
      })>
    </cfloop>
    <cfreturn data>
  </cffunction>

  <!-- Método para agregar un área -->
  <cffunction name="addArea" access="remote" returntype="struct">
    <cfargument name="NombreArea" type="string" required="true">
    <cfargument name="Descripcion" type="string" required="false" default="">
    <cfargument name="Activo" type="boolean" required="true">

    <cfquery datasource="AppPrueba">
      INSERT INTO Areas (NombreArea, Descripcion, Activo)
      VALUES (
        <cfqueryparam value="#arguments.NombreArea#" cfsqltype="cf_sql_varchar" maxlength="100">,
        <cfqueryparam value="#arguments.Descripcion#" cfsqltype="cf_sql_varchar" maxlength="255">,
        <cfqueryparam value="#arguments.Activo#" cfsqltype="cf_sql_bit">
      )
    </cfquery>

    <cfreturn { "success": true, "message": "Área agregada correctamente." }>
  </cffunction>

  <!-- Método para actualizar un área -->
  <cffunction name="updateArea" access="remote" returntype="struct">
    <cfargument name="AreaID" type="numeric" required="true">
    <cfargument name="NombreArea" type="string" required="true">
    <cfargument name="Descripcion" type="string" required="false" default="">
    <cfargument name="Activo" type="boolean" required="true">

    <!-- Validar si el área existe -->
    <cfquery name="checkArea" datasource="AppPrueba">
      SELECT AreaID 
      FROM Areas 
      WHERE AreaID = <cfqueryparam value="#arguments.AreaID#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif checkArea.recordcount EQ 0>
      <cfreturn { "success": false, "message": "El área con el ID proporcionado no existe." }>
    </cfif>

    <!-- Actualizar el área -->
    <cfquery datasource="AppPrueba">
      UPDATE Areas 
      SET NombreArea = <cfqueryparam value="#arguments.NombreArea#" cfsqltype="cf_sql_varchar" maxlength="100">,
          Descripcion = <cfqueryparam value="#arguments.Descripcion#" cfsqltype="cf_sql_varchar" maxlength="255">,
          Activo = <cfqueryparam value="#arguments.Activo#" cfsqltype="cf_sql_bit">
      WHERE AreaID = <cfqueryparam value="#arguments.AreaID#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfreturn { "success": true, "message": "Área actualizada correctamente." }>
  </cffunction>

  <!-- Método para eliminar un área -->
  <cffunction name="deleteArea" access="remote" returntype="struct">
    <cfargument name="AreaID" type="numeric" required="true">

    <!-- Validar si el área existe -->
    <cfquery name="checkArea" datasource="AppPrueba">
      SELECT AreaID 
      FROM Areas 
      WHERE AreaID = <cfqueryparam value="#arguments.AreaID#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfif checkArea.recordcount EQ 0>
      <cfreturn { "success": false, "message": "El área con el ID proporcionado no existe." }>
    </cfif>

    <!-- Eliminar el área -->
    <cfquery datasource="AppPrueba">
      DELETE FROM Areas 
      WHERE AreaID = <cfqueryparam value="#arguments.AreaID#" cfsqltype="cf_sql_integer">
    </cfquery>

    <cfreturn { "success": true, "message": "Área eliminada correctamente." }>
  </cffunction>
</cfcomponent>
