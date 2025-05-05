import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Search, User, UserCog, Eye, XCircle, CheckCircle, CreditCard } from 'lucide-react';

const AllAppointments = () => {
    const { aToken, appointments, getAllAppointments } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
        }
    }, [aToken, getAllAppointments]);

    useEffect(() => {
        if (appointments) {
            let filtered = [...appointments];
            
            // Apply search filter
            if (searchTerm.trim() !== '') {
                filtered = filtered.filter(app => 
                    app.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    app.docData.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Sort by date (newest first)
            filtered.sort((a, b) => b.date - a.date);
            
            setFilteredAppointments(filtered);
        }
    }, [appointments, searchTerm]);

    return (
        <div className='m-5 w-full'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-5'>
                <p className='mb-3 text-lg font-medium'>All Appointments</p>
                
                {/* Search Input */}
                <div className='relative w-full sm:w-64'>
                    <input
                        type='text'
                        placeholder='Search patient or doctor...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full'
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
            </div>

            {/* Appointments Table */}
            <div className='overflow-x-auto bg-white border border-primary rounded-lg overflow-hidden shadow-md'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                #
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Patient
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Doctor
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Date & Time
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Amount
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {filteredAppointments && filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment, index) => (
                                <tr key={appointment._id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {index + 1}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <div className='flex-shrink-0 h-10 w-10'>
                                                {appointment.userData.image ? (
                                                    <img 
                                                        className='h-10 w-10 rounded-full object-cover border border-gray-200' 
                                                        src={appointment.userData.image} 
                                                        alt='' 
                                                    />
                                                ) : (
                                                    <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                                        <User className='h-5 w-5 text-gray-500' />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {appointment.userData.name}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {appointment.userData.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <div className='flex-shrink-0 h-10 w-10'>
                                                {appointment.docData.image ? (
                                                    <img 
                                                        className='h-10 w-10 rounded-full object-cover border border-gray-200' 
                                                        src={appointment.docData.image} 
                                                        alt='' 
                                                    />
                                                ) : (
                                                    <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                                        <UserCog className='h-5 w-5 text-gray-500' />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    Dr. {appointment.docData.name}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {appointment.docData.speciality}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-900'>
                                            {appointment.slotDate}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {appointment.slotTime}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-900'>
                                            ${appointment.amount}
                                        </div>
                                        <div className='flex items-center text-sm text-gray-500'>
                                            <div className={`mr-1 h-2.5 w-2.5 rounded-full ${appointment.payment ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            {appointment.payment ? 'Paid' : 'Pending'}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <div className='flex justify-start space-x-2'>
                                            {!appointment.cancelled && !appointment.isCompleted && (
                                                <>
                                                    <button className='text-primary hover:text-primary-dark transition-colors' title='Mark as completed'>
                                                        <CheckCircle className='w-5 h-5' />
                                                    </button>
                                                    
                                                    <button className='text-red-500 hover:text-red-700 transition-colors' title='Cancel appointment' >
                                                        <XCircle className='w-5 h-5' />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan='7' className='px-6 py-4 text-center text-sm text-gray-500'>
                                    {searchTerm ? 'No appointments match your search criteria' : 'No appointments found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllAppointments;