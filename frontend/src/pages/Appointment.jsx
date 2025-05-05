import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, backendUrl, getDoctorsData, token } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const navigate = useNavigate();
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    // Find doctor info from doctors array when docId or doctors change
    useEffect(() => {
        if (doctors.length > 0 && docId) {
            const foundDoc = doctors.find(doc => doc._id === docId);
            if (foundDoc) {
                setDocInfo(foundDoc);
            }
        }
    }, [doctors, docId]);

    // Generate available slots once when component mounts
    useEffect(() => {
        if (docInfo) {
            generateAvailableSlots();
        }
    }, [docInfo]);

    const generateAvailableSlots = () => {
        let today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of the day

        let allSlots = [];
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // Format the date as YYYY-MM-DD for checking against doctor's booked slots
            const dateString = currentDate.toISOString().split('T')[0];

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0); // End time fixed at 9 PM

            currentDate.setHours(10);
            currentDate.setMinutes(0);

            let timeSlots = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Check if this specific date and time slot is available
                const isSlotAvailable = isTimeSlotAvailable(dateString, formattedTime);

                // Only add available slots
                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                        date: dateString // Store the date string for later reference
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            allSlots.push(timeSlots);
        }

        setDocSlots(allSlots);
    };

    // Helper function to check if a time slot is available
    const isTimeSlotAvailable = (dateString, timeString) => {
        // If doctor info isn't available yet, consider all slots available
        if (!docInfo || !docInfo.slots_booked) {
            return true;
        }

        // Check if the doctor has booked slots for this specific date
        const bookedSlotsForDate = docInfo.slots_booked[dateString];

        // If no booked slots for this date, all slots are available
        if (!bookedSlotsForDate || !Array.isArray(bookedSlotsForDate)) {
            return true;
        }

        // Check if this specific time is in the booked slots array for this specific date
        return !bookedSlotsForDate.includes(timeString);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment....');
            return navigate('/login');
        }

        if (!slotTime) {
            toast.warn('Please select a time slot');
            return;
        }

        // Get the actual selected date from the selected slot
        const selectedDate = docSlots[slotIndex][0]?.date || 
                           docSlots[slotIndex][0]?.datetime.toISOString().split('T')[0];

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                {
                    docId,
                    slotDate: selectedDate,
                    slotTime
                },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData(); // Refresh doctor data to get updated booked slots
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.message || 'Failed to book appointment');
        }
    };

    return docInfo && (
        <div>
            {/* ---------- Doctors Details ---------- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
                </div>
                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sn:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {docInfo.name} <img className="w-5" src={assets.verified_icon} alt="" />
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full text-white bg-primary shadow-md">{docInfo.experience}</button>
                    </div>
                    {/* ---------- Doctor About --------- */}
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <img src={assets.info_icon} alt="" /></p>
                        <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                    </div>
                    <p className="text-gray-500 font-medium mt-4">Appointment Fee : <span className="text-gray-700">${docInfo.fees}</span></p>
                </div>
            </div>
            {/* ---------- Booking Slots ---------- */}
            <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                <p>Booking Slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots.map((item, idx) => (
                        <div onClick={() => setSlotIndex(idx)} key={idx} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === idx ? "bg-primary text-white" : "borderz border-gray-200"}`}>
                            <p>{item.length > 0 && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item.length > 0 && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, idx) => (
                        <p onClick={() => setSlotTime(item.time)} key={idx} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book An Appointment</button>
            </div>
            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;