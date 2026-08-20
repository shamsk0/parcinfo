import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, User } from "lucide-react";
import {
  getEquipementById,
  updateEquipement,
  deleteEquipement,
  assignEquipement,
  unassignEquipement,
} from "../api/equipementService";
import { getEmployes } from "../api/employeService";
import { getHistoriqueEquipement } from "../api/affectationService";
import EquipementForm from "../components/EquipementForm";
import Badge from "../components/Badge";
import HistoriqueAffectationsTable from "../components/HistoriqueAffectationsTable";
import { useAuth } from "../context/AuthContext";

function EquipementDetailPage() {
  const { isAdmin } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipement, setEquipement] = useState(null);
  const [employes, setEmployes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [historique, setHistorique] = useState([]);

  const load = () => {
    getEquipementById(id).then((res) => setEquipement(res.data));
    getEmployes().then((res) => setEmployes(res.data));
    getHistoriqueEquipement(id).then((res) => setHistorique(res.data));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpdate = async (data) => {
    const { employeId, ...equipData } = data;
    await updateEquipement(id, equipData);
    const currentEmployeId = equipement.employe
      ? String(equipement.employe.id)
      : "";
    if (employeId !== currentEmployeId) {
      if (employeId) {
        await assignEquipement(id, employeId);
      } else {
        await unassignEquipement(id);
      }
    }
    setShowForm(false);
    load();
  };

  const handleDelete = async () => {
    if (confirm("Supprimer cet équipement ?")) {
      await deleteEquipement(id);
      navigate("/equipements");
    }
  };

  if (!equipement)
    return <div className="p-8 text-gray-700">Chargement...</div>;

  const isAssigned = !!equipement.employe;

  return (
    <div className="p-8">
      {/* navigate(-1) : revient exactement d'où l'on vient (liste équipements
          ou fiche d'un employé), pour permettre une vraie remontée en chaîne. */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 mb-4 hover:text-navy"
      >
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-navy">{equipement.nom}</h1>
            <p className="text-gray-600 mt-1">{equipement.type}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={equipement.statut} />
            <Badge status={equipement.etat} />
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Pencil size={16} /> Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-500">Numéro de série</p>
            <p className="text-gray-900 font-medium">
              {equipement.numeroSerie}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date d'acquisition</p>
            <p className="text-gray-900 font-medium">
              {equipement.dateAcquisition || "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <p className="text-gray-900 font-medium">{equipement.statut}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">État</p>
            <p className="text-gray-900 font-medium">{equipement.etat}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Affectation</h2>

        {isAssigned ? (
          <div
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/employes/${equipement.employe.id}`)}
          >
            <div className="w-10 h-10 rounded-full bg-steel text-white flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {equipement.employe.prenom} {equipement.employe.nom}
              </p>
              <p className="text-sm text-gray-600">
                {equipement.employe.poste} · {equipement.employe.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-gray-50 text-gray-600">
            Cet équipement n'est actuellement assigné à aucun employé.
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-navy mb-4">
          Historique des affectations
        </h2>
        <HistoriqueAffectationsTable affectations={historique} />
      </div>

      {isAdmin && showForm && (
        <EquipementForm
          initialData={equipement}
          employes={employes}
          onSubmit={handleUpdate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default EquipementDetailPage;
