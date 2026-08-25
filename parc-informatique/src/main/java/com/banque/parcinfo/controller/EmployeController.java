package com.banque.parcinfo.controller;

import com.banque.parcinfo.entity.Employe;
import com.banque.parcinfo.service.EmployeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
public class EmployeController {

    private final EmployeService employeService;

    @GetMapping
    public List<Employe> getAll() {
        return employeService.getAllEmployes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employe> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeService.getEmployeById(id));
    }

    @PostMapping
    public ResponseEntity<Employe> create(@Valid @RequestBody Employe employe) {
        Employe saved = employeService.createEmploye(employe);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employe> update(@PathVariable Long id, @Valid @RequestBody Employe employe) {
        return ResponseEntity.ok(employeService.updateEmploye(id, employe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeService.deleteEmploye(id);
        return ResponseEntity.noContent().build();
    }
}