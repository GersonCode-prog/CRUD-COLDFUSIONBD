component {
    // Nombre de la aplicación
    this.name = "CRUDApp";

    // Definir la fuente de datos
    this.datasource = "AppPrueba";  

  
    this.sessionManagement = true;
    this.sessionTimeout = createTimeSpan(0, 0, 20, 0); 
    this.setClientCookies = true;  
}
