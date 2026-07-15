// =====================================================================
// NINCH STAGE — Cuestionario conversacional (chatbot)
// Reemplaza al FAQ. Recolecta respuestas y las envía al Google Sheet.
// =====================================================================

export const CONTACT_EMAIL = "newbusiness@ninchcompany.com";

export type StepType = "single" | "multi" | "open" | "country" | "email";

export interface Step {
  id: string;              // clave con la que se guarda la respuesta
  question: string;        // texto que muestra el bot
  type: StepType;
  options?: string[];      // para single / multi
  placeholder?: string;    // para open / email
  optional?: boolean;      // permite saltear
  // Muestra este paso sólo si la respuesta guardada en `stepId` es uno de `equals`.
  showIf?: { stepId: string; equals: string[] };
}

export const WELCOME_TEXT =
  "👋 Hola, soy STAGE.\nConectamos marcas y creadores para desarrollar contenido auténtico, creativo y relevante para la cultura de hoy.\n\nPara empezar, contanos: ¿Quién eres?";

export const PATH_OPTIONS = [
  { id: "marca", label: "🔵 Soy una Marca" },
  { id: "creador", label: "🟣 Soy un Creador" },
];

// ---------------------------------------------------------------------
// RAMA: MARCA
// ---------------------------------------------------------------------
export const MARCA_STEPS: Step[] = [
  {
    id: "objetivo",
    question: "¿Cuál es tu principal objetivo hoy?",
    type: "single",
    options: [
      "Generar más contenido para redes",
      "Generar contenido para pauta digital",
      "Lanzar un producto o servicio",
      "Aumentar ventas o conversiones",
      "Generar awareness",
      "Estoy explorando opciones",
      "Ya tengo un brief a compartirles",
    ],
  },
  {
    id: "canales",
    question: "¿Dónde necesitás ese contenido?",
    type: "single",
    options: ["Instagram", "TikTok", "YouTube", "Varios canales"],
  },
  {
    id: "tipoContenido",
    question: "¿Qué tipo de contenido imaginás para tu marca?",
    type: "multi",
    options: [
      "Testimoniales",
      "Reviews",
      "Unboxing",
      "Tutoriales",
      "Lifestyle",
      "Trends",
      "No estoy seguro todavía",
    ],
  },
  {
    id: "modeloTrabajo",
    question: "¿Cómo te gustaría trabajar con los creadores?",
    type: "single",
    options: [
      "Solo necesito que produzcan contenido",
      "Quiero que además publiquen en sus redes",
      "Estoy evaluando ambas opciones",
      "No estoy seguro",
    ],
  },
  {
    id: "frecuencia",
    question: "¿Se trata de una necesidad puntual o recurrente?",
    type: "single",
    options: ["Una campaña puntual", "Mensual", "Trimestral", "Always-on"],
  },
  {
    id: "cantidadPiezas",
    question: "¿Cuántas piezas de contenido estimás necesitar?",
    type: "single",
    options: [
      "Menos de 10",
      "Entre 10 y 25",
      "Entre 25 y 50",
      "Entre 50 y 100",
      "Más de 100",
      "No lo tengo definido",
    ],
  },
  {
    id: "cantidadCreadores",
    question: "¿Ya tenés pensado cuántos creadores te gustaría involucrar?",
    type: "single",
    options: [
      "1 a 5",
      "5 a 10",
      "Más de 10",
      "Quiero que STAGE me lo recomiende",
      "No lo sé todavía",
    ],
  },
  {
    id: "preocupacion",
    question: "¿Qué es lo que más te preocupa al momento de contratar UGC?",
    type: "multi",
    options: [
      "La calidad del contenido",
      "Encontrar los creadores correctos",
      "El costo",
      "Los tiempos de entrega",
      "Medir resultados",
      "Gestionar todo el proceso",
    ],
  },
  {
    id: "produccionActual",
    question: "¿Cómo resolvés hoy la producción de contenido?",
    type: "multi",
    options: [
      "Equipo interno",
      "Agencia",
      "Influencers",
      "Freelancers",
      "Productora audiovisual",
      "No estoy generando suficiente contenido",
    ],
  },
  {
    id: "porQueUGC",
    question:
      "¿Qué te haría elegir una plataforma de UGC sobre una agencia o productora tradicional?",
    type: "multi",
    options: [
      "Más velocidad",
      "Menor costo",
      "Mayor volumen de contenido",
      "Acceso a creadores especializados",
      "Mejor performance",
      "Más flexibilidad",
    ],
  },
  {
    id: "industria",
    question: "¿Qué industria representa tu marca?",
    type: "single",
    options: [
      "Beauty",
      "Consumo Masivo",
      "Retail",
      "Tecnología",
      "Finanzas",
      "Automotriz",
      "Turismo",
      "Salud",
      "Otra",
    ],
  },
  {
    id: "presupuesto",
    question:
      "¿Qué presupuesto destinás actualmente a la generación de contenido digital?",
    type: "single",
    options: [
      "Menos de USD 2.000",
      "USD 2.000 a USD 5.000",
      "USD 5.000 a USD 10.000",
      "USD 10.000 a USD 25.000",
      "Más de USD 25.000",
      "Prefiero no responder",
    ],
  },
  {
    id: "necesidadNoResuelta",
    question:
      "¿Qué necesidad sentís que hoy ninguna agencia, productora o plataforma te está resolviendo?",
    type: "open",
    placeholder: "Contanos brevemente...",
    optional: true,
  },
];

// Cierre de la rama marca (ramificado según la respuesta de contacto)
export const MARCA_CIERRE: Step[] = [
  {
    id: "quiereContacto",
    question: "¿Te gustaría que un especialista de STAGE te contacte?",
    type: "single",
    options: ["Sí, quiero que me contacten", "No por ahora"],
  },
  {
    // Sólo si quiere que lo contacten
    id: "email",
    question: "¡Genial! Dejanos tu email para que un especialista se ponga en contacto.",
    type: "email",
    placeholder: "hola@tuempresa.com",
    showIf: { stepId: "quiereContacto", equals: ["Sí, quiero que me contacten"] },
  },
  {
    // Sólo si NO quiere que lo contacten
    id: "comoAyudar",
    question: "¿De qué forma podemos ayudarte?",
    type: "open",
    placeholder: "Contanos qué necesitás...",
    optional: true,
    showIf: { stepId: "quiereContacto", equals: ["No por ahora"] },
  },
];

// ---------------------------------------------------------------------
// RAMA: CREADOR
// ---------------------------------------------------------------------
export const CREADOR_STEPS: Step[] = [
  {
    id: "tipoCreador",
    question: "¿Qué tipo de creador eres?",
    type: "single",
    options: [
      "Lifestyle",
      "Beauty",
      "Moda",
      "Food & Gastronomía",
      "Viajes",
      "Tecnología",
      "Gaming",
      "Finanzas",
      "Automotriz",
      "Salud & Wellness",
      "Mamás & Familia",
      "Otro",
    ],
  },
  {
    id: "plataformaPrincipal",
    question: "¿Cuál es tu principal plataforma?",
    type: "single",
    options: ["TikTok", "Instagram", "YouTube", "Varias"],
  },
  {
    id: "contenidoDisfruta",
    question: "¿Qué tipo de contenido disfrutás crear más?",
    type: "multi",
    options: [
      "Reviews",
      "Tutoriales",
      "Unboxing",
      "Storytelling",
      "Lifestyle",
      "Humor",
      "Trends",
      "Fotografía",
      "Otro",
    ],
  },
  {
    id: "trabajoConMarcas",
    question: "¿Ya trabajaste con marcas?",
    type: "single",
    options: ["Sí, frecuentemente", "Algunas veces", "Nunca"],
  },
  {
    id: "tipoColaboracion",
    question: "¿Qué tipo de colaboración te interesa más?",
    type: "single",
    options: [
      "Crear contenido para marcas",
      "Publicar contenido en mis redes",
      "Ambas opciones",
    ],
  },
  {
    id: "formatoDomina",
    question: "¿Qué formato dominás mejor?",
    type: "single",
    options: [
      "Videos cortos (Reels/TikTok)",
      "Videos largos (YouTube)",
      "Fotografía",
      "Contenido para Ads",
      "Todos los anteriores",
    ],
  },
  {
    id: "piezasPorMes",
    question: "¿Cuántas piezas de contenido podrías producir por mes?",
    type: "single",
    options: ["Menos de 5", "Entre 5 y 10", "Entre 10 y 20", "Más de 20"],
  },
  {
    id: "produccionPropia",
    question: "¿Grabás y editás tu propio contenido?",
    type: "single",
    options: [
      "Sí, hago todo yo",
      "Grabo yo y tercerizo edición",
      "Trabajo con un equipo",
      "Depende del proyecto",
    ],
  },
  {
    id: "industriasComodo",
    question: "¿Para qué industrias te sentís más cómodo creando contenido?",
    type: "multi",
    options: [
      "Beauty",
      "Tecnología",
      "Consumo Masivo",
      "Retail",
      "Turismo",
      "Automotriz",
      "Finanzas",
      "Gastronomía",
      "Salud",
      "Otra",
    ],
  },
  {
    id: "pais",
    question: "¿En qué país residís?",
    type: "country",
  },
  {
    id: "presencial",
    question: "¿Podrías participar en campañas presenciales?",
    type: "single",
    options: ["Sí", "No", "Depende del proyecto"],
  },
  {
    id: "honorarios",
    question: "¿Cuál suele ser tu rango de honorarios por una pieza UGC?",
    type: "single",
    options: [
      "Menos de USD 50",
      "USD 50 a USD 100",
      "USD 100 a USD 250",
      "USD 250 a USD 500",
      "Más de USD 500",
    ],
  },
  {
    id: "valorDiferencial",
    question:
      "¿Qué valor creés que aportás a una marca que te diferencia de otros creadores?",
    type: "open",
    placeholder: "Contanos brevemente...",
    optional: true,
  },
  {
    id: "perfiles",
    question: "Compartenos tus perfiles o portfolio (Instagram, TikTok, YouTube, Behance, Web, Drive)",
    type: "open",
    placeholder: "Pegá tus links acá...",
  },
  {
    id: "topMarcas",
    question:
      "Compartenos las top 5 marcas con las que colaboraste, incluyendo link a las colaboraciones.",
    type: "open",
    placeholder: "Marcas y links...",
    optional: true,
  },
  {
    id: "marcasDeseadas",
    question: "¿Con qué marcas te gustaría trabajar?",
    type: "open",
    placeholder: "Contanos...",
    optional: true,
  },
  {
    id: "dataPack",
    question: "Compartenos tu portfolio o data pack con tus métricas.",
    type: "open",
    placeholder: "Link a tu data pack...",
    optional: true,
  },
];

export const CREADOR_CIERRE_TEXT =
  "✨ Gracias por sumarte a STAGE.\nNuestro equipo revisará tu perfil y te contactaremos cuando encontremos oportunidades alineadas con tu estilo, experiencia y perfil creativo.";

export const MARCA_CIERRE_TEXT =
  "✨ Gracias por tu interés en STAGE.\nNuestro equipo revisará tu consulta y se pondrá en contacto a la brevedad.";

// Países de LATAM + otros (para el paso tipo "country")
export const PAISES = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro",
];