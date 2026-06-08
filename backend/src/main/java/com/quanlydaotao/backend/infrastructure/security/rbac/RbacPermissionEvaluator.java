package com.quanlydaotao.backend.infrastructure.security.rbac;

import com.quanlydaotao.backend.role.entity.PermissionApis;
import com.quanlydaotao.backend.role.repository.PermissionApiRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RbacPermissionEvaluator {
    private final PermissionApiRepository permissionApiRepository;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public boolean hasCurrentRequestPermission(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        HttpServletRequest request = currentRequest();
        if (request == null) {
            return false;
        }

        PermissionApis matchedPermissionApi = findMatchedPermissionApi(request);
        if (matchedPermissionApi == null || matchedPermissionApi.getPermission() == null) {
            return false;
        }

        String requiredPermission = matchedPermissionApi.getPermission().getCode();
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> requiredPermission.equals(authority.getAuthority()));
    }

    private HttpServletRequest currentRequest() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
            return attributes.getRequest();
        }
        return null;
    }

    private PermissionApis findMatchedPermissionApi(HttpServletRequest request) {
        String method = request.getMethod().toUpperCase();
        String path = request.getRequestURI();
        List<PermissionApis> mappings = permissionApiRepository.findActiveWithPermission();
        return mappings.stream()
                .filter(mapping -> method.equalsIgnoreCase(mapping.getId().getHttpMethod()))
                .filter(mapping -> pathMatcher.match(mapping.getId().getApiPath(), path))
                .findFirst()
                .orElse(null);
    }
}
