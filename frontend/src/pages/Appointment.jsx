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
    const [selectedDate, setSelectedDate] = useState('');

    // Find doctor info from doctors array when docId or doctors change
    useEffect(() => {
        if (doctors.length > 0 && docId) {
            const foundDoc = doctors.find(doc => doc._id === docId);
            if (foundDoc) {
                setDocInfo(foundDoc);
            }
        }
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            generateAvailableSlots();
            setSlotTime('');
        }
    }, [docInfo]);

    // Helper function to format dates as YYYY-MM-DD in local timezone
    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        // Month is 0-indexed in JS, so add 1 and pad with 0 if needed
        const month = String(date.getMonth() + 1).padStart(2, '0');
        // Day of month, padded with 0 if needed
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    const generateAvailableSlots = () => {
        let today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of the day
        let allSlots = [];
        
        // Store date objects for each day for reference
        let dateMappings = [];
        
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            
            // Format the date as YYYY-MM-DD using local timezone instead of UTC
            const dateString = formatDateToYYYYMMDD(currentDate);
            
            // Store the day's date information
            dateMappings.push({
                index: i,
                dateObj: new Date(currentDate),
                dateString: dateString
            });
            
            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0); // End time fixed at 9 PM
            
            // Reset currentDate to morning for time slots
            let slotTime = new Date(currentDate);
            slotTime.setHours(10);
            slotTime.setMinutes(0);
            
            let timeSlots = [];
            
            while (slotTime < endTime) {
                // Use a consistent time format
                let formattedTime = slotTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true // Ensure 12-hour format with AM/PM
                });
                
                // Check if this specific date and time slot is available
                const isSlotAvailable = isTimeSlotAvailable(dateString, formattedTime);
                
                // Only add available slots
                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(slotTime),
                        time: formattedTime,
                        date: dateString // Store the date string for later reference
                    });
                }
                
                slotTime.setMinutes(slotTime.getMinutes() + 30);
            }
            
            allSlots.push(timeSlots);
        }
        
        setDocSlots(allSlots);
        
        // Set default selected date when slots are generated
        if (allSlots.length > 0 && allSlots[0].length > 0) {
            setSelectedDate(allSlots[0][0].date);
        }
        
        console.log("Generated date mappings:", dateMappings);
    };

    const isTimeSlotAvailable = (dateString, timeString) => {
        if (!docInfo || !docInfo.slots_booked) {
            return true;
        }
        const bookedSlotsForDate = docInfo.slots_booked[dateString];
        if (!bookedSlotsForDate || !Array.isArray(bookedSlotsForDate)) {
            return true;
        }
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
        
        // Use the selectedDate state that's updated whenever the day is changed
        if (!selectedDate) {
            toast.warn('Invalid date selection');
            return;
        }
        
        // Get the correct date for the selected day
        if (docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].length > 0) {
            const correctDate = docSlots[slotIndex][0].date;
            
            // Log for debugging
            console.log("Booking appointment for day index:", slotIndex);
            console.log("Date from slot:", correctDate);
            console.log("Currently selected date:", selectedDate);
            
            try {
                const { data } = await axios.post(
                    `${backendUrl}/api/user/book-appointment`,
                    {
                        docId,
                        slotDate: correctDate, // Always use the date from the selected day
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
        } else {
            toast.error('No available slots for the selected day');
        }
    };
    
    // Handle day selection with one centralized function for consistency
    const handleDaySelect = (idx, slots) => {
        setSlotIndex(idx);
        // Reset time selection when changing day
        setSlotTime('');
        
        // Ensure the correct date is selected
        if (slots.length > 0) {
            const newSelectedDate = slots[0].date;
            setSelectedDate(newSelectedDate);
            console.log(`Selected date updated to: ${newSelectedDate} for day index: ${idx}`);
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
                    {docSlots.length > 0 && docSlots.map((slots, idx) => {
                        // Only render if we have slots for this day
                        if (slots.length === 0) return null;
                        
                        const dayDate = slots[0].datetime;
                        return (
                            <div 
                                onClick={() => handleDaySelect(idx, slots)} 
                                key={idx} 
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === idx ? "bg-primary text-white" : "border border-gray-200"}`}
                            >
                                <p>{daysOfWeek[dayDate.getDay()]}</p>
                                <p>{dayDate.getDate()}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, idx) => (
                        <p 
                            onClick={() => setSlotTime(item.time)} 
                            key={idx} 
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                {/* Debug info that shows selected date and time */}
                {selectedDate && slotTime && (
                    <p className="text-sm text-gray-500 mt-2">
                        Selected: {selectedDate} at {slotTime}
                    </p>
                )}

                <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">Book An Appointment</button>
            </div>
            {/* Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;