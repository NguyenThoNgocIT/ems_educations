package com.quanlydaotao.backend.infrastructure.security.rbac;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import com.quanlydaotao.backend.role.entity.PermissionApis;
import com.quanlydaotao.backend.role.repository.PermissionApiRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RbacAuthorizationFilter extends OncePerRequestFilter {
    private final PermissionApiRepository permissionApiRepository;
    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (shouldSkip(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        PermissionApis matchedPermissionApi = findMatchedPermissionApi(request);
        if (matchedPermissionApi == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean superUser = authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()) || "ROLE_SUPER_ADMIN".equals(authority.getAuthority()));
        boolean allowed = superUser || authentication.getAuthorities().stream()
                .anyMatch(authority -> matchedPermissionApi.getPermission().getCode().equals(authority.getAuthority()));

        if (!allowed) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(), ApiResponse.error("Bạn không có quyền truy cập chức năng này", ErrorCode.FORBIDDEN));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean shouldSkip(HttpServletRequest request) {
        String path = request.getRequestURI();
        return HttpMethod.OPTIONS.matches(request.getMethod())
                || path.startsWith("/api/auth/")
                || path.startsWith("/swagger-ui/")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/h2-console");
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
