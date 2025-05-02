import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const { token, setToken, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (state == "Sign Up") {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, password, email });

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { password, email });

                if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token])

    return (
        <form action="" onSubmit={handleSubmit} className="min-h-[80vh] flex items-center ">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
                <p className="text-2xl text-gray-800 font-semibold">{state === "Sign Up" ? 'Create Account' : 'Login'}</p>
                <p>Please {state === "Sign Up" ? 'Sign Up' : 'Login'} to book appointment</p>

                {
                    state === "Sign Up" && <div className="w-full">
                        <p>Full Name : </p>
                        <input className="border border-[#DADADA] rounded w-full p-2 mt-1"
                            onChange={(e) => setName(e.target.value)} type="text" required value={name} />
                    </div>
                }
                <div className="w-full">
                    <p>Email : </p>
                    <input className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email"
                        onChange={(e) => setEmail(e.target.value)} required value={email} />
                </div>
                <div className="w-full">
                    <p>Password : </p>
                    <input className="border border-[#DADADA] rounded w-full p-2 mt-1" onChange={(e) => setPassword(e.target.value)} type="password" required value={password} />
                </div>

                <button type="submit" className="bg-primary text-white w-full py-2 my-2 rounded-md text-base">
                    {state === "Sign Up" ? 'Create Account' : 'Login'}
                </button>

                {
                    state === "Sign Up"
                        ? <p>
                            Already have an account ?
                            <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer"> Login here</span>
                        </p>
                        : <p>
                            Dont Have an Account ?
                            <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer"> Create New</span>
                        </p>
                }
            </div>
        </form>
    )
}

export default Login