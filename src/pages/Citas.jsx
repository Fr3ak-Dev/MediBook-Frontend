import { useState, useEffect } from 'react'
import { pacientesAPI, medicosAPI, citasAPI } from '../services/api'

function Citas() {

    const initialFormData = { pacienteId: '', medicoId: '', fechaHora: '', motivo: '', estado: '', observaciones: '' }

    const [busqueda, setBusqueda] = useState('')
    const [pacientes, setPacientes] = useState([])
    const [medicos, setMedicos] = useState([])
    const [citas, setCitas] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [formData, setFormData] = useState({ ...initialFormData })

    const [filtroEstado, setFiltroEstado] = useState('')

    const cargarPacientes = async () => {
        try {
            const response = await pacientesAPI.getAll()
            setPacientes(response.data)
        } catch (error) {
            console.error('Error al cargar pacientes:', error)
        }
    }

    const cargarMedicos = async () => {
        try {
            const response = await medicosAPI.getAll()
            setMedicos(response.data)
        } catch (error) {
            console.error('Error al cargar medicos:', error)
        }
    }

    const cargarCitas = async () => {
        try {
            const response = await citasAPI.getAll()
            setCitas(response.data)
        } catch (error) {
            console.error('Error al cargar citas:', error)
        }
    }

    const abrirModal = (cita = null) => {
        if (cita) {
            setEditando(cita)
            setFormData(cita)
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
                await citasAPI.update(editando.id, formData)
            } else {
                await citasAPI.create(formData)
            }
            cargarCitas()
            cerrarModal()
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Error al guardar la cita');
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar la cita?')) {
            try {
                await citasAPI.delete(id)
                cargarCitas()
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar el cita');
            }
        }
    }

    useEffect(() => {
        cargarPacientes()
        cargarMedicos()
        cargarCitas()
    }, [])

    const obtenerNombreCompleto = (id, type) => {
        let persona;
        if (type === 'paciente') {
            persona = pacientes.find(p => p.id === id);
        } else if (type === 'medico') {
            persona = medicos.find(m => m.id === id);
        }
        return persona ? `${persona.nombre} ${persona.apellido}` : 'N/A';
    }

    const obtenerEstiloEstado = (estado) => {
        const estilos = {
            Pendiente: 'bg-yellow-100 text-yellow-800',
            Confirmada: 'bg-green-100 text-green-800',
            Cancelada: 'bg-red-100 text-red-800',
            Completada: 'bg-blue-100 text-blue-800'
        }
        return estilos[estado] || 'bg-gray-100 text-gray-800'
    }

    const citasFiltrados = citas.filter(cita => {
        const nombreCompleto = obtenerNombreCompleto(cita.pacienteId, 'paciente') + ' ' + obtenerNombreCompleto(cita.medicoId, 'medico')
        const cumpleBusqueda = nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
        const cumpleFiltrado = filtroEstado === '' || cita.estado === filtroEstado
        return cumpleBusqueda && cumpleFiltrado
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Citas</h1>
                <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                    onClick={() => abrirModal()}>
                    + Nueva Cita
                </button>
            </div>
            <div className="flex items-center mb-6">
                <input type="text" placeholder="Buscar por nombre del paciente o del médico..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mr-4"
                    value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">Filtrar por estado</option>
                    <option key="Pendiente" value="Pendiente">Pendiente</option>
                    <option key="Confirmada" value="Confirmada">Confirmada</option>
                    <option key="Cancelada" value="Cancelada">Cancelada</option>
                    <option key="Completada" value="Completada">Completada</option>
                </select>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            citasFiltrados.map((cita) => (
                                <tr key={cita.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {pacientes.find(p => p.id === cita.pacienteId) ? obtenerNombreCompleto(cita.pacienteId, 'paciente') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {medicos.find(m => m.id === cita.medicoId) ? obtenerNombreCompleto(cita.medicoId, 'medico') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {cita.fechaHora ? new Date(cita.fechaHora).toLocaleString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${obtenerEstiloEstado(cita.estado)}`}>
                                            {cita.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-cyan-600 hover:text-cyan-900" onClick={() => abrirModal(cita)}>Editar</button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(cita.id)}>Eliminar</button>
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
                            {editando ? 'Editar Cita' : 'Nueva Cita'}
                        </h2>
                        <form className='space-y-4' onSubmit={handleInputSubmit}>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Paciente
                                    </label>
                                    {editando ?
                                        <input type="text" name="pacienteId" disabled
                                            value={pacientes.find(p => p.id === formData.pacienteId) ? obtenerNombreCompleto(formData.pacienteId, 'paciente') : 'N/A'}
                                            className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                        :
                                        <select name="pacienteId" value={formData.pacienteId} onChange={handleInputChange} required
                                            className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                                            <option value="">Seleccione un paciente</option>
                                            {pacientes.map((p) => (
                                                <option key={p.id} value={p.id}>{obtenerNombreCompleto(p.id, 'paciente')}</option>
                                            ))}
                                        </select>
                                    }
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Médico
                                    </label>
                                    {editando ? <input type="text" name="medicoId" disabled
                                        value={medicos.find(p => p.id === formData.medicoId) ? obtenerNombreCompleto(formData.medicoId, 'medico') : 'N/A'}
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                        :
                                        <select name="medicoId" value={formData.medicoId} onChange={handleInputChange} required
                                            className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                                            <option value="">Seleccione un médico</option>
                                            {medicos.map((m) => (
                                                <option key={m.id} value={m.id}>{obtenerNombreCompleto(m.id, 'medico')}</option>
                                            ))}
                                        </select>
                                    }
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Fecha/Hora
                                    </label>
                                    <input type="datetime-local" name="fechaHora" value={formData.fechaHora} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Estado
                                    </label>
                                    <select name="estado" value={formData.estado} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500'>
                                        <option value="">Seleccione un estado</option>
                                        <option key="Pendiente" value="Pendiente">Pendiente</option>
                                        <option key="Confirmada" value="Confirmada">Confirmada</option>
                                        <option key="Cancelada" value="Cancelada">Cancelada</option>
                                        <option key="Completada" value="Completada">Completada</option>
                                    </select>
                                </div>
                                <div className='col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Observaciones
                                    </label>
                                    <input type="text" name="observaciones"
                                        value={formData.observaciones} onChange={handleInputChange}
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

export default Citas