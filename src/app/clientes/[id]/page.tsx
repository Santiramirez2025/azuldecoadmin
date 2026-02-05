import EditarTelaClient from './EditarTelaClient'

export default async function EditarTelaPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  return <EditarTelaClient id={id} />
}