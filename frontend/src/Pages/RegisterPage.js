import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

function RegisterPage() {

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        try {
            if (token) { 
              console.log("User is logged in.");
            }
            else{
                alert("You are not logged in. Please log in to Register New Users.");
            }
        } catch (error) {
            console.error("Error checking login status:", error);
        }
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [secret, setSecret] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [message, setMessage] = useState("");
    const isLoggedIn = !!localStorage.getItem('access_token');
    const isAdminUser = localStorage.getItem('is_admin') === 'true';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/auth/users/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ name, email, isAdmin }),
            });
            const data = await response.json();
            if (response.ok) {
                setSecret(data.secret);
                setQrCode(data.qr_code);
                setMessage("Scan the QR code with Google Authenticator or type the secret code in Google Authenticator.");
            } else {
                setMessage(data.error || "Registration failed.");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    if (!isLoggedIn || !isAdminUser) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="">
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="mr-2 w-8 h-8" src="https://cdn.shortpixel.ai/spai2/q_lossless+w_257+to_webp+ret_img/assets.simpleviewinc.com/simpleview/image/upload/crm/santamonica/menchies-logo_ECB7D9CC-C8AC-F5BB-F5AFDAC11380689A-ecb7d95606c6631_ecb7dbfb-cc16-c67e-d50f0c45af37ba21.png" alt="Menchies Logo" />
                        Menchies Escondido
                    </Link>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create an account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Your Name"
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="test@example.com"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="admin_access" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Admin</label>
                                    <input
                                        type="checkbox"
                                        id="admin_access"
                                        name="admin_access"
                                        className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Create New User Account
                                </button>
                            </form>
                            {qrCode && (
                                <div className="mt-4 text-center">
                                    <p>{message}</p>
                                    <p className="mt-2 font-mono text-sm">Secret: {secret}</p>
                                    <img src={qrCode} alt="QR Code" className="mx-auto mt-2" />
                                </div>
                            )}
                            {message && !qrCode && <p className="mt-4 text-red-500">{message}</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default RegisterPage;