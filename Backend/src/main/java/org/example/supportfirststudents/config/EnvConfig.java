package org.example.supportfirststudents.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {
    static {
        Dotenv dotenv = Dotenv.load();

        String user =dotenv.get("DB_USERNAME");
        String password =dotenv.get("DB_PASSWORD");
        String key =dotenv.get("SIGNER_KEY");
        String cloudinary_cloud_name =dotenv.get("CLOUDINARY_CLOUD_NAME");
        String cloudinary_api_key =dotenv.get("CLOUDINARY_API_KEY");
        String cloudinary_api_secret =dotenv.get("CLOUDINARY_API_SECRET");

        System.setProperty("DB_USERNAME",user);
        System.setProperty("DB_PASSWORD",password);
        System.setProperty("SIGNER_KEY",key);
        System.setProperty("CLOUDINARY_CLOUD_NAME",cloudinary_cloud_name);
        System.setProperty("CLOUDINARY_API_KEY",cloudinary_api_key);
        System.setProperty("CLOUDINARY_API_SECRET",cloudinary_api_secret);
    }
}
