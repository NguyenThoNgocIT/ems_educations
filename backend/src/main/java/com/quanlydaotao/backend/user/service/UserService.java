package com.quanlydaotao.backend.user.service;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.staff.entity.Staff;
import com.quanlydaotao.backend.staff.repository.StaffRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.user.dto.AssignUserRolesRequest;
import com.quanlydaotao.backend.user.dto.LockUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UpdateUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UserAdminResponse;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.user.entity.UserSession;
import com.quanlydaotao.backend.user.mapper.UserMapper;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import com.quanlydaotao.backend.user.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserSessionRepository userSessionRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final StaffRepository staffRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public Page<UserAdminResponse> searchUsersForAdmin(String keyword, Boolean isActive, Boolean isLocked, Pageable pageable) {
        Boolean activeFilter = isActive != null ? isActive : true;
        Page<User> userPage = userRepository.searchUsers(keyword, activeFilter, isLocked, pageable);
        List<UserAdminResponse> responses = userMapper.toDtoList(userPage.getContent());
        enrichIdentitiesAndRoles(responses);
        return new PageImpl<>(responses, pageable, userPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public UserAdminResponse getUserForAdmin(UUID id) {
        return toAdminResponse(findUser(id));
    }

    @Transactional
    public UserAdminResponse updateUserForAdmin(UUID id, UpdateUserAdminRequest request) {
        User user = findUser(id);
        userMapper.updateEntityFromDto(request, user);
        if (request.getIsActive() != null) {
            if (request.getIsActive()) {
                user.setDeletedAt(null);
            }
        }
        return toAdminResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUserForAdmin(UUID id) {
        User user = findUser(id);
        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void lockUser(UUID id, LockUserAdminRequest request) {
        User user = findUser(id);
        user.setLockReason(StringUtils.hasText(request.getLockReason()) ? request.getLockReason() : "Khóa bởi quản trị viên");
        user.setLockoutEndAt(LocalDateTime.now().plusDays(request.getLockoutDays() != null ? request.getLockoutDays() : 9999));
        userRepository.save(user);
    }

    @Transactional
    public void unlockUser(UUID id) {
        User user = findUser(id);
        user.setLockReason(null);
        user.setLockoutEndAt(null);
        user.setAccessFailedCount(0);
        userRepository.save(user);
    }

    @Transactional
    public void restoreUser(UUID id) {
        User user = findUser(id);
        user.setDeletedAt(null);
        user.setIsActive(true);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserSession> getUserSessions(UUID id) {
        return userSessionRepository.findAllByUser_UserId(id);
    }

    @Transactional
    public void revokeAllUserSessions(UUID id) {
        List<UserSession> sessions = userSessionRepository.findAllByUser_UserId(id);
        sessions.forEach(s -> s.setRevokedAt(LocalDateTime.now()));
        userSessionRepository.saveAll(sessions);
    }

    @Transactional(readOnly = true)
    public List<String> getUserRoles(UUID id) {
        findUser(id);
        return findRoleCodes(id);
    }

    @Transactional
    public UserAdminResponse assignRoles(UUID id, AssignUserRolesRequest request) {
        User user = findUser(id);
        userRoleRepository.findByUserUserId(id).forEach(userRole -> {
            userRole.setIsActive(false);
            userRoleRepository.save(userRole);
        });

        if (request.getRoleIds() != null) {
            for (UUID roleId : request.getRoleIds()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
                UserRoleId userRoleId = new UserRoleId(user.getUserId(), role.getRoleId());
                UserRole userRole = userRoleRepository.findById(userRoleId).orElseGet(UserRole::new);
                userRole.setId(userRoleId);
                userRole.setUser(user);
                userRole.setRole(role);
                userRole.setIsActive(true);
                userRoleRepository.save(userRole);
            }
        }
        return toAdminResponse(user);
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    private UserAdminResponse toAdminResponse(User user) {
        UserAdminResponse response = userMapper.toDto(user);
        response.setRoles(findRoleCodes(user.getUserId()));
        enrichIdentity(response);
        return response;
    }

    private void enrichIdentity(UserAdminResponse response) {
        UUID personId = response.getPersonId();
        if (personId == null) {
            return;
        }

        studentRepository.findByPersonPersonId(personId).ifPresent(student -> {
            response.setDisplayCode(student.getStudentCode());
            response.setAccountType("STUDENT");
        });
        if (StringUtils.hasText(response.getDisplayCode())) {
            return;
        }

        employeeRepository.findByPersonPersonId(personId).ifPresent(employee -> {
            response.setDisplayCode(resolveEmployeeDisplayCode(employee));
            response.setAccountType(resolveEmployeeAccountType(employee));
        });
        applyRoleBasedIdentityFallback(response);
    }

    private void enrichIdentitiesAndRoles(List<UserAdminResponse> responses) {
        if (responses.isEmpty()) {
            return;
        }

        List<UUID> userIds = responses.stream()
                .map(UserAdminResponse::getUserId)
                .filter(id -> id != null)
                .toList();
        Map<UUID, List<String>> rolesByUserId = userRoleRepository.findActiveRolesByUserIds(userIds).stream()
                .collect(Collectors.groupingBy(
                        userRole -> userRole.getId().getUserId(),
                        Collectors.mapping(userRole -> userRole.getRole().getCode(), Collectors.toList())
                ));

        List<UUID> personIds = responses.stream()
                .map(UserAdminResponse::getPersonId)
                .filter(id -> id != null)
                .toList();
        Map<UUID, Student> studentsByPersonId = studentRepository.findByPersonPersonIdIn(personIds).stream()
                .collect(Collectors.toMap(student -> student.getPerson().getPersonId(), Function.identity(), (left, right) -> left));
        Map<UUID, Employee> employeesByPersonId = employeeRepository.findByPersonPersonIdIn(personIds).stream()
                .collect(Collectors.toMap(employee -> employee.getPerson().getPersonId(), Function.identity(), (left, right) -> left));

        List<UUID> employeeIds = employeesByPersonId.values().stream()
                .map(Employee::getEmployeeId)
                .toList();
        Map<UUID, InstructorProfile> instructorsByEmployeeId = instructorProfileRepository.findActiveByEmployeeIds(employeeIds).stream()
                .collect(Collectors.toMap(InstructorProfile::getEmployeeId, Function.identity(), (left, right) -> left));
        Map<UUID, Staff> staffsByEmployeeId = staffRepository.findByEmployeeIdInAndDeletedAtIsNull(employeeIds).stream()
                .collect(Collectors.toMap(Staff::getEmployeeId, Function.identity(), (left, right) -> left));

        responses.forEach(response -> {
            response.setRoles(rolesByUserId.getOrDefault(response.getUserId(), List.of()));

            Student student = studentsByPersonId.get(response.getPersonId());
            if (student != null) {
                response.setDisplayCode(student.getStudentCode());
                response.setAccountType("STUDENT");
                return;
            }

            Employee employee = employeesByPersonId.get(response.getPersonId());
            if (employee == null) {
                applyRoleBasedIdentityFallback(response);
                return;
            }

            InstructorProfile instructor = instructorsByEmployeeId.get(employee.getEmployeeId());
            if (instructor != null) {
                response.setDisplayCode(instructor.getInstructorCode());
                response.setAccountType("INSTRUCTOR");
                return;
            }

            Staff staff = staffsByEmployeeId.get(employee.getEmployeeId());
            if (staff != null) {
                response.setDisplayCode(staff.getStaffCode());
                response.setAccountType("STAFF");
                return;
            }

            response.setDisplayCode(employee.getEmployeeCode());
            response.setAccountType(employee.getEmployeeType());
        });
    }

    private void applyRoleBasedIdentityFallback(UserAdminResponse response) {
        if (!StringUtils.hasText(response.getDisplayCode()) && response.getRoles() != null && response.getRoles().contains("ADMIN")) {
            response.setDisplayCode("ADMIN");
            response.setAccountType("ADMIN");
        }
    }

    private String resolveEmployeeDisplayCode(Employee employee) {
        return instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId())
                .map(instructor -> instructor.getInstructorCode())
                .or(() -> staffRepository.findByEmployeeIdAndDeletedAtIsNull(employee.getEmployeeId()).map(staff -> staff.getStaffCode()))
                .orElse(employee.getEmployeeCode());
    }

    private String resolveEmployeeAccountType(Employee employee) {
        if (instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId()).isPresent()) {
            return "INSTRUCTOR";
        }
        if (staffRepository.findByEmployeeIdAndDeletedAtIsNull(employee.getEmployeeId()).isPresent()) {
            return "STAFF";
        }
        return employee.getEmployeeType();
    }

    private List<String> findRoleCodes(UUID userId) {
        return userRoleRepository.findActiveRolesByUserId(userId).stream()
                .map(UserRole::getRole)
                .map(role -> role.getCode())
                .toList();
    }
}
