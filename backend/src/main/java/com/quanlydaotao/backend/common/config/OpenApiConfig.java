package com.quanlydaotao.backend.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@Profile({"dev", "test"})
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI(@Value("${open.api.title}") String title,
                           @Value("${open.api.description}") String description,
                           @Value("${open.api.version}") String version,
                           @Value("${open.api.serverName}") String serverName,
                           @Value("${open.api.serverUrl}") String serverUrl) {
        return new OpenAPI()
                .info(new Info().title(title)
                        .description(description)
                        .version(version)
                        .license(new License().name("MIT License").url("https://domain.org/licenses/MIT")))
                        .servers(List.of(new Server().url(serverUrl).description(serverName)))
                .components(
                        new Components()
                                .addSecuritySchemes("bearerAuth",
                                        new io.swagger.v3.oas.models.security.SecurityScheme()
                                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")))
                                .security(List.of(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("bearerAuth")));
        ///  link truy cập swagger api là localhost:8080/swagger-ui/index.html
    }
    @Bean
    public GroupedOpenApi groupedOpenApi(){
        return GroupedOpenApi.builder()
                .group("api-service")
                .packagesToScan("com.quanlydaotao.backend")
                .build();
    }
}
