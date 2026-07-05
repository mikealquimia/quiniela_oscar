# 🎉 Quiniela Mundialista · Mundial 2026

Versión **actualizada** de tu quiniela: tu `quiniela_oscar` estaba corriendo
sobre una versión bastante más antigua del motor (parecida a como estaba
`quiniela_familia` antes de mejorarla). Este paquete la pone al día con
exactamente las mismas mejoras — motor, funciones nuevas y diseño — que ya
tiene `quiniela_familia`, pero conectada a **tu propio proyecto Firebase**
(`quiniela-oscar`), así que tus usuarios, PINs y datos guardados siguen
intactos.

---

## Qué le hacía falta a quiniela_oscar (y ya se agregó)

### 1. Bracket
Tenías el bracket viejo (columnas simples, sin animación). Ahora tiene el
bracket radial animado: banderas por equipo, iluminación de ronda en ronda y
el campeón en el centro cuando se define. Además, en esta entrega el bracket
ocupa toda la pantalla en su pestaña en vez de un espacio angosto.

### 2. Motor de puntos — arreglos importantes
- **Tiempo extra**: tu versión anterior solo guardaba el marcador reglamentario
  (90'). Si un cruce se definía en tiempo extra sin ir a penales (como
  Argentina 3-2 Cabo Verde este Mundial), lo registraba como empate y no
  sabía quién avanzaba. Ahora se captura el marcador de tiempo extra y se usa,
  junto con los penales, para decidir correctamente quién gana el cruce.
- **Puntos por acertar el ganador en penales o tiempo extra**: si predijiste
  que un equipo ganaba y ese equipo avanzó por penales o tiempo extra
  (aunque el marcador reglamentario haya sido empate), ahora sí te suma los
  puntos de "ganador acertado".
- **Ventana de "en vivo"**: se extendió de 2 a 2h40 para no marcar un partido
  como "Final" antes de que termine el tiempo extra y los penales.
- **Goleadores**: ahora se muestran debajo de cada partido jugado.

### 3. Función nueva — pronóstico de penales
Si tu pronóstico es un empate, puedes elegir quién crees que avanza en
penales. Si aciertas, ganas **+1 punto extra**.

### 4. Herramientas de Admin
- **Sincronizar**: un solo botón trae calendario, resultados (incluyendo
  tiempo extra y penales), goleadores, y corrige horarios/fases — gratis,
  sin necesidad de ninguna API key, desde openfootball.
- **Verificar horarios**: compara cada partido guardado contra la fuente
  oficial y te deja corregir uno por uno si algo no cuadra.
- **Marcador en vivo (opcional)**: si además quieres marcador minuto a
  minuto, puedes conectar una API key gratuita de API-Football desde Admin.
  A diferencia de tu versión anterior (donde la key quedaba escrita en texto
  plano dentro de `app.js`), ahora se guarda solo en tu navegador y las
  llamadas pasan por una función serverless (`api/resultados.js`) para que la
  key nunca quede expuesta en el código fuente.

### 5. Diseño — rediseño completo, desde el login
Se reemplazó el diseño anterior (fondo con marca de agua, tipografía básica)
por una identidad nueva tipo "boleto de lotería": tipografía cálida (Fraunces
+ Manrope + JetBrains Mono para los marcadores), paleta marigold/berry, y un
listón de papel picado animado en el login. El bracket mantiene un fondo
oscuro de "noche de estadio" a propósito — es el único lugar con ese
contraste, el resto de la app es cálido y de día.

Se dejó el nombre **Quiniela Mundialista** que ya usabas (no "Familia"); si
quieres otro nombre es un cambio de una línea en `index.html` (buscá
`Mundialista` y reemplazalo donde aparezca).

---

## Publicar los cambios

1. Sube estos archivos a tu repositorio de GitHub existente de
   `quiniela_oscar` (los mismos nombres: `index.html`, `style.css`, `app.js`,
   y ahora también la carpeta `api/` y `vercel.json` si no la tenías ya).
2. Vercel vuelve a desplegar automáticamente en cuanto detecta el cambio.
3. No hace falta ningún truco de "primer usuario" — tus usuarios y PINs
   existentes siguen ahí porque los datos viven en tu Firestore
   (`quiniela-oscar`), no en el código.
4. Dale un clic a **Sincronizar** en Admin una vez publicado, para que los
   partidos que ya se jugaron en tiempo extra (como Argentina vs Cabo Verde)
   se corrijan solos.

---

## Estructura de archivos

```
quiniela_oscar/
├── index.html         — estructura de la página (nuevo diseño)
├── style.css           — identidad visual nueva, completa
├── app.js               — motor de quiniela + funciones nuevas
├── api/resultados.js  — proxy serverless opcional para marcador en vivo
├── vercel.json          — configuración de rutas para el proxy
└── README.md            — esta guía
```
