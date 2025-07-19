import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CdDashboard() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [cashDrops, setCashDrops] = useState([]);
  const [cashDrawers, setCashDrawers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auth/users/me/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        const userData = await response.json();
        setIsAdmin(userData.is_admin);
        setLoading(false);
      } catch (err) {
        setError('Please log in to continue.');
        navigate('/login');
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchData = async () => {
    setError('');
    try {
      const [dropResponse, drawerResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/cash-drop-app1/cash-drop/?date=${selectedDate}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
        fetch(`http://localhost:8000/api/cash-drop-app1/cash-drawer/?date=${selectedDate}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }),
      ]);

      if (!dropResponse.ok || !drawerResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const dropData = await dropResponse.json();
      const drawerData = await drawerResponse.json();
      setCashDrops(dropData);
      setCashDrawers(drawerData);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 w-full max-w-6xl">
        <h2 className="text-4xl font-extrabold text-blue-600 dark:text-white text-center mb-10">
          Cash Drop Dashboard
        </h2>

        <div className="mb-8 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col">
              <label htmlFor="date" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Select Date:
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={fetchData}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Fetch Data
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-center">
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-6 border-b pb-3 border-blue-200 dark:border-gray-600">
              Cash Drops
            </h3>
            {cashDrops.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No cash drops found for {selectedDate}.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cashDrops.map((drop) => (
                  <div key={drop.id} className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md">
                    <p><strong>Workstation:</strong> {drop.workstation}</p>
                    <p><strong>Shift:</strong> {drop.shift_number}</p>
                    <p><strong>Employee:</strong> {drop.user_name}</p>
                    <p><strong>Drop Amount:</strong> ${drop.drop_amount}</p>
                    <p><strong>Denominations:</strong></p>
                    <ul className="list-disc pl-5">
                      {Object.entries(drop).map(([key, value]) => (
                        ['hundreds', 'fifties', 'twenties', 'tens', 'fives', 'twos', 'ones', 'half_dollars', 'quarters', 'dimes', 'nickels', 'pennies'].includes(key) && value > 0 && (
                          <li key={key}>{key.replace('_', ' ')}: {value}</li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-6 border-b pb-3 border-green-200 dark:border-gray-600">
              Cash Drawers
            </h3>
            {cashDrawers.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No cash drawers found for {selectedDate}.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cashDrawers.map((drawer) => (
                  <div key={drawer.id} className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg shadow-md">
                    <p><strong>Workstation:</strong> {drawer.workstation}</p>
                    <p><strong>Shift:</strong> {drawer.shift_number}</p>
                    <p><strong>Employee:</strong> {drawer.user_name}</p>
                    <p><strong>Starting Cash:</strong> ${drawer.starting_cash}</p>
                    <p><strong>Total Cash:</strong> ${drawer.total_cash}</p>
                    <p><strong>Denominations:</strong></p>
                    <ul className="list-disc pl-5">
                      {Object.entries(drawer).map(([key, value]) => (
                        ['hundreds', 'fifties', 'twenties', 'tens', 'fives', 'twos', 'ones', 'half_dollars', 'quarters', 'dimes', 'nickels', 'pennies'].includes(key) && value > 0 && (
                          <li key={key}>{key.replace('_', ' ')}: {value}</li>
                        )
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CdDashboard;