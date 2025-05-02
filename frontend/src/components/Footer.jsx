import React from 'react'
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className='pt-32 pb-10 my-2 md:mx-10'>
            <div className='flex md:flex-row flex-col flex-wrap mb-5'>
                <div className='md:w-6/12'>
                    <div className=' pr-10'>
                        <img className='w-52' src={assets.logo} alt="logo" />
                        <p className='text-gray-600 md:text-base text-sm mt-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                    </div>
                </div>
                <div className='md:w-3/12'>
                    <h3 className='text-xl font-semibold md:mb-5 mb-3 mt-10 text-gray-600'>Company</h3>
                    <ul className='text-gray-600 flex flex-col gap-2 text-base'>
                        <li className='hover:text-black cursor-pointer'>
                            <Link to={'/'}>Home</Link>
                        </li>
                        <li className='hover:text-black cursor-pointer'>
                            <Link to={'/about'}>About</Link>
                        </li>
                        <li className='hover:text-black cursor-pointer'>
                            <Link to={'/contact'}>Contact Us</Link>
                        </li>
                        <li className='hover:text-black cursor-pointer'>
                            <Link to={'/'}>Privacy Policy</Link>
                        </li>
                    </ul>
                </div>
                <div className='md:w-3/12'>
                    <h3 className='text-xl font-semibold md:mb-5 mb-3 mt-10 text-gray-600'>Get In Touch</h3>
                    <ul className='text-gray-600 flex flex-col gap-2 text-base'>
                        <li className='hover:text-black cursor-pointer'>
                            <a href="tel:+919924590125">
                                +91 99245 90125
                            </a>
                        </li>
                        <li className='hover:text-black cursor-pointer'>
                            <a href="mailto:dev.anantshah@gmail.com">
                                dev.anantshah@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <hr />

            <p className='mt-5 text-center text-gray-800'>Copyright © {new Date().getFullYear()} Anant Shah - All Right Reserved.</p>
        </footer>
    )
}

export default Footer;