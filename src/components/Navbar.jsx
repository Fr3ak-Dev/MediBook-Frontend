import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-cyan-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold">MediBook</h1>
                    </div>

                    {/* Links de navegación */}
                    <div className="flex space-x-4">
                        <Link
                            to="/"
                            className="px-3 py-2 rounded-md hover:bg-cyan-700 transition"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/pacientes"
                            className="px-3 py-2 rounded-md hover:bg-cyan-700 transition"
                        >
                            Pacientes
                        </Link>
                        <Link
                            to="/medicos"
                            className="px-3 py-2 rounded-md hover:bg-cyan-700 transition"
                        >
                            Médicos
                        </Link>
                        <Link
                            to="/especialidades"
                            className="px-3 py-2 rounded-md hover:bg-cyan-700 transition"
                        >
                            Especialidades
                        </Link>
                        <Link
                            to="/citas"
                            className="px-3 py-2 rounded-md hover:bg-cyan-700 transition"
                        >
                            Citas
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;