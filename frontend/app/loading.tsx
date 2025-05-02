export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-utp mb-4"></div>
        <p className="text-utp-light font-medium">Cargando recursos...</p>
      </div>
    </div>
  )
}