package org.example.supportfirststudents.repository;

import org.example.supportfirststudents.dto.response.UserResponse;
import org.example.supportfirststudents.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findByUserNameContaining(String username);
    List<User> findByFullNameContaining(String fullName);
    Boolean existsByUserName(String userName);
    Boolean existsByEmail(String email);
}
