/**
 * Groupe de boutons radio (sélection circulaire). Si disabled=true, affiche
 * l'état courant sans permettre de le changer (utilisé pour le Statut, qui
 * est toujours dérivé de l'affectation et jamais choisi directement).
 */
function RadioGroup({ name, options, value, onChange, disabled = false }) {
  return (
    <div className="flex gap-5">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-2 text-sm ${
            disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-800 cursor-pointer"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange && onChange(opt)}
            disabled={disabled}
            className="w-4 h-4 accent-steel"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default RadioGroup;
