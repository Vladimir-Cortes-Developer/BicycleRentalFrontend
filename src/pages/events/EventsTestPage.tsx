// Página de prueba simple para eventos
const EventsTestPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Test de Eventos</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Si puedes ver esto, el componente se está renderizando correctamente.</p>
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <p>Contenido de prueba</p>
        </div>
      </div>
    </div>
  )
}

export default EventsTestPage