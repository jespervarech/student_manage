import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8010/api/users');
        if (!response.ok) {
          throw new Error('Erreur de réseau');
        }

        const text = await response.text();
        console.log('Réponse brute:', text);
        const data = JSON.parse(text);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);



  const filteredUsers = users.filter((user) =>

    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
      <p>Liste des utilisateurs :</p>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4"
      />

      {/* Bouton pour afficher le formulaire d'ajout d'utilisateur */}
      <a
        href='/admin/register'
        className="bg-blue-500 text-white p-2 mb-4"
      >
        Ajouter un utilisateur
      </a>

      {/* Formulaire d'ajout d'utilisateur */}
      {showForm && (
        <div className="mb-4">

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Rôle"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white p-2"
          >
            Ajouter
          </button>
        </div>
      )}

      <table className="table-auto w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border p-2 text-center">
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
