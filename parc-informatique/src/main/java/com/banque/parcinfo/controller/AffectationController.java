package com.banque.parcinfo.controller;

import com.banque.parcinfo.entity.Affectation;
import com.banque.parcinfo.service.AffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
public class AffectationController {

    private final AffectationService affectationService;

    // Historique complet d'un équipement (tous les employés qui l'ont utilisé).
    @GetMapping("/equipement/{equipementId}")
    public List<Affectation> getHistoriqueEquipement(@PathVariable Long equipementId) {
        return affectationService.getHistoriqueByEquipement(equipementId);
    }

    // Historique complet d'un employé (tous les équipements qu'il a utilisés).
    @GetMapping("/employe/{employeId}")
    public List<Affectation> getHistoriqueEmploye(@PathVariable Long employeId) {
        return affectationService.getHistoriqueByEmploye(employeId);
    }
}
