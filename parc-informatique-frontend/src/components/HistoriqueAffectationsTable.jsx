import Badge from "./Badge";

// Tableau générique d'historique des affectations, utilisé à la fois
// dans la fiche équipement et dans la fiche employé.
// columns: "equipement" affiche la colonne "Équipement" (utile côté fiche employé),
//          "employe" affiche la colonne "Employé" (utile côté fiche équipement).
function HistoriqueAffectationsTable({ affectations, onRowClick }) {
  if (!affectations || affectations.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-gray-50 text-gray-600">
        Aucun historique d'affectation pour le moment.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-700 text-sm font-semibold">
          <tr>
            <th className="px-4 py-3">Employé</th>
            <th className="px-4 py-3">Équipement</th>
            <th className="px-4 py-3">Date de début</th>
            <th className="px-4 py-3">Date de fin</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {affectations.map((aff) => (
            <tr
              key={aff.id}
              className={`border-t ${onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}`}
              onClick={onRowClick ? () => onRowClick(aff) : undefined}
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {aff.employe ? `${aff.employe.prenom} ${aff.employe.nom}` : "—"}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {aff.equipement ? aff.equipement.nom : "—"}
              </td>
              <td className="px-4 py-3 text-gray-700">{aff.dateDebut || "—"}</td>
              <td className="px-4 py-3 text-gray-700">{aff.dateFin || "En cours"}</td>
              <td className="px-4 py-3">
                <Badge status={aff.statut} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoriqueAffectationsTable;
