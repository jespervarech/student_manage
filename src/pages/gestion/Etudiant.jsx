import React, { useState, useEffect } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    IconButton,
    Snackbar,
    Alert,
    InputAdornment,
    Menu,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const Etudiant = () => {
    // États de base
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour la pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // État pour le formulaire
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        phone: "",
        grade_id: "",
    });

    // États pour la recherche et les filtres
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        firstName: true,
        lastName: true,
        email: true,
        age: false,
    });

    // Chargement initial des données
    useEffect(() => {
        fetchStudents();
    }, []);

    // Fonction pour charger les étudiants
    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/students");
            if (!response.ok) throw new Error("Erreur de chargement");
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Gestion des changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingStudent 
                ? `http://localhost:8010/api/students/${editingStudent._id}`
                : "http://localhost:8010/api/students";

            const method = editingStudent ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) throw new Error();
            
            await fetchStudents();
            setFormValues({
                firstName: "",
                lastName: "",
                age: "",
                email: "",
                phone: "",
                grade_id: "",
            });
            setEditingStudent(null);
            setIsFormOpen(false);
        } catch (err) {
            setError("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    // Suppression d'un étudiant
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ?")) return;
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8010/api/students/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error();
            await fetchStudents();
        } catch (err) {
            setError("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    // Filtrage des étudiants
    const filteredStudents = students.filter(student => {
        if (!searchTerm) return true;

        const matchCriteria = [];

        if (filterOptions.firstName) {
            matchCriteria.push(
                student.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterOptions.lastName) {
            matchCriteria.push(
                student.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterOptions.email) {
            matchCriteria.push(
                student.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterOptions.age) {
            matchCriteria.push(
                student.age?.toString().includes(searchTerm)
            );
        }

        return matchCriteria.some(match => match);
    });

    // Gestion du menu de filtres
    const handleFilterMenuOpen = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterMenuClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterOptionChange = (option) => {
        setFilterOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    // Si chargement initial
    if (loading && students.length === 0) {
        return <div>Chargement...</div>;
    }

    // Si erreur fatale
    if (error && students.length === 0) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Statistiques */}
            <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                <Grid item xs={12} sm={4}>
                    <Card style={{ 
                        backgroundColor: "#f0f4c3", 
                        borderRadius: "16px", 
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
                    }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Total Étudiants</Typography>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>{students.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card style={{ 
                        backgroundColor: "#b2dfdb", 
                        borderRadius: "16px", 
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
                    }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Étudiants Actifs</Typography>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>N/A</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card style={{ 
                        backgroundColor: "#ffccbc", 
                        borderRadius: "16px", 
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
                    }}>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">Étudiants Inactifs</Typography>
                            <Typography variant="h4" style={{ fontWeight: 600 }}>N/A</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Barre de recherche et bouton d'ajout */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: "20px" 
            }}>
                {/* Barre de recherche avec filtre */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Rechercher des étudiants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginRight: "10px" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleFilterMenuOpen}>
                                    <FilterListIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                {/* Menu de filtres */}
                <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterMenuClose}
                >
                    {Object.keys(filterOptions).map(option => (
                        <MenuItem key={option} dense>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={filterOptions[option]}
                                        onChange={() => handleFilterOptionChange(option)}
                                    />
                                }
                                label={`Filtrer par ${option}`}
                            />
                        </MenuItem>
                    ))}
                </Menu>

                {/* Bouton d'ajout */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    style={{ 
                        borderRadius: "12px", 
                        padding: "10px 16px" 
                    }}
                >
                    {isFormOpen ? "Fermer" : "Ajouter"}
                </Button>
            </div>

            {/* Formulaire */}
            {isFormOpen && (
                <Card style={{ marginBottom: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Prénom"
                                        name="firstName"
                                        value={formValues.firstName}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom"
                                        name="lastName"
                                        value={formValues.lastName}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        name="age"
                                        type="number"
                                        value={formValues.age}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Téléphone"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Classe (grade_id)"
                                        name="grade_id"
                                        value={formValues.grade_id}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button 
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {editingStudent ? "Modifier" : "Ajouter"}
                                    </Button>
                                    {editingStudent && (
                                        <Button
                                            onClick={() => {
                                                setEditingStudent(null);
                                                setIsFormOpen(false);
                                            }}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Annuler
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Tableau des étudiants */}
            <TableContainer component={Paper} style={{ borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student) => (
                                <TableRow key={student._id}>
                                    <TableCell>{student.firstName || "N/A"}</TableCell>
                                    <TableCell>{student.lastName || "N/A"}</TableCell>
                                    <TableCell>{student.age || "N/A"}</TableCell>
                                    <TableCell>{student.email || "N/A"}</TableCell>
                                    <TableCell>{student.phone || "N/A"}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => {
                                                setEditingStudent(student);
                                                setIsFormOpen(true);
                                            }}
                                            disabled={loading}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDelete(student._id)}
                                            disabled={loading}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredStudents.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>

            {/* Notification d'erreur */}
            {error && (
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={() => setError(null)}
                >
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </div>
    );
};

export default Etudiant;