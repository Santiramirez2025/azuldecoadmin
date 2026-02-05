import QuickDocumentForm from "@/components/QuickDocumentForm"

export default function NuevoDocumentoPage() {
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Documento</h1>
        <p className="text-muted-foreground">
          Creá presupuestos y recibos rápidamente
        </p>
      </div>
      <QuickDocumentForm />
    </div>
  )
}