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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import {
    Users,
    UserCheck,
    UserX,
    Search,
    Edit,
    Trash2,
    PlusCircle
} from "lucide-react";

const Etudiant = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        phone: "",
        isActive: true
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch("http://localhost:8010/api/students");
            const data = await response.json();
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur de chargement", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingStudent
                ? `http://localhost:8010/api/students/${editingStudent._id}`
                : "http://localhost:8010/api/students";

            const method = editingStudent ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });

            const result = await response.json();

            if (editingStudent) {
                setStudents(prev =>
                    prev.map(student =>
                        student._id === result._id ? result : student
                    )
                );
            } else {
                setStudents(prev => [...prev, result]);
            }

            handleCloseModal();
        } catch (error) {
            console.error("Erreur d'enregistrement", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")) return;

        try {
            await fetch(`http://localhost:8010/api/students/${id}`, {
                method: "DELETE"
            });

            setStudents(prev => prev.filter(student => student._id !== id));
        } catch (error) {
            console.error("Erreur de suppression", error);
        }
    };

    const handleOpenModal = (student = null) => {
        setEditingStudent(student);
        setFormValues(student ? {
            firstName: student.firstName,
            lastName: student.lastName,
            age: student.age,
            email: student.email,
            phone: student.phone,
            isActive: student.isActive
        } : {
            firstName: "",
            lastName: "",
            age: "",
            email: "",
            phone: "",
            isActive: true
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingStudent(null);
    };

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeStudents = students.filter(student => student.isActive);
    const inactiveStudents = students.filter(student => !student.isActive);

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
                            <Users size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#827717' }} />
                            <Box>
                                <Typography variant="h6" color="textSecondary">
                                    Total Étudiants
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {students.length}
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
                            <UserCheck size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#004d40' }} />
                            <Box>
                                <Typography variant="h6" color="textSecondary">
                                    Étudiants Actifs
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {activeStudents.length}
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
                            <UserX size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#bf360c' }} />
                            <Box>
                                <Typography variant="h6" color="textSecondary">
                                    Étudiants Inactifs
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {inactiveStudents.length}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Actions et Recherche */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                    variant="outlined"
                    placeholder="Rechercher des étudiants"
                    InputProps={{
                        startAdornment: <Search style={{ marginRight: 8 }} />
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: '70%' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlusCircle />}
                    onClick={() => handleOpenModal()}
                >
                    Ajouter un étudiant
                </Button>
            </Box>

            {/* Liste des étudiants */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Prénom</TableCell>
                            <TableCell>Nom</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Téléphone</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student._id}>
                                <TableCell>{student.firstName}</TableCell>
                                <TableCell>{student.lastName}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.phone}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={student.isActive ? "Actif" : "Inactif"}
                                        color={student.isActive ? "success" : "error"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(student)}
                                    >
                                        <Edit size={20} />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(student._id)}
                                    >
                                        <Trash2 size={20} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal d'ajout/édition */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingStudent ? "Modifier l'étudiant" : "Ajouter un étudiant"}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Prénom"
                            name="firstName"
                            value={formValues.firstName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Nom"
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Téléphone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Âge"
                            name="age"
                            type="number"
                            value={formValues.age}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editingStudent ? "Modifier" : "Ajouter"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Etudiant;