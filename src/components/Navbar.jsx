import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false)

    const links = [
        { to: '/', label: 'Dashboard' },
        { to: '/pacientes', label: 'Pacientes' },
        { to: '/medicos', label: 'Médicos' },
        { to: '/especialidades', label: 'Especialidades' },
        { to: '/citas', label: 'Citas' },
    ];

    return (
        <nav className="bg-cyan-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-2xl font-bold">MediBook</h1>

                    {/* Botón hamburguesa (solo móvil) */}
                    <button
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        className="md:hidden p-2 rounded-md hover:bg-cyan-700 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuAbierto ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Links desktop */}
                    <div className="hidden md:flex space-x-4">
                        {links.map(link => (
                            <Link key={link.to} to={link.to}
                                className="px-3 py-2 rounded-md hover:bg-cyan-700 transition">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            {menuAbierto && (
                <div className="md:hidden border-t border-cyan-500">
                    <div className="px-4 py-2 space-y-1">
                        {links.map(link => (
                            <Link key={link.to} to={link.to}
                                onClick={() => setMenuAbierto(false)}
                                className="block px-3 py-2 rounded-md hover:bg-cyan-700 transition">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar;