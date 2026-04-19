package org.example.supportfirststudents.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    static {
        Dotenv dotenv = Dotenv.load();
        String user =dotenv.get("DB_USERNAME");
        String password =dotenv.get("DB_PASSWORD");


        System.setProperty("DB_USERNAME",user);
        System.setProperty("DB_PASSWORD",password);
    }
}
