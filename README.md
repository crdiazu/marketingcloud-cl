# MarketingCloud Chile 🇨🇱 · Ventaja Competitiva Digital

Plataforma web oficial de **MarketingCloud Chile** ([marketingcloud.cl](https://marketingcloud.cl/)), estudio estratégico y de ingeniería digital dirigido por **Cristian Díaz**, Consultor Senior con más de 12 años de trayectoria acelerando empresas e instituciones en Chile.

Desarrollada sobre una arquitectura Jamstack ultrarrápida (HTML5 semántico, CSS3 de alto contraste y Canvas 2D interactivo), combinando estética retro arcade inspirada en los años 80 (*H.E.R.O.* de Activision, 1984) con estándares modernos de conversión B2B, optimización GEO SEO para Chile y analítica en tiempo real.

---

## 🚀 Pilares Operativos y Servicios Principales

1. **Marketing Digital como Servicio**: Estrategia comercial, atracción de prospectos B2B, pauta de alta intención (Google Ads & Meta Ads) y desarrollo web orientado a conversión.
2. **Consultoría TI & Infraestructura**: Soporte corporativo presencial y remoto en Santiago, servidores cloud dedicados, hosting empresarial y continuidad operativa.
3. **Asesor Digital y en Ciberseguridad**: Auditoría de vulnerabilidades, protección perimetral, planes de contingencia anti-ransomware y capacitación para colaboradores.
4. **Venta como Servicio (Sales as a Service)**: Prospección activa, calificación BANT y nutrición comercial de oportunidades para equipos de ventas.
5. **Menú Inteligente QR**: Producto propio para gastronomía chilena sin comisiones de apps (0%), pedidos formateados directos a WhatsApp Business.

---

## 🕹️ Motor Físico Interactivo (Canvas 2D Engine)

La plataforma integra un motor de simulación física en tiempo real (`js/engine.js`) ejecutado a 60 FPS:

### 1. Astronautas Micro 80's (Estilo Rod Hero - Activision 1984)
- **Escala Micro Pixel Art** (`p = 1.15`, ~16px de altura) con prop-pack dorsal y hélice giratoria de 4 fotogramas.
- **Navegación 2D por toda la pantalla**: Vuelan libremente en los ejes X e Y, con inclinación aerodinámica natural, crucero autónomo y rebotes suaves en los márgenes del viewport.
- **Pistola Marciana Magnética**: Cada astronauta porta un arma retro marciana que detecta las tarjetas de primer plano (`.service-card`, `.tile`), proyectando haces de inducción con anillos concéntricos que generan tracción y catapultas.
- **Interacción Entre Compañeros**: Choques elásticos juguetones que emiten chispas y enlaces cuánticos de escuadrón al volar en proximidad.
- **Escape Subterráneo (Modo Túnel)**: Si un astronauta queda atrapado o encajado contra un objeto, se sumerge por detrás/debajo de la tarjeta y emerge por su borde inferior.
- **Atracción Magnética Directa**: El cursor del mouse actúa como un imán direccional suave sin órbitas artificiales.

### 2. 6 Entornos Planetarios con Transformación Total de Color
Cambio instantáneo de ambiente, iluminación, gradientes de fondo y bordes de tarjetas mediante la barra superior o atajos de teclado:

| Tecla | Planeta | Color Ambiental | Comportamiento Físico |
| :---: | :--- | :--- | :--- |
| **`[E]`** | **Espacio** | ⬛ **Negro Profundo** | Zero-G cósmico, flotación inercial libre. |
| **`[T]`** | **Tierra** | 🟩 **Verde Jade** | Gravedad estándar 1.0g y propulsión firme. |
| **`[M]`** | **Marte** | 🟥 **Rojo Carmesí** | Gravedad reducida 0.38g y polvo ferroso. |
| **`[A]`** | **Agua** | 🟦 **Azul Abisal** | Resistencia hidrodinámica y oleaje senoidal. |
| **`[P]`** | **Plasma** | ⚡ **Verde Neón** | Densidad electromagnética y amortiguación viscosa. |
| **`[C]`** | **Cuántico** | 🟪 **Púrpura Iridiscente** | Gravedad cuántica oscilante multidireccional con partículas prismáticas. |

### 3. Sobrecarga de Gravedad con `[Ctrl]` y `[Espacio]`
- Al mantener pulsado **`[Ctrl]`** o la **`Barra Espaciadora`**, se activa una sobrecarga de gravedad pesada (`0.54g`), haciendo que los astronautas caigan rápidamente hacia las tarjetas y reboten con chispas de impacto.
- Al soltar la tecla, los propulsores recuperan sustentación y vuelven a despegar.

### 4. Monolitos de Segunda Capa ("VENTAJA COMPETITIVA DIGITAL")
- Renderizados en la capa trasera del canvas de forma difuminada y atmosférica (`blur(10px)`).
- Ocultos al 100% en el Hero inicial y emergentes al hacer scroll, sin entorpecer ni interactuar con los astronautas ni con las tarjetas nítidas del primer plano.

---

## 📈 Indicadores Financieros y Horarios en Vivo
- **Reloj de Santiago de Chile**: Timecode tabular sincronizado en tiempo real (`America/Santiago`, UTC-3).
- **Dólar Observado y Unidad de Fomento (UF)**: Consulta automatizada a la API oficial de indicadores económicos de Chile (`mindicador.cl`).

---

## 📂 Estructura del Proyecto

```text
website/
├── .github/
│   └── workflows/
│       └── pages.yml           # Flujo CI/CD automatizado para despliegue en GitHub Pages
├── css/
│   └── style.css               # Sistema de diseño maestro (tokens, modos planetarios, alto contraste)
├── js/
│   └── engine.js               # Motor Canvas 2D, físicas planetarias, astronautas micro y telemetría
├── index.html                  # Página principal de MarketingCloud Chile
├── servicios.html              # Catálogo detallado de los 4 servicios modulares
├── sobre-mi.html               # Perfil profesional y trayectoria de Cristian Díaz
├── portafolio.html             # Casos de estudio y proyectos reales (ISM Chile, etc.)
├── contacto.html               # Formulario y canales de contacto directo
├── menu-inteligente.html       # Landing y demostración de Menú Inteligente QR
├── robots.txt                  # Directivas de rastreo para motores de búsqueda
├── sitemap.xml                 # Mapa del sitio optimizado para Google Search Console
└── vercel.json                 # Configuración de cabeceras de seguridad y redirecciones 301
```

---

## 🛠️ Tecnologías Utilizadas

- **Frontend Core**: HTML5 semántico sin dependencias externas, CSS3 Grid/Flexbox y variables nativas.
- **Gráficos & Simulación**: HTML5 Canvas API (Context 2D de alta tasa de refresco a resolución Retina/HiDPI).
- **Tipografía**: *Space Grotesk*, *Plus Jakarta Sans* e *IBM Plex Mono* vía Google Fonts.
- **APIs Externas**: `mindicador.cl` (indicadores económicos Banco Central de Chile).
- **Hosting & CI/CD**:
  - **GitHub Pages**: Despliegue continuo en cada `push` a la rama `main` mediante GitHub Actions.
  - **Vercel**: Compatibilidad nativa para despliegue serverless edge con `vercel.json`.

---

## 👤 Consultor & Contacto

- **Consultor Senior**: Cristian Díaz
- **WhatsApp Directo**: [+56 9 4943 8288](https://wa.me/56949438288)
- **Sitio Web**: [marketingcloud.cl](https://marketingcloud.cl/)
- **Email**: `contacto@marketingcloud.cl`
- **Ubicación**: Santiago de Chile, Región Metropolitana (LAT: -33.4489, LON: -70.6693)
