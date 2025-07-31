import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const accessToken = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const navigate = useNavigate();

    const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    if (!refreshToken || !accessToken) {
        alert("No valid tokens found. Please log in again.");
        localStorage.clear();
        navigate('/login');
        return;
    }
    try {
        const response = await fetch('http://localhost:8000/api/auth/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        if (response.ok) {
            localStorage.clear();
            navigate('/login');
            alert("Logout Successful");
        } else {
            const errorData = await response.json();
            console.error("Logout failed:", response.status, errorData);
            alert(`Logout Failed: ${errorData.detail || response.statusText}`);
        }
    } catch (error) {
        console.error("Error during logout:", error);
        alert("Error during logout: " + error.message);
    }
};

    return (
        <div className="bg-gray-100 rounded-md p-2 text-center">
            <nav className="text-2xl font-bold mb-2 text-pink-500">
                {accessToken ? (
                    <>
                        <Link to="/cash-drop" className="text-pink-500 m-3 p-3">Cash Drop</Link>
                        {isAdmin && (
                            <Link to="/dashboard" className="text-pink-500 m-3 p-3">Admin Dashboard</Link>
                        )}
                        <Link to="/cd-dashboard" className="text-pink-500 m-3 p-3">Cash Drop Dashboard</Link>
                        {isAdmin && (
                            <Link to="/register" className="text-pink-500 m-3 p-3">Register</Link>
                        )}
                        <button onClick={handleLogout} className="text-pink-500 m-3 p-3">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-pink-500 m-3 p-3">Login</Link>
                        <Link to="/cash-drop" className="text-pink-500 m-3 p-3">Cash Drop</Link>
                        <Link to="/cd-dashboard" className="text-pink-500 m-3 p-3">Cash Drop Dashboard</Link>
                    </>
                )}
            </nav>
        </div>
    );
}

export default Header;