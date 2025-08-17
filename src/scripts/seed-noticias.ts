import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding noticias...')

  const noticias = [
    {
      titulo: 'Gran Feria de Adopción de Verano 2025',
      resumen: 'Ven este sábado a conocer a más de 50 perritos que buscan hogar. Habrá actividades para toda la familia.',
      contenido: `El Centro Municipal de Adopción y Bienestar Animal de Atlixco se complace en invitar a toda la comunidad a participar en nuestra Gran Feria de Adopción de Verano 2025, un evento que promete ser una experiencia inolvidable para toda la familia.

Este evento especial reunirá a más de 50 adorables perritos que han sido rescatados, rehabilitados y están listos para encontrar un hogar lleno de amor. Cada uno de estos animales ha pasado por nuestro protocolo veterinario completo de 5 etapas, garantizando que están en óptimas condiciones de salud.

Durante la feria, los visitantes podrán:

• Conocer personalmente a todos los perritos disponibles para adopción
• Recibir asesoría personalizada de nuestro equipo de expertos
• Participar en talleres sobre cuidado responsable de mascotas
• Disfrutar de actividades recreativas para niños y adultos
• Conocer a los comercios pet-friendly de Atlixco

Nuestro equipo de veterinarios estará presente para resolver todas tus dudas sobre el cuidado de las mascotas, y nuestros voluntarios te ayudarán a encontrar el compañero perfecto para tu familia.

Si estás considerando adoptar, te recomendamos traer:
- Identificación oficial
- Comprobante de domicilio
- Una transportadora o correa (si decides adoptar ese mismo día)

La adopción es completamente gratuita e incluye:
- Mascota esterilizada
- Vacunas al día
- Desparasitación completa
- Certificado de salud
- Seguimiento post-adopción

¡No te pierdas esta oportunidad de cambiar una vida y encontrar a tu nuevo mejor amigo!`,
      imagen: '/images/centro/foto0.jpeg',
      categoria: 'evento',
      ubicacion: 'Plaza Principal de Atlixco',
      hora: '10:00 - 17:00',
      aforo: 500,
      autor: 'Dirección de Bienestar Animal',
      publicada: true,
      destacada: true
    },
    {
      titulo: 'Campaña de Esterilización Gratuita',
      resumen: 'Durante todo el mes de febrero, ofrecemos esterilizaciones gratuitas para perros y gatos.',
      contenido: `Como parte de nuestro compromiso con el bienestar animal y el control poblacional responsable, el Centro Municipal de Adopción y Bienestar Animal de Atlixco anuncia su Campaña de Esterilización Gratuita durante todo el mes de febrero de 2025.

La sobrepoblación de animales en situación de calle es uno de los principales retos que enfrentamos como sociedad. La esterilización es la forma más efectiva y humanitaria de controlar esta problemática, además de proporcionar importantes beneficios de salud para tu mascota.

Beneficios de la esterilización:

Para hembras:
• Previene tumores mamarios y cáncer de útero
• Elimina el celo y los sangrados
• Evita embarazos no deseados
• Reduce el comportamiento territorial

Para machos:
• Previene el cáncer testicular y prostático
• Reduce la agresividad y el marcaje territorial
• Disminuye el deseo de escapar de casa
• Mejora la convivencia con otros animales

Requisitos para acceder al programa:
• Ser residente de Atlixco (presentar comprobante de domicilio)
• Mascota mayor a 4 meses de edad
• Ayuno de 12 horas antes de la cirugía
• Presentar cartilla de vacunación (si la tiene)

El procedimiento es completamente seguro y es realizado por nuestro equipo de veterinarios certificados. La recuperación es rápida y tu mascota podrá regresar a casa el mismo día con indicaciones claras para su cuidado post-operatorio.

Agenda tu cita llamando al 244-445-8765 o visitando nuestras instalaciones. Los espacios son limitados, así que te recomendamos apartar tu lugar lo antes posible.

¡Juntos podemos hacer de Atlixco una ciudad más responsable con los animales!`,
      imagen: '/images/centro/Foto2.jpeg',
      categoria: 'salud',
      ubicacion: 'Centro Municipal de Adopción',
      hora: '09:00 - 14:00',
      autor: 'Departamento Veterinario',
      publicada: true,
      destacada: false
    },
    {
      titulo: 'Historia de Éxito: Max encuentra su hogar',
      resumen: 'Después de 6 meses en el centro, Max finalmente encontró una familia amorosa.',
      contenido: `Hoy queremos compartir con ustedes una historia que nos llena el corazón de alegría y nos recuerda por qué hacemos lo que hacemos: la historia de Max, un perrito que después de 6 meses de espera, finalmente encontró su hogar para siempre.

Max llegó a nuestro centro en julio de 2024, en condiciones que partían el corazón. Fue rescatado de las calles del centro de Atlixco, desnutrido, con sarna y una herida en su pata trasera. Pero lo que más nos impactó fue ver que, a pesar de todo lo que había sufrido, Max movía su colita cada vez que alguien se acercaba.

Su proceso de recuperación fue largo pero exitoso. Nuestro equipo veterinario trabajó incansablemente para sanar sus heridas físicas, mientras que nuestros voluntarios se encargaron de sanar las emocionales con mucho amor y paciencia.

Durante los meses siguientes, Max se convirtió en el favorito del centro. Su personalidad juguetona y cariñosa conquistaba a todos los que lo conocían. Sin embargo, por alguna razón, las familias que venían a adoptar siempre elegían a otros perritos.

Todo cambió el 15 de enero de 2025, cuando la familia González visitó nuestro centro. Su hijo de 8 años, Diego, había estado pidiendo un perrito durante meses, y sus padres finalmente decidieron que era el momento correcto. 

"Cuando Diego vio a Max, fue amor a primera vista", nos cuenta la Sra. González. "Se sentó en el piso y Max inmediatamente se acurrucó en su regazo. En ese momento supimos que era él".

La adopción se completó ese mismo día, y las fotos que la familia nos ha compartido muestran a un Max completamente transformado: feliz, saludable y rodeado de amor.

Esta historia es un recordatorio de que cada perrito en nuestro centro está esperando su oportunidad. Algunos esperan más que otros, pero cuando encuentran a su familia perfecta, todo vale la pena.

Si estás considerando adoptar, te invitamos a visitar nuestro centro. Tal vez tu "Max" está esperándote.`,
      imagen: '/images/centro/foto1.jpeg',
      categoria: 'adopcion',
      autor: 'Equipo de Comunicación',
      publicada: true,
      destacada: false
    },
    {
      titulo: 'Nuevo Protocolo de Bienestar Animal 2025',
      resumen: 'Implementamos un protocolo mejorado de 5 etapas para garantizar el bienestar integral de cada rescatado.',
      contenido: `El Centro Municipal de Adopción y Bienestar Animal de Atlixco se enorgullece en anunciar la implementación de nuestro nuevo Protocolo de Bienestar Animal 2025, un sistema integral de 5 etapas diseñado para garantizar el cuidado óptimo de cada animal que llega a nuestras instalaciones.

Este protocolo representa un avance significativo en nuestro compromiso con el bienestar animal y establece a Atlixco como líder regional en cuidado animal responsable.

Las 5 etapas del protocolo son:

1. EVALUACIÓN INICIAL
• Examen médico completo
• Evaluación comportamental
• Documentación fotográfica
• Asignación de código único de identificación

2. DESPARASITACIÓN
• Tratamiento interno contra parásitos intestinales
• Tratamiento externo contra pulgas y garrapatas
• Baños medicados según necesidad
• Seguimiento durante 15 días

3. VACUNACIÓN
• Esquema completo según edad
• Vacuna múltiple (parvovirus, moquillo, hepatitis, leptospirosis)
• Vacuna antirrábica
• Refuerzos programados

4. ESTERILIZACIÓN
• Cirugía realizada por veterinarios certificados
• Anestesia segura y monitoreo constante
• Recuperación supervisada
• Seguimiento post-operatorio de 7 días

5. ALTA MÉDICA Y ADOPCIÓN
• Certificado de salud completo
• Perfil comportamental documentado
• Fotografías profesionales para catálogo
• Disponible para adopción responsable

Cada etapa está cuidadosamente diseñada y supervisada por nuestro equipo de profesionales. El tiempo promedio desde el ingreso hasta la disponibilidad para adopción es de 30 a 45 días, dependiendo de las condiciones iniciales del animal.

Este protocolo no solo garantiza la salud física de los animales, sino que también aborda sus necesidades emocionales y comportamentales, preparándolos mejor para una integración exitosa en sus nuevos hogares.

Invitamos a la comunidad a conocer más sobre nuestro trabajo y a ser parte de este cambio positivo en el bienestar animal de Atlixco.`,
      imagen: '/images/centro/Foto3.jpeg',
      categoria: 'general',
      autor: 'Dirección General',
      publicada: true,
      destacada: true
    }
  ]

  for (const noticia of noticias) {
    const created = await prisma.noticia.create({
      data: noticia
    })
    console.log(`✅ Creada noticia: ${created.titulo}`)
  }

  console.log('✨ Seeding completado!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })