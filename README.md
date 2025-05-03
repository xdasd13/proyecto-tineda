# Guía Básica: Cómo Levantar este Proyecto CRUD

Esta guía te muestra los pasos básicos para descargar y ejecutar este proyecto CRUD usando Git Bash, Visual Studio Code y XAMPP.

## Herramientas necesarias

- [Git Bash](https://gitforwindows.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [XAMPP](https://www.apachefriends.org/es/index.html)
- [Node.js](https://nodejs.org/)

## 1. Clonar el proyecto desde GitHub usando Git Bash

1. Abre Git Bash haciendo clic derecho en la carpeta donde quieres guardar el proyecto y seleccionando "Git Bash Here"

2. Escribe el siguiente comando para clonar el repositorio:
   ```
   git clone https://github.com/usuario/nombre-repositorio.git
   ```

3. Entra a la carpeta del proyecto:
   ```
   cd nombre-repositorio
   ```

## 2. Abrir el proyecto en Visual Studio Code

1. Desde Git Bash, escribe el siguiente comando para abrir el proyecto en Visual Studio Code:
   ```
   code .
   ```

   O puedes abrir Visual Studio Code manualmente, ir a "File" > "Open Folder" y seleccionar la carpeta del proyecto.

## 3. Configurar XAMPP para el servicio SQL

1. Abre XAMPP desde el menú de inicio

2. Haz clic en "Start" a MySQL
   
   ![XAMPP Panel](/public/images/xammp.png)

3. Para crear una base de datos:
   - Haz clic en "Admin" junto a MySQL (abrirá phpMyAdmin en tu navegador)
   - En el panel izquierdo, haz clic en "Nueva"
   - Escribe un nombre para la base de datos (por ejemplo: "mi_proyecto")
   - Haz clic en "Crear"

## 4. Instalar las dependencias del proyecto

1. Abre una terminal en Visual Studio Code:
   - Haz clic en "Terminal" > "New Terminal"

2. Instala todas las dependencias con este comando:
   ```
   npm install
   ```

3. Si necesitas instalar dependencias específicas, usa este comando:
   ```
   npm install nodemon mysql2 express ejs
   ```

## 5. Iniciar el proyecto

1. Para iniciar el servidor con nodemon (reinicio automático al detectar cambios):
   ```
   npx nodemon app.js
   ```

2. Para iniciar el servidor sin nodemon:
   ```
   node app.js
   ```

## 6. Acceder al proyecto

1. Abre tu navegador web
2. Accede a: `http://localhost:3000` (o el puerto que esté configurado en el proyecto)

## Comandos útiles

- **Instalar una nueva dependencia:**
  ```
  npm install nombre-paquete
  ```

- **Detener el servidor:**
  Presiona `Ctrl + C` en la terminal donde está ejecutándose

## Solución de problemas básicos

- **Error: EADDRINUSE (puerto en uso):**
  Cambia el puerto en el archivo principal del proyecto o detén la aplicación que está usando ese puerto

- **Error de conexión a la base de datos:**
  Verifica que MySQL esté activo en XAMPP y que los datos de conexión sean correctos

- **Error: Cannot find module:**
  Ejecuta `npm install` para asegurarte de que todas las dependencias estén instaladas


## Comentario
   Usar la extención `vscode-pdf` para visualizar la documentación.