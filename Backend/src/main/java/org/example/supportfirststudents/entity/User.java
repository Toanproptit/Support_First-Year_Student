package org.example.supportfirststudents.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.example.supportfirststudents.enums.Role;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String fullName;
    String userName;
    String email;
    String password;

    @Enumerated(EnumType.STRING)
    Role role;

    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    List<Post> posts = new ArrayList<>();



    public void addPost(Post post) {
        posts.add(post);
        post.setUser(this);
    }


    public void removePost(Post post) {
        posts.remove(post);
        post.setUser(null);
    }
}
