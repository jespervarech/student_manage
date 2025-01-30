import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const Matiere = () => {
  const [matieres, setMatieres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [newMatiere, setNewMatiere] = useState('');
  const [editMatiere, setEditMatiere] = useState({ id: null, name: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMatieres();
  }, []);

  const fetchMatieres = async () => {
    try {
      const response = await fetch("http://localhost:8010/api/courses");
      if (!response.ok) throw new Error('Erreur réseau');
      const data = await response.json();
      setMatieres(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des matières:", error);
      showSnackbar('Erreur lors du chargement des matières', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8010/api/courses", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMatiere })
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');
      
      const data = await response.json();
      setMatieres([...matieres, data]);
      setNewMatiere('');
      showSnackbar('Matière ajoutée avec succès');
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      showSnackbar('Erreur lors de l\'ajout de la matière', 'error');
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8010/api/courses/${editMatiere.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editMatiere.name })
      });

      if (!response.ok) throw new Error('Erreur lors de la modification');

      setMatieres(matieres.map(m => 
        m._id === editMatiere.id ? { ...m, name: editMatiere.name } : m
      ));
      setOpenDialog(false);
      showSnackbar('Matière modifiée avec succès');
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      showSnackbar('Erreur lors de la modification', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8010/api/courses/${deleteDialog.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setMatieres(matieres.filter(m => m._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
      showSnackbar('Matière supprimée avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      showSnackbar('Erreur lors de la suppression', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Matières
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Nouvelle matière"
          value={newMatiere}
          onChange={(e) => setNewMatiere(e.target.value)}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ minWidth: 120 }}
        >
          Ajouter
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matière</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matieres
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((matiere) => (
                <TableRow key={matiere._id}>
                  <TableCell>{matiere.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setEditMatiere({ id: matiere._id, name: matiere.name });
                        setOpenDialog(true);
                      }}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, id: matiere._id })}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={matieres.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Dialog de modification */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Modifier la matière</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la matière"
            fullWidth
            value={editMatiere.name}
            onChange={(e) => setEditMatiere({ ...editMatiere, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleEdit} variant="contained">Modifier</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette matière ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Matiere;