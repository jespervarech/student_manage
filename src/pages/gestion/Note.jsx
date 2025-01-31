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
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { Edit2, Trash2, PlusCircle } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Note = ({ userRole }) => {
  const [notes, setNotes] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
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
    if (editingNote) {
      setFormValues({
        student: editingNote.student.id,
        course: editingNote.course,
        grade: editingNote.grade
      });
    } else {
      setFormValues({
        student: '',
        course: '',
        grade: ''
      });
    }
  }, [editingNote]);

  const fetchData = async () => {
    try {
      const notesResponse = await fetch('http://localhost:8010/api/grades');
      const notesData = await notesResponse.json();
      setNotes(notesData);

      const studentsResponse = await fetch('http://localhost:8010/api/students');
      const studentsData = await studentsResponse.json();
      setStudents(studentsData);

      const coursesResponse = await fetch('http://localhost:8010/api/courses');
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedStudent = students.find((s) => s._id === formValues.student);
    const noteData = {
      student: {
        id: selectedStudent._id,
      },
      course: formValues.course,
      grade: parseInt(formValues.grade)
    };

    try {
      if (editingNote) {
        const response = await fetch(`http://localhost:8010/api/grades/${editingNote._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Failed to update grade');
        const updatedNote = await response.json();
        setNotes((prev) =>
          prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
        );
        setEditingNote(null);
      } else {
        const response = await fetch('http://localhost:8010/api/grades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error('Failed to add grade');
        const newNote = await response.json();
        setNotes((prev) => [...prev, newNote]);
      }
      setFormValues({
        student: '',
        course: '',
        grade: ''
      });
    } catch (error) {
      console.error('Error during operation:', error);
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
      const response = await fetch(`http://localhost:8010/api/grades/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete grade');
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Check if user has permission to add/edit (ADMIN or SCOLARITE)
  const canModify = ['ADMIN', 'SCOLARITE'].includes(userRole);

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Grade Management</h2>
      
      {canModify && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <FormControl fullWidth variant="outlined" className="mb-2">
                <InputLabel>Student</InputLabel>
                <Select
                  name="student"
                  value={formValues.student}
                  onChange={handleInputChange}
                  label="Student"
                  required
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {`${student.firstName} ${student.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-3">
              <FormControl fullWidth variant="outlined" className="mb-2">
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={formValues.course}
                  onChange={handleInputChange}
                  label="Course"
                  required
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course.name}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-2">
              <TextField
                fullWidth
                variant="outlined"
                label="Grade"
                name="grade"
                type="number"
                value={formValues.grade}
                onChange={handleInputChange}
                required
                className="mb-2"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <Button 
                type="submit" 
                variant="contained" 
                color={editingNote ? 'secondary' : 'primary'} 
                startIcon={editingNote ? <Edit2 /> : <PlusCircle />}
                className="me-2"
              >
                {editingNote ? 'Update Grade' : 'Add Grade'}
              </Button>
              {editingNote && (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </form>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Grade</TableCell>
              {canModify && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {notes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((note) => (
                <TableRow key={note._id}>
                  <TableCell>{`${note.student.firstname} ${note.student.lastname}`}</TableCell>
                  <TableCell>{note.course}</TableCell>
                  <TableCell>{note.grade}</TableCell>
                  {canModify && (
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                        startIcon={<Edit2 />}
                        onClick={() => setEditingNote(note)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="error" 
                        size="small"
                        startIcon={<Trash2 />}
                        onClick={() => deleteNote(note._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
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
  );
};

export default Note;