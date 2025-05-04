import { useContext, useState } from "react"
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const MyProfile = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('phone', userData.phone);
            formData.append('address', JSON.stringify(userData.address));
            formData.append('gender', userData.gender);
            formData.append('dob', userData.dob);

            image && formData.append('image', image);

            const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {headers: {token}});

            if(data.success){
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err)
            toast.error(err.message);
        }
    }

    return userData ? (
        <div className="max-w-lg flex flex-col gap-2 text-sm">
            {
                isEdit ? <label htmlFor="image">
                    <div className="inline-block cursor-pointer relative">
                        <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                        <img className="w-10 absolute bottom-12 right-12" src={image || assets.upload_icon} alt="" />
                    </div>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} id="image" hidden />
                </label> : <img className="w-36 rounded" src={userData.image} alt="" />
            }

            {
                isEdit
                    ? <input className="bg-gray-100 text-3xl font-medium max-w-60 mt-4 p-2" type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                    : <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
            }

            <hr className="bg-zinc-400 h-[1px] border-none" />

            <div>
                <p className="text-neutral-500 underline mt-3">Contact Information</p>

                <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                    <p className="font-medium text-[#43d47b]">Email Id : </p>
                    <p className="text-blue-500">{userData.email}</p>

                    <p className="font-medium">Phone : </p>
                    {
                        isEdit
                            ? <input type="text" className="bg-gray-100 max-w-52 p-2" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                            : <p className="text-blue-500">{userData.phone}</p>
                    }

                    <p className="font-medium">Address : </p>
                    {
                        isEdit
                            ? <p>
                                <input type="text" className="bg-gray-50 p-1" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />

                                <br />

                                <input type="text" className="bg-gray-50 p-1" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
                            </p>
                            : <p className="text-gray-500">
                                {userData.address.line1}
                                <br />
                                {userData.address.line2}
                            </p>
                    }
                </div>
            </div>

            <div>
                <div>
                    <p className="text-neutral-500 underline mt-3">Basic Infomration</p>
                    <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
                        <p className="font-medium">Gender :</p>
                        {
                            isEdit
                                ? <select className="max-w-24 bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                : <p className="text-blue-500">{userData.gender}</p>
                        }

                        <p>Date of Birth : </p>
                        {
                            isEdit
                                ? <input className="max-w-30 bg-gray-100 p-2" type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                                : <p className="text-blue-500">{userData.dob}</p>
                        }
                    </div>
                </div>
            </div>

            <div className="mt-10">
                {
                    isEdit
                        ? <button className="border border-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 py-2 rounded-full" onClick={updateUserProfileData}>Save Information</button>
                        : <button className="border border-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 py-2 rounded-full" onClick={() => setIsEdit(true)}>Edit</button>
                }
            </div>
        </div>
    ) : <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>;
}

export default MyProfile