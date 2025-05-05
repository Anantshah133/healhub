import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const { token, setToken, userData } = useContext(AppContext);

    const logOut = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <div>
            <header className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
                <div className="logo">
                    <Link to={'/'}>
                        <img className="w-44 cursor-pointer" src={assets.logo} alt={"Logo"} />
                    </Link>
                </div>
                <ul className="hidden md:flex items-start gap-5 font-medium">
                    <NavLink to={'/'}>
                        <li className="py-1">
                            HOME
                            <hr className="border-none outline-none h-0.5 bg-primary w/3 m-auto hidden" />
                        </li>
                    </NavLink>
                    <NavLink to={'/doctors'}>
                        <li className="py-1">
                            ALL DOCTORS
                            <hr className="border-none outline-none h-0.5 bg-primary w/3 m-auto hidden" />
                        </li>
                    </NavLink>
                    <NavLink to={'/about'}>
                        <li className="py-1">
                            ABOUT
                            <hr className="border-none outline-none h-0.5 bg-primary w/3 m-auto hidden" />
                        </li>
                    </NavLink>
                    <NavLink to={'/contact'}>
                        <li className="py-1">
                            CONTACT
                            <hr className="border-none outline-none h-0.5 bg-primary w/3 m-auto hidden" />
                        </li>
                    </NavLink>
                    <a href="http://localhost:5174/" target="_blank">
                        <li className="border px-5 text-xs py-1.5 rounded-full">
                            Admin Panel
                        </li>
                    </a>
                </ul>
                <div className="flex items-center gap-4">
                    {
                        token && userData
                        ? <div className="flex items-center gap-2 cursor-pointer group relative">
                            <img className="w-8 rounded-full" src={userData.image} alt="" />
                            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            
                            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                                    <p onClick={()=>navigate('my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                    <p onClick={()=>navigate('my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                                    <p onClick={logOut} className="hover:text-black cursor-pointer">Logout</p>
                                </div>
                            </div>
                        </div> 
                        : <button className="bg-primary text-white px-8 py-3 rounded-full font-light md:block hidden" onClick={()=>navigate('/login')}>Create Account</button>
                    }
                    <img onClick={()=>setShowMenu(true)} src={assets.menu_icon} alt="Menu" className="w-6 md:hidden cursor-pointer" />
                </div>
            </header>
            {/*--------------Mobile-Menu--------------*/}
            <div className={`${showMenu ? "fixed w-full right-0 top-0 bottom-0" : "h-0 w-0"} md:hidden z-20 overflow-hidden bg-white transition-all duration-300`}>
                <div className="flex items-center justify-between px-5 py-6">
                    <img className="w-36" src={assets.logo} alt="" />
                    <img className="w-7" onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className="flex flex-col gap-2 mt-5 px-5 text-lg font-medium">
                    <NavLink onClick={()=>{
                        setShowMenu(false);
                        scrollTo(0, 0)
                    }} to='/' className="px-4 py-2 rounded inline-block">
                        <p>Home</p>
                    </NavLink>
                    <NavLink onClick={()=>{
                        setShowMenu(false);
                        scrollTo(0, 0)
                    }} to='/doctors' className="px-4 py-2 rounded inline-block">
                        <p>All Doctors</p>
                    </NavLink>
                    <NavLink onClick={()=>{
                        setShowMenu(false);
                        scrollTo(0, 0)
                    }} to='/about' className="px-4 py-2 rounded inline-block">
                        <p>About</p>
                    </NavLink>
                    <NavLink onClick={()=>{
                        setShowMenu(false);
                        scrollTo(0, 0)
                    }} to='/contact' className="px-4 py-2 rounded inline-block">
                        <p>Contact</p>
                    </NavLink>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;