import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    Select,
    MenuItem
} from "@mui/material";
import {
    BookOpen,
    Edit,
    Trash2,
    PlusCircle
} from "lucide-react";

const Grade = () => {
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);

    const [formValues, setFormValues] = useState({
        student: "",
        course: "",
        grade: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [gradesRes, studentsRes, coursesRes] = await Promise.all([
                fetch("http://localhost:8010/api/grades"),
                fetch("http://localhost:8010/api/students"),
                fetch("http://localhost:8010/api/courses")
            ]);

            const gradesData = await gradesRes.json();
            const studentsData = await studentsRes.json();
            const coursesData = await coursesRes.json();

            setGrades(gradesData);
            setStudents(studentsData);
            setCourses(coursesData);
            setLoading(false);
        } catch (error) {
            console.error("Erreur de chargement", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingGrade
                ? `http://localhost:8010/api/grades/${editingGrade._id}`
                : "http://localhost:8010/api/grades";

            const method = editingGrade ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });

            const result = await response.json();

            if (editingGrade) {
                setGrades(prev =>
                    prev.map(grade =>
                        grade._id === result._id ? result : grade
                    )
                );
            } else {
                setGrades(prev => [...prev, result]);
            }

            handleCloseModal();
        } catch (error) {
            console.error("Erreur d'enregistrement", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette note ?")) return;

        try {
            await fetch(`http://localhost:8010/api/grades/${id}`, {
                method: "DELETE"
            });

            setGrades(prev => prev.filter(grade => grade._id !== id));
        } catch (error) {
            console.error("Erreur de suppression", error);
        }
    };

    const handleOpenModal = (grade = null) => {
        setEditingGrade(grade);
        setFormValues(grade ? {
            student: grade.student,
            course: grade.course,
            grade: grade.grade,
            date: grade.date
        } : {
            student: "",
            course: "",
            grade: "",
            date: new Date().toISOString().split('T')[0]
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingGrade(null);
    };

    // Afficher toutes les notes sans filtrage
    const averageGrade = grades.length > 0
        ? (grades.reduce((sum, grade) => sum + parseFloat(grade.grade), 0) / grades.length).toFixed(2)
        : 0;

    return (
        <Box sx={{ p: 3 }}>
            {/* Statistiques */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: '#f0f4c3',
                            borderRadius: 2,
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <BookOpen size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#827717' }} />
                            <Box>
                                <Typography variant="h6" color="textSecondary">
                                    Total Notes
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {grades.length}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: '#b2dfdb',
                            borderRadius: 2,
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <BookOpen size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#004d40' }} />
                            <Box>
                                <Typography variant="h6" color="textSecondary">
                                    Moyenne Générale
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {averageGrade}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            bgcolor: '#ffccbc',
                            borderRadius: 2,
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <BookOpen size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#bf360c' }} />
                            <Box>
                                <Typography variant="h6" color="textSecondary">
                                    Cours Uniques
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {courses.length}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Ajouter une note */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlusCircle />}
                    onClick={() => handleOpenModal()}
                >
                    Ajouter une Note
                </Button>
            </Box>

            {/* Liste des notes */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Étudiant</TableCell>
                            <TableCell>Cours</TableCell>
                            <TableCell>Note</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades.length > 0 ? (
                            grades.map((grade) => {
                                const student = students.find(s => s._id === grade.student);
                                const course = courses.find(c => c._id === grade.course);

                                return (
                                    <TableRow key={grade._id}>
                                        <TableCell>
                                            {student ? `${student.firstName} ${student.lastName}` : 'N/A'}
                                        </TableCell>
                                        <TableCell>{course ? course.name : 'N/A'}</TableCell>
                                        <TableCell>{grade.grade}</TableCell>
                                        <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenModal(grade)}
                                            >
                                                <Edit size={20} />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(grade._id)}
                                            >
                                                <Trash2 size={20} />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Aucune note disponible
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal d'ajout/édition */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGrade ? "Modifier la Note" : "Ajouter une Note"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <FormControl fullWidth>
                            <Select
                                name="student"
                                displayEmpty
                                value={formValues.student}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="" disabled>Sélectionner un étudiant</MenuItem>
                                {students.map(student => (
                                    <MenuItem key={student._id} value={student._id}>
                                        {student.firstName} {student.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <Select
                                name="course"
                                displayEmpty
                                value={formValues.course}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value="" disabled>Sélectionner un cours</MenuItem>
                                {courses.map(course => (
                                    <MenuItem key={course._id} value={course._id}>
                                        {course.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Note"
                            name="grade"
                            type="number"
                            value={formValues.grade}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            inputProps={{ min: 0, max: 20 }}
                        />
                        <TextField
                            label="Date"
                            name="date"
                            type="date"
                            value={formValues.date}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editingGrade ? "Mettre à jour" : "Ajouter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Grade;
