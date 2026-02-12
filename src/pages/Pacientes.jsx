import { useState, useEffect } from 'react'
import { pacientesAPI } from '../services/api'

function Pacientes() {

    const [busqueda, setBusqueda] = useState('')
    const [pacientes, setPacientes] = useState([])

    const cargarPacientes = async () => {
        try {
            const response = await pacientesAPI.getAll()
            setPacientes(response.data)
        } catch (error) {
            console.error('Error al cargar pacientes:', error)
        }
    }

    useEffect(() => {
        cargarPacientes()
    }, [])

    const pacientesFiltrados = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.cedula.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.numeroHistoriaClinica.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700">
                    + Nuevo Paciente
                </button>
            </div>
            <div className="mb-6">
                <input type="text" placeholder="Buscar por nombre, apellido o cédula..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    // controlled component
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Historia Clínica</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            pacientesFiltrados.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paciente.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paciente.apellido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paciente.cedula}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paciente.numeroHistoriaClinica}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-cyan-600 hover:text-cyan-900">Editar</button>
                                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Pacientes