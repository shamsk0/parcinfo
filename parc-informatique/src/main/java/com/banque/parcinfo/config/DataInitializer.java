package com.banque.parcinfo.config;

import com.banque.parcinfo.entity.Employe;
import com.banque.parcinfo.entity.Equipement;
import com.banque.parcinfo.repository.EmployeRepository;
import com.banque.parcinfo.repository.EquipementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            EmployeRepository employeRepository,
            EquipementRepository equipementRepository) {

        return args -> {

            if (employeRepository.count() > 0) {
                return;
            }

            Employe e1 = new Employe();
            e1.setNom("Dupont");
            e1.setPrenom("Jean");
            e1.setEmail("jean.dupont@banque.ma");
            e1.setPoste("Développeur");
            e1.setDateEmbauche(LocalDate.of(2022, 1, 10));

            Employe e2 = new Employe();
            e2.setNom("Martin");
            e2.setPrenom("Sophie");
            e2.setEmail("sophie.martin@banque.ma");
            e2.setPoste("Analyste");
            e2.setDateEmbauche(LocalDate.of(2021, 6, 15));

            Employe e3 = new Employe();
            e3.setNom("Benali");
            e3.setPrenom("Youssef");
            e3.setEmail("youssef.benali@banque.ma");
            e3.setPoste("Administrateur Système");
            e3.setDateEmbauche(LocalDate.of(2023, 3, 20));

            employeRepository.save(e1);
            employeRepository.save(e2);
            employeRepository.save(e3);

            Equipement pc1 = new Equipement();
            pc1.setNom("Dell Latitude 7440");
            pc1.setType("Ordinateur");
            pc1.setNumeroSerie("DL7440-001");
            pc1.setDateAcquisition(LocalDate.of(2024, 1, 15));
            pc1.setStatut("En service");
            pc1.setEtat("Fonctionnel");
            pc1.setEmploye(e1);

            Equipement tel = new Equipement();
            tel.setNom("iPhone 15");
            tel.setType("Téléphone");
            tel.setNumeroSerie("IPH15-001");
            tel.setDateAcquisition(LocalDate.of(2024, 2, 1));
            tel.setStatut("En service");
            tel.setEtat("Fonctionnel");
            tel.setEmploye(e1);

            Equipement pc2 = new Equipement();
            pc2.setNom("HP EliteBook");
            pc2.setType("Ordinateur");
            pc2.setNumeroSerie("HP840-002");
            pc2.setDateAcquisition(LocalDate.of(2023, 11, 20));
            pc2.setStatut("En service");
            pc2.setEtat("Fonctionnel");
            pc2.setEmploye(e2);

            // Exemple d'équipement assigné mais en panne : les deux dimensions sont bien indépendantes.
            Equipement pc3 = new Equipement();
            pc3.setNom("Lenovo ThinkPad T14");
            pc3.setType("Ordinateur");
            pc3.setNumeroSerie("LN-T14-005");
            pc3.setDateAcquisition(LocalDate.of(2023, 8, 2));
            pc3.setStatut("En service");
            pc3.setEtat("En panne");
            pc3.setEmploye(e3);

            Equipement ecran = new Equipement();
            ecran.setNom("Écran Dell 27\"");
            ecran.setType("Moniteur");
            ecran.setNumeroSerie("MON-003");
            ecran.setDateAcquisition(LocalDate.of(2024, 4, 5));
            ecran.setStatut("En stock");
            ecran.setEtat("Fonctionnel");

            Equipement clavier = new Equipement();
            clavier.setNom("Clavier Logitech MX");
            clavier.setType("Clavier");
            clavier.setNumeroSerie("KEY-004");
            clavier.setDateAcquisition(LocalDate.of(2024, 5, 12));
            clavier.setStatut("En stock");
            clavier.setEtat("Fonctionnel");

            equipementRepository.save(pc1);
            equipementRepository.save(tel);
            equipementRepository.save(pc2);
            equipementRepository.save(pc3);
            equipementRepository.save(ecran);
            equipementRepository.save(clavier);
        };
    }
}
