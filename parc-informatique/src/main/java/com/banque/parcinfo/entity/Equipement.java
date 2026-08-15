package com.banque.parcinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "equipement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Equipement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'équipement est obligatoire")
    private String nom;

    @NotBlank(message = "Le type est obligatoire")
    @Pattern(
        regexp = "^(Ordinateur|Téléphone|Moniteur|Clavier)$",
        message = "Le type doit être Ordinateur, Téléphone, Moniteur ou Clavier"
    )
    private String type;

    @NotBlank(message = "Le numéro de série est obligatoire")
    @Column(unique = true)
    private String numeroSerie;

    private LocalDate dateAcquisition;

    // Disponibilité de l'équipement : dérivée automatiquement de l'affectation.
    // Jamais modifiable directement via le formulaire — voir EquipementService.
    @Pattern(
        regexp = "^(En stock|En service)$",
        message = "Le statut doit être En stock ou En service"
    )
    private String statut;

    // État de fonctionnement, indépendant du statut : un équipement peut être
    // en panne qu'il soit en stock ou en service.
    @Pattern(
        regexp = "^(Fonctionnel|En panne)$",
        message = "L'état doit être Fonctionnel ou En panne"
    )
    private String etat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employe_id")
    @JsonIgnoreProperties({ "equipements", "hibernateLazyInitializer", "handler" })
    private Employe employe;
}