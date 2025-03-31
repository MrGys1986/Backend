// importar librerías
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // exportado desde Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// tus eventos
const eventos = [
    {
      "nombre": "Futuro Digital México",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Conferencias",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://www.ift.org.mx/sites/default/files/huawei.jpg",
      "fecha": "2025-11-20",
      "lugar": "Monterrey",
      "disponibilidad": {
        "vip": {
          "disponibles": 50,
          "precio": 200,
          "descripcion": "Incluye acceso a áreas exclusivas, atención personalizada, asientos preferenciales y material complementario premium."
        },
        "premium": {
          "disponibles": 20,
          "precio": 150,
          "descripcion": "Acceso a sesiones destacadas, material adicional y ubicación mejorada dentro del evento."
        },
        "basico": {
          "disponibles": 52,
          "precio": 100,
          "descripcion": "Entrada general con acceso completo al evento y a todas las conferencias estándar."
        }
      }
    },
    {
      "nombre": "Visión Tech 2025",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Conferencias",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://www.pega.com/sites/default/files/styles/1366/public/resources/2021-04/pega-2025-tech-trends-report-es.png?itok=PkrlaVpI",
      "fecha": "2026-02-13",
      "lugar": "Guadalajara",
      "disponibilidad": {
        "vip": {
          "disponibles": 16,
          "precio": 150,
          "descripcion": "Acceso preferencial con material exclusivo y espacios reservados para networking."
        },
        "premium": {
          "disponibles": 35,
          "precio": 100,
          "descripcion": "Acceso a sesiones destacadas y material adicional."
        },
        "basico": {
          "disponibles": 100,
          "precio": 50,
          "descripcion": "Acceso general a todas las conferencias."
        }
      }
    },
    {
      "nombre": "Conecta Ciencia: Encuentro Nacional",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Conferencias",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://www.astro4dev.org/wp-content/uploads/2022/08/IMG_20220810_173217-1536x1152.jpg",
      "fecha": "2025-11-22",
      "lugar": "Guadalajara",
      "disponibilidad": {
        "vip": {
          "disponibles": 38,
          "precio": 200,
          "descripcion": "Asientos reservados, acceso prioritario y material de presentación adicional."
        },
        "premium": {
          "disponibles": 36,
          "precio": 150,
          "descripcion": "Ubicación privilegiada en las salas principales y acceso a contenidos adicionales."
        },
        "basico": {
          "disponibles": 83,
          "precio": 100,
          "descripcion": "Acceso general a las conferencias."
        }
      }
    },
    {
      "nombre": "Innovación sin Fronteras",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Conferencias",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://th.bing.com/th/id/OIP.zDTcqp4gZ54iGiyPTrnePAHaEK?w=995&h=560&rs=1&pid=ImgDetMain",
      "fecha": "2025-08-31",
      "lugar": "CDMX",
      "disponibilidad": {
        "vip": {
          "disponibles": 22,
          "precio": 200,
          "descripcion": "Asientos exclusivos, acceso preferencial y material de eventos premium."
        },
        "premium": {
          "disponibles": 27,
          "precio": 150,
          "descripcion": "Asientos mejorados y acceso a material adicional."
        },
        "basico": {
          "disponibles": 92,
          "precio": 100,
          "descripcion": "Acceso general con asientos regulares."
        }
      }
    },
    {
      "nombre": "Foro de Avances Científicos",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Conferencias",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://diario.uach.cl/wp-content/uploads/2018/05/4066300.jpg",
      "fecha": "2025-08-17",
      "lugar": "Querétaro",
      "disponibilidad": {
        "vip": {
          "disponibles": 37,
          "precio": 200,
          "descripcion": "Incluye áreas VIP y material exclusivo de los ponentes principales."
        },
        "premium": {
          "disponibles": 58,
          "precio": 150,
          "descripcion": "Acceso a áreas preferenciales y material extra."
        },
        "basico": {
          "disponibles": 53,
          "precio": 100,
          "descripcion": "Acceso general a las ponencias."
        }
      }
    },
    {
      "nombre": "Taller de Robótica Educativa",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Talleres",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://www.uoh.cl/wp-content/uploads/2023/04/Taller-de-robotica-2.png",
      "fecha": "2025-08-15",
      "lugar": "Monterrey",
      "disponibilidad": {
        "vip": {
          "disponibles": 39,
          "precio": 200,
          "descripcion": "Acceso a áreas VIP, materiales adicionales y un kit de robótica exclusivo."
        },
        "premium": {
          "disponibles": 48,
          "precio": 150,
          "descripcion": "Material de alta calidad y soporte personalizado durante el taller."
        },
        "basico": {
          "disponibles": 84,
          "precio": 100,
          "descripcion": "Acceso general al taller con materiales básicos incluidos."
        }
      }
    },
    {
      "nombre": "Manos a la Ciencia: Laboratorio Vivo",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Talleres",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://th.bing.com/th/id/OIP.7lgRdie1mRRrHHmCE6JmrwHaEJ?rs=1&pid=ImgDetMain",
      "fecha": "2025-05-03",
      "lugar": "CDMX",
      "disponibilidad": {
        "vip": {
          "disponibles": 35,
          "precio": 100,
          "descripcion": "Acceso a estaciones exclusivas y materiales premium."
        },
        "premium": {
          "disponibles": 21,
          "precio": 75,
          "descripcion": "Material complementario y soporte directo del instructor."
        },
        "basico": {
          "disponibles": 92,
          "precio": 50,
          "descripcion": "Acceso general con todos los materiales esenciales."
        }
      }
    },
    {
      "nombre": "Taller de Ciencia Ciudadana",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Talleres",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://th.bing.com/th/id/OIP.TLMXwEa4LIyMWjSXpUvJOgHaFj?rs=1&pid=ImgDetMain",
      "fecha": "2025-07-01",
      "lugar": "CDMX",
      "disponibilidad": {
        "vip": {
          "disponibles": 36,
          "precio": 100,
          "descripcion": "Acceso VIP con soporte exclusivo y materiales avanzados."
        },
        "premium": {
          "disponibles": 49,
          "precio": 75,
          "descripcion": "Material adicional y asistencia técnica preferencial."
        },
        "basico": {
          "disponibles": 72,
          "precio": 50,
          "descripcion": "Acceso general con los materiales básicos."
        }
      }
    },
    {
      "nombre": "Aprendiendo con IA",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Talleres",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://unifranz.edu.bo/wp-content/uploads/2024/02/unifranz_robot_reading_a_book_and_icons_around_him_in_the_style_7fce3346-8f3c-4317-baa7-ce226ddea140.png",
      "fecha": "2025-04-23",
      "lugar": "Querétaro",
      "disponibilidad": {
        "vip": {
          "disponibles": 36,
          "precio": 350,
          "descripcion": "Incluye acceso exclusivo a laboratorios, materiales de investigación avanzada y tutoría personalizada."
        },
        "premium": {
          "disponibles": 38,
          "precio": 280,
          "descripcion": "Acceso preferencial a recursos y material avanzado."
        },
        "basico": {
          "disponibles": 39,
          "precio": 200,
          "descripcion": "Acceso general con materiales estándar."
        }
      }
    },
    {
      "nombre": "Biohacking para Principiantes",
      "categoria": "Ciencia y Tecnología",
      "subcategoria": "Talleres",
      "descripcion": "Evento imperdible sobre ciencia y tecnología. Conecta, aprende y transforma.",
      "imagen": "https://charlesrezende.com/wp-content/uploads/2022/05/biohacking.jpg",
      "fecha": "2026-02-22",
      "lugar": "Monterrey",
      "disponibilidad": {
        "vip": {
          "disponibles": 28,
          "precio": 300,
          "descripcion": "Incluye materiales exclusivos, guías avanzadas y asistencia personalizada."
        },
        "premium": {
          "disponibles": 58,
          "precio": 200,
          "descripcion": "Material mejorado y soporte técnico extendido."
        },
        "basico": {
          "disponibles": 91,
          "precio": 150,
          "descripcion": "Acceso general con materiales básicos incluidos."
        }
      }
    },
    {
        "nombre": "Festival del Sabor Mexicano",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Gastronomía",
        "descripcion": "Descubre la riqueza gastronómica de México.",
        "imagen": "https://1.bp.blogspot.com/-JuOlUuvISns/XUoCLiNG1rI/AAAAAAABCbY/Wz3EkI5hcjEz7Id4oS_rQB5MgmtNklqlACLcBGAs/s1600/20190803142806_IMG_1603-01.jpg",
        "fecha": "2025-09-03",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 40,
            "precio": 1000,
            "descripcion": "Acceso a áreas VIP, experiencias exclusivas y catas dirigidas por chefs reconocidos."
          },
          "premium": {
            "disponibles": 50,
            "precio": 750,
            "descripcion": "Acceso preferencial y degustaciones premium."
          },
          "basico": {
            "disponibles": 76,
            "precio": 500,
            "descripcion": "Entrada general con acceso a todos los stands y actividades estándar."
          }
        }
      },
      {
        "nombre": "Taller de Cocina Vegana",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Saludable",
        "descripcion": "Aprende a preparar recetas veganas deliciosas.",
        "imagen": "https://th.bing.com/th/id/R.996f5062b6302455ac5365665e328812?rik=CpTSp8uej2mEUA&pid=ImgRaw&r=0",
        "fecha": "2025-08-25",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 13,
            "precio": 700,
            "descripcion": "Acceso a una clase privada con el chef, material exclusivo y degustación personalizada."
          },
          "premium": {
            "disponibles": 33,
            "precio": 500,
            "descripcion": "Material adicional y acceso preferencial a las recetas más avanzadas."
          },
          "basico": {
            "disponibles": 74,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todos los módulos y recetas básicas."
          }
        }
      },
      {
        "nombre": "Cata de Vinos y Quesos",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Gourmet",
        "descripcion": "Experiencia gourmet con maridaje de vinos y quesos.",
        "imagen": "https://media.tacdn.com/media/attractions-splice-spp-674x446/06/6f/7a/e0.jpg",
        "fecha": "2025-04-25",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 21,
            "precio": 1200,
            "descripcion": "Incluye vinos de reserva, quesos de edición limitada y acceso a una masterclass con sommeliers expertos."
          },
          "premium": {
            "disponibles": 55,
            "precio": 900,
            "descripcion": "Vinos seleccionados, quesos artesanales y cata guiada por especialistas."
          },
          "basico": {
            "disponibles": 94,
            "precio": 600,
            "descripcion": "Acceso a la cata general con vinos y quesos estándar."
          }
        }
      },
      {
        "nombre": "Mercado Orgánico Dominical",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Estilo de Vida",
        "descripcion": "Compra productos orgánicos y artesanales directamente de productores.",
        "imagen": "https://th.bing.com/th/id/R.12c61500106968dd29d74fd5fdd9e5ad?rik=NAYGYPwuTlotQw&riu=http%3a%2f%2flpavisit.com%2fimages%2fstories%2fcom_form2content%2fp17%2ff1202%2f188.jpg&ehk=d2wpFE6g1uvKuLOYt5X6GMOO0drQhhRQCjpGc5dWHuA%3d&risl=&pid=ImgRaw&r=0",
        "fecha": "2025-04-20",
        "lugar": "Puebla",
        "disponibilidad": {
          "vip": {
            "disponibles": 47,
            "precio": 500,
            "descripcion": "Acceso a productos exclusivos y charlas privadas con productores destacados."
          },
          "premium": {
            "disponibles": 48,
            "precio": 400,
            "descripcion": "Acceso preferencial a los stands y productos orgánicos premium."
          },
          "basico": {
            "disponibles": 77,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todos los productos y stands."
          }
        }
      },
      {
        "nombre": "Clase de Repostería Creativa",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Gastronomía",
        "descripcion": "Aprende técnicas de repostería decorativa.",
        "imagen": "https://newjessicakes.empresas2cero.com.co/files/2014/08/1.jpg",
        "fecha": "2025-06-17",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 16,
            "precio": 800,
            "descripcion": "Incluye kit de decoración premium, recetas exclusivas y asesoría personalizada."
          },
          "premium": {
            "disponibles": 60,
            "precio": 600,
            "descripcion": "Material adicional, acceso a recetas avanzadas y soporte preferencial."
          },
          "basico": {
            "disponibles": 75,
            "precio": 400,
            "descripcion": "Acceso general con materiales y recetas básicas."
          }
        }
      },
      {
        "nombre": "Semana del Café y Chocolate",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Degustación",
        "descripcion": "Degustaciones, charlas y experiencias alrededor del café y el chocolate.",
        "imagen": "https://static.wixstatic.com/media/656942_801d429869f9430eaf4f8b67c130251f~mv2.jpg/v1/fill/w_1360,h_910,al_c/656942_801d429869f9430eaf4f8b67c130251f~mv2.jpg",
        "fecha": "2025-07-04",
        "lugar": "Toluca",
        "disponibilidad": {
          "vip": {
            "disponibles": 38,
            "precio": 1000,
            "descripcion": "Incluye degustaciones premium, talleres exclusivos y un kit de regalo especial."
          },
          "premium": {
            "disponibles": 30,
            "precio": 750,
            "descripcion": "Talleres destacados y catas de alta calidad."
          },
          "basico": {
            "disponibles": 64,
            "precio": 500,
            "descripcion": "Acceso general a todas las charlas y degustaciones estándar."
          }
        }
      },
      {
        "nombre": "Taller de Cocina Tradicional",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Cocina Mexicana",
        "descripcion": "Rescata recetas tradicionales mexicanas con chefs locales.",
        "imagen": "https://www.anahuac.mx/veracruz/sites/default/files/2022-05/taller-cocina-regional-acuyo_03.jpg",
        "fecha": "2025-06-16",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 47,
            "precio": 900,
            "descripcion": "Recetas especiales, kits exclusivos y asesoría personalizada con chefs locales."
          },
          "premium": {
            "disponibles": 36,
            "precio": 700,
            "descripcion": "Acceso a recetas avanzadas y materiales adicionales."
          },
          "basico": {
            "disponibles": 59,
            "precio": 500,
            "descripcion": "Acceso general con recetas tradicionales."
          }
        }
      },
      {
        "nombre": "Expo Estilo de Vida y Bienestar",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Estilo de Vida",
        "descripcion": "Conoce productos, tendencias y servicios para un estilo de vida saludable.",
        "imagen": "https://www.ideafit.com/wp-content/uploads/2020/02/iwc19-exp-expo.jpg",
        "fecha": "2025-05-18",
        "lugar": "San Luis Potosí",
        "disponibilidad": {
          "vip": {
            "disponibles": 15,
            "precio": 1500,
            "descripcion": "Acceso preferencial a talleres premium y charlas privadas."
          },
          "premium": {
            "disponibles": 27,
            "precio": 1000,
            "descripcion": "Incluye acceso prioritario y material extra en cada sesión."
          },
          "basico": {
            "disponibles": 74,
            "precio": 700,
            "descripcion": "Acceso general a todas las exhibiciones y actividades."
          }
        }
      },
      {
        "nombre": "Festival de Comida Internacional",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Gastronomía",
        "descripcion": "Disfruta platillos del mundo en un solo lugar.",
        "imagen": "https://live.staticflickr.com/65535/52502756934_0f806b9d60_b.jpg",
        "fecha": "2025-06-19",
        "lugar": "León",
        "disponibilidad": {
          "vip": {
            "disponibles": 24,
            "precio": 100,
            "descripcion": "Acceso exclusivo a chefs internacionales y catas especiales."
          },
          "premium": {
            "disponibles": 38,
            "precio": 75,
            "descripcion": "Incluye acceso a áreas preferenciales y catas selectas."
          },
          "basico": {
            "disponibles": 35,
            "precio": 50,
            "descripcion": "Entrada general con acceso a todos los stands y actividades estándar."
          }
        }
      },
      {
        "nombre": "Brunch Dominical con Estilo",
        "categoria": "Gastronomía y Estilo de Vida",
        "subcategoria": "Gourmet",
        "descripcion": "Brunch elegante con música en vivo y opciones saludables.",
        "imagen": "https://th.bing.com/th/id/R.ff4c12d4b038c9567df7392531644d71?rik=YBZLgzgH55kEhw&pid=ImgRaw&r=0",
        "fecha": "2025-08-08",
        "lugar": "Aguascalientes",
        "disponibilidad": {
          "vip": {
            "disponibles": 18,
            "precio": 1500,
            "descripcion": "Incluye selección gourmet, estaciones exclusivas y un brindis especial con chefs."
          },
          "premium": {
            "disponibles": 32,
            "precio": 1300,
            "descripcion": "Acceso a áreas destacadas, menú extendido y música en vivo."
          },
          "basico": {
            "disponibles": 31,
            "precio": 1000,
            "descripcion": "Entrada general con menú estándar y acceso al brunch."
          }
        }
      },
      {
        "nombre": "Feria Familiar de Primavera",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Familiar",
        "descripcion": "Actividades para toda la familia, juegos, comida y diversión.",
        "imagen": "https://th.bing.com/th/id/R.f395f37ca1659e017b048bd95632886d?rik=rskAhkZ15Y3B7A&riu=http%3a%2f%2fmarcatextos.com%2fwp-content%2fuploads%2f2019%2f10%2fZapotl%C3%A1n-el-Grande-Feria.jpg&ehk=OSQRn0VD3zkC5DuUNyF2FQjjnsRoUpmyF5XJBrqGUfc%3d&risl=&pid=ImgRaw&r=0",
        "fecha": "2025-05-17",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 41,
            "precio": 100,
            "descripcion": "Incluye acceso a todas las áreas, actividades especiales y un kit de bienvenida."
          },
          "premium": {
            "disponibles": 56,
            "precio": 75,
            "descripcion": "Acceso preferencial a juegos y talleres destacados."
          },
          "basico": {
            "disponibles": 38,
            "precio": 50,
            "descripcion": "Entrada general con acceso a todas las actividades familiares."
          }
        }
      },
      {
        "nombre": "Día de Picnic en el Parque",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Familiar",
        "descripcion": "Un día al aire libre con juegos, música y comida.",
        "imagen": "https://img.chilango.com/2018/03/lugares-para-irte-de-picnic-en-la-CDMX.jpg",
        "fecha": "2025-08-09",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 11,
            "precio": 80,
            "descripcion": "Incluye área exclusiva, refrigerios y actividades privadas."
          },
          "premium": {
            "disponibles": 52,
            "precio": 60,
            "descripcion": "Acceso preferencial a juegos y música en vivo."
          },
          "basico": {
            "disponibles": 37,
            "precio": 40,
            "descripcion": "Acceso general con picnic en áreas comunes."
          }
        }
      },
      {
        "nombre": "Taller de Padres e Hijos",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Educación Familiar",
        "descripcion": "Fortalece los vínculos con tu hijo a través de juegos y dinámicas.",
        "imagen": "https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/03/05/15202705353605.jpg",
        "fecha": "2025-08-14",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 39,
            "precio": 120,
            "descripcion": "Incluye un kit exclusivo de materiales y sesiones privadas."
          },
          "premium": {
            "disponibles": 59,
            "precio": 90,
            "descripcion": "Acceso preferencial y materiales adicionales."
          },
          "basico": {
            "disponibles": 100,
            "precio": 60,
            "descripcion": "Acceso general al taller y materiales básicos."
          }
        }
      },
      {
        "nombre": "Festival del Vecino",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Comunidad",
        "descripcion": "Conoce a tu comunidad y participa en actividades colaborativas.",
        "imagen": "https://titeredata.eu/wp-content/uploads/2019/11/4-FESTIVAL-MERINDADES.jpg",
        "fecha": "2025-07-01",
        "lugar": "Toluca",
        "disponibilidad": {
          "vip": {
            "disponibles": 10,
            "precio": 70,
            "descripcion": "Acceso VIP con refrigerios gratuitos y actividades exclusivas."
          },
          "premium": {
            "disponibles": 33,
            "precio": 50,
            "descripcion": "Acceso preferencial a las actividades colaborativas."
          },
          "basico": {
            "disponibles": 87,
            "precio": 30,
            "descripcion": "Acceso general con entrada a todas las actividades comunes."
          }
        }
      },
      {
        "nombre": "Domingos de Cuenta Cuentos",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Cultural Infantil",
        "descripcion": "Historias mágicas para niños en espacios abiertos.",
        "imagen": "https://www.portaldemelipilla.cl/wp-content/uploads/2022/03/Angel-Reyes-Andrea-Gaete-Eva-Passig-Gentileza-CINOCH.png",
        "fecha": "2025-06-26",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 45,
            "precio": 50,
            "descripcion": "Incluye área VIP, cuentos interactivos y actividades extras."
          },
          "premium": {
            "disponibles": 20,
            "precio": 40,
            "descripcion": "Acceso preferencial a cuentos y material adicional."
          },
          "basico": {
            "disponibles": 30,
            "precio": 30,
            "descripcion": "Acceso general con entrada a todas las narraciones."
          }
        }
      },
      {
        "nombre": "Taller de Manualidades para Niños",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Educación Creativa",
        "descripcion": "Fomenta la creatividad en tus hijos con este divertido taller.",
        "imagen": "https://th.bing.com/th/id/R.6091fc28cf69ef8e9583949480bc2488?rik=rEQ6Y2jQo%2bPBAw&riu=http%3a%2f%2fwww.marcelatrujillo.cl%2fwp-content%2fuploads%2f2015%2f08%2ftaller-de-ni1.jpg&ehk=doOhIO5gxzxA%2f1SkK%2bGOLDKP1tSJ0mUJPTj4s5QRp2k%3d&risl=&pid=ImgRaw&r=0",
        "fecha": "2025-05-21",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 47,
            "precio": 80,
            "descripcion": "Incluye materiales de calidad y atención personalizada."
          },
          "premium": {
            "disponibles": 37,
            "precio": 60,
            "descripcion": "Acceso preferencial y materiales adicionales."
          },
          "basico": {
            "disponibles": 86,
            "precio": 40,
            "descripcion": "Acceso general con materiales básicos."
          }
        }
      },
      {
        "nombre": "Convivencia en Comunidad",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Comunidad",
        "descripcion": "Eventos y actividades que promueven la unidad vecinal.",
        "imagen": "https://th.bing.com/th/id/R.c80f1e2e7c636985b62ba525ce255f18?rik=EKTKvxwX%2fDQBYA&pid=ImgRaw&r=0",
        "fecha": "2025-08-22",
        "lugar": "Aguascalientes",
        "disponibilidad": {
          "vip": {
            "disponibles": 12,
            "precio": 90,
            "descripcion": "Acceso VIP con beneficios exclusivos y actividades especiales."
          },
          "premium": {
            "disponibles": 24,
            "precio": 70,
            "descripcion": "Acceso preferencial a los eventos destacados."
          },
          "basico": {
            "disponibles": 42,
            "precio": 50,
            "descripcion": "Entrada general con acceso a todas las actividades comunes."
          }
        }
      },
      {
        "nombre": "Tarde de Juegos de Mesa",
        "categoria": "Familia y Comunidad",
        "subcategoria": "Entretenimiento Familiar",
        "descripcion": "Reúne a tu familia para disfrutar de juegos de mesa clásicos y modernos.",
        "imagen": "https://deviramericas.com/wp-content/uploads/2016/11/15167705_1201769966597726_6164598358665627271_o.jpg",
        "fecha": "2025-09-03",
        "lugar": "San Luis Potosí",
        "disponibilidad": {
          "vip": {
            "disponibles": 49,
            "precio": 50,
            "descripcion": "Incluye mesas VIP con juegos exclusivos y anfitriones especializados."
          },
          "premium": {
            "disponibles": 52,
            "precio": 40,
            "descripcion": "Acceso preferencial y selección ampliada de juegos."
          },
          "basico": {
            "disponibles": 56,
            "precio": 30,
            "descripcion": "Acceso general a todas las mesas de juegos estándar."
          }
        }
      },
      {
        "nombre": "Carrera Nocturna 10K",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Deportes",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://www.encastillalamancha.es/wp-content/uploads/2023/10/nocturna-albacete.jpg",
        "fecha": "2025-06-05",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 36,
            "precio": 500,
            "descripcion": "Incluye acceso VIP a la zona de salida, kit premium y bebidas energéticas exclusivas."
          },
          "premium": {
            "disponibles": 45,
            "precio": 300,
            "descripcion": "Incluye acceso preferencial y un kit de corredor avanzado."
          },
          "basico": {
            "disponibles": 45,
            "precio": 150,
            "descripcion": "Incluye entrada general y un kit básico."
          }
        }
      },
      {
        "nombre": "Torneo de Fútbol Juvenil",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Deportes",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/OIP.0UdzWOm--Olf_1cJ7H87gQHaEV?rs=1&pid=ImgDetMain",
        "fecha": "2025-09-04",
        "lugar": "León",
        "disponibilidad": {
          "vip": {
            "disponibles": 29,
            "precio": 400,
            "descripcion": "Incluye asientos VIP, acceso a la zona de jugadores y recuerdos del torneo."
          },
          "premium": {
            "disponibles": 28,
            "precio": 200,
            "descripcion": "Incluye asientos preferenciales y souvenirs oficiales."
          },
          "basico": {
            "disponibles": 62,
            "precio": 100,
            "descripcion": "Entrada general con acceso a las gradas comunes."
          }
        }
      },
      {
        "nombre": "Maratón CDMX 2025",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Deportes",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://edomex.quadratin.com.mx/www/wp-content/uploads/2019/04/Marat%C3%B3n-CDMX-1160x700.jpg",
        "fecha": "2025-09-25",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 42,
            "precio": 1000,
            "descripcion": "Acceso a zonas exclusivas, kit premium y soporte personalizado durante la carrera."
          },
          "premium": {
            "disponibles": 46,
            "precio": 700,
            "descripcion": "Incluye acceso preferencial y kit de corredor avanzado."
          },
          "basico": {
            "disponibles": 83,
            "precio": 500,
            "descripcion": "Entrada general con kit básico."
          }
        }
      },
      {
        "nombre": "Campeonato Nacional de Natación",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Deportes",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://i.ytimg.com/vi/FwN2tkGf9nc/maxresdefault.jpg",
        "fecha": "2025-07-12",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 49,
            "precio": 800,
            "descripcion": "Incluye acceso VIP, zona de espectadores exclusiva y kit premium."
          },
          "premium": {
            "disponibles": 56,
            "precio": 600,
            "descripcion": "Acceso preferencial y material adicional."
          },
          "basico": {
            "disponibles": 48,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las competencias."
          }
        }
      },
      {
        "nombre": "Retiro de Meditación y Yoga",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Bienestar",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://hridaya-yoga.com/wp-content/uploads/2021/04/07-retreat-guidelines.jpg",
        "fecha": "2025-09-25",
        "lugar": "León",
        "disponibilidad": {
          "vip": {
            "disponibles": 38,
            "precio": 1500,
            "descripcion": "Incluye sesiones privadas, material exclusivo y acceso a talleres avanzados."
          },
          "premium": {
            "disponibles": 23,
            "precio": 1000,
            "descripcion": "Acceso preferencial a talleres y material adicional."
          },
          "basico": {
            "disponibles": 75,
            "precio": 700,
            "descripcion": "Acceso general a todas las sesiones y talleres."
          }
        }
      },
      {
        "nombre": "Feria de Salud Integral",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Bienestar",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://hidalgo.quadratin.com.mx/www/wp-content/uploads/2017/07/unnamed-1-1.jpg",
        "fecha": "2025-08-17",
        "lugar": "Puebla",
        "disponibilidad": {
          "vip": {
            "disponibles": 30,
            "precio": 700,
            "descripcion": "Acceso a charlas exclusivas, material premium y consultas personalizadas."
          },
          "premium": {
            "disponibles": 40,
            "precio": 500,
            "descripcion": "Incluye acceso preferencial a talleres y consultas."
          },
          "basico": {
            "disponibles": 73,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las actividades estándar."
          }
        }
      },
      {
        "nombre": "Taller de Alimentación Consciente",
        "categoria": "Deportes y Bienestar",
        "subcategoria": "Bienestar",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://unna-life.com/wordpress/wp-content/uploads/2017/03/Demo-Cartel-Alimentacion-Consciente-01-940x1330.jpg",
        "fecha": "2025-11-23",
        "lugar": "Puebla",
        "disponibilidad": {
          "vip": {
            "disponibles": 24,
            "precio": 600,
            "descripcion": "Incluye sesiones personalizadas, material exclusivo y acceso a talleres privados."
          },
          "premium": {
            "disponibles": 44,
            "precio": 400,
            "descripcion": "Acceso preferencial a los talleres y material adicional."
          },
          "basico": {
            "disponibles": 48,
            "precio": 200,
            "descripcion": "Acceso general con materiales básicos."
          }
        }
      },
      {
        "nombre": "Congreso Internacional de Educación STEM",
        "categoria": "Educación y Negocios",
        "subcategoria": "Educación",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/OIP.NH2o3f9bK9tdB-DXKZWahwHaDc?rs=1&pid=ImgDetMain",
        "fecha": "2025-08-22",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 39,
            "precio": 900,
            "descripcion": "Acceso VIP, talleres exclusivos y material avanzado."
          },
          "premium": {
            "disponibles": 58,
            "precio": 700,
            "descripcion": "Acceso preferencial a sesiones clave y material adicional."
          },
          "basico": {
            "disponibles": 65,
            "precio": 500,
            "descripcion": "Entrada general con acceso a todas las conferencias."
          }
        }
      },
      {
        "nombre": "Expo Educación Digital",
        "categoria": "Educación y Negocios",
        "subcategoria": "Educación",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://www.primerahora.com/resizer/pRnGJHTmwEBEV1OcK1KGus-5zAw=/1200x717/filters:quality(75):format(jpeg):focal(561x268:571x258)/cloudfront-us-east-1.images.arcpublishing.com/gfrmedia/JNKN4G4YUFDNNLRPW2VF5V5MUA.jpg",
        "fecha": "2025-06-22",
        "lugar": "León",
        "disponibilidad": {
          "vip": {
            "disponibles": 22,
            "precio": 750,
            "descripcion": "Acceso VIP a presentaciones exclusivas y talleres especializados."
          },
          "premium": {
            "disponibles": 53,
            "precio": 500,
            "descripcion": "Incluye acceso preferencial y material complementario."
          },
          "basico": {
            "disponibles": 70,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las áreas de exhibición."
          }
        }
      },
      {
        "nombre": "Foro de Innovación Educativa",
        "categoria": "Educación y Negocios",
        "subcategoria": "Educación",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/R.81b06986146b428bd6f1917267b5197c?rik=AQAXsa5KnY1Zzg&pid=ImgRaw&r=0",
        "fecha": "2025-11-11",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 10,
            "precio": 1000,
            "descripcion": "Incluye acceso VIP, talleres avanzados y material premium."
          },
          "premium": {
            "disponibles": 58,
            "precio": 700,
            "descripcion": "Acceso preferencial a conferencias y material adicional."
          },
          "basico": {
            "disponibles": 61,
            "precio": 400,
            "descripcion": "Acceso general con entrada a todas las presentaciones."
          }
        }
      },
      {
        "nombre": "Taller de Educación Emocional",
        "categoria": "Educación y Negocios",
        "subcategoria": "Educación",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/OIP.HvsAbphHFhH7FWtjSwXzSgHaKe?rs=1&pid=ImgDetMain",
        "fecha": "2025-11-20",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 40,
            "precio": 600,
            "descripcion": "Incluye sesiones exclusivas, material avanzado y asesoría personalizada."
          },
          "premium": {
            "disponibles": 23,
            "precio": 400,
            "descripcion": "Acceso a talleres destacados y material adicional."
          },
          "basico": {
            "disponibles": 50,
            "precio": 200,
            "descripcion": "Acceso general con materiales básicos."
          }
        }
      },
      {
        "nombre": "Jornada de Tecnología Educativa",
        "categoria": "Educación y Negocios",
        "subcategoria": "Educación",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://www.xoc.uam.mx/wp-content/uploads/2023/06/tecnologiaeducativa.png",
        "fecha": "2025-09-05",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 44,
            "precio": 800,
            "descripcion": "Acceso VIP a demostraciones avanzadas y material exclusivo."
          },
          "premium": {
            "disponibles": 53,
            "precio": 600,
            "descripcion": "Acceso preferencial y material adicional."
          },
          "basico": {
            "disponibles": 57,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las actividades estándar."
          }
        }
      },
      {
        "nombre": "Cumbre de Emprendedores 2025",
        "categoria": "Educación y Negocios",
        "subcategoria": "Negocios",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://blogs.upn.edu.pe/carreras-para-adultos-que-trabajan/wp-content/uploads/sites/15/2015/04/1553414_810614855675923_6908277340037093839_o.png",
        "fecha": "2025-09-10",
        "lugar": "León",
        "disponibilidad": {
          "vip": {
            "disponibles": 43,
            "precio": 1000,
            "descripcion": "Acceso VIP con sesiones privadas, material exclusivo y acceso preferencial."
          },
          "premium": {
            "disponibles": 43,
            "precio": 700,
            "descripcion": "Incluye acceso preferencial y material de apoyo adicional."
          },
          "basico": {
            "disponibles": 48,
            "precio": 500,
            "descripcion": "Entrada general con acceso a todas las ponencias."
          }
        }
      },
      {
        "nombre": "Foro Internacional de Negocios",
        "categoria": "Educación y Negocios",
        "subcategoria": "Negocios",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://plazacapital.co/media/k2/items/cache/7734b5291984d2ea095e8617554289ca_M.jpg",
        "fecha": "2025-06-18",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 18,
            "precio": 900,
            "descripcion": "Incluye acceso VIP, material avanzado y sesiones privadas."
          },
          "premium": {
            "disponibles": 25,
            "precio": 600,
            "descripcion": "Acceso preferencial y materiales adicionales."
          },
          "basico": {
            "disponibles": 74,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las conferencias."
          }
        }
      },
      {
        "nombre": "Expo PyME México",
        "categoria": "Educación y Negocios",
        "subcategoria": "Negocios",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://protexa.mx/wp-content/uploads/2022/08/Protexa-Expo-Pyme-2022.jpeg",
        "fecha": "2025-07-15",
        "lugar": "Puebla",
        "disponibilidad": {
          "vip": {
            "disponibles": 21,
            "precio": 750,
            "descripcion": "Acceso VIP a reuniones exclusivas y talleres avanzados."
          },
          "premium": {
            "disponibles": 45,
            "precio": 500,
            "descripcion": "Acceso preferencial y material complementario."
          },
          "basico": {
            "disponibles": 82,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las áreas."
          }
        }
      },
      {
        "nombre": "Conferencia de Liderazgo Empresarial",
        "categoria": "Educación y Negocios",
        "subcategoria": "Negocios",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://maestriasydiplomadostec.blob.core.windows.net/maestriasydiplomados/uploads/evento/imagen/160/banner1600x840_lp__C_mo-ser-un-l_der-que-inspira-.png",
        "fecha": "2025-09-26",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 35,
            "precio": 850,
            "descripcion": "Acceso VIP, sesiones privadas y material exclusivo."
          },
          "premium": {
            "disponibles": 52,
            "precio": 600,
            "descripcion": "Acceso preferencial y materiales adicionales."
          },
          "basico": {
            "disponibles": 70,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las ponencias."
          }
        }
      },
      {
        "nombre": "Seminario de Finanzas y Startups",
        "categoria": "Educación y Negocios",
        "subcategoria": "Negocios",
        "descripcion": "Evento imperdible. Disfruta una experiencia única.",
        "imagen": "https://i.ytimg.com/vi/MmoyMcVzzpY/maxresdefault_live.jpg",
        "fecha": "2025-07-16",
        "lugar": "León",
        "disponibilidad": {
          "vip": {
            "disponibles": 22,
            "precio": 800,
            "descripcion": "Acceso VIP, talleres avanzados y material exclusivo."
          },
          "premium": {
            "disponibles": 48,
            "precio": 600,
            "descripcion": "Acceso preferencial y materiales complementarios."
          },
          "basico": {
            "disponibles": 84,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las conferencias y talleres."
          }
        }
      },
      {
        "nombre": "Cine Bajo la Luna",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Cine y Medios",
        "descripcion": "Evento de cine y medios imperdible. Disfruta una experiencia única.",
        "imagen": "https://3.bp.blogspot.com/-eiS6aTS1RZQ/UDe5zpM9JiI/AAAAAAAAAE4/ClOw0UU_BL0/s1600/Pendon_cine+bajo+la+luna.png",
        "fecha": "2025-07-12",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 27,
            "precio": 500,
            "descripcion": "Incluye asientos preferenciales y una experiencia exclusiva al aire libre."
          },
          "premium": {
            "disponibles": 38,
            "precio": 300,
            "descripcion": "Acceso preferencial y material adicional."
          },
          "basico": {
            "disponibles": 51,
            "precio": 150,
            "descripcion": "Entrada general con acceso a todas las proyecciones."
          }
        }
      },
      {
        "nombre": "Festival de Cortometrajes Internacionales",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Cine y Medios",
        "descripcion": "Evento de cine y medios imperdible. Disfruta una experiencia única.",
        "imagen": "https://www.hellovalencia.es/wp-content/uploads/2018/04/festiival-cortos.jpg",
        "fecha": "2025-05-07",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 28,
            "precio": 600,
            "descripcion": "Incluye acceso VIP, material exclusivo y asientos reservados."
          },
          "premium": {
            "disponibles": 30,
            "precio": 400,
            "descripcion": "Acceso preferencial a las salas principales y material adicional."
          },
          "basico": {
            "disponibles": 98,
            "precio": 200,
            "descripcion": "Entrada general con acceso a todas las proyecciones."
          }
        }
      },
      {
        "nombre": "Encuentro de Cine Mexicano",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Cine y Medios",
        "descripcion": "Evento de cine y medios imperdible. Disfruta una experiencia única.",
        "imagen": "https://selecciones.com.mx/wp-content/uploads/2024/08/Dia-del-cine-mexicano.png",
        "fecha": "2025-05-06",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 10,
            "precio": 700,
            "descripcion": "Incluye asientos VIP, acceso a proyecciones exclusivas y material premium."
          },
          "premium": {
            "disponibles": 37,
            "precio": 500,
            "descripcion": "Acceso preferencial y material complementario."
          },
          "basico": {
            "disponibles": 73,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las proyecciones."
          }
        }
      },
      {
        "nombre": "Documentales del Mundo",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Cine y Medios",
        "descripcion": "Evento de cine y medios imperdible. Disfruta una experiencia única.",
        "imagen": "https://cfm.yidio.com/images/tv/34839/backdrop-1280x720.jpg",
        "fecha": "2025-06-18",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 11,
            "precio": 600,
            "descripcion": "Acceso VIP con asientos reservados, material exclusivo y proyecciones adicionales."
          },
          "premium": {
            "disponibles": 38,
            "precio": 400,
            "descripcion": "Acceso preferencial y contenido extra."
          },
          "basico": {
            "disponibles": 92,
            "precio": 200,
            "descripcion": "Entrada general con acceso a todos los documentales."
          }
        }
      },
      {
        "nombre": "Maratón Sci-Fi Retro",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Cine y Medios",
        "descripcion": "Evento de cine y medios imperdible. Disfruta una experiencia única.",
        "imagen": "https://hpr.com/wp-content/uploads/2021/08/PS_ent_movie_SFMarathon.jpg?v=1697577869",
        "fecha": "2025-04-18",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 28,
            "precio": 500,
            "descripcion": "Incluye acceso VIP, sesiones exclusivas y material retro especial."
          },
          "premium": {
            "disponibles": 31,
            "precio": 300,
            "descripcion": "Acceso preferencial y material complementario."
          },
          "basico": {
            "disponibles": 82,
            "precio": 150,
            "descripcion": "Entrada general con acceso a todas las películas."
          }
        }
      },
      {
        "nombre": "Expo Arte Contemporáneo",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Arte y Cultura",
        "descripcion": "Evento de arte y cultura imperdible. Disfruta una experiencia única.",
        "imagen": "https://cms.artcenter.edu/image/21208/b24/0.5,0.5",
        "fecha": "2025-06-12",
        "lugar": "Puebla",
        "disponibilidad": {
          "vip": {
            "disponibles": 16,
            "precio": 700,
            "descripcion": "Acceso VIP, visitas guiadas exclusivas y material premium."
          },
          "premium": {
            "disponibles": 31,
            "precio": 500,
            "descripcion": "Acceso preferencial a exposiciones destacadas."
          },
          "basico": {
            "disponibles": 96,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las exposiciones."
          }
        }
      },
      {
        "nombre": "Encuentro de Letras y Café",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Arte y Cultura",
        "descripcion": "Evento de arte y cultura imperdible. Disfruta una experiencia única.",
        "imagen": "https://yt3.googleusercontent.com/5SptpyRT0WIozwTY3c-UkY9LcHTa_VMUNWN2Gn-hQlcbBgnjem8gQs5pqT7e4Br1D3H7TPztMQ=s900-c-k-c0x00ffffff-no-rj",
        "fecha": "2025-07-18",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 18,
            "precio": 600,
            "descripcion": "Acceso VIP, sesiones privadas con autores y material exclusivo."
          },
          "premium": {
            "disponibles": 31,
            "precio": 400,
            "descripcion": "Acceso preferencial y contenido adicional."
          },
          "basico": {
            "disponibles": 55,
            "precio": 200,
            "descripcion": "Entrada general con acceso a todas las actividades."
          }
        }
      },
      {
        "nombre": "Teatro Urbano en el Parque",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Arte y Cultura",
        "descripcion": "Evento de arte y cultura imperdible. Disfruta una experiencia única.",
        "imagen": "https://img.chilango.com/2019/01/jazz-en-el-teatro-angela-peralta.jpg",
        "fecha": "2025-04-09",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 24,
            "precio": 500,
            "descripcion": "Incluye asientos VIP, acceso exclusivo y material adicional."
          },
          "premium": {
            "disponibles": 39,
            "precio": 300,
            "descripcion": "Acceso preferencial a las funciones destacadas."
          },
          "basico": {
            "disponibles": 86,
            "precio": 150,
            "descripcion": "Entrada general con acceso a todas las funciones."
          }
        }
      },
      {
        "nombre": "Fotografía y Sociedad",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Arte y Cultura",
        "descripcion": "Evento de arte y cultura imperdible. Disfruta una experiencia única.",
        "imagen": "https://3.bp.blogspot.com/-E01Tgkhdab0/T-E198NWNfI/AAAAAAAACZw/VlBiKhlZur8/s1600/librofoto.jpg",
        "fecha": "2025-06-12",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 20,
            "precio": 600,
            "descripcion": "Acceso VIP con visitas guiadas exclusivas y material avanzado."
          },
          "premium": {
            "disponibles": 48,
            "precio": 400,
            "descripcion": "Acceso preferencial y material adicional."
          },
          "basico": {
            "disponibles": 67,
            "precio": 200,
            "descripcion": "Entrada general con acceso a todas las exhibiciones."
          }
        }
      },
      {
        "nombre": "Festival de Danza y Color",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Arte y Cultura",
        "descripcion": "Evento de arte y cultura imperdible. Disfruta una experiencia única.",
        "imagen": "https://i.pinimg.com/736x/04/59/52/045952f70ed1f831b9b768e926269faf.jpg",
        "fecha": "2025-07-05",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 26,
            "precio": 700,
            "descripcion": "Incluye acceso VIP a funciones destacadas y material exclusivo."
          },
          "premium": {
            "disponibles": 39,
            "precio": 500,
            "descripcion": "Acceso preferencial y contenido adicional."
          },
          "basico": {
            "disponibles": 85,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las presentaciones."
          }
        }
      },
      {
        "nombre": "Noches de Jazz en el Lago",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/OIP.EB7x_IPFjFQACpYzDUUiSAHaFj?w=258&h=193&c=7&r=0&o=5&pid=1.7",
        "fecha": "2025-04-09",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 19,
            "precio": 600,
            "descripcion": "Incluye asientos preferenciales, bebidas exclusivas y acceso a áreas VIP."
          },
          "premium": {
            "disponibles": 42,
            "precio": 400,
            "descripcion": "Acceso preferencial a las presentaciones y material exclusivo."
          },
          "basico": {
            "disponibles": 71,
            "precio": 200,
            "descripcion": "Entrada general con acceso a todas las presentaciones."
          }
        }
      },
      {
        "nombre": "Festival Sonidos del Mundo",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
        "fecha": "2025-05-22",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 27,
            "precio": 700,
            "descripcion": "Acceso VIP con asientos preferenciales, meet & greet con artistas y material exclusivo."
          },
          "premium": {
            "disponibles": 45,
            "precio": 500,
            "descripcion": "Acceso preferencial y contenido adicional."
          },
          "basico": {
            "disponibles": 99,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      },
      {
        "nombre": "Rock Sin Fronteras",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://1.bp.blogspot.com/_ADbuBaeIylA/TVG47YO87NI/AAAAAAAAAKY/fiDdN-GCAE4/s1600/29197_10150177742490511_891700510_12627186_4429050_n%2Bcopia.jpg",
        "fecha": "2025-07-23",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 16,
            "precio": 800,
            "descripcion": "Acceso VIP con asientos reservados, bebidas premium y material exclusivo."
          },
          "premium": {
            "disponibles": 48,
            "precio": 600,
            "descripcion": "Acceso preferencial y souvenirs adicionales."
          },
          "basico": {
            "disponibles": 61,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      },
      {
        "nombre": "Reggae Roots Fest",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/OIP.lBmC78gaLUh0QWAvnjvFlAHaD4?w=331&h=180&c=7&r=0&o=5&pid=1.7",
        "fecha": "2025-07-21",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 18,
            "precio": 700,
            "descripcion": "Incluye acceso VIP, asientos preferenciales y material exclusivo."
          },
          "premium": {
            "disponibles": 35,
            "precio": 500,
            "descripcion": "Acceso preferencial y contenido adicional."
          },
          "basico": {
            "disponibles": 88,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las presentaciones."
          }
        }
      },
      {
        "nombre": "Pop Star Experience",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://th.bing.com/th/id/OIP.05DS_iFs77g417RvTsr4mwHaE8?rs=1&pid=ImgDetMain",
        "fecha": "2025-07-07",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 28,
            "precio": 900,
            "descripcion": "Acceso VIP, meet & greet con el artista principal y material premium."
          },
          "premium": {
            "disponibles": 31,
            "precio": 700,
            "descripcion": "Acceso preferencial y contenido exclusivo."
          },
          "basico": {
            "disponibles": 82,
            "precio": 500,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      },
      {
        "nombre": "Clásicos bajo las Estrellas",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://i.ytimg.com/vi/I7TCUqY47lI/maxresdefault.jpg",
        "fecha": "2025-06-30",
        "lugar": "Querétaro",
        "disponibilidad": {
          "vip": {
            "disponibles": 19,
            "precio": 800,
            "descripcion": "Incluye acceso VIP, asientos reservados y material adicional."
          },
          "premium": {
            "disponibles": 34,
            "precio": 600,
            "descripcion": "Acceso preferencial y contenido exclusivo."
          },
          "basico": {
            "disponibles": 72,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las presentaciones."
          }
        }
      },
      {
        "nombre": "Beat & Groove Festival",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://img.new.livestream.com/events/0000000000935750/38995a7e-7385-4d8b-ab5d-6dd1bd555fc4.jpg",
        "fecha": "2025-07-13",
        "lugar": "Guadalajara",
        "disponibilidad": {
          "vip": {
            "disponibles": 13,
            "precio": 1000,
            "descripcion": "Acceso VIP, backstage con artistas y material premium."
          },
          "premium": {
            "disponibles": 45,
            "precio": 700,
            "descripcion": "Acceso preferencial y contenido exclusivo."
          },
          "basico": {
            "disponibles": 83,
            "precio": 500,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      },
      {
        "nombre": "Noche Flamenca",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://www.nyc-arts.org/wp-content/uploads/2022/03/Noche-Flamenca-09.jpg",
        "fecha": "2025-05-22",
        "lugar": "Puebla",
        "disponibilidad": {
          "vip": {
            "disponibles": 30,
            "precio": 600,
            "descripcion": "Incluye acceso VIP, asientos preferenciales y material exclusivo."
          },
          "premium": {
            "disponibles": 34,
            "precio": 400,
            "descripcion": "Acceso preferencial y contenido adicional."
          },
          "basico": {
            "disponibles": 63,
            "precio": 200,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      },
      {
        "nombre": "Indie Sounds Querétaro",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://i.ytimg.com/vi/BxP80Ei8xW8/maxresdefault.jpg",
        "fecha": "2025-06-26",
        "lugar": "CDMX",
        "disponibilidad": {
          "vip": {
            "disponibles": 25,
            "precio": 700,
            "descripcion": "Acceso VIP, meet & greet con artistas y material exclusivo."
          },
          "premium": {
            "disponibles": 34,
            "precio": 500,
            "descripcion": "Acceso preferencial y contenido adicional."
          },
          "basico": {
            "disponibles": 62,
            "precio": 300,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      },
      {
        "nombre": "Orquesta Sinfónica al Aire Libre",
        "categoria": "Arte, Cultura y Entretenimiento",
        "subcategoria": "Música",
        "descripcion": "Evento de música imperdible. Disfruta una experiencia única.",
        "imagen": "https://hoypyspace.sfo2.digitaloceanspaces.com/imagenes/2019/10/08225044/osca_4.jpg",
        "fecha": "2025-06-08",
        "lugar": "Monterrey",
        "disponibilidad": {
          "vip": {
            "disponibles": 12,
            "precio": 800,
            "descripcion": "Incluye acceso VIP, asientos reservados y material adicional."
          },
          "premium": {
            "disponibles": 43,
            "precio": 600,
            "descripcion": "Acceso preferencial y contenido exclusivo."
          },
          "basico": {
            "disponibles": 72,
            "precio": 400,
            "descripcion": "Entrada general con acceso a todas las actuaciones."
          }
        }
      }
  ]

eventos.forEach(async (evento) => {
  await db.collection("eventos").add(evento);
  console.log(`Evento ${evento.nombre} agregado`);
});
