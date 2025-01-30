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

const Sidebar = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Configuration des menus par rôle
  const menuSections = [
    {
      title: "GÉNÉRAL",
      items: [
        { icon: <DashboardIcon />, label: "Tableau de bord", path: "/admin/dashboard", roles: ['ADMIN'] }
      ]
    },
    {
      title: "GESTION",
      items: [
        { icon: <PeopleIcon />, label: "Étudiants", path: "/admin/etudiants", roles: ['ADMIN', 'SCOLARITE'] },

      ]
    },
    {
      title: "ACADÉMIQUE",
      items: [
        { icon: <GradeIcon />, label: "Notes", path: "/admin/grades", roles: ['ADMIN', 'STUDENT', 'SCOLARITE'] },
        { icon: <AssignmentIcon />, label: "Matières", path: "/admin/matiere", roles: ['ADMIN', 'SCOLARITE'] }
      ]
    },
    {
      title: "PARAMÈTRES",
      items: [
        { icon: <SettingsIcon />, label: "Users Manage", path: "/admin/users", roles: ['ADMIN'] }
      ]
    },
    {
      title: "COMPTE",
      items: [
        { icon: <AccountCircleOutlinedIcon />, label: "Profil", path: "/admin/profile", roles: ['ADMIN', 'STUDENT'] },
        { icon: <ExitToAppIcon />, label: "Déconnexion", path: "/admin/logout", roles: ['ADMIN', 'STUDENT'] }
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
            {/* Afficher les sections uniquement si elles contiennent des items visibles pour le rôle */}
            {console.log("User Role:", userRole)}
            {section.items.some(item => item.roles.includes(userRole)) && (
              <>

                {!isCollapsed && (
                  <p className="text-xs font-bold text-gray-500 px-4 mb-1">
                    {section.title}
                  </p>
                )}
                {section.items
                  .filter(item => item.roles.includes(userRole)) // Filtrer selon le rôle
                  .map((item, itemIndex) => (
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
