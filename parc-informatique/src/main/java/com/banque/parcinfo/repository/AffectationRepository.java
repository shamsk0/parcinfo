package com.banque.parcinfo.repository;

import com.banque.parcinfo.entity.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, Long> {

    // Historique complet d'un équipement, du plus récent au plus ancien.
    List<Affectation> findByEquipementIdOrderByDateDebutDesc(Long equipementId);

    // Historique complet d'un employé, du plus récent au plus ancien.
    List<Affectation> findByEmployeIdOrderByDateDebutDesc(Long employeId);

    // Affectation actuellement active (dateFin NULL) d'un équipement, s'il y en a une.
    Optional<Affectation> findByEquipementIdAndDateFinIsNull(Long equipementId);
}
