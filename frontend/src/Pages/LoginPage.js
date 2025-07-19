import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [totp, setTotp] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, totp_code: totp }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('is_admin', data.is_admin);
                setMessage("Login successful!");
                navigate(data.is_admin ? '/dashboard' : '/cd-dashboard');
            } else {
                setMessage(data.error || "Login failed.");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    return (
        <div className="login-page">
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="mr-2 w-8 h-8" src="https://cdn.shortpixel.ai/spai2/q_lossless+w_257+to_webp+ret_img/assets.simpleviewinc.com/simpleview/image/upload/crm/santamonica/menchies-logo_ECB7D9CC-C8AC-F5BB-F5AFDAC11380689A-ecb7d95606c6631_ecb7dbfb-cc16-c67e-d50f0c45af37ba21.png" alt="Menchies Logo" />
                        Menchies Escondido
                    </Link>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Login to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="test@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="totp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google Authenticator Code</label>
                                    <input
                                        type="text"
                                        id="totp"
                                        value={totp}
                                        onChange={(e) => setTotp(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Login
                                </button>
                            </form>
                            {message && <p className="mt-4 text-center text-red-500">{message}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;