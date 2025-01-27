import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import GradeIcon from "@mui/icons-material/Grade";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/SettingsApplications";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import logo from '../assets/images/logo-emsi.png';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuSections = [
    {
      title: "GÉNÉRAL",
      items: [
        { icon: <DashboardIcon />, label: "Tableau de bord", path: "/admin/dashboard" }
      ]
    },
    {
      title: "GESTION",
      items: [
        { icon: <PeopleIcon />, label: "Étudiants", path: "/admin/etudiants" },
        { icon: <ClassIcon />, label: "Classes", path: "/admin/classes" },
        { icon: <SchoolIcon />, label: "Filières", path: "/majors" }
      ]
    },
    {
      title: "ACADÉMIQUE",
      items: [
        { icon: <GradeIcon />, label: "Notes", path: "/grades" },
        { icon: <AssignmentIcon />, label: "Matières", path: "/subjects" }
      ]
    },
    {
      title: "PARAMÈTRES",
      items: [
        { icon: <SettingsIcon />, label: "Configuration", path: "/settings" }
      ]
    },
    {
      title: "COMPTE",
      items: [
        { icon: <AccountCircleOutlinedIcon />, label: "Profil", path: "/profile" },
        { icon: <ExitToAppIcon />, label: "Déconnexion", path: "/logout" }
      ]
    }
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div 
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'} 
        border-r border-gray-200 min-h-screen bg-white flex flex-col 
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Logo Section */}
      <div 
        className="h-20 flex items-center justify-center border-b border-gray-200 cursor-pointer"
        onClick={toggleSidebar}
      >
        <img 
          src={logo}
          alt="Logo" 
          className="h-12 w-auto object-contain" 
        />
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto py-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-2">
            {!isCollapsed && (
              <p className="text-xs font-bold text-gray-500 px-4 mb-1">
                {section.title}
              </p>
            )}
            {section.items.map((item, itemIndex) => (
              <Link 
                key={itemIndex} 
                to={item.path} 
                className="block no-underline"
                title={isCollapsed ? item.label : undefined}
              >
                <div 
                  className={`
                    flex items-center p-2 mx-2 rounded-lg cursor-pointer 
                    ${location.pathname === item.path 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-50 text-gray-600 hover:text-blue-600'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {React.cloneElement(item.icon, { 
                    className: `${isCollapsed ? 'mr-0' : 'mr-3'} ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'}` 
                  })}
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;