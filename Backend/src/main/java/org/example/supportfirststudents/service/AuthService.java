package org.example.supportfirststudents.service;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.supportfirststudents.dto.request.LoginRequest;
import org.example.supportfirststudents.dto.request.RegisterRequest;
import org.example.supportfirststudents.dto.response.AuthResponse;
import org.example.supportfirststudents.dto.response.UserResponse;
import org.example.supportfirststudents.entity.User;
import org.example.supportfirststudents.enums.ErrorCode;
import org.example.supportfirststudents.enums.Role;
import org.example.supportfirststudents.exception.AppException;
import org.example.supportfirststudents.mapper.UserMapper;
import org.example.supportfirststudents.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper  userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${signer_key}")
    private String SIGNER_KEY;

    public UserResponse register (RegisterRequest register){
        if(userRepository.existsByUserName(register.getUsername()) ||  userRepository.existsByEmail(register.getEmail())){
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        User saved = new User();
        saved.setFullName(register.getFullName());
        saved.setPassword(passwordEncoder.encode(register.getPassword()));
        saved.setUserName(register.getUsername());
        saved.setEmail(register.getEmail());
        saved.setRole(Role.Student);
        return userMapper.toUserResponse(userRepository.save(saved));
    }

    public AuthResponse login (LoginRequest request){
        User u = userRepository.findByEmail(request.getEmail()).orElseThrow(() ->
                new AppException(ErrorCode.EMAIL_NOT_FOUND));
        boolean matches = passwordEncoder.matches(request.getPassword(), u.getPassword());
        if (!matches) {
            // Hỗ trợ dữ liệu cũ: một số user được tạo từ /users đang lưu plain-text password
            if (u.getPassword() != null && u.getPassword().equals(request.getPassword())) {
                u.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(u);
                matches = true;
            }
        }
        if (!matches) throw new AppException(ErrorCode.PASSWORD_INVALID);
        var token = generateToken(u);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("Toandev")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(24*30 , ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("scope" ,user.getRole().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header,payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.warn("Cannot create token" + e.getMessage());
            throw new AppException(ErrorCode.TOKEN_GENERATION_FAILED);
        }
    }

}
