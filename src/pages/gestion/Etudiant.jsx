import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
    Switch,
    FormControlLabel,
    Box,
    Fade,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";

const Etudiant = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        phone: "",
        grade_id: "",
        isActive: true,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [filterOptions, setFilterOptions] = useState({
        firstName: true,
        lastName: true,
        email: true,
        age: false,
    });

    useEffect(() => {
        fetchStudents();
    }, []);

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

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormValues(prev => ({ ...prev, [name]: newValue }));
    };

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

            if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

            const updatedStudent = await response.json();

            setStudents((prevStudents) => {
                if (editingStudent) {
                    return prevStudents.map(student =>
                        student._id === updatedStudent._id ? updatedStudent : student
                    );
                } else {
                    return [...prevStudents, updatedStudent];
                }
            });

            setSuccessMessage(editingStudent ? "Étudiant modifié avec succès!" : "Étudiant ajouté avec succès!");
            handleCloseModals(); // Fermeture du modal après la soumission
            resetForm();
        } catch (err) {
            setError("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ?")) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8010/api/students/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error();

            setStudents((prevStudents) => prevStudents.filter(student => student._id !== id));
            setSuccessMessage("Étudiant supprimé avec succès!");
        } catch (err) {
            setError("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModals = () => {
        setOpenAddModal(false);
        setOpenEditModal(false);
        setEditingStudent(null);
        resetForm();
    };

    const resetForm = () => {
        setFormValues({
            firstName: "",
            lastName: "",
            age: "",
            email: "",
            phone: "",
            grade_id: "",
            isActive: true,
        });
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormValues({
            firstName: student.firstName || "",
            lastName: student.lastName || "",
            age: student.age || "",
            email: student.email || "",
            phone: student.phone || "",
            grade_id: student.grade_id || "",
            isActive: student.isActive ?? true,
        });
        setOpenEditModal(true);
    };

    const getActiveStudentsCount = () => students.filter(student => student.isActive).length;
    const getInactiveStudentsCount = () => students.filter(student => !student.isActive).length;

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

    const StudentForm = ({ onSubmit, title }) => (
        <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Prénom"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Nom"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={handleInputChange}
                        required
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
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Téléphone"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formValues.isActive}
                                onChange={handleInputChange}
                                name="isActive"
                                color="primary"
                            />
                        }
                        label="Étudiant actif"
                    />
                </Grid>
            </Grid>
        </form>
    );

    return (
        <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Stats Cards */}
            <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                <Grid item xs={12} sm={4}>
                    <Fade in={true} timeout={500}>
                        <Card style={{
                            backgroundColor: "#f0f4c3",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "transform 0.3s ease-in-out",
                            "&:hover": {
                                transform: "translateY(-5px)"
                            }
                        }}>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <SchoolIcon style={{ fontSize: 40, marginRight: 16, color: "#827717" }} />
                                    <div>
                                        <Typography variant="h6" color="textSecondary">Total Étudiants</Typography>
                                        <Typography variant="h4" style={{ fontWeight: 600 }}>{students.length}</Typography>
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Fade in={true} timeout={700}>
                        <Card style={{
                            backgroundColor: "#b2dfdb",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <SchoolIcon style={{ fontSize: 40, marginRight: 16, color: "#004d40" }} />
                                    <div>
                                        <Typography variant="h6" color="textSecondary">Étudiants Actifs</Typography>
                                        <Typography variant="h4" style={{ fontWeight: 600 }}>{getActiveStudentsCount()}</Typography>
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Fade in={true} timeout={900}>
                        <Card style={{
                            backgroundColor: "#ffccbc",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}>
                            <CardContent>
                                <Box display="flex" alignItems="center">
                                    <SchoolIcon style={{ fontSize: 40, marginRight: 16, color: "#bf360c" }} />
                                    <div>
                                        <Typography variant="h6" color="textSecondary">Étudiants Inactifs</Typography>
                                        <Typography variant="h4" style={{ fontWeight: 600 }}>{getInactiveStudentsCount()}</Typography>
                                    </div>
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>

            {/* Search and Add Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <TextField
                    style={{ width: "70%" }}
                    variant="outlined"
                    placeholder="Rechercher des étudiants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => {
                        setOpenAddModal(true);
                        resetForm();
                    }}
                    style={{
                        borderRadius: "12px",
                        padding: "10px 20px",
                        background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
                    }}
                >
                    Ajouter un étudiant
                </Button>
            </Box>

            {/* Table */}
            <TableContainer
                component={Paper}
                style={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    marginTop: "20px"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((student) => (
                                <TableRow
                                    key={student._id}
                                    style={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            transition: 'background-color 0.3s ease'
                                        }
                                    }}
                                >
                                    <TableCell>{student.firstName || "N/A"}</TableCell>
                                    <TableCell>{student.lastName || "N/A"}</TableCell>
                                    <TableCell>{student.age || "N/A"}</TableCell>
                                    <TableCell>{student.email || "N/A"}</TableCell>
                                    <TableCell>{student.phone || "N/A"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={student.isActive ? "Actif" : "Inactif"}
                                            color={student.isActive ? "success" : "error"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleEdit(student)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(student._id)}
                                            color="error"
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

            {/* Modals */}
            <Dialog open={openAddModal || openEditModal} onClose={handleCloseModals}>
                <DialogTitle>
                    {editingStudent ? "Modifier l'étudiant" : "Ajouter un étudiant"}
                </DialogTitle>
                <DialogContent>
                    <StudentForm onSubmit={handleSubmit} title={editingStudent ? "Modifier" : "Ajouter"} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModals} color="primary">Annuler</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={loading}>Enregistrer</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            {error && (
                <Snackbar
                    open={Boolean(error)}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                >
                    <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                </Snackbar>
            )}
            {successMessage && (
                <Snackbar
                    open={Boolean(successMessage)}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMessage("")}
                >
                    <Alert severity="success" onClose={() => setSuccessMessage("")}>{successMessage}</Alert>
                </Snackbar>
            )}
        </div>
    );
};

export default Etudiant;
