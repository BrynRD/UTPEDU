import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Star, Share2, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFViewer } from './PDFViewer';
import { toast } from "@/components/ui/use-toast";

interface RecursoViewerProps {
  recurso: {
    id: number;
    titulo: string;
    descripcion: string;
    archivo_url: string;
    archivo_id?: string;
    categoria_id: number;
    categoria_nombre: string;
    fecha_creacion: string;
    descargas: number;
    tipo_archivo?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function RecursoViewer({ recurso, isOpen, onClose }: RecursoViewerProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [fileType, setFileType] = useState<string>('');
  const [txtContent, setTxtContent] = useState<string | null>(null);
  const [isTxtLoading, setIsTxtLoading] = useState(false);

  // Function to determine file type based on provided info or URL
  const determineFileType = (recurso: RecursoViewerProps['recurso']): string => {
    console.log("Determinando tipo de archivo para:", recurso);

    // PRIORIDAD 1: Check if it's a Google Drive URL
    const url = recurso.archivo_url;
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/(.*?)\/view/)?.[1];
      if (fileId) {
        console.log("URL de Google Drive detectada, usando iframe");
        return 'iframe'; // Always use iframe for Google Drive files
      }
    }

    // PRIORIDAD 2: Usar tipo_archivo del backend si está disponible
    if (recurso.tipo_archivo) {
      console.log("Usando tipo_archivo del backend:", recurso.tipo_archivo);
      const backendType = recurso.tipo_archivo.toLowerCase();
      if (backendType.includes('pdf')) return 'pdf';
      if (backendType.includes('word') || backendType.includes('document')) return 'doc';
      if (backendType.includes('excel') || backendType.includes('spreadsheet')) return 'excel';
      if (backendType.includes('powerpoint') || backendType.includes('presentation')) return 'ppt';
      if (backendType.includes('text/plain') || backendType.includes('text/')) return 'txt';
    }

    // PRIORIDAD 3: Inferir de la extensión
    const extMatch = url.split('.').pop()?.toLowerCase();
    if (extMatch) {
      switch (extMatch) {
        case 'pdf': return 'pdf';
        case 'doc': case 'docx': return 'doc';
        case 'xls': case 'xlsx': return 'excel';
        case 'ppt': case 'pptx': return 'ppt';
        case 'txt': return 'txt';
      }
    }

    return 'other';
  };

  // Effect for initial file type detection and TXT loading
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setTxtContent(null);
      setIsTxtLoading(false);

      // Determine file type
      const detectedType = determineFileType(recurso);
      console.log("Tipo de archivo detectado:", detectedType);
      setFileType(detectedType);

      // If it's a TXT file, simulate loading
      if (detectedType === 'txt') {
        setIsTxtLoading(true);
        // Simulate TXT loading
        setTimeout(() => {
          setTxtContent('Contenido de archivo TXT simulado.\nEsto es una vista previa.');
          setIsTxtLoading(false);
        }, 500);
      }

      setIsLoading(false);
    } else {
      // Reset states when dialog closes
      setFileType('');
      setError(null);
      setIsLoading(true);
      setTxtContent(null);
      setIsTxtLoading(false);
    }
  }, [isOpen, recurso]);

  const handleLoadComplete = (success: boolean) => {
    console.log("handleLoadComplete called with success:", success);
    if (!success) {
      setError('No se pudo cargar la vista previa del archivo.');
    }
  };

  const getViewerUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/(.*?)\/view/)?.[1];
      if (fileId) {
        // Always use preview for Google Drive files
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    // For non-Google Drive files, use Office Online Viewer
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando archivo...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              className="mt-4"
              onClick={() => window.open(recurso.archivo_url, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar archivo
            </Button>
          </div>
        </div>
      );
    }

    switch (fileType) {
      case 'pdf':
        // Only use PDFViewer for non-Google Drive PDFs
        if (!recurso.archivo_url.includes('drive.google.com')) {
          return <PDFViewer url={recurso.archivo_url} title={recurso.titulo} onLoadComplete={handleLoadComplete} />;
        }
        // Fall through to iframe case for Google Drive PDFs
      case 'doc':
      case 'excel':
      case 'ppt':
      case 'iframe':
        return (
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <iframe
              src={getViewerUrl(recurso.archivo_url)}
              className="absolute inset-0 w-full h-full"
              title={recurso.titulo}
              onLoad={() => handleLoadComplete(true)}
              onError={() => handleLoadComplete(false)}
              style={{ border: 'none' }}
              allowFullScreen
            />
          </div>
        );

      case 'txt':
        if (isTxtLoading) {
          return (
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Cargando contenido de texto...</p>
              </div>
            </div>
          );
        }
        return (
          <div className="w-full h-full rounded-lg overflow-auto bg-white p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
              {txtContent}
            </pre>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No se puede previsualizar este tipo de archivo.
                Asegúrate de que el archivo sea público si es de Google Drive.
              </p>
              <Button
                className="mt-4"
                onClick={() => window.open(recurso.archivo_url, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar archivo
              </Button>
            </div>
          </div>
        );
    }
  };

  const handleDownload = async () => {
    console.log('Frontend Download: Initiating download for resource ID:', recurso.id);
    try {
      console.log('Frontend Download: Fetching from URL:', `${process.env.NEXT_PUBLIC_API_URL}/recursos/download/${recurso.id}`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recursos/download/${recurso.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include auth token
        },
      });

      console.log('Frontend Download: Response status', response.status);
      console.log('Frontend Download: Response ok', response.ok);
      console.log('Frontend Download: Response headers', [...response.headers.entries()]);

      if (!response.ok) {
        console.error('Frontend Download: Response not OK.', response.status);
        // If response is not ok, try to parse JSON for an error message
        const errorData = await response.json();
        console.error('Frontend Download: Error data from backend:', errorData);
        throw new Error(errorData.mensaje || 'Error al descargar el archivo');
      }

      console.log('Frontend Download: Response is OK. Processing as blob.');
      // If the response is ok, process the stream to create a downloadable file
      const blob = await response.blob(); // Get the response body as a Blob
      console.log('Frontend Download: Blob created:', blob);

      const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
      console.log('Frontend Download: Blob URL created:', url);

      const a = document.createElement('a'); // Create a link element
      
      // Try to get filename from Content-Disposition header first
      const contentDisposition = response.headers.get('Content-Disposition');
      console.log('Frontend Download: Content-Disposition header:', contentDisposition);

      let filename = recurso.titulo; // Default filename

      if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.*)"/);
          if (filenameMatch && filenameMatch[1]) {
              // Decode URI component to handle potential encoded characters in filename
              try { filename = decodeURIComponent(filenameMatch[1]); } catch (e) { filename = filenameMatch[1]; }
          }
      }
      // Fallback to resource title + inferred extension if header is not clear or decoding fails
       if (!filename.includes('.') && recurso.tipo_archivo) { // Use tipo_archivo from resource if available
            const ext = recurso.tipo_archivo.toLowerCase();
             if (ext) { filename = `${recurso.titulo}.${ext}`; }
       } else if (!filename.includes('.') && recurso.archivo_url) { // Fallback to URL extension if tipo_archivo not available
             const ext = recurso.archivo_url.split('.').pop();
             if (ext) { filename = `${recurso.titulo}.${ext}`; }
       }
       console.log('Frontend Download: Final filename used:', filename);


      a.href = url; // Set the link's href to the Blob URL
      a.download = filename; // Set the download attribute with the desired filename
      document.body.appendChild(a); // Append the link to the body (needed for Firefox)
      console.log('Frontend Download: Link created and appended.');

      a.click(); // Programmatically click the link to trigger download
      console.log('Frontend Download: Link clicked.');
      
      // Clean up
      // Use setTimeout to ensure click event has time to register before removing
      setTimeout(() => {
         window.URL.revokeObjectURL(url); // Release the Blob URL
         document.body.removeChild(a); // Remove the link from the body
         console.log('Frontend Download: Cleaned up Blob URL and link.');
      }, 100); // Small delay

      toast({
        title: "Descarga iniciada",
        description: "El archivo debería empezar a descargarse pronto.",
      });

    } catch (error: any) {
      console.error('Error during download:', error);
      toast({
        title: "Error en la descarga",
        description: error.message || "No se pudo iniciar la descarga del archivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle>{recurso.titulo}</DialogTitle>
              <DialogDescription>
                {recurso.descripcion}
              </DialogDescription>
            </div>
            <div className="flex gap-2 items-center">
               <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(recurso.archivo_url, '_blank')}
                title="Ver archivo"
              >
                <FileText className="h-4 w-4 mr-1" /> Ver
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                title="Descargar archivo"
              >
                <Download className="h-4 w-4 mr-1" /> Descargar
              </Button>
              {/* Optional: Add other action buttons here like Favorite, Share, etc. */}
              <DialogClose asChild>
                 {/* Default close button will be rendered by DialogContent */}
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden relative">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
} 