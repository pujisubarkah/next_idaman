"use client";
import React from "react";
import { Sidebar } from "flowbite-react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import Dropdown from "./dropdown";
import { sidebarData } from "./datasidebar";


const CustomSidebar = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Router>
  
      
      <div className="flex">
        {/* Sidebar component */}
        <Sidebar aria-label="Sidebar with content separator" className="w-64">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              {sidebarData.map((item, index) =>
                item.dropdown ? (
                  <Dropdown
                    key={index}
                    label={item.label}
                    icon={item.icon}
                    children={item.children} // Pass children to Dropdown
                  />
                ) : (
                  <Sidebar.Item
                    key={index}
                    as={Link}
                    to={item.to}
                    icon={item.icon}
                    className="hover:bg-white hover:text-teal-500 hover:border-teal-500 border border-transparent"
                  >
                    {item.label}
                  </Sidebar.Item>
                )
              )}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>

        {/* Add content area here */}
        <div className="flex-1 p-4">
          {/* Content goes here */}
        </div>
      </div>
    </Router>
  );
};

export default CustomSidebar;
