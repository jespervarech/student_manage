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
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

const Grade = () => {
    // États de base
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]); // Liste des étudiants
    const [courses, setCourses] = useState([]); // Liste des cours
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour la pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // État pour le formulaire
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [formValues, setFormValues] = useState({
        student: "",
        course: "",
        grade: "",
        date: new Date().toISOString().split('T')[0], // Date par défaut
    });

    // Chargement initial des données
    useEffect(() => {
        fetchGrades();
        fetchStudents();
        fetchCourses();
    }, []);

    // Fonction pour charger les grades
    const fetchGrades = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/grades");
            if (!response.ok) throw new Error("Erreur de chargement");
            const data = await response.json();
            setGrades(data);
        } catch (err) {
            setError("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour charger les étudiants
    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/students");
            if (!response.ok) throw new Error("Erreur de chargement");
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError("Erreur lors du chargement des étudiants");
        }
    };

    // Fonction pour charger les cours
    const fetchCourses = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/courses");
            if (!response.ok) throw new Error("Erreur de chargement");
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            setError("Erreur lors du chargement des cours");
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
            const url = editingGrade 
                ? `http://localhost:8010/api/grades/${editingGrade._id}`
                : "http://localhost:8010/api/grades";

            const method = editingGrade ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) throw new Error();
            
            await fetchGrades();
            setFormValues({
                student: "",
                course: "",
                grade: "",
                date: new Date().toISOString().split('T')[0],
            });
            setEditingGrade(null);
            setIsFormOpen(false);
        } catch (err) {
            setError("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    // Suppression d'un grade
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ?")) return;
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8010/api/grades/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error();
            await fetchGrades();
        } catch (err) {
            setError("Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    // Si chargement initial
    if (loading && grades.length === 0) {
        return <div>Chargement...</div>;
    }

    // Si erreur fatale
    if (error && grades.length === 0) {
        return <div>Erreur: {error}</div>;
    }

    return (
        <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            {/* Barre de recherche et bouton d'ajout */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: "20px" 
            }}>
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
                                    <FormControl fullWidth>
                                        <InputLabel>Étudiant</InputLabel>
                                        <Select
                                            name="student"
                                            value={formValues.student}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {students.map(student => (
                                                <MenuItem key={student._id} value={student._id}>
                                                    {student.firstName} {student.lastName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Cours</InputLabel>
                                        <Select
                                            name="course"
                                            value={formValues.course}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {courses.map(course => (
                                                <MenuItem key={course._id} value={course._id}>
                                                    {course.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Note"
                                        name="grade"
                                        type="number"
                                        inputProps={{ min: 0, max: 20 }}
                                        value={formValues.grade}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        name="date"
                                        type="date"
                                        value={formValues.date}
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
                                        {editingGrade ? "Modifier" : "Ajouter"}
                                    </Button>
                                    {editingGrade && (
                                        <Button
                                            onClick={() => {
                                                setEditingGrade(null);
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

            {/* Tableau des grades */}
            <TableContainer component={Paper} style={{ borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Étudiant</TableCell>
                            <TableCell>Cours</TableCell>
                            <TableCell>Note</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((grade) => (
                                <TableRow key={grade._id}>
                                    <TableCell>
                                        {students.find(s => s._id === grade.student)?.firstName || "N/A"}{" "}
                                        {students.find(s => s._id === grade.student)?.lastName || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {courses.find(c => c._id === grade.course)?.name || "N/A"}
                                    </TableCell>
                                    <TableCell>{grade.grade || "N/A"}</TableCell>
                                    <TableCell>{new Date(grade.date).toLocaleDateString() || "N/A"}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => {
                                                setEditingGrade(grade);
                                                setIsFormOpen(true);
                                            }}
                                            disabled={loading}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDelete(grade._id)}
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
                    count={grades.length}
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

export default Grade;