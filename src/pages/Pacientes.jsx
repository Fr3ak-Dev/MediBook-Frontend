import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { pacientesAPI } from '../services/api'

function Pacientes() {

    const initialFormData = { nombre: '', apellido: '', cedula: '', fechaNacimiento: '', telefono: '', email: '', direccion: '', numeroHistoriaClinica: '' }

    const [busqueda, setBusqueda] = useState('')
    const [pacientes, setPacientes] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [formData, setFormData] = useState({ ...initialFormData })

    const [errores, setErrores] = useState({})
    const [loading, setLoading] = useState(true)
    const [guardando, setGuardando] = useState(false)

    const cargarPacientes = async () => {
        try {
            setLoading(true)
            const response = await pacientesAPI.getAll()
            setPacientes(response.data)
        } catch (error) {
            console.error('Error al cargar pacientes:', error)
        } finally {
            setLoading(false)
        }
    }

    const exportarExcel = () => {

        const datosExcel = pacientesFiltrados.map(p => ({
            'Nombre': p.nombre,
            'Apellido': p.apellido,
            'Cédula': p.cedula,
            'Fecha Nacimiento': new Date(p.fechaNacimiento).toLocaleDateString('es-ES'),
            'Teléfono': p.telefono,
            'Email': p.email,
            'Dirección': p.direccion,
            'Historia Clínica': p.numeroHistoriaClinica
        }))

        const hoja = XLSX.utils.json_to_sheet(datosExcel)

        const libro = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(libro, hoja, 'Pacientes')

        XLSX.writeFile(libro, 'Pacientes.xlsx')
        toast.success('Archivo Excel descargado')
    }

    const exportarPDF = () => {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text('Lista de Pacientes', 14, 20)

        doc.setFontSize(10)
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 28)

        const columnas = ['Nombre Completo', 'Cédula', 'Fecha Nacimiento', 'Teléfono', 'Email', 'Dirección', 'Historia Clínica']
        const filas = pacientesFiltrados.map(p => [
            obtenerNombreCompleto(p),
            p.cedula,
            new Date(p.fechaNacimiento).toLocaleDateString('es-ES'),
            p.telefono,
            p.email,
            p.direccion,
            p.numeroHistoriaClinica
        ])

        // Crear tabla
        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [8, 145, 178] } // color cyan-600 en RGB
        })

        doc.save('Pacientes.pdf')
        toast.success('Archivo PDF descargado')
    }

    const abrirModal = (paciente = null) => {
        if (paciente) {
            setEditando(paciente)
            setFormData(paciente)
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
        setErrores({});
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const validarFormulario = () => {
        const nuevosErrores = {}

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            nuevosErrores.email = 'El email no es válido'
        }

        if (formData.cedula.length < 6 || formData.cedula.length > 10) {
            nuevosErrores.cedula = 'La cédula debe tener entre 6 y 10 dígitos'
        }

        if (formData.telefono.length < 7) {
            nuevosErrores.telefono = 'El teléfono debe tener al menos 7 dígitos'
        }

        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const handleInputSubmit = async (e) => {
        e.preventDefault()

        if (!validarFormulario()) {
            return
        }

        setGuardando(true)

        try {
            if (editando) {
                await pacientesAPI.update(editando.id, formData)
                toast.success('Paciente actualizado con éxito')
            } else {
                await pacientesAPI.create(formData)
                toast.success('Paciente creado con éxito')
            }
            cargarPacientes()
            cerrarModal()
        } catch (error) {
            console.error('Error al guardar:', error)
            toast.error('Error al guardar el paciente')
        } finally {
            setGuardando(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
            try {
                await pacientesAPI.delete(id)
                toast.success('Paciente eliminado con éxito')
                cargarPacientes()
            } catch (error) {
                console.error('Error al eliminar:', error)
                toast.error('Error al eliminar el paciente')
            }
        }
    }

    useEffect(() => {
        cargarPacientes()
    }, [])

    const obtenerNombreCompleto = (paciente) => {
        return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'N/A';
    }

    const pacientesFiltrados = pacientes.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.cedula.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.numeroHistoriaClinica.toLowerCase().includes(busqueda.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando pacientes...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
                <div className="flex gap-2">
                    <button
                        onClick={exportarExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        📊 Exportar Excel
                    </button>
                    <button
                        onClick={exportarPDF}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        📄 Exportar PDF
                    </button>
                    <button
                        onClick={() => abrirModal()}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
                    >
                        + Nuevo Paciente
                    </button>
                </div>
            </div>
            <div className="mb-6">
                <input type="text" placeholder="Buscar por nombres, apellidos o cédula..."
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
                                        <button className="text-cyan-600 hover:text-cyan-900" onClick={() => abrirModal(paciente)}>Editar</button>
                                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(paciente.id)}>Eliminar</button>
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
                            {editando ? 'Editar Paciente' : 'Nuevo Paciente'}
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
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.cedula
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-cyan-500'
                                            }`}
                                    />
                                    {errores.cedula && <p className='text-red-500 text-xs mt-1'>{errores.cedula}</p>}
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Fecha de Nacimiento
                                    </label>
                                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento ? formData.fechaNacimiento.split('T')[0] : ''}
                                        onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Teléfono
                                    </label>
                                    <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} required
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errores.telefono
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-cyan-500'
                                            }`}
                                    />
                                    {errores.telefono && (
                                        <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
                                    )}
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Correo Electrónico
                                    </label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                                        className={`border w-full  px-3 py-2 rounded-lg focus:outline-none focus:ring-2
                                            ${errores.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-cyan-500'}`} />
                                    {errores.email && <p className='text-red-500 text-xs mt-1'>{errores.email}</p>}
                                </div>
                                <div className='col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Dirección
                                    </label>
                                    <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                                <div className='col-span-2'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Número de Historia Clínica
                                    </label>
                                    <input type="text" name="numeroHistoriaClinica" value={formData.numeroHistoriaClinica} onChange={handleInputChange} required
                                        className='border w-full  px-3 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500' />
                                </div>
                            </div>
                            <div className='flex justify-end space-x-3 pt-4'>
                                <button type="button" onClick={() => cerrarModal()}
                                    className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'>
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={guardando}
                                    className={`px-4 py-2 rounded-lg text-white ${guardando
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-cyan-600 hover:bg-cyan-700'
                                        }`}
                                >
                                    {guardando ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Pacientes