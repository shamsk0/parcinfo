package com.banque.parcinfo.repository;

import com.banque.parcinfo.entity.Equipement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    List<Equipement> findByEmployeId(Long employeId);
}