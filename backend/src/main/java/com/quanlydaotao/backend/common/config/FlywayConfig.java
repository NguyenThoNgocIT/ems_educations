package com.quanlydaotao.backend.common.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy(Environment environment) {
        return flyway -> {
            boolean repairOnMigrate = environment.getProperty(
                    "spring.flyway.repair-on-migrate",
                    Boolean.class,
                    false
            );

            if (repairOnMigrate) {
                flyway.repair();
            }

            flyway.migrate();
        };
    }
}
