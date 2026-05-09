package org.example.supportfirststudents.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtDecode implements JwtDecoder {

    private JwtDecoder delegate;

    public JwtDecode(@Value("${signer_key}") String signerKey) {
        SecretKeySpec key = new SecretKeySpec(
                signerKey.getBytes(), "HS512"
        );

        this.delegate = NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }


    @Override
    public Jwt decode(String token) throws JwtException {
        return delegate.decode(token);
    }
}