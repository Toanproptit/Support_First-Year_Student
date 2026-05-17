package org.example.supportfirststudents.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.ParticipationStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "participations")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Participation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    Activity activity;

    LocalDateTime joinDate;
    String role;

    @Enumerated(EnumType.STRING)
    ParticipationStatus status;

    String cancelRequestReason;
    LocalDateTime cancelRequestedAt;
    Long cancelRequestedBy;

    LocalDateTime cancelReviewedAt;
    Long cancelReviewedBy;
    String cancelReviewNote;

    @PrePersist
    public void prePersist() {
        joinDate = LocalDateTime.now();
        if (status == null) {
            status = ParticipationStatus.ACTIVE;
        }
    }

}
