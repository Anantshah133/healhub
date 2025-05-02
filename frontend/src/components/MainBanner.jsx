import { assets } from "../assets/assets"

const MainBanner = () => {
    return (
        <div className="flex flex-col lg:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
            {/* ------- Left Side ------ */}
            <div className="lg:w-1/2 flex flex-col items-start justify-center gap-8 py-10 m-auto lg:py-[10vw] lg:mb-[-30px]">
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-[3.5rem]">Book Appointment <br /> With Trusted Doctors</h1>
                <div className="flex flex-col lg:flex-row items-center gap-3 text-white text-sm font-light">
                    <img src={assets.group_profiles} alt="" />
                    <p>Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block" />
                    schedule your appointment hassle-free.</p>
                </div>
                <a href="#speciality" className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto lg:m-0 hover:translate-y-[-5px] transition-all duration-300">
                    Book Appointment <img className="w-3" src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* ------- Right Side ------ */}
            <div className="lg:w-1/2 relative">
                <img src={assets.header_img} alt="banner" className="w-full lg:absolute bottom-0 h-auto rounded-lg" />
            </div>
        </div>
    )
}

export default MainBanner