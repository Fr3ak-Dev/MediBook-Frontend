import { useState, useEffect } from 'react'
import { especialidadesAPI } from '../services/api'

function Especialidades() {

    const initialFormData = { nombre: '', descripcion: '' }

    const [busqueda, setBusqueda] = useState('')
    const [especialidades, setEspecialidades] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [formData, setFormData] = useState({ ...initialFormData })

    const cargarEspecialidades = async () => {
        try {
            const response = await especialidadesAPI.getAll()
            setEspecialidades(response.data)
        } catch (error) {
            console.error('Error al cargar especialidades:', error)
        }
    }

    const abrirModal = (especialidad = null) => {
        if (especialidad) {
            setEditando(especialidad)
            setFormData(especialidad)
        } else {
            setEditando(null)
            setFormData({ ...initialFormData })
        }
        setShowModal(true)
    }

    const cerrarModal = () => {
        setShowModal(false)
        setEditando(null)
        setFormData({ ...initialFormData })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleInputSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editando) {
                await especialidadesAPI.update(editando.id, formData)
            } else {
                await especialidadesAPI.create(formData)
            }
            cargarEspecialidades()
            cerrarModal()
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al guardar la especialidad');
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta especialidad?')) {
            try {
                await especialidadesAPI.delete(id)
                cargarEspecialidades()
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar la especialidad');
            }
        }
    }

    useEffect(() => {
        cargarEspecialidades()
    }, [])

    const especialidadesFiltrados = especialidades.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Especialidades</h1>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                    onClick={() => abrirModal()}>
                    + Nueva Especialidad
                </button>
            </div>
            <div className="mb-6">
                <input type="text" placeholder="Buscar por nombre, apellido o cédula..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            especialidadesFiltrados.map((especialidad) => (
                                <tr key={especialidad.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{especialidad.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{especialidad.descripcion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-cyan-600 hover:text-cyan-900" onClick={() => abrirModal(especialidad)}>Editar</button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(especialidad.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className='fixed bg-black bg-opacity-50 flex items-center justify-center z-50 inset-0'>
                    <div className='bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto'>
                        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                            {editando ? 'Editar Especialidad' : 'Nueva Especialidad'}
                        </h2>
                        <form className='space-y-4' onSubmit={handleInputSubmit}>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Nombre
                                    </label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required
                                        className='border w-full px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Descripción
                                    </label>
                                    <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required
                                        className='border w-full px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                            </div>
                            <div className='flex justify-end space-x-3 pt-4'>
                                <button type="button" onClick={() => cerrarModal()}
                                    className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'>
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className='px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700'>
                                    {editando ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Especialidades