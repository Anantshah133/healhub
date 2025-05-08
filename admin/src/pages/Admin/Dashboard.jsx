import React, { useContext, useEffect } from 'react';
import { Users, Calendar, BriefcaseMedical, TrendingUp } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';

const Dashboard = () => {
    const { aToken, getDashboardData, dashData } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getDashboardData();
        }
    }, [aToken, getDashboardData]);

    const getDashboardItems = () => {
        if (!dashData) return [];

        return [
            {
                title: "Total Patients",
                count: dashData.patients || 0,
                icon: <Users className="h-8 w-8 text-primary" />,
                trend: "+12% from last month"
            },
            {
                title: "Appointments",
                count: dashData.appointments || 0,
                icon: <Calendar className="h-8 w-8 text-primary" />,
                trend: "Total appointments"
            },
            {
                title: "Total Doctors",
                count: dashData.doctors || 0,
                icon: <BriefcaseMedical className="h-8 w-8 text-primary" />,
                trend: "Active practitioners"
            },
            {
                title: "Revenue",
                count: `$${(dashData.appointments || 0) * 50}`,
                icon: <TrendingUp className="h-8 w-8 text-primary" />,
                trend: "Estimated earnings"
            }
        ];
    };

    return (
        <div className="m-5 w-full">
            <p className="mb-5 text-xl font-medium">Dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {getDashboardItems().map((item, index) => (
                    <div key={index} className="bg-white hover:translate-y-[-5px] rounded-lg shadow p-6 transition-all duration-300 hover:shadow-md border-l-4 border-primary">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">{item.title}</h3>
                                <p className="text-2xl font-bold">{item.count}</p>
                                <p className="text-xs text-gray-500 mt-2">{item.trend}</p>
                            </div>
                            <div className="bg-primary bg-opacity-10 p-3 rounded-full">
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Latest Appointments Section */}
            {dashData && dashData.latestAppointments && dashData.latestAppointments.length > 0 && (
                <div className="mt-8">
                    <p className="mb-4 text-lg font-medium">Latest Appointments</p>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dashData.latestAppointments.map((appointment, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {appointment.userData.image ? (
                                                        <img className="h-10 w-10 rounded-full object-cover" src={appointment.userData.image} alt="" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <Users className="h-5 w-5 text-gray-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{appointment.userData.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">Dr. {appointment.docData.name}</div>
                                            <div className="text-sm text-gray-500">{appointment.docData.speciality}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.slotDate}</div>
                                            <div className="text-sm text-gray-500">{appointment.slotTime}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {appointment.cancelled ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Cancelled
                                                </span>
                                            ) : appointment.isCompleted ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    Upcoming
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;