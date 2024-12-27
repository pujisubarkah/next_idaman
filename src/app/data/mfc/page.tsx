import React from 'react';

const MonitoringPage: React.FC = () => {
    const checklistItems = [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
    ];

    return (
        <div>
            <h1>Monitoring Checklist</h1>
            <ul>
                {checklistItems.map((item, index) => (
                    <li key={index}>
                        <label>
                            <input type="checkbox" />
                            {item}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MonitoringPage;