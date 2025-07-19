import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

// Main Dashboard Component
const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

    const fetchUsers = async () => {
        if (isLoggedIn && isAdmin) {
            const accessToken = localStorage.getItem('access_token');
            try {
                const response = await fetch('http://localhost:8000/api/auth/users/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users:", response.status, response.statusText);
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('is_admin');
                        setIsLoggedIn(false);
                        setIsAdmin(false);
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [isLoggedIn, isAdmin]);

    const handleEdit = (user) => {
        setCurrentUserToEdit(user);
        setShowEditModal(true);
    };

    const handleUpdateUser = async (userId, formData) => {
        const accessToken = localStorage.getItem('access_token');
        try {
            const response = await fetch(`http://localhost:8000/api/auth/users/${userId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("User updated successfully!");
                setShowEditModal(false);
                setCurrentUserToEdit(null);
                fetchUsers();
            } else {
                const errorData = await response.json();
                alert(`Failed to update user: ${errorData.detail || JSON.stringify(errorData)}`);
                console.error("Update failed:", response.status, response.statusText, errorData);
            }
        } catch (error) {
            console.error("Error during update operation:", error);
            alert("An error occurred during update.");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        const accessToken = localStorage.getItem('access_token');
        try {
            const response = await fetch(`http://localhost:8000/api/auth/users/${userId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                alert("User deleted successfully!");
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            } else {
                const errorData = await response.json();
                alert(`Failed to delete user: ${errorData.detail || JSON.stringify(errorData)}`);
                console.error("Delete failed:", response.status, response.statusText, errorData);
            }
        } catch (error) {
            console.error("Error during delete operation:", error);
            alert("An error occurred during deletion.");
        }
    };

    if (!isLoggedIn || !isAdmin) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard - All Users</h2>

            <div className="mb-4">
                <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    Add New User
                </Link>
            </div>

            {users.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No users found or you are not authorized to view this page.</p>
            )}

            {showEditModal && currentUserToEdit && (
                <EditUserModal
                    user={currentUserToEdit}
                    onClose={() => {
                        setShowEditModal(false);
                        setCurrentUserToEdit(null);
                    }}
                    onSave={handleUpdateUser}
                />
            )}
        </div>
    );
};


// Component for the Edit User Modal/Form
const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(user.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit User: {user.name}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                        />
                    </div>
                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="is_admin"
                            name="is_admin"
                            checked={formData.is_admin}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                        <label htmlFor="is_admin" className="text-gray-700 text-sm font-bold">Is Admin</label>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;