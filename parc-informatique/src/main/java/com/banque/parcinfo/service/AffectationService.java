package com.banque.parcinfo.service;

import com.banque.parcinfo.entity.Affectation;
import com.banque.parcinfo.entity.Employe;
import com.banque.parcinfo.entity.Equipement;
import com.banque.parcinfo.repository.AffectationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AffectationService {

    private final AffectationRepository affectationRepository;

    // Historique d'un équipement : tous les employés qui l'ont utilisé, du plus récent au plus ancien.
    public List<Affectation> getHistoriqueByEquipement(Long equipementId) {
        return affectationRepository.findByEquipementIdOrderByDateDebutDesc(equipementId);
    }

    // Historique d'un employé : tous les équipements qu'il a utilisés, du plus récent au plus ancien.
    public List<Affectation> getHistoriqueByEmploye(Long employeId) {
        return affectationRepository.findByEmployeIdOrderByDateDebutDesc(employeId);
    }

    // Clôture l'affectation en cours d'un équipement (le cas échéant) en renseignant sa date de fin.
    // Ne fait rien si l'équipement n'a pas d'affectation active.
    public void cloturerAffectationEnCours(Equipement equipement) {
        affectationRepository.findByEquipementIdAndDateFinIsNull(equipement.getId())
                .ifPresent(affectation -> {
                    affectation.setDateFin(LocalDate.now());
                    affectation.setStatut("Terminé");
                    affectationRepository.save(affectation);
                });
    }

    // Démarre une nouvelle affectation active (dateFin = NULL, statut = "Actif") entre un équipement et un employé.
    public Affectation demarrerAffectation(Equipement equipement, Employe employe) {
        Affectation affectation = new Affectation();
        affectation.setEquipement(equipement);
        affectation.setEmploye(employe);
        affectation.setDateDebut(LocalDate.now());
        affectation.setDateFin(null);
        affectation.setStatut("Actif");
        return affectationRepository.save(affectation);
    }
}
