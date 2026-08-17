# Mini Desk Store — Mobile

App de tienda con flujo de carrito completo, construida con React Native + Expo + TypeScript, consumiendo la [Fake Store API](https://fakestoreapi.com). Prueba técnica Full Stack con enfoque Mobile.

## Stack

- **Expo SDK 57** (React Native 0.86)
- **TypeScript**
- **Expo Router** — navegación basada en archivos
- **Zustand** — estado global del carrito
- **TanStack Query (React Query) v5** como fetching y cache de datos del servidor
- **Axios** como cliente HTTP
- **expo-image**, **expo-linear-gradient**, **@expo/vector-icons** — UI

## Requisitos

- Node.js **v24.18.0** (debería funcionar igual con cualquier v20+; esta es la versión usada en desarrollo)
- npm
- App **Expo Go** instalada en el celular (Android/iOS), compatible con SDK 57 — o un build de desarrollo

## Instalación y ejecución

```bash
git clone <url-del-repo>
cd mini-desk-store-mobile
npm install
npx expo start
```

Luego:

- Escanea el código QR con la app **Expo Go** desde tu celular estando en la misma red WiFi que la computadora; si tu red bloquea conexiones LAN, usa `npx expo start --tunnel`).
- O presiona `w` en la terminal para abrir la versión web.
- O presiona `a` con un emulador Android corriendo.

No se necesita ninguna variable de entorno ni configuración adicional ya que no hay backend propio, la app consume directamente `https://fakestoreapi.com`.

## Estructura de carpetas

```
mini-desk-store-mobile/
├── app/                     # Rutas (Expo Router, basado en archivos)
│   ├── _layout.tsx          # Layout raíz: providers (React Query, SafeArea) y stack de navegación
│   ├── index.tsx            # Pantalla de bienvenida
│   ├── products/
│   │   ├── index.tsx        # Listado de productos (Pantalla 1)
│   │   └── [id].tsx         # Detalle de producto — ruta dinámica (Pantalla 2)
│   ├── cart.tsx              # Resumen del carrito (Pantalla 3)
│   ├── checkout.tsx          # Pago mock (Pantalla 4)
│   └── success.tsx           # Confirmación de pago
│
├── components/                # Componentes de UI reutilizables, sin lógica de negocio propia
├── hooks/                      # Custom hooks: conectan componentes con datos/estado
├── store/                      # Estado global (Zustand)
├── services/                   # Capa de datos: cliente HTTP y llamadas a la API
├── types/                      # Tipos de dominio (Product, CartItem, CartLine)
├── constants/                   # Configuración (API, cache) y sistema de diseño (theme)
├── utils/                       # Funciones puras de utilidad (formateo)
└── assets/                      # Íconos e imagen de fondo de la bienvenida
```

**Por qué esta organización:** separa por *responsabilidad técnica* osea qué hace cada cosa en vez de por *feature*, porque el proyecto es chico y organizar por feature hubiera sido una capa de abstracción sin beneficio para este tamaño. `app/` contiene únicamente rutas y su JSX con eso toda la lógica reutilizable como fetching, estado, formateo vive fuera de `app/` en carpetas de nivel raíz, para que las pantallas se mantengan finas y legibles.

---

## Decisiones técnicas

### 1. Manejo de estado global

Elegí **Zustand** sobre Redux.

- **Por qué Zustand y no Redux:** para este alcance Redux implica ceremonia sin beneficio real ya que implica reducers, action types, y un `Provider` envolviendo toda la app, para manejar lo que acá es un objeto y cuatro funciones. Zustand da un hook directo, sin Provider, con soporte nativo para suscripción selectiva por selector, que es justo lo que necesitaba para el problema de rendimiento de abajo.
- **¿Cuándo elegiría Redux en cambio?** Si la app tuviera varios dominios de estado global interdependientes, necesitara middleware pesado, o el equipo ya tuviera Redux estandarizado en otros proyectos.
- **Qué vive en el estado global y qué no:** únicamente el carrito ya que es estado de cliente puro, generado por interacción del usuario. El catálogo de productos no vive en Zustand porque es estado de servidor, con su propio ciclo de vida, y vive en el cache de React Query. Mezclarlos hubiera significado duplicar datos y sincronizar su vigencia a mano.
- **Rendimiento con los controles repartidos en 3 pantallas:** dos decisiones lo resuelven. (1) El carrito se guarda como `Record` indexado por `id` de producto, no como array así actualizar o leer la cantidad de un producto puntual no requiere recorrer una lista en cada tap de +/-. (2) Los hooks de acceso usan selectores de Zustand, así cada componente se suscribe solo al fragmento de estado que necesita: una fila del listado solo se re-renderiza cuando cambia la cantidad de su propio producto, no cuando cambia cualquier otro ítem del carrito.

### 2. Navegación y rutas dinámicas

Elegí **Expo Router** (basado en archivos) sobre el enfoque legacy con React Navigation directo.

- **Por qué:** rutas dinámicas nativas por convención de archivos (`products/[id].tsx`), deep linking automático sin configuración extra, y es el enfoque que Expo recomienda actualmente para proyectos nuevos.
- **Estructura de rutas:**
  ```
  /                    → Bienvenida
  /products            → Listado
  /products/[id]        → Detalle (ruta dinámica)
  /cart                → Carrito
  /checkout             → Pago mock
  /success              → Confirmación
  ```
- **Parámetros de ruta dinámica:** `app/products/[id].tsx` lee el id con `useLocalSearchParams<{ id: string }>()`, lo convierte a número, y llama a `useProduct(id)` de forma independiente ya que nunca depende de datos pasados por navegación desde el listado. Esto es lo que garantiza que la ruta funcione si se abre directo, osea, probado manualmente escribiendo la URL en la versión web sin pasar por el listado.
- **Stack de navegación del flujo completo:** `router.push` para avanzar (bienvenida → listado → detalle → carrito → checkout). Al confirmar el pago, `router.replace('/success')` en vez de `push`, para que el checkout ya procesado no quede en el historial. Desde la pantalla de éxito, `router.dismissTo('/products')` en vez de `push`/`replace` esto descarta todas las pantallas intermedias y vuelve limpio al listado original, sin duplicar esa ruta en la pila.
- El número de orden, total pagado y cantidad de ítems se pasan del checkout a la pantalla de éxito como **parámetros de ruta**, no como estado global ya que es información efímera de una sola navegación, no algo que el resto de la app necesite leer.

### 3. Cache del lado del cliente

Elegí **TanStack Query (React Query)**.

- **Estrategia y configuración:** `staleTime` de 5 minutos y `gcTime` de 30 minutos, configurados globalmente en el `QueryClient` (`app/_layout.tsx`, valores centralizados en `constants/config.ts`). `retry: 2` global también.
- **Por qué esos valores:** el catálogo de la Fake Store API es esencialmente estático, así que tratarlo como "fresco" por 5 minutos evita refetch innecesario mientras el usuario navega entre listado/detalle/carrito, sin arriesgar mostrar datos desactualizados de forma perceptible. 30 minutos de `gcTime` cubre cómodamente una sesión de uso normal sin mantener datos en memoria indefinidamente.
- **Qué se cachea y qué no:** se cachean únicamente las lecturas GET (listado y detalle de producto) — son idempotentes y se comparten entre pantallas. No hay nada más que cachear: no existen mutaciones contra la API real (el carrito y el pago son 100% locales/mock, viven en Zustand y en estado de componente, no en React Query).

### 4. Custom hooks

- **`useProducts()`** — encapsula fetch + cache del catálogo completo. Evita repetir configuración de `useQuery` en cada lugar que necesite la lista.
- **`useProduct(id)`** — fetch + cache de un producto individual, siempre independiente del listado (garantiza que el deep link funcione), con la optimización de `initialData` descrita arriba.
- **`useCartItem(product)`** — resuelve el problema central de rendimiento: un componente se suscribe solo a la cantidad de su propio producto, no al carrito completo. Usado en `ProductCard` y en el detalle.
- **`useCartSummary()`** — transforma el estado crudo del store (objeto indexado por id) en lo que necesita la pantalla de carrito: líneas con subtotal por línea y el total general.
- **`useCartBadge()`** — aísla el conteo total de ítems para el indicador persistente del carrito (header), independiente del resto del estado del carrito.

Ninguno es decorativo: cada uno resuelve un problema puntual de re-render, de independencia de datos, o de transformación de forma de los datos.

### 5. Capa de datos y peticiones a la API

Elegí **Axios** sobre `fetch`.

- **Por qué:** interceptores para normalizar errores en un solo lugar (una clase `ApiError` tipada con mensaje legible y `status`), `timeout` configurable de forma nativa, y `baseURL` para no repetir la URL de la API en cada llamada. Con `fetch` nativo, cada una de estas cosas hay que armarla a mano.
- **Organización:** un solo archivo, `services/api.ts`, con la instancia de Axios (interceptor incluido) y dos funciones: `fetchProducts()` y `fetchProductById(id)`. No hay más endpoints que consumir porque toda la app es de solo lectura contra la API pública.
- **Manejo de errores:** el interceptor de respuesta de Axios distingue tres casos (error HTTP con respuesta, timeout, sin conexión) y los envuelve en un `ApiError` con mensaje legible para el usuario. Combinado con el `retry: 2` de React Query y el componente `ErrorState` con botón Retry, la app se recupera de fallas intermitentes de la API sin quedar trabada ni mostrar errores técnicos crudos al usuario.

### 6. Calidad general

- **TypeScript** en todo el proyecto, con `strict: true` (heredado del `tsconfig` base de Expo).
- **Estructura de carpetas** explicada arriba.
- **UI libre**, pero con un sistema de diseño consistente (`constants/theme.ts`): una paleta de blanco de fondo con imagen de fondo en pantalla de bienvenida y color **ámbar** reservado exclusivamente para botones de acción de compra (Add, Shop Now, Proceed to Payment, Confirm Payment, Go to Cart, etc.), para que el usuario siempre identifique visualmente cuál es la acción principal en cada pantalla.

---

## Qué quedó fuera y qué haría con más tiempo

- **Sin tests automatizados.** Con más tiempo agregaría tests unitarios (Jest + React Native Testing Library) para el store de Zustand y los hooks del carrito, y un test end-to-end (Maestro o Detox) del flujo crítico completo (agregar → checkout → éxito).
- **Sin persistencia del carrito** (AsyncStorage). Es intencional ya que el documento excluye explícitamente persistencia en servidor o sesión, pero en una app real sería el siguiente paso natural para que el carrito sobreviva a un cierre de la app.
- **Sin skeleton loading** ya que se usa un spinner simple en vez de un esqueleto de la grilla de productos, que mejoraría la percepción de velocidad de carga.
- 

## Decisiones sobre requerimientos ambiguos

- **Idioma de la interfaz:** se optó por inglés en toda la UI, para que sea consistente con los datos de la Fake Store API. Esto incluye el texto de confirmación de pago, que en el documento aparece citado en español ("Pago completado con éxito") simplemente porque el documento entero está en español pero se tradujo a "Payment Completed Successfully!" para mantener consistencia total del idioma en la app, priorizando ese criterio de consistencia (explícitamente evaluado en el punto 4.6) por sobre una coincidencia literal de texto.
- **Filtro por categoría** en el listado: funcionalidad adicional no pedida por el documento, agregada porque el propio documento invita a sumar funcionalidad extra. Se calcula en el cliente a partir del listado ya cacheado, sin pedir nada nuevo a la API.
- **Formulario de pago con vencimiento y CVV**, y confirmación con número de orden/fecha de entrega estimada: también funcionalidad extra, simulando un checkout más realista sin que exista ningún procesamiento de pago real detrás.
