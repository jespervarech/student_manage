// src/components/Navbar.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import de useLocation
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    InputBase,
    Badge,
    Menu,
    MenuItem,
    Avatar,
} from "@mui/material";
import {
    Search as SearchIcon,
    Language as LanguageIcon,
    FullscreenExit as FullscreenExitIcon,
    Notifications as NotificationsIcon,
    Chat as ChatIcon,
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null); // Pour le menu du profil
    const location = useLocation(); // Récupère l'emplacement actuel

    // Gestion du menu du profil
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Fonction pour déterminer le titre en fonction de l'emplacement
    const getPageTitle = () => {
        switch (location.pathname) {
            case "/admin/dashboard":
                return "Dashboard";
            case "/admin/etudiants":
                return "Étudiants";
            case "/admin/notes":
                return "Notes";
            case "/admin/cours":
                return "Cours";
            case "/admin/parametres":
                return "Paramètres";
            default:
                return "Gestion des Étudiants"; // Titre par défaut
        }
    };

    return (
        <AppBar position="static" color="white" elevation={1}>
            <Toolbar>
                {/* Titre dynamique en fonction de la page */}
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    {getPageTitle()}
                </Typography>

                {/* Icônes et actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Langue */}
                    <IconButton color="inherit">
                        <LanguageIcon />
                    </IconButton>

                    {/* Plein écran */}
                    <IconButton color="inherit">
                        <FullscreenExitIcon />
                    </IconButton>

                    {/* Notifications */}
                    <IconButton color="inherit">
                        <Badge badgeContent={1} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    {/* Messages */}
                    <IconButton color="inherit">
                        <Badge badgeContent={2} color="error">
                            <ChatIcon />
                        </Badge>
                    </IconButton>

                    {/* Menu du profil */}
                    <IconButton onClick={handleMenuOpen} color="inherit">
                        <Avatar
                            src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt="Profile"
                            style={{ width: "32px", height: "32px" }}
                        />
                    </IconButton>

                    {/* Menu déroulant du profil */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <AccountCircleIcon style={{ marginRight: "8px" }} />
                            Voir le profil
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <SettingsIcon style={{ marginRight: "8px" }} />
                            Modifier le profil
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <ExitToAppIcon style={{ marginRight: "8px" }} />
                            Se déconnecter
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;