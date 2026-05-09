package org.example.supportfirststudents.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.Role;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;



@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder;
    @Bean
    ApplicationRunner initApplicationRunner(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUserNameContaining("admin").isEmpty()) {
                User user = User.builder()
                        .userName("admin")
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.Admin)
                        .build();
                userRepository.save(user);
                log.info("user has been created");
            }
        };
    }
}
