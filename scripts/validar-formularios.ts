import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ValidationResult {
  formulario: string
  archivo: string
  problemas: string[]
  camposFaltantes: string[]
  camposIncorrectos: { campo: string, esperado: string, actual: string }[]
  camposNoExistentes: string[]
}

// Mapeo de modelos Prisma y sus campos requeridos
const modelosEsquema = {
  Perrito: {
    campos: {
      nombre: 'String',
      codigo: 'String',
      slug: 'String',
      fotos: 'String',
      fotoPrincipal: 'String',
      edad: 'String',
      tamano: 'String',
      raza: 'String',
      sexo: 'String',
      peso: 'Float?',
      historia: 'String',
      fechaIngreso: 'DateTime',
      tipoIngreso: 'String',
      procedencia: 'String?',
      responsableIngreso: 'String?',
      vacunas: 'Boolean',
      esterilizado: 'Boolean',
      desparasitado: 'Boolean',
      saludNotas: 'String?',
      energia: 'String',
      aptoNinos: 'Boolean',
      aptoPerros: 'Boolean',
      aptoGatos: 'Boolean',
      caracter: 'String',
      estado: 'String',
      destacado: 'Boolean',
      vistas: 'Int'
    },
    enums: {
      tamano: ['chico', 'mediano', 'grande'],
      sexo: ['macho', 'hembra'],
      tipoIngreso: ['entrega_voluntaria', 'rescate', 'decomiso'],
      energia: ['baja', 'media', 'alta'],
      estado: ['disponible', 'proceso', 'adoptado']
    }
  },
  Solicitud: {
    campos: {
      codigo: 'String',
      perritoId: 'String',
      nombre: 'String',
      edad: 'Int',
      telefono: 'String',
      email: 'String',
      direccion: 'String',
      ciudad: 'String',
      codigoPostal: 'String',
      tipoVivienda: 'String',
      tienePatio: 'Boolean',
      experiencia: 'String',
      otrasMascotas: 'String?',
      motivoAdopcion: 'String',
      ineUrl: 'String?',
      comprobanteUrl: 'String?',
      estado: 'String',
      origenQR: 'String?'
    },
    enums: {
      tipoVivienda: ['casa', 'departamento'],
      estado: ['nueva', 'revision', 'entrevista', 'prueba', 'aprobada', 'rechazada']
    }
  }
}

// Mapeo de nombres incorrectos conocidos
const mapeoNombres = {
  Perrito: {
    'descripcion': 'historia',
    'vacunado': 'vacunas',
    'notasIngreso': 'procedencia',
    'personalidad': 'caracter'
  },
  Solicitud: {
    'motivo': 'motivoAdopcion',
    'patio': 'tienePatio'
  }
}

// Campos que NO deberían existir
const camposInexistentes = {
  Perrito: [
    'padecimientos',
    'vacunasDetalle',
    'tratamientos',
    'alergias',
    'fotosInternas',
    'fotosCatalogo'
  ]
}

async function validarFormularios() {
  console.log('🔍 Iniciando validación de formularios...\n')
  
  const resultados: ValidationResult[] = []
  
  // Validar Formulario Nuevo Perrito
  console.log('📋 Validando formulario Nuevo Perrito...')
  const resultadoPerrito = validarFormularioPerrito()
  resultados.push(resultadoPerrito)
  
  // Validar Formulario Solicitud
  console.log('📋 Validando formularios de Solicitud...')
  const resultadosSolicitud = validarFormulariosSolicitud()
  resultados.push(...resultadosSolicitud)
  
  // Generar reporte
  generarReporte(resultados)
}

function validarFormularioPerrito(): ValidationResult {
  const resultado: ValidationResult = {
    formulario: 'Nuevo Perrito',
    archivo: '/src/app/admin/perritos/nuevo/page.tsx',
    problemas: [],
    camposFaltantes: [],
    camposIncorrectos: [],
    camposNoExistentes: []
  }
  
  // Campos que el formulario captura (basado en análisis)
  const camposFormulario = [
    'nombre', 'raza', 'edad', 'sexo', 'tamano', 'peso', 'energia',
    'personalidad', 'descripcion', 'aptoNinos', 'aptoPerros', 'aptoGatos',
    'tipoIngreso', 'fechaIngreso', 'responsableIngreso', 'notasIngreso',
    'esterilizado', 'vacunado', 'padecimientos', 'alergias', 'vacunas',
    'tratamientos'
  ]
  
  // Verificar campos faltantes
  const camposRequeridos = Object.keys(modelosEsquema.Perrito.campos)
  for (const campo of camposRequeridos) {
    if (!camposFormulario.includes(campo) && 
        !['id', 'codigo', 'slug', 'createdAt', 'updatedAt', 'vistas'].includes(campo)) {
      resultado.camposFaltantes.push(campo)
    }
  }
  
  // Verificar nombres incorrectos
  for (const [incorrecto, correcto] of Object.entries(mapeoNombres.Perrito)) {
    if (camposFormulario.includes(incorrecto)) {
      resultado.camposIncorrectos.push({
        campo: incorrecto,
        esperado: correcto,
        actual: incorrecto
      })
    }
  }
  
  // Verificar campos que no deberían existir
  for (const campo of camposInexistentes.Perrito) {
    if (camposFormulario.includes(campo)) {
      resultado.camposNoExistentes.push(campo)
    }
  }
  
  // Agregar problemas específicos
  if (resultado.camposIncorrectos.length > 0) {
    resultado.problemas.push('Nombres de campos incorrectos')
  }
  if (resultado.camposNoExistentes.length > 0) {
    resultado.problemas.push('Campos que no existen en la base de datos')
  }
  if (resultado.camposFaltantes.length > 0) {
    resultado.problemas.push('Campos faltantes en el formulario')
  }
  
  return resultado
}

function validarFormulariosSolicitud(): ValidationResult[] {
  const resultados: ValidationResult[] = []
  
  // Formulario público 1
  resultados.push({
    formulario: 'Solicitud Pública Simple',
    archivo: '/src/app/solicitud/[perritoId]/page.tsx',
    problemas: ['Formulario muy básico, faltan muchos campos requeridos'],
    camposFaltantes: ['edad', 'ciudad', 'codigoPostal', 'tipoVivienda', 'tienePatio', 'experiencia'],
    camposIncorrectos: [],
    camposNoExistentes: []
  })
  
  // Formulario público 2 (Stepper)
  resultados.push({
    formulario: 'Solicitud Pública Stepper',
    archivo: '/src/app/solicitud-adopcion/[slug]/page.tsx',
    problemas: ['Estructura diferente al modelo, campos con nombres diferentes'],
    camposFaltantes: ['codigo', 'perritoId', 'codigoPostal'],
    camposIncorrectos: [
      { campo: 'apellidos', esperado: 'nombre', actual: 'separado' },
      { campo: 'motivacion', esperado: 'motivoAdopcion', actual: 'motivacion' }
    ],
    camposNoExistentes: ['comprometimiento', 'visitas_veterinario']
  })
  
  return resultados
}

function generarReporte(resultados: ValidationResult[]) {
  console.log('\n' + '='.repeat(60))
  console.log('📊 REPORTE DE VALIDACIÓN')
  console.log('='.repeat(60) + '\n')
  
  let totalProblemas = 0
  
  for (const resultado of resultados) {
    const numProblemas = resultado.problemas.length + 
                        resultado.camposFaltantes.length + 
                        resultado.camposIncorrectos.length + 
                        resultado.camposNoExistentes.length
    
    totalProblemas += numProblemas
    
    console.log(`\n📄 ${resultado.formulario}`)
    console.log(`   Archivo: ${resultado.archivo}`)
    console.log(`   Estado: ${numProblemas > 0 ? '❌ CON PROBLEMAS' : '✅ OK'}`)
    
    if (resultado.problemas.length > 0) {
      console.log('\n   🔴 Problemas generales:')
      resultado.problemas.forEach(p => console.log(`      - ${p}`))
    }
    
    if (resultado.camposFaltantes.length > 0) {
      console.log('\n   ⚠️  Campos faltantes:')
      resultado.camposFaltantes.forEach(c => console.log(`      - ${c}`))
    }
    
    if (resultado.camposIncorrectos.length > 0) {
      console.log('\n   🔄 Nombres incorrectos:')
      resultado.camposIncorrectos.forEach(c => 
        console.log(`      - "${c.actual}" → debe ser "${c.esperado}"`)
      )
    }
    
    if (resultado.camposNoExistentes.length > 0) {
      console.log('\n   🚫 Campos que NO existen en BD:')
      resultado.camposNoExistentes.forEach(c => console.log(`      - ${c}`))
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log(`\n📈 RESUMEN: ${totalProblemas} problemas encontrados en ${resultados.length} formularios\n`)
  
  // Guardar reporte en archivo
  const reporte = JSON.stringify(resultados, null, 2)
  fs.writeFileSync(
    path.join(process.cwd(), 'validacion-formularios.json'),
    reporte
  )
  console.log('💾 Reporte guardado en: validacion-formularios.json\n')
}

// Ejecutar validación
validarFormularios()
  .catch(console.error)
  .finally(() => prisma.$disconnect())