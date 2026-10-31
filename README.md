# MarketingCloud Chile — Web Estática (Vercel & GitHub)

Sitio web oficial de MarketingCloud Chile (`marketingcloud.cl`), migrado desde WordPress hacia una arquitectura estática ultrarrápida (Jamstack/HTML5) con diseño moderno, optimización SEO local para Chile (GEO) y soporte de Google Search Console.

## Estructura de Archivos
- `index.html`: Página principal con SEO Schema.org, metatags GEO, portafolio y propuesta de valor.
- `vercel.json`: Redirecciones 301 de las URLs antiguas de WordPress y cabeceras de seguridad.
- `sitemap.xml`: Mapa del sitio para Google Search Console.
- `robots.txt`: Reglas de rastreo de motores de búsqueda.

## Cómo Subir a GitHub y Publicar en Vercel

### Paso 1: Inicializar repositorio Git en esta carpeta
Abre la terminal en la carpeta `website` y ejecuta:
```bash
git init
git add .
git commit -m "feat: migración inicial marketingcloud a vercel"
git branch -M main
```

### Paso 2: Conectar con tu repositorio en GitHub
1. Crea un nuevo repositorio en [github.com/new](https://github.com/new) llamado `marketingcloud-cl` (público o privado).
2. Vincula el repositorio remoto y haz push:
```bash
git remote add origin https://github.com/TU_USUARIO/marketingcloud-cl.git
git push -u origin main
```

### Paso 3: Desplegar en Vercel
1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New... -> Project**.
3. Selecciona tu repositorio `marketingcloud-cl` y dale a **Deploy**.
4. ¡Listo! Vercel te dará una URL temporal instantánea (ej: `marketingcloud-cl.vercel.app`).

