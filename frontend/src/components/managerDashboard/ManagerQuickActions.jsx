import React from "react";
import { Link } from "react-router-dom";

const ManagerQuickActions = () => {
  const quickActions = [
    {
      title: "Manage Stylists",
      description: "Create, edit, and manage stylists in your salon",
      link: "/manager/stylists",
      icon: (
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      bgColor: "bg-blue-100",
      buttonText: "Go to Stylist Management",
    },
    {
      title: "Day Off Requests",
      description: "Review and approve stylist leave requests",
      link: "/manager/dayoff",
      icon: (
        <svg
          className="w-5 h-5 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: "bg-yellow-100",
      buttonText: "Review Requests",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600">Commonly used manager functions</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <Link
                  to={action.link}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                >
                  {action.buttonText} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerQuickActions;
