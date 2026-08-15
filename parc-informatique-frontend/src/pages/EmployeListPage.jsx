import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import {
  getEmployes, createEmploye, updateEmploye, deleteEmploye,
} from '../api/employeService';
import EmployeForm from '../components/EmployeForm';

function EmployeListPage() {
  const [employes, setEmployes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = () => {
    getEmployes().then((res) => setEmployes(res.data));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (data) => {
    if (editing) {
      await updateEmploye(editing.id, data);
    } else {
      await createEmploye(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (confirm('Supprimer cet employé et tous ses équipements assignés ?')) {
      await deleteEmploye(id);
      load();
    }
  };

  const term = search.trim().toLowerCase();
  const filtered = employes.filter((emp) =>
    term === '' ||
    emp.nom?.toLowerCase().includes(term) ||
    emp.prenom?.toLowerCase().includes(term) ||
    emp.email?.toLowerCase().includes(term) ||
    emp.poste?.toLowerCase().includes(term)
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Employés</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-steel text-white px-4 py-2 rounded-lg hover:bg-navy"
        >
          <Plus size={18} /> Ajouter un employé
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un employé (nom, prénom, email, poste)..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-900 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Poste</th>
              <th className="px-4 py-3">Date d'embauche</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/employes/${emp.id}`)}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{emp.prenom} {emp.nom}</td>
                <td className="px-4 py-3 text-gray-700">{emp.email}</td>
                <td className="px-4 py-3 text-gray-700">{emp.poste}</td>
                <td className="px-4 py-3 text-gray-700">{emp.dateEmbauche}</td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { setEditing(emp); setShowForm(true); }} className="text-gray-600 hover:text-steel mr-3">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(emp.id)} className="text-gray-600 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Aucun employé ne correspond</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <EmployeForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

export default EmployeListPage;
