import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

// Importar PDF.js desde CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface PDFViewerProps {
  url: string;
  title: string;
  onLoadComplete: (success: boolean) => void;
  // Opcional: Prop para indicar si el componente padre aún está cargando datos iniciales
  // parentIsLoading?: boolean; // Ya no es necesario con la nueva lógica de RecursoViewer
}

// Componente que solo renderiza PDFs usando PDF.js
export function PDFViewer({ url, title, onLoadComplete }: PDFViewerProps) {
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga del contenido del PDF.js
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // YA NO necesitamos convertir URL de Google Drive aquí. RecursoViewer lo decide.
  // const getDirectUrl = (driveUrl: string) => { ... };

  // Cargar PDF.js desde CDN
  useEffect(() => {
    const loadScript = async () => {
      if (window.pdfjsLib) {
        setIsScriptLoaded(true);
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setIsScriptLoaded(true);
        console.log('PDF.js script loaded successfully.');
      } catch (err) {
        console.error('Error loading PDF.js:', err);
        setError('Error al cargar el visor PDF. Por favor, recarga la página.');
        setIsLoading(false);
        onLoadComplete(false);
      }
    };

    loadScript();
  }, []); // Ejecutar solo una vez al montar el componente

  // Cargar el PDF cuando el script esté listo y la URL cambie
  useEffect(() => {
    // Solo intentar cargar si el script está cargado, hay una URL y no hay errores de script.
    if (!isScriptLoaded || !url || error) return;

    const loadPDF = async () => {
      console.log('PDFViewer: Intentando cargar PDF con PDF.js desde URL:', url);
      try {
        setIsLoading(true); // Empezar carga del contenido
        setError(null); // Limpiar errores anteriores

        // YA NO HAY LOGICA DE GOOGLE DRIVE IFRAME AQUI.
        // if (directUrl.includes('drive.google.com')) { ... return; }

        // Usar PDF.js para cargar el documento
        const loadingTask = window.pdfjsLib.getDocument({
          url: url, // Usar la URL tal cual viene de RecursoViewer (debe ser directa para PDF.js o manejada por proxy)
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
          cMapPacked: true,
        });

        const pdfDoc = await loadingTask.promise;
        console.log('PDFViewer: PDF loaded successfully with PDF.js.');

        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setIsLoading(false);
        onLoadComplete(true); // Reportar éxito al padre
      } catch (err) {
        console.error('PDFViewer: Error loading PDF:', err);
        setError('No se pudo cargar el PDF. Por favor, intenta descargarlo.');
        setIsLoading(false);
        onLoadComplete(false); // Reportar fallo al padre
      }
    };

    loadPDF();
  }, [isScriptLoaded, url, onLoadComplete, error]); // Depende del script, URL y el callback del padre

  // Renderizar la página actual
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf) return; // No renderizar si el documento PDF no está cargado

      console.log('PDFViewer: Renderizando página:', currentPage);
      try {
        const page = await pdf.getPage(currentPage);
        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }

        // Calcular dimensiones para ajustar al contenedor con zoom
        const originalViewport = page.getViewport({ scale: 1 });
        const container = canvas.parentElement; // Obtener el contenedor (debe tener overflow: auto)
        const containerWidth = container?.offsetWidth || 0;
        const containerHeight = container?.offsetHeight || 0;

        // Ajustar escala para que quepa inicialmente (opcional, pero útil)
        // Si quieres que ajuste al ancho por defecto:
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Si quieres que el ancho del canvas intente ser el 100% del contenedor menos padding
        // const targetWidth = containerWidth - (parseInt(getComputedStyle(container).paddingLeft) || 0) - (parseInt(getComputedStyle(container).paddingRight) || 0);
        // const scaleX = targetWidth / originalViewport.width;
        // const scaleY = containerHeight / originalViewport.height; // Podríamos considerar ajustar al alto también si fuera necesario
        // const autoScale = Math.min(scaleX, scaleY); // Escala que ajusta completamente
        // const viewport = page.getViewport({ scale: scale * autoScale }); // Aplicar zoom sobre la escala de autoajuste
        // canvas.height = viewport.height;
        // canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        console.log('PDFViewer: Página renderizada exitosamente.');
      } catch (err) {
        console.error('PDFViewer: Error rendering page:', err);
        // El error de renderizado no necesariamente significa que la carga del PDF falló completamente,
        // pero es un problema visual. Podríamos reportarlo o manejarlo localmente.
        // Por ahora, solo lo logueamos.
        // setError('Error al renderizar la página del PDF.');
        // onLoadComplete(false); // No reportar fallo total por error de renderizado individual
      }
    };

    renderPage();
  }, [pdf, currentPage, scale]); // Depende del documento, página actual y zoom

  // Efecto para ajustar la escala cuando se carga el PDF por primera vez para que quepa en el contenedor.
  useEffect(() => {
      if (pdf && document.getElementById('pdf-canvas')) {
          // Pequeño retraso para asegurar que el contenedor tiene las dimensiones correctas
          setTimeout(() => {
              const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
              const container = canvas.parentElement; // Debe ser el div con overflow-auto
              if (canvas && container) {
                   const originalViewport = pdf.getPage(1).getViewport({ scale: 1 });
                   const containerWidth = container.offsetWidth;
                   // Ajustar escala para que el ancho del PDF sea el ancho del contenedor (menos padding/margin si hay)
                   const targetWidth = containerWidth; // Ajustar según el padding real del contenedor si es necesario
                   const newScale = targetWidth / originalViewport.width;
                   setScale(newScale);
                   console.log('PDFViewer: Ajustando escala inicial a:', newScale);
              }
          }, 50); // Retraso mínimo
      }
  }, [pdf]); // Solo se ejecuta cuando el objeto PDF cambia (es decir, cuando se carga un nuevo PDF)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  // Mostrar estado de carga o error del SCRIPT de PDF.js
  if (!isScriptLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Inicializando visor PDF...</p>
        </div>
      </div>
    );
  }

  // Mostrar estado de carga del CONTENIDO del PDF
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando PDF...</p>
        </div>
      </div>
    );
  }

  // Mostrar error de carga del CONTENIDO del PDF
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.open(url, '_blank')}>
            Descargar PDF
          </Button>
        </div>
      </div>
    );
  }

  // Mostrar el visor PDF con controles
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Controles del visor */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-100">
        {/* Paginación */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {/* Zoom */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            aria-label="Alejar"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            aria-label="Acercar"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Contenedor del Canvas del PDF */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
        {/* El canvas se renderizará aquí por PDF.js */}
        <canvas id="pdf-canvas" className="shadow-lg"></canvas>
      </div>
    </div>
  );
} 