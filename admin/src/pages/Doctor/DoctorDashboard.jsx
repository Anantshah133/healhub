import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext';
import { useEffect } from 'react';

const DoctorDashboard = () => {

    const { dToken, dashData, setDashData, getDashData } = useContext(DoctorContext);

    useEffect(() => {
        if(dToken){
            getDashData();
        }
    }, [dToken]);

    return dashData && (
        <div>
            
        </div>
    )
}

export default DoctorDashboard