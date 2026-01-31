import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, activeView, onViewChange, provider }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar
                activeView={activeView}
                onViewChange={onViewChange}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMenuClick={() => setIsMobileOpen(true)}
                    provider={provider}
                />

                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
