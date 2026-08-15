import { useState, useEffect } from 'react';

// Regex email raisonnable côté client (le backend valide aussi avec @Email).
const EMAIL_PATTERN = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

function EmployeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', poste: '', dateEmbauche: '',
  });
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEmailBlur = () => {
    if (form.email && !new RegExp(EMAIL_PATTERN).test(form.email)) {
      setEmailError("Le format de l'email n'est pas valide (ex : nom@domaine.com)");
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!new RegExp(EMAIL_PATTERN).test(form.email)) {
      setEmailError("Le format de l'email n'est pas valide (ex : nom@domaine.com)");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          {initialData ? "Modifier l'employé" : 'Ajouter un employé'}
        </h2>

        <label className="block text-sm text-gray-700 mb-1">Nom</label>
        <input name="nom" value={form.nom} onChange={handleChange} required
          className="w-full border rounded-lg px-3 py-2 mb-3 text-gray-900" />

        <label className="block text-sm text-gray-700 mb-1">Prénom</label>
        <input name="prenom" value={form.prenom} onChange={handleChange} required
          className="w-full border rounded-lg px-3 py-2 mb-3 text-gray-900" />

        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          required
          pattern={EMAIL_PATTERN}
          title="Le format de l'email n'est pas valide (ex : nom@domaine.com)"
          placeholder="nom@domaine.com"
          className={`w-full border rounded-lg px-3 py-2 mb-1 text-gray-900 ${emailError ? 'border-red-400' : ''}`}
        />
        {emailError && <p className="text-sm text-red-600 mb-2">{emailError}</p>}
        <div className={emailError ? '' : 'mb-3'} />

        <label className="block text-sm text-gray-700 mb-1">Poste</label>
        <input name="poste" value={form.poste} onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-3 text-gray-900" />

        <label className="block text-sm text-gray-700 mb-1">Date d'embauche</label>
        <input name="dateEmbauche" type="date" value={form.dateEmbauche} onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-4 text-gray-900" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            Annuler
          </button>
          <button type="submit"
            className="px-4 py-2 rounded-lg bg-steel text-white hover:bg-navy">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeForm;
