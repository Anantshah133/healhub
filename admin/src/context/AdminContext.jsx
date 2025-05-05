import axios from "axios";
import { createContext, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState();
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Memoize getAllDoctors first (no other function dependencies)
    const getAllDoctors = useCallback(async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/all-doctors`, {}, { headers: { aToken } });
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err.message);
        }
    }, [aToken, backendUrl]);

    // Memoize getDashboardData (no dependencies on other functions)
    const getDashboardData = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {headers: {aToken}});
            if(data.success){
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }, [aToken, backendUrl]);

    // Memoize getAllAppointments (no dependencies on other functions)
    const getAllAppointments = useCallback(async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {headers: {aToken}});
            if(data.success){
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }, [aToken, backendUrl]);

    // Memoize functions that depend on other functions
    const changeAvailability = useCallback(async (docId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/change-availability`, 
                { docId }, 
                { headers: {aToken} }
            );

            if(data.success){
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }, [aToken, backendUrl, getAllDoctors]);

    const cancelAppointment = useCallback(async (appointmentID) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`, 
                {appointmentID}, 
                {headers: {aToken}}
            );
            
            if(data.success){
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }, [aToken, backendUrl, getAllAppointments]);

    const deleteDoctor = useCallback(async (docId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/admin/delete-doctor`,
                { docId },
                { headers: { aToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to delete doctor");
        } finally {
            setLoading(false);
        }
    }, [aToken, backendUrl, getAllDoctors]);

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,
        getDashboardData,
        loading,
        deleteDoctor,
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;