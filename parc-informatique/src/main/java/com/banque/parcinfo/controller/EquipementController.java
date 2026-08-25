package com.banque.parcinfo.controller;

import com.banque.parcinfo.entity.Equipement;
import com.banque.parcinfo.service.EquipementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipements")
@RequiredArgsConstructor
public class EquipementController {

    private final EquipementService equipementService;

    @GetMapping
    public List<Equipement> getAll() {
        return equipementService.getAllEquipements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(equipementService.getEquipementById(id));
    }

    // Récupérer tous les équipements d'un employé donné
    @GetMapping("/employe/{employeId}")
    public List<Equipement> getByEmploye(@PathVariable Long employeId) {
        return equipementService.getEquipementsByEmploye(employeId);
    }

    // Créer un équipement rattaché à un employé
    @PostMapping("/employe/{employeId}")
    public ResponseEntity<Equipement> create(@PathVariable Long employeId,
            @Valid @RequestBody Equipement equipement) {
        Equipement saved = equipementService.createEquipement(employeId, equipement);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipement> update(@PathVariable Long id, @Valid @RequestBody Equipement equipement) {
        return ResponseEntity.ok(equipementService.updateEquipement(id, equipement));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        equipementService.deleteEquipement(id);
        return ResponseEntity.noContent().build();
    }

    // Créer un équipement non affecté (reste "en stock" jusqu'à affectation)
    @PostMapping
    public ResponseEntity<Equipement> createSansAffectation(@Valid @RequestBody Equipement equipement) {
        Equipement saved = equipementService.createEquipementSansAffectation(equipement);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Assigner / réaffecter un équipement à un employé
    @PutMapping("/{id}/assigner/{employeId}")
    public ResponseEntity<Equipement> assigner(@PathVariable Long id, @PathVariable Long employeId) {
        return ResponseEntity.ok(equipementService.assignerEquipement(id, employeId));
    }

    // Désaffecter un équipement (le rendre sans propriétaire)
    @PutMapping("/{id}/desaffecter")
    public ResponseEntity<Equipement> desaffecter(@PathVariable Long id) {
        return ResponseEntity.ok(equipementService.desaffecterEquipement(id));
    }
}