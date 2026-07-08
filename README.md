# 🎉 Quiniela Mundialista · Mundial 2026

Versión **actualizada** de tu quiniela: tu `quiniela_oscar` estaba corriendo
sobre una versión más vieja del motor. Este paquete la pone al día con
exactamente las mismas mejoras — motor, funciones nuevas y diseño — que tiene
`quiniela_familia` a hoy, pero conectada a **tu propio proyecto Firebase**
(`quiniela-oscar`), así que tus usuarios, PINs y datos guardados siguen
intactos.

---

## 🆕 Últimos cambios (esta ronda)

- **Tabla + Estadísticas fusionadas** en una sola pestaña "Tabla": ya no hay
  contenido repetido. Arriba hay KPIs (líder, mejor precisión, mejor racha,
  rey del empate, partidos jugados) y abajo una sola tabla con todas las
  columnas (antes eran dos tablas separadas).
- **Bracket clickeable**: cada cruce (incluido el centro/Final) ahora se
  puede clickear. Si el partido ya se jugó, muestra marcador, goleadores,
  cómo se decidió (tiempo extra/penales), sede del partido y quién del grupo
  le atinó. Si todavía no se juega, muestra una **probabilidad casera** de
  quién avanza, calculada con los partidos que ya tenés sincronizados
  (puntos y diferencia de gol por partido en el torneo) — sin depender de
  ninguna API de pago.
- **Sede del partido**: el sincronizador ahora también guarda el estadio
  (`ground`) que ya venía gratis en el JSON de openfootball y no se estaba
  usando.
- **KPI en "Mi quiniela"**: 🚀 Puntos en juego — el techo de puntos que
  todavía podés ganar si le atinás a todo lo que falta, más un aviso si te
  quedan partidos sin pronosticar.
- **KPIs en "Comparar"**: 🐑 % de coincidencia con el consenso del grupo y
  🎲 cuántos "picks contrarian" llevás — además, cada tarjeta de partido
  marca con una etiqueta cuando tu pronóstico le fue en contra al grupo.
- **KPIs en "Admin"**: panel de salud de datos — resultados pendientes de
  capturar, quinielas incompletas (con nombres), partidos por bloquearse en
  menos de 3h, y el total de partidos/participantes.
- **Área de toque más grande en el bracket (móvil)**: los círculos del
  bracket se ven igual que antes, pero ahora responden al tacto en un área
  bastante más grande alrededor de cada uno.
- **La app ahora es instalable (PWA)**: se agregó `manifest.json`, `sw.js`
  (service worker) e íconos (`icon-192.png`, `icon-512.png`,
  `icon-512-maskable.png`, `apple-touch-icon.png`). Con esto el teléfono
  ofrece "Instalar" / "Agregar a inicio" y la app abre en pantalla completa,
  con su propio ícono — ver **"Instalarla en el teléfono"** más abajo.
- **Animaciones nuevas**: sonido sutil al iniciar sesión, transición de
  "boleto que se abre" al entrar, confeti de fondo y cambio de pestaña con
  deslizamiento.

---

## 📱 Instalarla en el teléfono (PWA)

Esto **no es una app nueva que subir a una tienda** — es la misma página web
de siempre, pero ahora cumple los requisitos técnicos para que el teléfono la
deje "instalar" con ícono propio y sin la barra del navegador.

**Android (Chrome):**
1. Abrí el link de la quiniela en Chrome.
2. Va a aparecer un botón "Instalar app" solo, o desde el menú ⋮ → **"Instalar app"** / **"Agregar a pantalla de inicio"**.
3. Listo — queda un ícono como cualquier otra app, y abre en pantalla completa.

**iPhone (Safari):**
- iOS **no muestra un botón automático** — hay que hacerlo a mano, siempre:
  1. Abrí el link en **Safari** (tiene que ser Safari, no Chrome).
  2. Tocá el ícono de compartir (el cuadrito con la flecha hacia arriba).
  3. Buscá **"Agregar a pantalla de inicio"**.

> Nota técnica: los datos de la quiniela siguen viviendo en Firestore y
> necesitan internet para estar al día — esto no la vuelve una app 100%
> offline, solo hace que abra como una app instalada en vez de una pestaña
> del navegador.

---

## Qué le hacía falta a quiniela_oscar (y ya se agregó)

### 1. Motor de quiniela (lógica) — goles fuera de tiempo, empates y penales
- **Tiempo extra**: si un cruce se define en tiempo extra sin ir a penales
  (marcador reglamentario 90' empatado), se captura el marcador de tiempo
  extra por separado y se usa, junto con los penales si los hubo, para
  decidir correctamente quién gana el cruce — el marcador que la gente
  pronostica sigue siendo el de los 90'.
- **Puntos por acertar el ganador en penales o tiempo extra**: si
  predijiste que un equipo ganaba y ese equipo avanzó por penales o tiempo
  extra (aunque el marcador reglamentario haya sido empate), te suma los
  puntos de "ganador acertado", como si hubieras acertado el resultado.
- **Pronóstico de penales**: si tu pronóstico es un empate, podés elegir
  quién creés que avanza en penales. Si acertás, ganás **+1 punto extra**
  (además de tus puntos por acertar el empate reglamentario).
- **Ventana de "en vivo"**: se extendió de 2h a 2h40 para no marcar un
  partido de eliminación directa como "Final" antes de que termine el
  tiempo extra y los penales.
- **Goleadores**: se muestran debajo de cada partido jugado (nombre +
  minuto), importados automáticamente de la fuente de datos.
- **Bracket**: bracket radial animado con banderas, iluminación de ronda en
  ronda, campeón en el centro, y ahora clickeable en cada cruce (ver arriba).

### 2. Herramientas de Admin
- **Sincronizar**: un solo botón trae calendario, resultados (incluyendo
  tiempo extra y penales), goleadores y sede — gratis, sin API key, desde
  openfootball.
- **Verificar horarios**: compara cada partido guardado contra la fuente
  oficial y te deja corregir uno por uno si algo no cuadra.
- **Panel de salud de datos**: ver sección de KPIs de Admin arriba.
- **Marcador en vivo (opcional)**: si además querés marcador minuto a
  minuto, podés conectar una API key gratuita de API-Football desde Admin.
  La key se guarda solo en tu navegador y las llamadas pasan por una
  función serverless (`api/resultados.js`) para que nunca quede expuesta en
  el código fuente.

### 3. Diseño — rediseño completo, desde el login
Identidad "boleto de lotería": tipografía cálida (Fraunces + Manrope +
JetBrains Mono para los marcadores), paleta marigold/berry, listón de papel
picado animado en el login. El bracket mantiene un fondo oscuro de "noche de
estadio" a propósito — es el único lugar con ese contraste, el resto de la
app es cálido y de día.

Se dejó el nombre **Quiniela Mundialista** que ya usabas (no "Familia"); si
querés otro nombre, buscá `Mundialista` en `index.html` y `manifest.json` y
reemplazalo donde aparezca.

---

## Publicar los cambios

1. Sube estos archivos a tu repositorio de GitHub existente de
   `quiniela_oscar` (los mismos nombres: `index.html`, `style.css`, `app.js`,
   y ahora también `manifest.json`, `sw.js`, los íconos, y la carpeta `api/`
   y `vercel.json` si no la tenías ya).
2. Vercel vuelve a desplegar automáticamente en cuanto detecta el cambio.
3. No hace falta ningún truco de "primer usuario" — tus usuarios y PINs
   existentes siguen ahí porque los datos viven en tu Firestore
   (`quiniela-oscar`), no en el código.
4. Dale un clic a **Sincronizar** en Admin una vez publicado, para que los
   partidos que se hayan definido en tiempo extra o penales se corrijan
   solos y quede la sede guardada.
5. Si alguien ya tenía la página guardada como acceso directo desde antes,
   puede que tenga que borrarla y volver a agregarla una vez para que tome
   el ícono nuevo y el modo pantalla-completa.

---

## Estructura de archivos

```
quiniela_oscar/
├── index.html               — estructura de la página
├── style.css                 — identidad visual completa
├── app.js                     — motor de quiniela + funciones nuevas
├── manifest.json             — metadatos de la PWA
├── sw.js                       — service worker (requisito técnico de instalación)
├── icon-192.png, icon-512.png,
│   icon-512-maskable.png,
│   apple-touch-icon.png      — íconos de la PWA
├── trophy-fifa26.png         — trofeo del login
├── api/resultados.js        — proxy serverless opcional para marcador en vivo
├── vercel.json                — configuración de rutas para el proxy
└── README.md                  — esta guía
```
