import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import EmployeListPage from "./pages/EmployeListPage";
import EmployeDetailPage from "./pages/EmployeDetailPage";
import EquipementListPage from "./pages/EquipementListPage";
import EquipementDetailPage from "./pages/EquipementDetailPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<EmployeListPage />} />
            <Route path="/employes/:id" element={<EmployeDetailPage />} />
            <Route path="/equipements" element={<EquipementListPage />} />
            <Route path="/equipements/:id" element={<EquipementDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
