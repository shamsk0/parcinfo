package com.banque.parcinfo.service;

import com.banque.parcinfo.entity.Employe;
import com.banque.parcinfo.exception.ResourceNotFoundException;
import com.banque.parcinfo.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeService {

    private final EmployeRepository employeRepository;

    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }

    public Employe getEmployeById(Long id) {
        return employeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employé introuvable avec id : " + id));
    }

    public Employe createEmploye(Employe employe) {
        return employeRepository.save(employe);
    }

    public Employe updateEmploye(Long id, Employe employeDetails) {
        Employe employe = getEmployeById(id);
        employe.setNom(employeDetails.getNom());
        employe.setPrenom(employeDetails.getPrenom());
        employe.setEmail(employeDetails.getEmail());
        employe.setPoste(employeDetails.getPoste());
        employe.setDateEmbauche(employeDetails.getDateEmbauche());
        return employeRepository.save(employe);
    }

    public void deleteEmploye(Long id) {
        Employe employe = getEmployeById(id);
        employeRepository.delete(employe);
    }
}