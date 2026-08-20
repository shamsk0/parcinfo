import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, XCircle } from "lucide-react";
import { getEmployeById } from "../api/employeService";
import {
  getEquipementsByEmploye,
  getAllEquipements,
  assignEquipement,
  unassignEquipement,
  deleteEquipement,
} from "../api/equipementService";
import { getHistoriqueEmploye } from "../api/affectationService";
import SearchableSelect from "../components/SearchableSelect";
import Badge from "../components/Badge";
import HistoriqueAffectationsTable from "../components/HistoriqueAffectationsTable";
import { useAuth } from "../context/AuthContext";

function EmployeDetailPage() {
  const { isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [employe, setEmploye] = useState(null);
  const [equipements, setEquipements] = useState([]);
  const [availableEquipements, setAvailableEquipements] = useState([]);
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [selectedEquipId, setSelectedEquipId] = useState("");
  const [historique, setHistorique] = useState([]);

  const load = () => {
    getEmployeById(id).then((res) => setEmploye(res.data));
    getEquipementsByEmploye(id).then((res) => setEquipements(res.data));
    getAllEquipements().then((res) =>
      setAvailableEquipements(
        res.data.filter((eq) => !eq.employe && eq.statut === "En stock"),
      ),
    );
    getHistoriqueEmploye(id).then((res) => setHistorique(res.data));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedEquipId) return;
    await assignEquipement(selectedEquipId, id);
    setShowAssignPanel(false);
    setSelectedEquipId("");
    load();
  };

  const handleUnassign = async (equipId) => {
    if (
      confirm("Retirer cet équipement de cet employé ? Il retournera en stock.")
    ) {
      await unassignEquipement(equipId);
      load();
    }
  };

  const handleDelete = async (equipId) => {
    if (confirm("Supprimer définitivement cet équipement du parc ?")) {
      await deleteEquipement(equipId);
      load();
    }
  };

  if (!employe) return <div className="p-8 text-gray-700">Chargement...</div>;

  const equipementOptions = availableEquipements.map((eq) => ({
    value: eq.id,
    label: `${eq.nom} — ${eq.type} (N° ${eq.numeroSerie})`,
  }));

  return (
    <div className="p-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-700 mb-4 hover:text-navy"
      >
        <ArrowLeft size={18} /> Retour aux employés
      </button>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-navy">
          {employe.prenom} {employe.nom}
        </h1>
        <p className="text-gray-600">
          {employe.poste} · {employe.email}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-navy">
          Équipements assignés
        </h2>
        {isAdmin && (
          <button
            onClick={() => {
              setShowAssignPanel(true);
              setSelectedEquipId("");
            }}
            className="flex items-center gap-2 bg-steel text-white px-4 py-2 rounded-lg hover:bg-navy"
          >
            <Plus size={18} /> Assigner un équipement
          </button>
        )}
      </div>

      {isAdmin && showAssignPanel && (
        <div className="bg-white rounded-xl shadow p-5 mb-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">
            Choisir un équipement disponible en stock (non assigné) à affecter à{" "}
            {employe.prenom} {employe.nom} :
          </p>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <SearchableSelect
                options={equipementOptions}
                value={selectedEquipId}
                onChange={setSelectedEquipId}
                placeholder="Rechercher un équipement..."
                emptyLabel={
                  equipementOptions.length === 0
                    ? "Aucun équipement disponible en stock"
                    : "Sélectionner un équipement"
                }
              />
            </div>
            <button
              onClick={handleAssign}
              disabled={!selectedEquipId}
              className="bg-steel text-white px-4 py-2 rounded-lg hover:bg-navy disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Assigner
            </button>
            <button
              onClick={() => setShowAssignPanel(false)}
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
          </div>
          {equipementOptions.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Aucun équipement en stock n'est disponible actuellement.
              Ajoutez-en un depuis l'onglet Équipements.
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">N° série</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">État</th>
              {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {equipements.map((eq) => (
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
                {isAdmin && (
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleUnassign(eq.id)}
                      title="Retirer l'affectation (retourne en stock)"
                      className="text-gray-600 hover:text-amber-600 mr-3"
                    >
                      <XCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(eq.id)}
                      title="Supprimer définitivement"
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {equipements.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  Aucun équipement assigné
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-navy mb-4">
          Historique des équipements
        </h2>
        <HistoriqueAffectationsTable
          affectations={historique}
          onRowClick={(aff) =>
            aff.equipement && navigate(`/equipements/${aff.equipement.id}`)
          }
        />
      </div>
    </div>
  );
}

export default EmployeDetailPage;
