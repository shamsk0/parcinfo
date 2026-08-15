import { NavLink } from "react-router-dom";
import { Users, Laptop } from "lucide-react";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive ? "bg-steel text-white" : "text-slate-200 hover:bg-white/10"
    }`;

  return (
    <aside className="w-64 bg-navy min-h-screen p-4 flex flex-col gap-2">
      <div className="text-white font-bold text-lg mb-6 px-2">
        Parc Informatique
      </div>
      <NavLink to="/" className={linkClass} end>
        <Users size={20} /> Employés
      </NavLink>
      <NavLink to="/equipements" className={linkClass}>
        <Laptop size={20} /> Équipements
      </NavLink>
    </aside>
  );
}

export default Sidebar;
