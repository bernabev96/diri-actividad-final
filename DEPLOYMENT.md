# Despliegue de GymQueue

## Instalacion

Requisitos:

- Node.js 22
- pnpm

Instalar dependencias:

```bash
pnpm install
```

## Variables de entorno

Crear un archivo `.env.local` a partir de `.env.example`:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Los valores se obtienen desde la configuracion web del proyecto Firebase.

## Ejecucion local

```bash
pnpm dev
```

## Tests

```bash
pnpm test --run
```

## Build de produccion

```bash
pnpm build
```

El resultado se genera en la carpeta `dist`.

## GitHub Pages

La aplicacion usa `HashRouter`, por lo que las rutas publicadas funcionan con URLs del tipo:

```txt
https://usuario.github.io/repositorio/#/classes
```

Pasos:

1. Subir el proyecto a GitHub.
2. En Settings > Pages, seleccionar GitHub Actions como fuente de despliegue.
3. Crear en Settings > Secrets and variables > Actions los secretos `VITE_FIREBASE_*`.
4. Hacer push a la rama `main`.

El workflow `.github/workflows/deploy.yml` instala dependencias, ejecuta el build y publica `dist` en GitHub Pages.
