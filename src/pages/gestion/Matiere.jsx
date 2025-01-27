import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Header from './Header';

const Matiere = () => {
  const [matieres, setMatieres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editIndex, setEditIndex] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const formRef = useRef(null);

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
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const matiereData = { name: formData.get('matiere') };

    try {
      const response = await fetch("http://localhost:8010/api/courses", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matiereData)
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout');

      const newMatiere = await response.json();
      setMatieres(prev => [...prev, newMatiere]);
      formRef.current.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la matière:", error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Header />
      <div className="p-4">
        <form ref={formRef} onSubmit={handleSubmit} className="mb-4">
          <TextField
            label="Nom de la matière"
            name="matiere"
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-3"
          >
            Ajouter
          </Button>
        </form>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Matière</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matieres
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((matiere) => (
                  <TableRow key={matiere._id}>
                    <TableCell>{matiere.name}</TableCell>
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </div>
  );
};
export default Matiere;