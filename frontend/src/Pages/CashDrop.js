import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CashDrop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    shiftNumber: '',
    workStation: '',
    date: new Date().toISOString().slice(0, 10),
    startingCash: '200.00',
    pennies: 0,
    nickels: 0,
    dimes: 0,
    quarters: 0,
    halfDollars: 0,
    ones: 0,
    twos: 0,
    fives: 0,
    tens: 0,
    twenties: 0,
    fifties: 0,
    hundreds: 0,
  });
  const [cashDropDenominations, setCashDropDenominations] = useState(null);
  const [remainingCashInDrawer, setRemainingCashInDrawer] = useState(null);
  const [denominationsError, setDenominationsError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const DENOMINATION_CONFIG = [
    { name: 'Hundreds', value: 100, field: 'hundreds' },
    { name: 'Fifties', value: 50, field: 'fifties' },
    { name: 'Twenties', value: 20, field: 'twenties' },
    { name: 'Tens', value: 10, field: 'tens' },
    { name: 'Fives', value: 5, field: 'fives' },
    { name: 'Twos', value: 2, field: 'twos' },
    { name: 'Ones', value: 1, field: 'ones' },
    { name: 'Half Dollars', value: 0.50, field: 'halfDollars' },
    { name: 'Quarters', value: 0.25, field: 'quarters' },
    { name: 'Dimes', value: 0.10, field: 'dimes' },
    { name: 'Nickels', value: 0.05, field: 'nickels' },
    { name: 'Pennies', value: 0.01, field: 'pennies' },
  ];

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
        setFormData((prev) => ({
          ...prev,
          employeeName: userData.name,
          startingCash: userData.is_admin ? '' : '200.00',
        }));
        setIsAdmin(userData.is_admin);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Please log in to continue.');
        navigate('/login');
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
    setCashDropDenominations(null);
    setRemainingCashInDrawer(null);
    setDenominationsError('');
  };

  const calculateTotalCash = () => {
    let total = 0;
    DENOMINATION_CONFIG.forEach(denom => {
      total += (formData[denom.field] || 0) * denom.value;
    });
    return total.toFixed(2);
  };

  const calculateCashDropAmount = () => {
    const totalCash = parseFloat(calculateTotalCash());
    const startingCash = parseFloat(formData.startingCash) || 0;
    const dropAmount = totalCash - startingCash;
    return dropAmount.toFixed(2);
  };

  const calculateDenominationsTotal = (denominationsObject) => {
    let total = 0;
    if (denominationsObject) {
      DENOMINATION_CONFIG.forEach(denom => {
        total += (denominationsObject[denom.field] || 0) * denom.value;
      });
    }
    return total.toFixed(2);
  };

  const calculateDenominations = () => {
    const amountToDrop = parseFloat(calculateCashDropAmount());
    if (isNaN(amountToDrop) || amountToDrop <= 0) {
      setDenominationsError("Please ensure a valid positive cash drop amount is calculated.");
      setCashDropDenominations(null);
      setRemainingCashInDrawer(null);
      return;
    }

    const currentDrawer = {};
    DENOMINATION_CONFIG.forEach(denom => {
      currentDrawer[denom.field] = formData[denom.field] || 0;
    });

    let remainingDropAmount = Math.round(amountToDrop * 100);
    const dropBreakdown = {};
    const finalDrawerRemaining = {};

    DENOMINATION_CONFIG.forEach(denom => {
      const denomValueCents = Math.round(denom.value * 100);
      const availableCount = currentDrawer[denom.field];
      let countForDrop = 0;

      if (denomValueCents > 0 && remainingDropAmount >= denomValueCents) {
        const neededCount = Math.floor(remainingDropAmount / denomValueCents);
        countForDrop = Math.min(neededCount, availableCount);
        remainingDropAmount -= countForDrop * denomValueCents;
      }

      dropBreakdown[denom.field] = countForDrop;
      finalDrawerRemaining[denom.field] = availableCount - countForDrop;
    });

    if (remainingDropAmount > 0) {
      setDenominationsError(
        `Cannot make exact change for $${(remainingDropAmount / 100).toFixed(2)}. 
        Variance: $${(remainingDropAmount / 100).toFixed(2)}.`
      );
      setCashDropDenominations(null);
      setRemainingCashInDrawer(null);
    } else {
      setDenominationsError('');
      setCashDropDenominations(dropBreakdown);
      setRemainingCashInDrawer(finalDrawerRemaining);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.shiftNumber || !formData.workStation || !formData.date || !formData.startingCash) {
      alert("Please fill in all Cashier Details before submitting.");
      return;
    }
    if (!cashDropDenominations || denominationsError) {
      alert("Please calculate cash drop denominations first and resolve any errors.");
      return;
    }

    const totalCash = calculateTotalCash();
    const dropAmount = calculateCashDropAmount();

    const drawerData = {
      workstation: formData.workStation,
      shift_number: formData.shiftNumber,
      date: formData.date,
      starting_cash: parseFloat(formData.startingCash),
      hundreds: formData.hundreds,
      fifties: formData.fifties,
      twenties: formData.twenties,
      tens: formData.tens,
      fives: formData.fives,
      twos: formData.twos,
      ones: formData.ones,
      half_dollars: formData.halfDollars,
      quarters: formData.quarters,
      dimes: formData.dimes,
      nickels: formData.nickels,
      pennies: formData.pennies,
      total_cash: parseFloat(totalCash),
    };

    const cashDropData = {
      workstation: formData.workStation,
      shift_number: formData.shiftNumber,
      date: formData.date,
      drop_amount: parseFloat(dropAmount),
      hundreds: cashDropDenominations.hundreds,
      fifties: cashDropDenominations.fifties,
      twenties: cashDropDenominations.twenties,
      tens: cashDropDenominations.tens,
      fives: cashDropDenominations.fives,
      twos: cashDropDenominations.twos,
      ones: cashDropDenominations.ones,
      half_dollars: cashDropDenominations.halfDollars,
      quarters: cashDropDenominations.quarters,
      dimes: cashDropDenominations.dimes,
      nickels: cashDropDenominations.nickels,
      pennies: cashDropDenominations.pennies,
    };

    try {
      const drawerResponse = await fetch('http://localhost:8000/api/cash-drop-app1/cash-drawer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(drawerData),
      });

      if (!drawerResponse.ok) {
        const errorData = await drawerResponse.json();
        throw new Error(`Failed to save drawer data: ${JSON.stringify(errorData)}`);
      }

      const drawerResult = await drawerResponse.json();

      const cashDropResponse = await fetch('http://localhost:8000/api/cash-drop-app1/cash-drop/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ ...cashDropData, drawer_entry: drawerResult.id }),
      });

      if (!cashDropResponse.ok) {
        const errorData = await cashDropResponse.json();
        throw new Error(`Failed to save cash drop data: ${JSON.stringify(errorData)}`);
      }

      alert('Cash drop details and drawer denominations saved successfully!');
      navigate('/cd-dashboard');
    } catch (error) {
      console.error('Error saving data:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 w-full max-w-6xl">
        <h2 className="text-4xl font-extrabold text-pink-600 dark:text-white text-center mb-10">
          CashDrop Terminal
        </h2>

        <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 dark:text-blue-200 mb-6 border-b pb-3 border-blue-200 dark:border-gray-600">
            Cashier Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-4 gap-x-6">
            <div className="flex flex-col">
              <label htmlFor="employeeName" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Employee Name:
              </label>
              <input
                id="employeeName"
                type="text"
                name="employeeName"
                value={formData.employeeName}
                readOnly
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="shiftNumber" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Shift Number:
              </label>
              <input
                id="shiftNumber"
                type="text"
                name="shiftNumber"
                value={formData.shiftNumber}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., S123"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="workStation" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Workstation:
              </label>
              <input
                id="workStation"
                type="text"
                name="workStation"
                value={formData.workStation}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., WS01"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="date" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Date:
              </label>
              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="startingCash" className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                Starting Cash ($):
              </label>
              <input
                id="startingCash"
                type="number"
                name="startingCash"
                value={formData.startingCash}
                onChange={handleChange}
                readOnly={!isAdmin}
                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${!isAdmin ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                placeholder="200.00"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
          <div className="flex-1 bg-green-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-6 border-b pb-3 border-green-200 dark:border-gray-600">
              Cash Drawer Details (Enter All Cash)
            </h3>
            <div className="grid grid-cols-1 gap-y-3 gap-x-6">
              {DENOMINATION_CONFIG.map((denom) => (
                <div key={denom.field} className="flex items-center justify-between">
                  <label htmlFor={denom.field} className="text-gray-700 dark:text-gray-300">
                    {denom.name}:
                  </label>
                  <input
                    id={denom.field}
                    type="number"
                    name={denom.field}
                    value={formData[denom.field]}
                    onChange={handleChange}
                    className="w-24 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                Total Cash in Drawer: <span className="text-blue-600 dark:text-blue-400">${calculateTotalCash()}</span>
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                Calculated Cash Drop: <span className="text-green-600 dark:text-green-400">${calculateCashDropAmount()}</span>
              </p>
            </div>
          </div>

          {(cashDropDenominations && !denominationsError) && (
            <>
              <div className="flex-1 bg-purple-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-purple-800 dark:text-purple-200 mb-6 border-b pb-3 border-purple-200 dark:border-gray-600 text-center">
                  Cash Drop Denominations
                </h3>
                <div className="grid grid-cols-1 gap-y-3 gap-x-6">
                  {DENOMINATION_CONFIG.map((denom) => {
                    const count = cashDropDenominations[denom.field];
                    if (count > 0) {
                      return (
                        <div key={denom.field} className="flex items-center justify-between p-2 bg-purple-100 dark:bg-gray-800 rounded-md shadow-sm">
                          <span className="text-gray-800 dark:text-gray-200 font-medium">{denom.name}:</span>
                          <span className="text-purple-700 dark:text-purple-300 font-bold text-lg">{count}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600 text-right">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    Total Drop: <span className="text-purple-600 dark:text-purple-400">${calculateDenominationsTotal(cashDropDenominations)}</span>
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-yellow-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-yellow-800 dark:text-yellow-200 mb-6 border-b pb-3 border-yellow-200 dark:border-gray-600 text-center">
                  Remaining Cash in Drawer
                </h3>
                <div className="grid grid-cols-1 gap-y-3 gap-x-6">
                  {DENOMINATION_CONFIG.map((denom) => {
                    const count = remainingCashInDrawer[denom.field];
                    return (
                      <div key={`remaining-${denom.field}`} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{denom.name}:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-600 text-right">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    Total Remaining: <span className="text-yellow-600 dark:text-yellow-400">${calculateDenominationsTotal(remainingCashInDrawer)}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-10 text-center flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={calculateDenominations}
            className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 dark:focus:ring-pink-800"
          >
            Get Cash Drop Denominations
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            Submit Cash Drop
          </button>
        </div>

        {denominationsError && (
          <div className="mt-8 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md text-center">
            <p className="font-semibold mb-2">Error calculating denominations:</p>
            <p>{denominationsError}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CashDrop;