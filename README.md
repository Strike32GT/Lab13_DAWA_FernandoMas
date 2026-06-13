# Lab12_DAWA_Fernando_Mas

## Autenticacion OAUTH

Proyecto desarrollado con Next.js y NextAuth.js para implementar autenticacion en una aplicacion web.

En este laboratorio se trabajo el registro y logueo de usuarios usando diferentes proveedores de autenticacion:

- Google
- Discord
- GitHub
- Credenciales con correo y contrasena

## Desarrollo

Primero se habilitaron las credenciales OAuth en los portales de desarrolladores de cada proveedor:

- Google Cloud Console
- GitHub Developer Settings
- Discord Developer Portal

Luego se configuraron los Client ID, Client Secret y las URL de callback necesarias en el archivo `.env.local`.

En la aplicacion se uso NextAuth.js para conectar los proveedores OAuth y manejar la sesion del usuario. Tambien se agrego autenticacion con credenciales mediante `CredentialsProvider`.

Para el registro con credenciales se implemento cifrado de contrasenas usando `bcrypt`. Ademas, se agrego un control de intentos fallidos para bloquear temporalmente el inicio de sesion luego de varios intentos incorrectos.

## Funcionalidades

- Login con Google.
- Login con GitHub.
- Login con Discord.
- Registro con nombre, correo y contrasena.
- Inicio de sesion con credenciales.
- Cifrado de contrasenas con bcrypt.
- Bloqueo temporal por multiples intentos fallidos.
- Proteccion de rutas privadas con middleware.

## Variables de entorno

El proyecto usa variables de entorno para las credenciales de OAuth y NextAuth:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_ID=
GITHUB_SECRET=

DISCORD_ID=
DISCORD_SECRET_CLIENT=

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

El archivo `.env.local` no debe subirse al repositorio porque contiene credenciales privadas.

## Ejecucion

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

Abrir la aplicacion en:

```text
http://localhost:3000
```

## Autor

Hecho por Fernando Mas Pinto.
