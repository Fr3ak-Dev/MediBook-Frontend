import { useState, useEffect } from 'react'
import { medicosAPI, especialidadesAPI } from '../services/api'

function Medicos() {

    const initialFormData = { nombre: '', apellido: '', cedula: '', telefono: '', email: '', especialidadId: '' }

    const [busqueda, setBusqueda] = useState('')
    const [medicos, setMedicos] = useState([])
    const [especialidades, setEspecialidades] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [formData, setFormData] = useState({ ...initialFormData })

    const cargarMedicos = async () => {
        try {
            const response = await medicosAPI.getAll()
            setMedicos(response.data)
        } catch (error) {
            console.error('Error al cargar medicos:', error)
        }
    }

    const cargarEspecialidades = async () => {
        try {
            const response = await especialidadesAPI.getAll()
            setEspecialidades(response.data)
        } catch (error) {
            console.error('Error al cargar especialidades:', error)
        }
    }

    const abrirModal = (medico = null) => {
        if (medico) {
            setEditando(medico)
            setFormData(medico)
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
                await medicosAPI.update(editando.id, formData)
            } else {
                await medicosAPI.create(formData)
            }
            cargarMedicos()
            cerrarModal()
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al guardar el médico');
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este médico?')) {
            try {
                await medicosAPI.delete(id)
                cargarMedicos()
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar el medico');
            }
        }
    }

    useEffect(() => {
        cargarMedicos()
        cargarEspecialidades()
    }, [])

    const medicosFiltrados = medicos.filter(m =>
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.cedula.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Médicos</h1>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                    onClick={() => abrirModal()}>
                    + Nuevo Médico
                </button>
            </div>
            <div className="mb-6">
                <input type="text" placeholder="Buscar por nombres, apellidos o cédula..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            medicosFiltrados.map((medico) => (
                                <tr key={medico.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medico.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medico.apellido}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medico.cedula}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {especialidades.find(e => e.id === medico.especialidadId)?.nombre || 'Sin especialidad'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-cyan-600 hover:text-cyan-900" onClick={() => abrirModal(medico)}>Editar</button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(medico.id)}>Eliminar</button>
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
                            {editando ? 'Editar Medico' : 'Nuevo Medico'}
                        </h2>
                        <form className='space-y-4' onSubmit={handleInputSubmit}>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Nombres
                                    </label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required
                                        className='border w-full px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Apellidos
                                    </label>
                                    <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required
                                        className='border w-full px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Cédula
                                    </label>
                                    <input type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Teléfono
                                    </label>
                                    <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Correo Electrónico
                                    </label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Especialidad
                                    </label>
                                    <select name="especialidadId" value={formData.especialidadId} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                                        <option value="">Seleccione una especialidad</option>
                                        {especialidades.map((esp) => (
                                            <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                                        ))}
                                    </select>
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

export default Medicos