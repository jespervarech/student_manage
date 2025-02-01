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
  DialogActions
} from "@mui/material";
import {
  BookOpen,
  Edit,
  Trash2,
  PlusCircle
} from "lucide-react";

const Matiere = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState(null);
  const [formValues, setFormValues] = useState({ name: "" });

  useEffect(() => {
    fetchMatieres();
  }, []);

  const fetchMatieres = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8010/api/courses");
      const data = await response.json();
      setMatieres(data);
    } catch (error) {
      console.error("Erreur de chargement des matières", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMatiere
        ? `http://localhost:8010/api/courses/${editingMatiere._id}`
        : "http://localhost:8010/api/courses";
      const method = editingMatiere ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues)
      });

      const result = await response.json();

      if (response.ok) {
        if (editingMatiere) {
          setMatieres(prev =>
            prev.map(matiere => (matiere._id === result._id ? result : matiere))
          );
        } else {
          setMatieres(prev => [...prev, result]);
        }
        handleCloseModal();
      } else {
        alert('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error("Erreur d'enregistrement", error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette matière ?")) return;

    try {
      const response = await fetch(`http://localhost:8010/api/courses/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setMatieres(prev => prev.filter(matiere => matiere._id !== id));
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error("Erreur de suppression", error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleOpenModal = (matiere = null) => {
    setEditingMatiere(matiere);
    setFormValues(matiere ? { name: matiere.name } : { name: "" });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingMatiere(null);
  };

  const filteredMatieres = matieres.filter(matiere =>
    matiere.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#f0f4c3', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <BookOpen size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#827717' }} />
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Total Matières
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {matieres.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#b2dfdb', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <BookOpen size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#004d40' }} />
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Matières Uniques
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {new Set(matieres.map(m => m.name)).size}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#ffccbc', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <BookOpen size={40} strokeWidth={1.5} style={{ marginRight: 16, color: '#bf360c' }} />
              <Box>
                <Typography variant="h6" color="textSecondary">
                  Dernier Ajout
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {matieres.length > 0 ? matieres[matieres.length - 1].name : 'N/A'}
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
          placeholder="Rechercher des matières"
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
          Ajouter une Matière
        </Button>
      </Box>

      {/* Liste des matières */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de la Matière</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMatieres.map((matiere) => (
              <TableRow key={matiere._id}>
                <TableCell>{matiere.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenModal(matiere)}
                  >
                    <Edit size={20} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(matiere._id)}
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
          {editingMatiere ? "Modifier la Matière" : "Ajouter une Matière"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de la Matière"
            name="name"
            value={formValues.name}
            onChange={(e) => setFormValues({ name: e.target.value })}
            fullWidth
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingMatiere ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Matiere;
