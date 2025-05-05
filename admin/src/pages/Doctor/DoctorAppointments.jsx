import React, { useContext, useEffect, useRef } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { User, CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';

const DoctorAppointments = () => {
    const { dToken, appointments, getAppointments, loading, handleComplete, handleCancel } = useContext(DoctorContext);
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        // Only fetch if we have a token and haven't already fetched
        if (dToken && !dataFetchedRef.current) {
            dataFetchedRef.current = true;
            getAppointments();
        }
        
        // Cleanup function to reset the ref if component unmounts
        return () => {
            dataFetchedRef.current = false;
        };
    }, [dToken]); // Removed getAppointments from dependency array

    // Format date for display
    const formatDate = (dateString) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="m-5 w-full">
            <h1 className="text-lg font-medium mb-5">My Appointments</h1>
            
            {appointments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-medium mb-2">No appointments scheduled</h2>
                    <p className="text-gray-500">When patients book appointments with you, they will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {appointments.map((appointment) => (
                        <div 
                            key={appointment._id} 
                            className={`bg-white rounded-lg shadow overflow-hidden border-t-4 ${
                                appointment.cancelled 
                                    ? 'border-red-500' 
                                    : appointment.isCompleted 
                                        ? 'border-green-500' 
                                        : 'border-blue-500'
                            }`}
                        >
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium">
                                        {appointment.cancelled 
                                            ? <span className="text-red-500">Cancelled</span>
                                            : appointment.isCompleted 
                                                ? <span className="text-green-500">Completed</span>
                                                : <span className="text-blue-500">Upcoming</span>
                                        }
                                    </h3>
                                    <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-800">
                                        ${appointment.amount}
                                    </div>
                                </div>
                                
                                <div className="flex items-center mb-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                                        {appointment.userData.image ? (
                                            <img 
                                                src={appointment.userData.image}
                                                alt={appointment.userData.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{appointment.userData.name}</h4>
                                        <p className="text-gray-500 text-sm">{appointment.userData.email}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 -mx-5 p-4 mb-4">
                                    <div className="flex items-center mb-2">
                                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm">{formatDate(appointment.slotDate)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-sm">{appointment.slotTime}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-sm">
                                    <div className={`mr-2 h-2.5 w-2.5 rounded-full ${appointment.payment ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span>{appointment.payment ? 'Payment Done' : 'Payment Pending'}</span>
                                </div>
                            </div>
                            
                            {/* Action buttons */}
                            {!appointment.cancelled && !appointment.isCompleted && (
                                <div className="flex border-t border-gray-200">
                                    <button 
                                        onClick={() => handleComplete(appointment._id)}
                                        disabled={loading}
                                        className="flex-1 py-3 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                                    >
                                        <CheckCircle className="h-5 w-5 mr-1" />
                                        Complete
                                    </button>
                                    <div className="w-px bg-gray-200"></div>
                                    <button 
                                        onClick={() => handleCancel(appointment._id)}
                                        disabled={loading}
                                        className="flex-1 py-3 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <XCircle className="h-5 w-5 mr-1" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;