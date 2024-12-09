    <cfcomponent displayName="UsuarioService">

        <!-- Función para validar datos del usuario -->
        <cffunction name="validarDatosUsuario" access="private" returnType="struct">
            <cfargument name="nombre" type="string" required="true">
            <cfargument name="codigo" type="string" required="true">
            <cfargument name="sueldo" type="numeric" required="true">
            <cfargument name="usuario" type="string" required="true">

            <cfset result = structNew()>

            <!-- Validar campos vacíos -->
            <cfif len(trim(arguments.nombre)) eq 0 OR len(trim(arguments.codigo)) eq 0 OR len(trim(arguments.sueldo)) eq 0 OR len(trim(arguments.usuario)) eq 0>
                <cfset result.success = false>
                <cfset result.message = "Todos los campos son obligatorios.">
                <cfreturn result>
            </cfif>

            <!-- Validar sueldo positivo -->
            <cfif arguments.sueldo LT 0>
                <cfset result.success = false>
                <cfset result.message = "El sueldo debe ser un número positivo.">
                <cfreturn result>
            </cfif>

            <cfset result.success = true>
            <cfset result.message = "Datos validados correctamente.">
            <cfreturn result>
        </cffunction>

        <!-- Función para validar usuario -->
        <cffunction name="validarUsuario" access="remote" returnType="struct">
            <cfargument name="usuario" type="string" required="true">
            <cfargument name="codigo" type="string" required="true">

            <cfset result = structNew()>

            <cftry>
                <cfquery name="queryValidar" datasource="AppPrueba">
                    SELECT COUNT(*) AS existe
                    FROM dbo.Usuarios
                    WHERE Usuario = <cfqueryparam value="#arguments.usuario#" cfsqltype="cf_sql_nvarchar">
                    AND Codigo = <cfqueryparam value="#arguments.codigo#" cfsqltype="cf_sql_nvarchar">
                </cfquery>

                <cfif queryValidar.existe GT 0>
                    <cfset result.success = true>
                    <cfset result.message = "Inicio de sesión exitoso.">
                <cfelse>
                    <cfset result.success = false>
                    <cfset result.message = "Usuario o código incorrectos.">
                </cfif>
            <cfcatch>
                <cflog file="app_errors" text="Error en la validación del usuario: #cfcatch.message#">
                <cfset result.success = false>
                <cfset result.message = "Error en el servidor. Inténtelo de nuevo más tarde.">
            </cfcatch>
            </cftry>

            <cfreturn result>
        </cffunction>

        <!-- Función para obtener todos los usuarios con paginación -->
        <cffunction name="obtenerUsuarios" access="public" returnType="array">
            <cfargument name="page" type="numeric" required="true" default="1">
            <cfargument name="pageSize" type="numeric" required="true" default="1000">

            <cfset startRow = (arguments.page - 1) * arguments.pageSize>
            <cftry>
                <cfquery name="getUsers" datasource="AppPrueba">
                    SELECT * 
                    FROM dbo.Usuarios
                    ORDER BY ID 
                    OFFSET <cfqueryparam value="#startRow#" cfsqltype="cf_sql_integer"> ROWS 
                    FETCH NEXT <cfqueryparam value="#arguments.pageSize#" cfsqltype="cf_sql_integer"> ROWS ONLY
                </cfquery>

                <!-- Convierte el query en un array -->
                <cfset usuarios = arrayNew(1)>
                <cfloop query="getUsers">
                    <cfset arrayAppend(usuarios, {
                        "ID" = getUsers.ID,
                        "Nombre" = getUsers.Nombre,
                        "Codigo" = getUsers.Codigo,
                        "Sueldo" = getUsers.Sueldo,
                        "Usuario" = getUsers.Usuario
                    }) />
                </cfloop>

                <cfreturn usuarios>
            <cfcatch>
                <cflog file="app_errors" text="Error al obtener usuarios: #cfcatch.message#" />
                <cfreturn { "success" = false, "message" = "Error al obtener usuarios. Contacte al administrador." } />
            </cfcatch>
            </cftry>
        </cffunction>

        <!-- Función para crear un nuevo usuario -->
        <cffunction name="crearUsuario" access="public" returnType="struct">
            <cfargument name="nombre" type="string" required="true">
            <cfargument name="codigo" type="string" required="true">
            <cfargument name="sueldo" type="numeric" required="true">
            <cfargument name="usuario" type="string" required="true">

            <cfset validation = validarDatosUsuario(arguments.nombre, arguments.codigo, arguments.sueldo, arguments.usuario)>
            <cfif NOT validation.success>
                <cfreturn validation>
            </cfif>

            <cftry>
                <cftransaction>
                    <cfquery datasource="AppPrueba">
                        INSERT INTO dbo.Usuarios (Nombre, Codigo, Sueldo, Usuario)
                        VALUES (
                            <cfqueryparam value="#arguments.nombre#" cfsqltype="cf_sql_nvarchar">,
                            <cfqueryparam value="#arguments.codigo#" cfsqltype="cf_sql_nvarchar">,
                            <cfqueryparam value="#arguments.sueldo#" cfsqltype="cf_sql_numeric">,
                            <cfqueryparam value="#arguments.usuario#" cfsqltype="cf_sql_nvarchar">
                        )
                    </cfquery>
                </cftransaction>

                <cfreturn { "success" = true, "message" = "Usuario creado correctamente." } />
            <cfcatch>
                <cflog file="app_errors" text="Error al crear usuario: #cfcatch.message#" />
                <cfreturn { "success" = false, "message" = "Error al crear usuario. Contacte al administrador." } />
            </cfcatch>
            </cftry>
        </cffunction>

        <!-- Función para actualizar un usuario -->
        <cffunction name="actualizarUsuario" access="public" returnType="struct">
            <cfargument name="id" type="numeric" required="true">
            <cfargument name="nombre" type="string" required="true">
            <cfargument name="codigo" type="string" required="true">
            <cfargument name="sueldo" type="numeric" required="true">
            <cfargument name="usuario" type="string" required="true">

            <cfset validation = validarDatosUsuario(arguments.nombre, arguments.codigo, arguments.sueldo, arguments.usuario)>
            <cfif NOT validation.success>
                <cfreturn validation>
            </cfif>

            <cftry>
                <cftransaction>
                    <cfquery datasource="AppPrueba">
                        UPDATE dbo.Usuarios
                        SET 
                            Nombre = <cfqueryparam value="#arguments.nombre#" cfsqltype="cf_sql_nvarchar">,
                            Codigo = <cfqueryparam value="#arguments.codigo#" cfsqltype="cf_sql_nvarchar">,
                            Sueldo = <cfqueryparam value="#arguments.sueldo#" cfsqltype="cf_sql_numeric">,
                            Usuario = <cfqueryparam value="#arguments.usuario#" cfsqltype="cf_sql_nvarchar">
                        WHERE ID = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                    </cfquery>
                </cftransaction>

                <cfreturn { "success" = true, "message" = "Usuario actualizado correctamente." } />
            <cfcatch>
                <cflog file="app_errors" text="Error al actualizar usuario: #cfcatch.message#" />
                <cfreturn { "success" = false, "message" = "Error al actualizar usuario. Contacte al administrador." } />
            </cfcatch>
            </cftry>
        </cffunction>

        <!-- Función para eliminar un usuario -->
        <cffunction name="eliminarUsuario" access="public" returnType="struct">
            <cfargument name="id" type="numeric" required="true">

            <cftry>
                <cftransaction>
                    <cfquery datasource="AppPrueba">
                        DELETE FROM dbo.Usuarios WHERE ID = <cfqueryparam value="#arguments.id#" cfsqltype="cf_sql_integer">
                    </cfquery>
                </cftransaction>

                <cfreturn { "success" = true, "message" = "Usuario eliminado correctamente." } />
            <cfcatch>
                <cflog file="app_errors" text="Error al eliminar usuario: #cfcatch.message#" />
                <cfreturn { "success" = false, "message" = "Error al eliminar usuario. Contacte al administrador." } />
            </cfcatch>
            </cftry>
        </cffunction>

    </cfcomponent>
