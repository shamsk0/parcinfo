package com.banque.parcinfo.service;

import com.banque.parcinfo.entity.Employe;
import com.banque.parcinfo.entity.Equipement;
import com.banque.parcinfo.exception.ResourceNotFoundException;
import com.banque.parcinfo.repository.EquipementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipementService {

    private final EquipementRepository equipementRepository;
    private final EmployeService employeService;
    private final AffectationService affectationService;

    public List<Equipement> getAllEquipements() {
        return equipementRepository.findAll();
    }

    public Equipement getEquipementById(Long id) {
        return equipementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Équipement introuvable avec id : " + id));
    }

    public List<Equipement> getEquipementsByEmploye(Long employeId) {
        return equipementRepository.findByEmployeId(employeId);
    }

    // Créer un équipement directement affecté à un employé : toujours "En service" / "Fonctionnel".
    public Equipement createEquipement(Long employeId, Equipement equipement) {
        Employe employe = employeService.getEmployeById(employeId);
        equipement.setEmploye(employe);
        equipement.setStatut("En service");
        equipement.setEtat("Fonctionnel");
        Equipement saved = equipementRepository.save(equipement);
        affectationService.demarrerAffectation(saved, employe);
        return saved;
    }

    // Créer un équipement SANS l'assigner : toujours "En stock" / "Fonctionnel".
    // Impossible de créer un équipement déjà en panne ou déjà en service.
    public Equipement createEquipementSansAffectation(Equipement equipement) {
        equipement.setEmploye(null);
        equipement.setStatut("En stock");
        equipement.setEtat("Fonctionnel");
        return equipementRepository.save(equipement);
    }

    // Modification des informations et de l'état de fonctionnement (Fonctionnel / En panne).
    // Le statut (En stock / En service) n'est JAMAIS modifié ici : il ne dépend que de l'affectation.
    public Equipement updateEquipement(Long id, Equipement details) {
        Equipement equipement = getEquipementById(id);
        equipement.setNom(details.getNom());
        equipement.setType(details.getType());
        equipement.setNumeroSerie(details.getNumeroSerie());
        equipement.setDateAcquisition(details.getDateAcquisition());
        equipement.setEtat(details.getEtat());
        return equipementRepository.save(equipement);
    }

    public void deleteEquipement(Long id) {
        Equipement equipement = getEquipementById(id);
        equipementRepository.delete(equipement);
    }

    // Assigner (ou réaffecter) un équipement existant à un employé.
    // Un équipement assigné est, par définition, "En service" — l'état de fonctionnement n'est pas touché.
    public Equipement assignerEquipement(Long equipementId, Long employeId) {
        Equipement equipement = getEquipementById(equipementId);
        Employe employe = employeService.getEmployeById(employeId);
        // Clôture l'affectation précédente (s'il y en a une) avant d'en démarrer une nouvelle,
        // afin de ne jamais perdre l'historique lors d'une réaffectation.
        affectationService.cloturerAffectationEnCours(equipement);
        equipement.setEmploye(employe);
        equipement.setStatut("En service");
        Equipement saved = equipementRepository.save(equipement);
        affectationService.demarrerAffectation(saved, employe);
        return saved;
    }

    // Désaffecter un équipement : il retourne "En stock". L'état de fonctionnement n'est pas touché
    // (un équipement en panne désaffecté reste en panne, mais redevient disponible en stock).
    public Equipement desaffecterEquipement(Long equipementId) {
        Equipement equipement = getEquipementById(equipementId);
        affectationService.cloturerAffectationEnCours(equipement);
        equipement.setEmploye(null);
        equipement.setStatut("En stock");
        return equipementRepository.save(equipement);
    }
}
