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
import MenuIcon from "@mui/icons-material/Menu";
import logo from '../assets/images/logo-emsi.png';

const Sidebar = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Configuration des menus par rôle
  const menuSections = [
    {
      title: "GÉNÉRAL",
      items: [
        { icon: <DashboardIcon />, label: "Tableau de bord", path: "/admin/homeadmin", roles: ['ADMIN'] },
        { icon: <DashboardIcon />, label: "Tableau de bord", path: "/admin/homestudent", roles: ['STUDENT'] },
        { icon: <DashboardIcon />, label: "Tableau de bord", path: "/admin/homescolarite", roles: ['SCOLARITE'] }


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
        { icon: <GradeIcon />, label: "Notes", path: "/admin/grades", roles: ['ADMIN', 'SCOLARITE'] },
        { icon: <AssignmentIcon />, label: "Matières", path: "/admin/matiere", roles: ['ADMIN', 'SCOLARITE'] },
        { icon: <AssignmentIcon />, label: "Notes", path: "/admin/grades/${gradeId}", roles: ['STUDENT'] }

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
        { icon: <ExitToAppIcon />, label: "Déconnexion", path: "/admin/logout", roles: ['ADMIN', 'STUDENT', 'SCOLARITE'] }
      ]
    }
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={`
        ${isCollapsed ? 'w-20' : 'w-72'} 
        bg-white shadow-lg min-h-screen flex flex-col 
        transition-all duration-300 ease-in-out relative
        border-r border-gray-100
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <MenuIcon className={`text-gray-600 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <img
          src={logo}
          alt="EMSI Logo"
          className={`
            ${isCollapsed ? 'w-10' : 'w-40'}
            transition-all duration-300 object-contain
          `}
        />
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.items.some(item => item.roles.includes(userRole)) && (
              <>
                {!isCollapsed && (
                  <p className="text-xs font-bold text-gray-400 px-4 mb-2 uppercase tracking-wider">
                    {section.title}
                  </p>
                )}
                {section.items
                  .filter(item => item.roles.includes(userRole))
                  .map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className="block no-underline mb-1"
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div
                        className={`
                          flex items-center p-3 rounded-lg cursor-pointer 
                          transition-all duration-200
                          ${location.pathname === item.path
                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600'
                            : 'hover:bg-gray-50 text-gray-600 hover:text-emerald-600'}
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                      >
                        {React.cloneElement(item.icon, {
                          className: `${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} transition-colors duration-200
                            ${location.pathname === item.path ? 'text-emerald-600' : 'text-gray-400'}
                          `
                        })}
                        {!isCollapsed && (
                          <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
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
