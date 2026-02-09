import { useState, useEffect } from 'react';
import { pacientesAPI, medicosAPI, especialidadesAPI, citasAPI } from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState({
        pacientes: 0,
        medicos: 0,
        especialidades: 0,
        citas: 0
    });

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const [pacientes, medicos, especialidades, citas] = await Promise.all([
                pacientesAPI.getAll(),
                medicosAPI.getAll(),
                especialidadesAPI.getAll(),
                citasAPI.getAll()
            ]);

            setStats({
                pacientes: pacientes.data.length,
                medicos: medicos.data.length,
                especialidades: especialidades.data.length,
                citas: citas.data.length
            });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tarjeta Pacientes */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Pacientes</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pacientes}</p>
                </div>

                {/* Tarjeta Médicos */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Médicos</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.medicos}</p>
                </div>

                {/* Tarjeta Especialidades */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Especialidades</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.especialidades}</p>
                </div>

                {/* Tarjeta Citas */}
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-600">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase">Citas</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{stats.citas}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;