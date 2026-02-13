import { useState, useEffect } from 'react'
import { pacientesAPI, medicosAPI, especialidadesAPI, citasAPI } from '../services/api'
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

function Dashboard() {
    const [stats, setStats] = useState({
        pacientes: 0,
        medicos: 0,
        especialidades: 0,
        citas: 0
    });

    const [medicos, setMedicos] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [citas, setCitas] = useState([])

    useEffect(() => {
        cargarEstadisticas()
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const [pacientes, medicos, especialidades, citas] = await Promise.all([
                pacientesAPI.getAll(),
                medicosAPI.getAll(),
                especialidadesAPI.getAll(),
                citasAPI.getAll()
            ])

            setStats({
                pacientes: pacientes.data.length,
                medicos: medicos.data.length,
                especialidades: especialidades.data.length,
                citas: citas.data.length
            })

            setMedicos(medicos.data)
            setEspecialidades(especialidades.data)
            setCitas(citas.data)
        } catch (error) {
            console.error('Error al cargar estadísticas:', error)
        }
    }

    const prepararDatosCitasPorEstado = () => {
        const estados = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada']

        return estados.map(estado => ({
            nombre: estado,
            cantidad: citas.filter(c => c.estado === estado).length
        }))
    }

    const prepararDatosMedicosPorEspecialidad = () => {
        return especialidades.map(esp => ({
            nombre: esp.nombre,
            cantidad: medicos.filter(m => m.especialidadId === esp.id).length
        }))
    }

    const prepararDatosCitasPorMes = () => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        const ahora = new Date()
        const ultimos6Meses = []

        // últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
            const mes = meses[fecha.getMonth()]
            const anio = fecha.getFullYear()

            const cantidad = citas.filter(c => {
                const fechaCita = new Date(c.fechaHora)
                return fechaCita.getMonth() === fecha.getMonth() &&
                    fechaCita.getFullYear() === fecha.getFullYear()
            }).length

            ultimos6Meses.push({
                nombre: `${mes} ${anio}`,
                cantidad: cantidad
            })
        }

        return ultimos6Meses;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Pacientes</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pacientes}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Médicos</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.medicos}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Especialidades</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.especialidades}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Citas</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.citas}</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Citas por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={prepararDatosCitasPorEstado()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="cantidad" fill="#0891b2" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Médicos por Especialidad</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={prepararDatosMedicosPorEspecialidad()}
                                dataKey="cantidad"
                                nameKey="nombre"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {prepararDatosMedicosPorEspecialidad().map((entry, index) => {
                                    const colores = ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc'];
                                    return <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />;
                                })}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Tendencia de Citas (Últimos 6 meses)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={prepararDatosCitasPorMes()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="cantidad" stroke="#0891b2" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;