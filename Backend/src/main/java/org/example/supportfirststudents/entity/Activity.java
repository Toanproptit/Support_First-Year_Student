package org.example.supportfirststudents.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.ActivityStatus;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "activities")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    Date startDate;
    Date endDate;
    String address;

    @Enumerated(EnumType.STRING)
    ActivityStatus status;

    String description;

    @Column(name = "student_quantity")
    Integer studentQuantity;

    @OneToMany(mappedBy = "activity" , cascade = CascadeType.ALL , fetch = FetchType.LAZY )
    private List<Participation> participations = new ArrayList<>();

    public void addParticipation(Participation p) {
        participations.add(p);
        p.setActivity(this);
    }
    public void removeParticipation(Participation p) {
        participations.remove(p);
        p.setActivity(null);
    }
}
