import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios";
// https://youtu.be/yBJSYEG-TGQ?si=rFCnFHGNguk5NxID
const MyAppointment = () => {
    const { doctors, backendUrl, token } = useContext(AppContext);

    const [appointments, setAppointments] = useState([]);

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log(data.appointments);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
            <div>
                {appointments.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 border-b">
                        <div>
                            <img className="w-32 bg-indigo-50" src={item.docData.image} alt={item.docData.name} />
                        </div>
                        <div className="flex-1 text-sm text-zinc-600">
                            <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                            <p>{item.speciality}</p>
                            <p className="text-zinc-700 font-medium mt-1">Address : </p>
                            <p className="text-xs">{item.docData.address.line1}</p>
                            <p className="text-xs">{item.docData.address.line2}</p>
                            <p className="mt-1">
                                <span className="text-neutral-700 font-medium">Date and time : </span>
                                {item.slotDate} {item.slotTime}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                                Pay Online
                            </button>
                            <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyAppointment