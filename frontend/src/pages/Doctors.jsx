import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Doctors = () => {
    const { speciality } = useParams();
    const [showFilter, setShowFilter] = useState(false);
    const [filterDoc, setFilterDoc] = useState([]);
    const {doctors} = useContext(AppContext);
    const navigate = useNavigate();

    
    useEffect(()=>{
        const applyFilter = () => {
            if(speciality) {
                setFilterDoc(doctors.filter(doc => doc.speciality == speciality));
            } else {
                setFilterDoc(doctors);
            }
        }
        applyFilter();
    }, [doctors, speciality]);

    return (
        <div>
            <p className="text-gray-600">Browse through the doctors specialist.</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setShowFilter(!showFilter)}>Filters</button>
                <div className={`w-full sm:w-auto flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {specialityData.map((item, idx)=>(
                        <p onClick={() => navigate(`/doctors/${item.speciality}`)} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === `${item.speciality}` ? "bg-blue-500 text-white" : "" }`} key={idx} >

                            {item.speciality}

                        </p>
                    ))}
                </div>

                <div className="w-full grid grid-cols-auto gap-4">
                    {
                        filterDoc.map((item, idx)=>(
                            <div onClick={()=>navigate(`/appointment/${item._id}`)} className="border border-blue-200 overflow-hidden rounded-xl cursor-pointer hover:translate-y-[-10px] transition-all duration-300" key={idx}>
                                <img className="bg-blue-50 w-full" src={item.image} alt={item.name} />
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-sm text-center text-green-500">
                                        <p className="w-2 h-2 bg-green-500 rounded-full"></p><p>Available</p>
                                    </div>
                                    <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Doctors;