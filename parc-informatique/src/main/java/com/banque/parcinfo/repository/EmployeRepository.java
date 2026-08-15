package com.banque.parcinfo.repository;

import com.banque.parcinfo.entity.Employe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeRepository extends JpaRepository<Employe, Long> {
}