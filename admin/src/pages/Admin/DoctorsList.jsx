import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext';
import { Trash2, AlertTriangle } from 'lucide-react';

const DoctorList = () => {
    const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor, loading } = useContext(AdminContext);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, doctorId: null, doctorName: '' });

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
        }
    }, [aToken, getAllDoctors]);
    
    const handleDeleteClick = (id, name) => {
        setDeleteConfirm({ show: true, doctorId: id, doctorName: name });
    };

    const handleConfirmDelete = () => {
        deleteDoctor(deleteConfirm.doctorId);
        setDeleteConfirm({ show: false, doctorId: null, doctorName: '' });
    };

    const handleCancelDelete = () => {
        setDeleteConfirm({ show: false, doctorId: null, doctorName: '' });
    };
    
    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-medium'>All Doctors</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {
                    doctors.map((item, idx) => (
                        <div className="border border-[#C9D8FF] rounded-xl max-w-64 overflow-hidden cursor-pointer group" key={idx}>
                            <div className="relative">
                                <img className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500" src={item.image} alt={item.name} />
                                <button 
                                    onClick={() => handleDeleteClick(item._id, item.name)}
                                    className="absolute top-2 right-2 bg-white/80 hover:bg-red-500 p-2 rounded-full text-red-500 hover:text-white transition-all duration-300 shadow-sm"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={item.available}
                                            onChange={() => changeAvailability(item._id)}
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        <span className="ms-1 text-sm font-medium text-gray-700">{item.available ? 'Available' : 'Unavailable'}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div 
                        className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl transform transition-all"
                        style={{animation: "scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both"}}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Doctor</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Do you really want to delete <span className="font-medium">{deleteConfirm.doctorName}</span>? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleCancelDelete}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                                    disabled={loading}
                                >
                                    No, Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scale-in-center {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}

export default DoctorList