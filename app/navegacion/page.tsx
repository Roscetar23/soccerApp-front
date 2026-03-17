export default function NavegacionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-lg">
        <div className="text-4xl md:text-5xl font-bold">
          <span className="text-white">Bienvenido a </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Navegación
          </span>
        </div>
        <p className="text-gray-400 text-lg">
          Usa el menú superior para moverte entre las secciones de la aplicación.
        </p>
      </div>
    </div>
  );
}
