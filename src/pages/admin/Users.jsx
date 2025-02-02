import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users as UsersIcon,
  Search,
  UserPlus,
  Trash2,
  GraduationCap,
  School
} from 'lucide-react';

// Fonction utilitaire pour compter les utilisateurs par rôle
const countUsersByRole = (users) => {
  return {
    total: users.length,
    students: users.filter(user => user.role === 'STUDENT').length,
    scolarite: users.filter(user => user.role === 'SCOLARITE').length
  };
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    students: 0,
    scolarite: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userData = response.data;
        setUsers(userData);
        // Utilisation de la fonction countUsersByRole
        setUserStats(countUsersByRole(userData));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedUsers = users.filter(user => user._id !== deleteUserId);
      setUsers(updatedUsers);
      // Mise à jour des stats après la suppression
      setUserStats(countUsersByRole(updatedUsers));
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center mb-4">
        <UsersIcon className="me-2" size={24} />
        <h1 className="h3 mb-0">Gestion des Utilisateurs</h1>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Total Utilisateurs</h6>
                  <h3 className="mb-0">{userStats.total}</h3>
                </div>
                <UsersIcon size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Étudiants</h6>
                  <h3 className="mb-0">{userStats.students}</h3>
                </div>
                <GraduationCap size={24} className="text-primary" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Scolarité</h6>
                  <h3 className="mb-0">{userStats.scolarite}</h3>
                </div>
                <School size={24} className="text-info" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <a
                  href="/admin/register"
                  className="btn btn-outline-secondary d-flex align-items-center"
                >
                  <UserPlus className="me-2" size={16} />
                  Ajouter
                </a>
              </div>

              <div className="table-responsive">
                <table className="table table-borderless table-hover">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.email}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {user.role}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => setDeleteUserId(user._id)}
                            >
                              <Trash2 size={16} className="me-1" />
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {deleteUserId && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteUserId(null)}
                ></button>
              </div>
              <div className="modal-body">
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                Cette action est irréversible.
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteUserId(null)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteUser}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;