<cfcomponent>
    <cfscript>
        variables.settings = structNew();
    </cfscript>

    <!--- Define cómo manejar una clave sin modificar los datos. --->
    <cffunction name="asAny" access="public" returntype="any">
        <cfargument name="key" type="string" required="true">
        <cfset variables.settings[arguments.key] = { type = "any" }>
        <cfreturn this>
    </cffunction>

    <!--- Define cómo manejar una clave forzando un booleano. --->
    <cffunction name="asBoolean" access="public" returntype="any">
        <cfargument name="key" type="string" required="true">
        <cfset variables.settings[arguments.key] = { type = "boolean" }>
        <cfreturn this>
    </cffunction>

    <!--- Define cómo manejar una clave forzando un entero. --->
    <cffunction name="asInteger" access="public" returntype="any">
        <cfargument name="key" type="string" required="true">
        <cfset variables.settings[arguments.key] = { type = "integer" }>
        <cfreturn this>
    </cffunction>

    <!--- Excluir una clave del JSON final. --->
    <cffunction name="exclude" access="public" returntype="any">
        <cfargument name="key" type="string" required="true">
        <cfset variables.settings[arguments.key] = { type = "exclude" }>
        <cfreturn this>
    </cffunction>

    <!--- Serializar los datos con las configuraciones aplicadas. --->
    <cffunction name="serialize" access="public" returntype="string">
        <cfargument name="data" type="struct" required="true">
        <cfscript>
            var result = duplicate(arguments.data);
            for (var key in result) {
                if (variables.settings[key]) {
                    var setting = variables.settings[key];
                    if (setting.type == "exclude") {
                        structDelete(result, key);
                    } else if (setting.type == "boolean") {
                        result[key] = (result[key] ? true : false);
                    } else if (setting.type == "integer") {
                        result[key] = int(result[key]);
                    }
                }
            }
            return serializeJSON(result);
        </cfscript>
    </cffunction>
</cfcomponent>
