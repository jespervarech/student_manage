import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Header from './Header';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingNote, setEditingNote] = useState(null);
  const [formValues, setFormValues] = useState({
    student: '',
    course: '',
    grade: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Mettre à jour les valeurs du formulaire quand editingNote change
    if (editingNote) {
      setFormValues({
        student: editingNote.student.id,
        course: editingNote.course,
        grade: editingNote.grade
      });
    } else {
      // Réinitialiser le formulaire quand on quitte le mode édition
      setFormValues({
        student: '',
        course: '',
        grade: ''
      });
    }
  }, [editingNote]);

  const fetchData = async () => {
    try {
      // Fetch notes
      const notesResponse = await fetch("http://localhost:8010/api/notes");
      const notesData = await notesResponse.json();
      setNotes(notesData);

      // Fetch students
      const studentsResponse = await fetch("http://localhost:8010/api/students");
      const studentsData = await studentsResponse.json();
      setStudents(studentsData);

      // Fetch courses
      const matieresResponse = await fetch("http://localhost:8010/api/courses");
      const matieresData = await matieresResponse.json();
      setMatieres(matieresData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedStudent = students.find(s => s._id === formValues.student);

    const noteData = {
      student: {
        id: formValues.student,
        firstname: selectedStudent.firstName,
        lastname: selectedStudent.lastName
      },
      course: formValues.course,
      grade: parseInt(formValues.grade)
    };

    try {
      if (editingNote) {
        const response = await fetch(`http://localhost:8010/api/notes/${editingNote._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Erreur lors de la modification');

        const updatedNote = await response.json();
        setNotes(prev => prev.map(note =>
          note._id === updatedNote._id ? updatedNote : note
        ));
        setEditingNote(null);
      } else {
        const response = await fetch("http://localhost:8010/api/notes", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Erreur lors de l\'ajout');

        const newNote = await response.json();
        setNotes(prev => [...prev, newNote]);
      }
      setFormValues({
        student: '',
        course: '',
        grade: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormValues({
      student: '',
      course: '',
      grade: ''
    });
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:8010/api/notes/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
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
        <form onSubmit={handleSubmit} className="mb-4">
          <FormControl fullWidth margin="normal">
            <InputLabel>Étudiant</InputLabel>
            <Select
              name="student"
              value={formValues.student}
              onChange={handleInputChange}
              required
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {`${student.firstName} ${student.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Matière</InputLabel>
            <Select
              name="course"
              value={formValues.course}
              onChange={handleInputChange}
              required
            >
              {matieres.map((matiere) => (
                <MenuItem key={matiere._id} value={matiere.name}>
                  {matiere.name}
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
            inputProps={{ min: 0, max: 100 }}
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
            {editingNote ? 'Modifier' : 'Ajouter'}
          </Button>

          {editingNote && (
            <>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                className="ml-2"
              >
                Annuler
              </Button>

            </>
          )}
        </form>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Étudiant</TableCell>
                <TableCell>Matière</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((note) => (
                  <TableRow key={note._id}>
                    <TableCell>
                      {`${note.student.firstname} ${note.student.lastname}`}
                    </TableCell>
                    <TableCell>{note.course}</TableCell>
                    <TableCell>{note.grade}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditingNote(note)}
                        className="mr-2"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteNote(note._id)}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={notes.length}
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

export default Note;