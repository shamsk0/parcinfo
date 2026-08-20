import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  getAllEquipements,
  createEquipementStandalone,
  updateEquipement,
  deleteEquipement,
  assignEquipement,
  unassignEquipement,
} from "../api/equipementService";
import { getEmployes } from "../api/employeService";
import EquipementForm from "../components/EquipementForm";
import SearchableSelect from "../components/SearchableSelect";
import Badge from "../components/Badge";
import { useAuth } from "../context/AuthContext";

function EquipementListPage() {
  const { isAdmin } = useAuth();
  const [equipements, setEquipements] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterEtat, setFilterEtat] = useState("Tous");
  const [filterType, setFilterType] = useState("Tous");
  const navigate = useNavigate();

  const load = () => {
    getAllEquipements().then((res) => setEquipements(res.data));
    getEmployes().then((res) => setEmployes(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data) => {
    const { employeId, ...equipData } = data;

    if (editing) {
      await updateEquipement(editing.id, equipData);
      const currentEmployeId = editing.employe
        ? String(editing.employe.id)
        : "";
      if (employeId !== currentEmployeId) {
        if (employeId) {
          await assignEquipement(editing.id, employeId);
        } else {
          await unassignEquipement(editing.id);
        }
      }
    } else {
      const res = await createEquipementStandalone(equipData);
      if (employeId) {
        await assignEquipement(res.data.id, employeId);
      }
    }

    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleEdit = (eq) => {
    setEditing(eq);
    setShowForm(true);
  };

  const handleAssignChange = async (equipId, employeId) => {
    if (employeId === "") {
      await unassignEquipement(equipId);
    } else {
      await assignEquipement(equipId, employeId);
    }
    load();
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer cet équipement ?")) {
      await deleteEquipement(id);
      load();
    }
  };

  const types = [...new Set(equipements.map((eq) => eq.type))];

  const filtered = equipements.filter((eq) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      eq.nom?.toLowerCase().includes(term) ||
      eq.numeroSerie?.toLowerCase().includes(term) ||
      eq.type?.toLowerCase().includes(term) ||
      (eq.employe &&
        `${eq.employe.prenom} ${eq.employe.nom}`.toLowerCase().includes(term));

    return (
      matchesSearch &&
      (filterStatut === "Tous" || eq.statut === filterStatut) &&
      (filterEtat === "Tous" || eq.etat === filterEtat) &&
      (filterType === "Tous" || eq.type === filterType)
    );
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Équipements</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-steel text-white px-4 py-2 rounded-lg hover:bg-navy"
          >
            <Plus size={18} /> Ajouter un équipement
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un équipement (nom, type, n° série, employé assigné)..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-gray-900 bg-white"
        />
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-900 bg-white"
        >
          <option>Tous</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-900 bg-white"
        >
          <option value="Tous">Statut : Tous</option>
          <option value="En stock">En stock</option>
          <option value="En service">En service</option>
        </select>
        <select
          value={filterEtat}
          onChange={(e) => setFilterEtat(e.target.value)}
          className="border rounded-lg px-3 py-2 text-gray-900 bg-white"
        >
          <option value="Tous">État : Tous</option>
          <option value="Fonctionnel">Fonctionnel</option>
          <option value="En panne">En panne</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 rounded-tl-xl">Nom</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">N° série</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">État</th>
              <th className="px-4 py-3">Assigné à</th>
              {isAdmin && (
                <th className="px-4 py-3 text-right rounded-tr-xl">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((eq) => (
              <tr
                key={eq.id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/equipements/${eq.id}`)}
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {eq.nom}
                </td>
                <td className="px-4 py-3 text-gray-700">{eq.type}</td>
                <td className="px-4 py-3 text-gray-700">{eq.numeroSerie}</td>
                <td className="px-4 py-3">
                  <Badge status={eq.statut} />
                </td>
                <td className="px-4 py-3">
                  <Badge status={eq.etat} />
                </td>
                <td
                  className="px-4 py-3 w-56"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAdmin ? (
                    <SearchableSelect
                      options={employes.map((emp) => ({
                        value: emp.id,
                        label: `${emp.prenom} ${emp.nom}`,
                      }))}
                      value={eq.employe ? eq.employe.id : ""}
                      onChange={(val) => handleAssignChange(eq.id, val)}
                      placeholder="Rechercher un employé..."
                      emptyLabel="Non assigné"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {eq.employe
                        ? `${eq.employe.prenom} ${eq.employe.nom}`
                        : "Non assigné"}
                    </span>
                  )}
                </td>
                {isAdmin && (
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEdit(eq)}
                      className="text-gray-600 hover:text-steel mr-3"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(eq.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Aucun équipement ne correspond
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAdmin && showForm && (
        <EquipementForm
          initialData={editing}
          employes={employes}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

export default EquipementListPage;
