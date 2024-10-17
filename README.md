# baronette-api
Esta API es parte de un sistema que conecta una aplicación web con una base de datos PostgreSQL. Permite la gestión de usuarios, incluyendo registro, login y verificación de privilegios de administrador. Está construida utilizando Node.js con Express, y la base de datos es administrada con PostgreSQL.

## Estructura del proyecto
```
baronette-api/
├── src/
│   ├── app.js................... Punto de entrada de la aplicación
│   ├── routes/
│   │   └── userRoutes.js........ Definición de las rutas relacionadas con los usuarios
│   ├── controllers/
│   │   └── userController.js.... Lógica de control para las solicitudes de los usuarios
│   ├── models/
│   │   └── userModel.js......... Consultas a la base de datos y procesamiento de la información
│   └── config/
│       └── database.js.......... Configuración de la conexión a PostgreSQL
├── docker-compose.yml........... Configuración de Docker para levantar la API
├── Dockerfile................... Archivo Docker para crear la imagen de la API
├── .env......................... Archivo de configuración de variables de entorno
├── package.json................. Dependencias y scripts del proyecto
├── package-lock.json............ Archivo de lock de dependencias
```

## Instalación y configuración
1. ### Requisitos previos:
    - Node.js (se recomienda usar una versión LTS para asegurar la estabilidad)
    - Docker (para desplegar el servicio de forma independiente)
    - Servicio de PostgreSQL instalado o acceso a una base de datos remota
2. ### Clonar el repositorio:
    ```bash
    git clone https://github.com/propstg/baronette-api.git
    cd baronette-api
    ```
3. ### Configuración de las variables de entorno:
    Crea un archivo ``.env`` en la raíz del proyecto con las siguientes variables:`
    ```bash
    # Puerto donde corre la API
    PORT=3000

    # Configuración de la base de datos PostgreSQL
    DB_USER=tu_usuario
    DB_HOST=localhost
    DB_NAME=nombre_base_datos
    DB_PASSWORD=tu_contraseña
    DB_PORT=5432 # Puerto por defecto para servicios PostgreSQL
    ```
4. ### Instalación de dependencias
    Ejecuta el siguiente comando para instalar las dependencias del proyecto:
    ```bash
    npm install
    ```
5. ### Levantar la aplicación
    - #### Con Docker
        ```bash
        docker compose up -d --build
        ```
        Esto construirá la imagen Docker y levantará un contenedor con la API escuchando en el puerto ``3000`` en segundo plano.
    - #### Sin Docker
        Si prefieres ejecutar la instalación directamente:
        ```bash
        npm src/app.js
        ```

## Endpoints
### ``POST /api/login``
Realiza el login de un usuario.
- Body:
    ```json
    {
        "username": "usuario",
        "user_password": "contraseña"
    }
    ```
- Respuestas:
    - ``200 OK``: El usuario ha accedido correctamente.
    - ``401 Unauthorized``: Contraseña incorrecta.
    - ``404 Not Found``: Usuario no encontrado.
    - ``403 Forbidden``: Usuario no verificado por un administrador.
### ``POST /api/register``
Registra un usuario.
- Body:
    ```json
    {
        "first_name": "nombre",
        "last_name_1": "apellido1",
        "last_name_2": "apellido2",
        "username": "usuario",
        "user_password": "contraseña",
        "email": "correo@ejemplo.com"
    }
    ```
- Respuestas:
    - ``201 Created``: Usuario registrado correctamente.
    - ``400 Bad request``: El nombre de usuario o correo ya están en uso.
### ``POST /api/settings``
Verifica si un usuario es administrador.
- Body:
    ```json
    {
        "user_id": "id_usuario"
    }
    ```
- Respuestas:
    - ``200 OK``: El usuario es administrador o no.
    - ``500 Internal Server Error``: Error al verificar el estatus del usuario.

## Modelo de Base de Datos
La API asume la existencia de dos tablas principales:
### Tabla ``user_list``
Esta tabla contiene la información de los usuarios:
| Campo | Tipo | Descripción |
|-------|------|-------------|
|id|SERIAL| Identificador único de usuario uuid4 (clave primaria)|
|first_name|VARCHAR|Nombre (real) del usuario|
|last_name_1|VARCHAR|Primer apellido del usuario|
|last_name_2|VARCHAR|Segundo apellido del usuario (opcional)|
|username|VARCHAR|Nombre de usuario en la aplicación (único)|
|user_password|VARCHAR|Contraseña (hasheada) del usuario|
|email|VARCHAR|Correo electrónico del usuario|
|verified|BOOLEAN|Indica si el usuario está verificado|

### Tabla ``admin_list``
Esta tabla contiene los identificadores de los usuarios que son administradores:
| Campo | Tipo | Descripción |
|-------|------|-------------|
|admin_id|SERIAL| Identificador único de administrador uuid4 (clave primaria)|
|user_id|SERIAL| Identificador único de usuario uuid4 (clave foránea [user_list])|

## Despliegue
Si deseas desplegar la API en un servidor, asegúrate de que las variables de entorno estén configuradas correctamente en el servidor y que la base de datos PostgreSQL esté accesible desde la ubicación del servidor.
1. ### Construir la imagen de Docker:
    ```bash
    docker build -t baronette-data-api .
    ```
2. ### Ejecutar el contenedor:
    ```bash
    docker run -d -p 3000:3000 --env-file .env baronette-data-api
    ```
***Si bien también es posible ejecutar el comando explicado anteriormente: ``docker compose up -d --build``. Hay que tener el cuenta que antes de ejecutarlo se deben hacer las modificaciones necesarias en el archivo ``docker-compose.yml``***

## Dependencias
- Express: Framework de Node.js para desarrollar servidores web.
- bcrypt: Middleware para encriptar y verificar datos sensibles.
- body-parser: Middleware para procesar datos en formato JSON.
- CORS: Middleware para habilitar Cross-Origin Resource Sharing.
- dotenv: Middleware para cargar variables de entorno desde un archivo ``env``.
- pg: Cliente de Node.js para PostgreSQL

## Licencia
Este proyecto está licenciado bajo la licencia MIT:
```txt
MIT License

Copyright (c) 2024 Propstg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```