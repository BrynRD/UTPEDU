import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, Search, Users, Award, BookCheck, FileText, BarChart } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      

      {}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0edfe] to-white dark:from-gray-200 dark:to-gray-50">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6">
             
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900 dark:text-black">
                  Recursos <span className="text-[#5b36f2]">Educativos</span> para Todos
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                  Comparte, descubre y organiza recursos pedagógicos de calidad. Una comunidad para docentes comprometidos con la excelencia educativa.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/registro" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-[#5b36f2] hover:bg-[#4a2bd0] text-white">
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/recursos" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-[#5b36f2] text-[#5b36f2] hover:bg-[#f0edfe] dark:border-[#7c5df5] dark:text-[#7c5df5] dark:hover:bg-[#5b36f2]/10">
                    Explorar recursos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative w-full md:max-w-[80%] lg:max-w-[600px] mx-auto">
  <div className="absolute -inset-2 md:-inset-3 rounded-lg bg-gradient-to-r from-[#5b36f2] to-[#8b6cf8] opacity-30 blur-lg md:blur-xl filter group-hover:opacity-40 animate-pulse"></div>
  <img
    src="/bg2.png"
    alt="Biblioteca UTP"
    className="relative rounded-lg shadow-xl w-full h-auto object-cover"
    style={{
      aspectRatio: '16/9',
      maxHeight: '400px'
    }}
  />
</div>
          </div>
        </div>
      </section>

      {}
<section className="py-12 bg-white dark:bg-gray-450">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      <div className="flex flex-col items-center p-6 border-2 border-[#5b36f2] rounded-lg dark:border-[#7c5df5] hover:shadow-md hover:shadow-[#5b36f2]/20 transition-all">
        <div className="text-3xl md:text-4xl font-bold text-[#5b36f2]">1,200+</div>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center">Recursos educativos</p>
      </div>
      <div className="flex flex-col items-center p-6 border-2 border-[#5b36f2] rounded-lg dark:border-[#7c5df5] hover:shadow-md hover:shadow-[#5b36f2]/20 transition-all">
        <div className="text-3xl md:text-4xl font-bold text-[#5b36f2]">850+</div>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center">Docentes activos</p>
      </div>
      <div className="flex flex-col items-center p-6 border-2 border-[#5b36f2] rounded-lg dark:border-[#7c5df5] hover:shadow-md hover:shadow-[#5b36f2]/20 transition-all">
        <div className="text-3xl md:text-4xl font-bold text-[#5b36f2]">25+</div>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center">Instituciones participantes</p>
      </div>
      <div className="flex flex-col items-center p-6 border-2 border-[#5b36f2] rounded-lg dark:border-[#7c5df5] hover:shadow-md hover:shadow-[#5b36f2]/20 transition-all">
        <div className="text-3xl md:text-4xl font-bold text-[#5b36f2]">15k+</div>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center">Descargas mensuales</p>
      </div>
    </div>
  </div>
</section>

      {}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-150">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-full bg-[#ede8ff] px-3 py-1 text-sm text-[#5b36f2] dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
              Lo que ofrecemos
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 dark:text-black">
              Características <span className="text-[#5b36f2]">Principales</span>
            </h2>
            <p className="max-w-[800px] text-xl text-gray-600 dark:text-gray-400">
              Nuestra plataforma está diseñada pensando en las necesidades diarias de los docentes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white  rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ede8ff] text-[#5b36f2] mb-5 dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-black">Recursos Educativos</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sube, categoriza y comparte tus mejores recursos con la comunidad educativa. Encuentra contenido de calidad para todas las asignaturas y niveles.
              </p>
            </div>
            
            <div className="bg-white  rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ede8ff] text-[#5b36f2] mb-5 dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-black">Búsqueda Avanzada</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Encuentra rápidamente los recursos que necesitas con filtros por materia, nivel educativo, tipo de recurso y valoración. Ahorra tiempo en la planificación.
              </p>
            </div>
            
            <div className="bg-white  rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ede8ff] text-[#5b36f2] mb-5 dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-black">Comunidad Docente</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Conecta con otros docentes, comparte experiencias educativas y colabora en proyectos. Una red de profesionales comprometidos con la educación.
              </p>
            </div>
            
            <div className="bg-white  rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ede8ff] text-[#5b36f2] mb-5 dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
                <BookCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-black">Colecciones Personalizadas</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organiza tus recursos favoritos en colecciones temáticas. Crea secuencias didácticas completas y compártelas con tus colegas.
              </p>
            </div>
            
            <div className="bg-white  rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ede8ff] text-[#5b36f2] mb-5 dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-black">Certificaciones UTP</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Obtén reconocimiento por tus aportes. Los recursos mejor valorados reciben certificaciones de calidad respaldadas por la Universidad Tecnológica.
              </p>
            </div>
            
            <div className="bg-white  rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#ede8ff] text-[#5b36f2] mb-5 dark:bg-[#5b36f2]/20 dark:text-[#a193f0]">
                <BarChart className="h-6 w-6" />
                  </div>
                       <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-black">Análisis de Impacto</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                Visualiza estadísticas sobre el uso de tus recursos: descargas, valoraciones y comentarios. Mejora continuamente tus materiales educativos.
                          </p>
                              </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 md:py-24 bg-[#5b36f2] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-dots.svg')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Únete a nuestra comunidad educativa hoy
            </h2>
            <p className="text-xl mb-8 text-[#d7cfff]">
              Forma parte de la red de educadores más grande de la región y transforma tu experiencia docente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/registro">
                <Button size="lg" className="w-full bg-white text-[#5b36f2] hover:bg-[#f5f2ff]">
                  Crear cuenta gratuita
                </Button>
              </Link>
              <Link href="/recursos">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-[#4a2bd0]">
                  Explorar recursos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}