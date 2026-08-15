package com.banque.parcinfo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

// Historique des affectations d'un équipement à un employé.
// Chaque changement d'affectation (assignation, réaffectation, désaffectation)
// crée / clôture une ligne ici. Aucune ligne n'est jamais supprimée manuellement
// (voir EquipementService et AffectationService) : c'est la source de vérité
// pour "qui a utilisé quel équipement, et quand".
@Entity
@Table(name = "affectation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Affectation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employe_id", nullable = false)
    @JsonIgnoreProperties({ "equipements", "hibernateLazyInitializer", "handler" })
    // Si l'employé est supprimé, son historique d'affectations est supprimé avec lui
    // (cohérent avec la suppression en cascade déjà en place sur Employe.equipements).
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Employe employe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipement_id", nullable = false)
    @JsonIgnoreProperties({ "employe", "hibernateLazyInitializer", "handler" })
    // Idem si l'équipement lui-même est supprimé définitivement du parc.
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Equipement equipement;

    private LocalDate dateDebut;

    // NULL tant que l'affectation est en cours.
    private LocalDate dateFin;

    // "Actif" ou "Terminé"
    private String statut;
}
