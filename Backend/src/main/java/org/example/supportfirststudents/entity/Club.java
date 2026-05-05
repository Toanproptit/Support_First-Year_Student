package org.example.supportfirststudents.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "clubs")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String name;

    String linkFacebook;
    String linkYoutube;
    String linkWeb;
    String image;
    String description;

    String head;
}
