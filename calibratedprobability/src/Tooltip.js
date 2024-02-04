import React, { useState } from 'react';
import { MdOutlineTipsAndUpdates } from "react-icons/md";


const Tooltip = ({ message }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative flex items-center">
            <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            >
            <MdOutlineTipsAndUpdates className="w-6 h-6 text-gray-500 cursor-pointer" />
            </div>
            {showTooltip && (
            <div className="absolute z-10 w-64 p-2 bg-white border rounded shadow-lg left-10 top-0">
                {message}
            </div>
            )}
        </div>
    );
};

export default Tooltip;