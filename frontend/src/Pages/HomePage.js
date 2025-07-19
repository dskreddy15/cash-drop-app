import React from "react";

function Homepage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Welcome to Menchies Escondido</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center">This is the main page of our cash drop application.</p>
            </div>
        </div>
    );
}

export default Homepage;