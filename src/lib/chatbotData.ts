// Contenido del chatbot NINCH STAGE (UGC).
// Estructura: categorías → preguntas → respuestas fijas (sin IA).
// El email de contacto se usa para la opción "Otra consulta".

export const CONTACT_EMAIL = "newbusiness@ninchcompany.com";

export interface QA {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  label: string;
  questions: QA[];
}

export const CATEGORIES: Category[] = [
  {
    id: "general",
    label: "Información general",
    questions: [
      {
        question: "¿Quién es NINCH?",
        answer:
          "NINCH® Creative Communication Company es una compañía de comunicación integral que acompaña a top brands en Latinoamérica a generar relevancia cultural real, combinando estrategia, creatividad y ejecución para acompañarlas en su evolución con una mirada regional, joven y desafiante.",
      },
      {
        question: "¿Qué es STAGE?",
        answer:
          "NINCH Stage es la plataforma de UGC de NINCH que conecta top brands con creadores para transformar contenido auténtico en conversación cultural, combinando estrategia y creatividad.",
      },
      {
        question: "¿En qué países opera STAGE?",
        answer:
          "STAGE opera en toda la región de Latinoamérica. Las campañas pueden variar según el país dependiendo de los objetivos de la marca. Si sos creador o marca de un país específico, podés consultar con nuestro equipo la disponibilidad para tu mercado.",
      },
    ],
  },
  {
    id: "creador",
    label: "Soy creador",
    questions: [
      {
        question: "¿Qué diferencia tiene el UGC con el influencer?",
        answer:
          "La diferencia principal está en el foco: mientras que el influencer se valora principalmente por su alcance y comunidad, el creador de UGC se destaca por la calidad de su contenido. En STAGE no importa cuántos seguidores tenés — lo que importa es tu capacidad para crear contenido auténtico, creativo y relevante.",
      },
      {
        question: "¿Cuántos seguidores tengo que tener para suscribirme como creador?",
        answer:
          "En STAGE no ponemos un mínimo de seguidores como requisito. Lo que evaluamos es la calidad de tu contenido: tu forma de narrar, tu manejo de cámara, tu estética, tu autenticidad. Si generás contenido que genera conexión, eso es lo que nos interesa.",
      },
      {
        question: "¿Cómo me entero de las campañas que hay disponibles para participar?",
        answer:
          "Una vez que formes parte de STAGE, nosotros te contactaremos cuando haya una campaña que se adapte a tu perfil y características.",
      },
      {
        question: "¿Puedo trabajar para más de una campaña?",
        answer:
          "Sí, siempre y cuando no sea para marcas del mismo rubro o categoría.",
      },
      {
        question: "¿Cómo es el modelo de contratación?",
        answer:
          "El modelo de contratación es mediante factura. Al cerrar tu participación en una campaña, acordamos los términos y el creador emite la factura correspondiente al trabajo.",
      },
      {
        question: "¿Puedo participar en campañas en más de un país?",
        answer:
          "Sí, siempre que se cumplan los requisitos de la campaña. Si la campaña requiere presencia física en un país determinado, vas a necesitar estar ahí en el momento de la producción. Si la campaña no requiere presencialidad, podés participar desde donde estés. En todos los casos, te informaremos claramente qué se necesita antes de confirmar tu participación.",
      },
      {
        question: "¿Tengo que seguir un guión de la marca o el contenido lo propongo yo?",
        answer:
          "El contenido se construye en co-creación. La marca trae su identidad, objetivos y puntos clave a comunicar; vos traés tu estilo, tu autenticidad y tu visión. Desde NINCH coordinamos ese proceso para que el resultado sea el mensaje de la marca, pero que suene genuino y natural en tu propio estilo.",
      },
      {
        question: "¿En qué redes se publicará el contenido?",
        answer:
          "Depende de cada campaña. El contenido podrá publicarse tanto en tus redes sociales (Instagram, TikTok, YouTube) como en los canales propios de la marca — sus redes, web, newsletters o anuncios pagos — o en ambos a la vez. Depende de la estrategia de cada campaña y se comunicará antes de producir el contenido.",
      },
      {
        question: "¿Por qué anotarme en STAGE?",
        answer:
          "STAGE es la puerta de entrada para trabajar con top brands de Latinoamérica de manera profesional, permitiéndote monetizar tu capacidad creativa.",
      },
      {
        question: "¿Qué tipo de contenido puedo crear en STAGE?",
        answer:
          "Depende de tu perfil y del tipo de campaña. Puede incluir videos cortos para redes sociales, reseñas de productos, unboxings, tutoriales, entre otros formatos. Esto dependerá del objetivo de la marca y tu perfil.",
      },
      {
        question: "¿Tengo que comprar yo los productos que voy a mostrar?",
        answer:
          "En la mayoría de los casos, la marca proveerá los productos necesarios para la producción del contenido. En caso de que haya alguna particularidad, te lo informaremos.",
      },
    ],
  },
  {
    id: "marca",
    label: "Soy marca",
    questions: [
      {
        question: "¿Qué diferencia tiene el UGC con el influencer?",
        answer:
          "La diferencia principal está en el foco: mientras que el influencer se valora principalmente por su alcance y comunidad, el creador de UGC se destaca por la calidad de su contenido. En STAGE no importa cuántos seguidores tenés — lo que importa es tu capacidad para crear contenido auténtico, creativo y relevante.",
      },
      {
        question: "¿El creador publica el contenido en sus redes también?",
        answer:
          "Existen dos modelos, y podemos combinarlos según tu estrategia. El primero es el modelo de contenido para ecosistema de marca, donde el creador produce el material y la marca lo utiliza en sus propios canales (STUDIO-ON). El segundo es el modelo de amplificación, donde el creador también publica en sus redes, sumando su alcance orgánico (SPREAD-ON). Podemos trabajar con uno, con el otro, o con ambos según tus objetivos.",
      },
      {
        question: "¿Cuánto tiempo lleva una campaña de UGC?",
        answer:
          "Los tiempos varían según la complejidad de la campaña, la cantidad de creadores involucrados y los objetivos estratégicos. En términos generales, una campaña puede durar desde un mes hasta varios meses. En la etapa de planificación te damos un cronograma claro con cada etapa del proceso.",
      },
      {
        question: "¿Yo le tengo que decir al creador lo que tiene que publicar?",
        answer:
          "En STAGE trabajamos con un modelo de co-creación entre la marca, el creador y nuestro equipo de NINCH. Mientras la marca define sus objetivos y mensajes clave, el creador aporta su estilo y autenticidad, y nosotros coordinamos el proceso creativo para que el resultado sea contenido que funcione estratégicamente y sea genuino.",
      },
      {
        question: "¿Cómo sé si el contenido se va a ajustar a lo que necesito?",
        answer:
          "Implementamos un proceso de validación previa antes de que el contenido sea publicado o entregado definitivamente.",
      },
      {
        question: "¿Se puede ejecutar más de una campaña UGC en simultáneo?",
        answer:
          "Sí, es posible. Depende de tu estrategia y de los recursos disponibles. La clave para que funcione bien es una selección rigurosa de perfiles para cada campaña, asegurando que los creadores sean los indicados para cada objetivo específico.",
      },
      {
        question: "¿Cuál es la inversión para una campaña de UGC?",
        answer:
          "La inversión depende de cada caso: la cantidad de creadores, el tipo de contenido y la duración de la campaña, entre otras cosas. El objetivo es que la campaña responda 100% a las necesidades de la marca. Para tener un presupuesto customizado te recomendamos contactarnos a través de newbusiness@ninchcompany.com.",
      },
      {
        question: "¿Esta campaña me va a ayudar a tener más ventas?",
        answer:
          "El UGC bien ejecutado tiene un impacto directo en la conversión porque genera la confianza que los consumidores buscan antes de comprar. El resultado depende de factores como la estrategia detrás de la campaña, la selección de los perfiles correctos y el tipo de contenido según el objetivo (awareness, consideración o conversión).",
      },
      {
        question: "¿Cómo se seleccionan los creadores para mi marca?",
        answer:
          "La selección es uno de los pilares más importantes del proceso. Evaluamos el perfil de cada creador en función de tu marca, tu audiencia, el tipo de producto o servicio y el tono de comunicación. Cada creador que proponemos está pensado estratégicamente para tu campaña.",
      },
      {
        question: "¿Puedo hacer una campaña con STAGE si no soy cliente actual de NINCH?",
        answer:
          "¡Claro! NINCH ofrece distintas modalidades de contratación que permiten sumarte como cliente anual a través de una iguala o fee mensual, o contratarnos para un proyecto puntual. En cualquier caso, podés contactarte con newbusiness@ninchcompany.com para evaluar tu caso concreto.",
      },
    ],
  },
];