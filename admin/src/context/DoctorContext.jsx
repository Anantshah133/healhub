import { useState, useCallback } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dashData, setDashData] = useState(false);
    
    // Use useCallback to memoize the function
    const getAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { dToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, dToken]);

    // Handle completing an appointment
    const handleComplete = useCallback(async (appointmentId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/complete-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );
           
            if (data.success) {
                toast.success(data.message);
                getAppointments(); // Refresh appointments
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to complete appointment');
        } finally {
            setLoading(false);
        }
    }, [backendUrl, dToken, getAppointments]);
    
    // Handle cancelling an appointment
    const handleCancel = useCallback(async (appointmentId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                { headers: { dToken } }
            );
           
            if (data.success) {
                toast.success(data.message);
                getAppointments(); // Refresh appointments
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to cancel appointment');
        } finally {
            setLoading(false);
        }
    }, [backendUrl, dToken, getAppointments]);

    // function to get the dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/doctor/dashboard`, 
                {headers: {dToken}}
            );
            if (data.success) {
                setDashData(data.dashData); // Refresh appointments
                console.log(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to cancel appointment');
        }
    }

    const value = { 
        dToken, 
        setDToken, 
        backendUrl, 
        appointments, 
        getAppointments, 
        setAppointments, 
        loading, 
        setLoading, 
        handleComplete, 
        handleCancel, 
        dashData, setDashData, getDashData
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;