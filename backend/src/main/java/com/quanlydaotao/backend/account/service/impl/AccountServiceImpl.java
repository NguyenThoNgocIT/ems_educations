package com.quanlydaotao.backend.account.service.impl;
import com.quanlydaotao.backend.account.dto.AccountCreationRequest;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.user.entity.Employee;
import com.quanlydaotao.backend.staff.entity.Staff;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.lecturer.entity.LecturerProfile;
import com.quanlydaotao.backend.utils.StringUtil;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
@Service
@RequiredArgsConstructor
public class AccountServiceImpl {
    private final EntityManager entityManager;
    private final PasswordEncoder passwordEncoder;
    @Transactional
    public void createAccount(AccountCreationRequest req) {
        // 1. Person
        Person person = new Person();
        person.setFullName(req.getFullName());
        person.setGender(req.getGender());
        person.setDateOfBirth(req.getDateOfBirth());
        person.setContactEmail(req.getContactEmail());
        person.setPhoneNumber(req.getPhoneNumber());
        person.setPersonalIdentificationNumber(req.getPersonalIdentificationNumber());
        person.setFullNameNoAccent(StringUtil.removeAccents(req.getFullName()));
        entityManager.persist(person);
        // Compute common credentials
        String firstNameRaw = StringUtil.getFirstNameNoAccent(req.getFullName());
        String code = "";
        if ("STUDENT".equalsIgnoreCase(req.getType())) {
            Student s = new Student();
            s.setPerson(person);
            s.setStudentCode(req.getStudentCode());
            s.setTrainingProgramId(req.getTrainingProgramId());
            entityManager.persist(s);
            code = req.getStudentCode();
        } else {
            Employee e = new Employee();
            e.setPerson(person);
            e.setEmployeeCode(req.getEmployeeCode());
            e.setStartWorkDate(req.getStartWorkDate());
            e.setEmployeeType(req.getType());
            e.setStatus("ACTIVE");
            entityManager.persist(e);

            if ("INSTRUCTOR".equalsIgnoreCase(req.getType()) || "LECTURER".equalsIgnoreCase(req.getType())) {
                LecturerProfile lp = new LecturerProfile();
                lp.setEmployee(e);
                lp.setInstructorCode(req.getEmployeeCode());
                lp.setDepartmentId(req.getDepartmentId());
                lp.setDegreeId(req.getDegreeId());
                entityManager.persist(lp);
            } else if ("STAFF".equalsIgnoreCase(req.getType())) {
                Staff st = new Staff();
                st.setEmployee(e);
                st.setStaffCode(req.getEmployeeCode());
                st.setDivisionId(req.getDivisionId());
                st.setPositionId(req.getPositionId());
                entityManager.persist(st);
            }
            code = req.getEmployeeCode();
        }
        // Generate User
        User user = new User();
        user.setPerson(person);
        user.setUsername(code.toLowerCase());
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("ddMMyyyy");
        String rawPass = req.getDateOfBirth() != null ? req.getDateOfBirth().format(dtf) : "123456";
        user.setPasswordHash(passwordEncoder.encode(rawPass));
        String emailEdu = firstNameRaw + code.toLowerCase() + "@donga.edu.vn";
        user.setEmail(emailEdu);
        user.setRequirePasswordChange(true);
        entityManager.persist(user);
        // Generate Role
        String roleName = req.getType(); // Map exactly or match logic
        Role role = entityManager.createQuery("SELECT r FROM Role r WHERE r.code  = :code OR r.name = :code", Role.class)
                .setParameter("code", roleName)
                .getResultStream().findFirst().orElse(null);
        if (role != null) {
            UserRole ur = new UserRole();
            ur.setUser(user);
            ur.setRole(role);
            entityManager.persist(ur);
        }
    }
}