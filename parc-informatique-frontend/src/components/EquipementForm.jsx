import { useState } from "react";
import SearchableSelect from "./SearchableSelect";
import RadioGroup from "./RadioGroup";

const emptyForm = {
  nom: "",
  type: "",
  numeroSerie: "",
  dateAcquisition: "",
  etat: "Fonctionnel",
  employeId: "",
};

const formFromInitialData = (initialData) =>
  initialData
    ? { ...initialData, employeId: initialData.employe?.id ?? "" }
    : emptyForm;

function EquipementForm({ initialData, employes, onSubmit, onCancel, error, isSubmitting }) {
  const isEditing = !!initialData;

  const [form, setForm] = useState(() => formFromInitialData(initialData));

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  // Le statut n'est jamais choisi directement : il reflète simplement si un
  // employé est sélectionné ou non dans ce formulaire.
  const statutDerive = form.employeId ? "En service" : "En stock";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          {isEditing ? "Modifier l'équipement" : "Ajouter un équipement"}
        </h2>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <label className="block text-sm text-gray-700 mb-1">Nom</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 mb-3 text-gray-900"
        />

        <label className="block text-sm text-gray-700 mb-1">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 mb-3 text-gray-900 bg-white"
        >
          <option value="" disabled>Sélectionner un type</option>
          <option>Ordinateur</option>
          <option>Téléphone</option>
          <option>Moniteur</option>
          <option>Clavier</option>
        </select>

        <label className="block text-sm text-gray-700 mb-1">
          Numéro de série
        </label>
        <input
          name="numeroSerie"
          value={form.numeroSerie}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 mb-3 text-gray-900"
        />

        <label className="block text-sm text-gray-700 mb-1">
          Date d'acquisition
        </label>
        <input
          name="dateAcquisition"
          type="date"
          value={form.dateAcquisition}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4 text-gray-900"
        />

        <div className="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">
            Statut <span className="text-gray-400">(déterminé par l'affectation, non modifiable ici)</span>
          </p>
          <RadioGroup
            name="statut"
            options={["En stock", "En service"]}
            value={statutDerive}
            disabled
          />
        </div>

        <div className="mb-5 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">
            État
            {!isEditing && (
              <span className="text-gray-400"> (un équipement est toujours créé Fonctionnel)</span>
            )}
          </p>
          <RadioGroup
            name="etatFonctionnement"
            options={["Fonctionnel", "En panne"]}
            value={form.etat}
            onChange={(val) => setForm({ ...form, etat: val })}
            disabled={!isEditing}
          />
        </div>

        {employes && (
          <>
            <label className="block text-sm text-gray-700 mb-1">
              Assigner à (optionnel)
            </label>
            <div className="mb-4">
              <SearchableSelect
                options={employes.map((emp) => ({
                  value: emp.id,
                  label: `${emp.prenom} ${emp.nom}`,
                }))}
                value={form.employeId}
                onChange={(val) => setForm({ ...form, employeId: val })}
                placeholder="Rechercher un employé..."
                emptyLabel="Non assigné"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-steel text-white hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EquipementForm;
