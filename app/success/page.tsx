export default function Success() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8">
      <div className="bg-gray-900 rounded-2xl p-12 max-w-lg w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-bold mb-4">Paiement confirmé !</h1>
        <p className="text-gray-400 mb-8">
          Ta licence va être générée et envoyée à ton adresse email dans quelques instants.
        </p>
        <a href="/" className="text-blue-400 hover:underline">
          Retour à l'accueil
        </a>
      </div>
    </main>
  )
}