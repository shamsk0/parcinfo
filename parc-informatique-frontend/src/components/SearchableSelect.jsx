import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";

/**
 * Menu déroulant avec recherche par saisie.
 * options: [{ value, label }]
 * emptyLabel: si fourni, affiche une option en tête pour vider la sélection (ex: "Non assigné")
 *
 * Le panneau est rendu via un portail (document.body) et positionné en
 * "fixed" par-dessus le reste de la page : il n'est donc jamais rogné par
 * un conteneur parent avec overflow-hidden (ex: le tableau des équipements).
 */
function SearchableSelect({ options, value, onChange, placeholder = "Rechercher...", emptyLabel }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  const selected = options.find((o) => String(o.value) === String(value));

  const openDropdown = () => {
    const rect = buttonRef.current.getBoundingClientRect();
    const panelHeight = 264; // hauteur max approximative du panneau
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < panelHeight && rect.top > panelHeight;

    setCoords({
      top: openUpwards ? rect.top - Math.min(panelHeight, 264) : rect.bottom,
      left: rect.left,
      width: rect.width,
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        panelRef.current && !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    function handleScrollOrResize() {
      setOpen(false);
      setQuery("");
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (opt) => {
    onChange(opt ? String(opt.value) : "");
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 bg-white text-left"
      >
        <span className={`truncate ${selected ? "text-gray-900" : "text-gray-500"}`}>
          {selected ? selected.label : (emptyLabel || "Sélectionner...")}
        </span>
        <ChevronDown size={16} className="text-gray-500 shrink-0" />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
          className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 flex flex-col"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 shrink-0">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full outline-none text-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="overflow-y-auto">
            {emptyLabel && (
              <div
                onClick={() => handleSelect(null)}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                {emptyLabel}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">Aucun résultat</div>
            )}
            {filtered.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 cursor-pointer"
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default SearchableSelect;
