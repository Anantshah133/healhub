import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { User, Mail, Phone, MapPin, Clipboard, Award, DollarSign, Building, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const { dToken, backendUrl } = useContext(DoctorContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fees: '',
        address: {
            line1: '',
            line2: ''
        },
        available: true
    });

    // Fetch doctor profile data
    useEffect(() => {
        const getProfileData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
                    headers: { dToken }
                });

                if (data.success) {
                    setProfileData(data.profileData);
                    setFormData({
                        fees: data.profileData.fees,
                        address: {
                            line1: data.profileData.address?.line1 || '',
                            line2: data.profileData.address?.line2 || ''
                        },
                        available: data.profileData.available
                    });
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error(err.message || 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };

        if (dToken) {
            getProfileData();
        }
    }, [dToken, backendUrl]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            // Handle nested address fields
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/update-profile`,
                formData, { headers: { dToken } }
            );

            if (data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);

                // Update profile data with new values
                setProfileData({
                    ...profileData,
                    ...formData
                });
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    if (loading && !profileData) {
        return (
            <div className="m-5 w-full flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return profileData && (
        <div className="m-5 w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium">Doctor Profile</h1>
                <button
                    onClick={toggleEditMode}
                    className={`px-4 py-2 rounded-lg text-white ${isEditing ? 'bg-gray-500' : 'bg-red-600'} transition-colors`}
                    disabled={loading}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Profile Header with Image */}
                <div className="relative h-40 bg-[url('https://wallpapercat.com/w/full/2/a/5/177433-3840x2160-desktop-4k-clouds-background-photo.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-green-500/80"></div>
                    <div className="absolute -bottom-16 left-6">
                        <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                            {profileData.image ? (
                                <img
                                    src={profileData.image}
                                    alt={profileData.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                    <User className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Body */}
                <div className="pt-20 px-6 pb-6">
                    {isEditing ? (
                        // Edit Form
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name - Read Only */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        disabled
                                    />
                                </div>

                                {/* Email - Read Only */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        disabled
                                    />
                                </div>

                                {/* Speciality - Read Only */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Speciality
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.speciality}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        disabled
                                    />
                                </div>

                                {/* Degree - Read Only */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Degree
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.degree}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        disabled
                                    />
                                </div>

                                {/* Experience - Read Only */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Experience
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.experience}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        disabled
                                    />
                                </div>

                                {/* Fees - Editable */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Consultation Fee ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="fees"
                                        value={formData.fees}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>

                                {/* Address Line 1 - Editable */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        name="address.line1"
                                        value={formData.address.line1}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>

                                {/* Address Line 2 - Editable */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="address.line2"
                                        value={formData.address.line2}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Availability - Editable */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="available"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                                        Available for Appointments
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // View Profile
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">{profileData.name}</h2>
                            <p className="text-lg text-primary mb-6">{profileData.speciality}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Mail className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-800">{profileData.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Award className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Degree</p>
                                            <p className="text-gray-800">{profileData.degree}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="text-gray-800">{profileData.experience}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Consultation Fee</p>
                                            <p className="text-gray-800">${profileData.fees}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="text-gray-800">
                                                {profileData.address?.line1}
                                                {profileData.address?.line2 && (
                                                    <>, {profileData.address.line2}</>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <Clipboard className="h-5 w-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Availability Status</p>
                                            <p className={`${profileData.available ? 'text-green-500' : 'text-red-500'} font-medium`}>
                                                {profileData.available ? 'Available' : 'Not Available'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;