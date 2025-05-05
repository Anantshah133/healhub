import React from 'react';
import { Users, Calendar, BriefcaseMedical, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const dashboardItems = [
        {
            title: "Total Patients",
            count: "100",
            icon: <Users className="h-8 w-8 text-primary" />,
            trend: "+12% from last month"
        },
        {
            title: "Appointments",
            count: "156",
            icon: <Calendar className="h-8 w-8 text-primary" />,
            trend: "Today's scheduled"
        },
        {
            title: "Total Doctors",
            count: "25",
            icon: <BriefcaseMedical className="h-8 w-8 text-primary" />,
            trend: "This week"
        },
        {
            title: "Revenue",
            count: "$5320",
            icon: <TrendingUp className="h-8 w-8 text-primary" />,
            trend: "This month"
        }
    ];

    return (
        <div className="m-5 w-full">
            <p className="mb-5 text-xl font-medium">Dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {dashboardItems.map((item, index) => (
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
        </div>
    );
};

export default Dashboard;