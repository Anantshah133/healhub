const AvailabilityBadge = ({ isAvailable }) => {
    return (
        <div className={`inline-flex items-center px-3 py-1 my-3 rounded-full text-sm font-medium ${isAvailable 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            <div className={`h-2 w-2 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
            {isAvailable ? 'Available' : 'Unavailable'}
        </div>
    );
};

export default AvailabilityBadge;