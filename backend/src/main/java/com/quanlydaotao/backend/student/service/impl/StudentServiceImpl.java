package com.quanlydaotao.backend.student.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.mapper.StudentMapper;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.studentclass.service.StudentClassService;
import com.quanlydaotao.backend.studentstatus.service.StudentStatusHistoryService;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.utils.StringUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final AccountServiceImpl accountService;
    private final MajorRepository majorRepository;
    private final AcademicCohortRepository academicCohortRepository;
    private final StudentMapper studentMapper;
    private final StudentClassService studentClassService;
    private final StudentStatusHistoryService studentStatusHistoryService;

    @Override
    @Transactional
    public AccountCreationResponse createStudentForAdmin(StudentAdminCreateRequest request) {
        return accountService.createStudentAccount(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAdminResponse> getAllStudentsForAdmin() {
        return studentMapper.toDtoList(studentRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAdminResponse getStudentForAdmin(UUID id) {
        return studentMapper.toDto(findStudent(id));
    }

    @Override
    @Transactional
    public StudentAdminResponse updateStudentForAdmin(UUID id, StudentAdminUpdateRequest request) {
        Student student = findStudent(id);
        Person person = student.getPerson();

        if (StringUtils.hasText(request.getStudentCode()) && !request.getStudentCode().equalsIgnoreCase(student.getStudentCode())) {
            String studentCode = request.getStudentCode().trim().toUpperCase();
            if (studentRepository.findByStudentCode(studentCode).isPresent()) {
                throw new BusinessException("Mã sinh viên đã tồn tại");
            }
            student.setStudentCode(studentCode);
        }
        if (request.getTrainingProgramId() != null) {
            validateStudentProgramSelection(request.getMajorId(), request.getTrainingProgramId(), request.getAcademicCohortId());
            student.setTrainingProgramId(request.getTrainingProgramId());
        }
        if (request.getMajorId() != null) {
            if (!majorRepository.existsById(request.getMajorId())) {
                throw new BusinessException("Ngành không tồn tại");
            }
            student.setMajorId(request.getMajorId());
        }
        if (request.getAcademicCohortId() != null) {
            if (!academicCohortRepository.existsById(request.getAcademicCohortId())) {
                throw new BusinessException("Khóa học không tồn tại");
            }
            student.setAcademicCohortId(request.getAcademicCohortId());
        }
        if (request.getClassId() != null) {
            if (request.getSemesterId() == null) {
                throw new BusinessException("Học kỳ không được để trống khi cập nhật lớp hành chính cho sinh viên");
            }
            studentClassService.assignStudentToClass(student.getStudentId(), request.getClassId(), request.getSemesterId(),
                    null, "ACTIVE", request.getNote());
            student.setClassId(request.getClassId());
        }
        if (request.getStudentStatusId() != null) {
            studentStatusHistoryService.setCurrentStatus(student.getStudentId(), request.getStudentStatusId(),
                    request.getStudentStatusStartDate(), request.getStudentStatusReason());
        }
        if (request.getAdmissionDate() != null) {
            student.setAdmissionDate(request.getAdmissionDate());
        }
        if (request.getNote() != null) {
            student.setNote(request.getNote());
        }
        if (request.getIsActive() != null) {
            student.setIsActive(request.getIsActive());
        }

        updatePersonForAdmin(person, request);
        personRepository.save(person);
        return studentMapper.toDto(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudentForAdmin(UUID id) {
        Student student = findStudent(id);
        student.setIsActive(false);
        student.setDeletedAt(LocalDateTime.now());
        studentRepository.save(student);
        userRepository.findByPersonPersonId(student.getPerson().getPersonId()).ifPresent(user -> {
            user.setIsActive(false);
            user.setDeletedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public StudentSelfResponse getCurrentStudent(String username) {
        return studentMapper.toSelfDto(findCurrentStudent(username));
    }

    @Override
    @Transactional
    public StudentSelfResponse updateCurrentStudent(String username, StudentSelfUpdateRequest request) {
        Student student = findCurrentStudent(username);
        Person person = student.getPerson();
        updatePersonForSelf(person, request);
        personRepository.save(person);
        return studentMapper.toSelfDto(student);
    }

    private Student findStudent(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
    }

    private Student findCurrentStudent(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        return studentRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không phải sinh viên"));
    }

    private void updatePersonForAdmin(Person person, StudentAdminUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            person.setFullName(request.getFullName().trim());
        }
        if (StringUtils.hasText(request.getFullNameNoAccent())) {
            person.setFullNameNoAccent(StringUtil.normalizeForAccountCode(request.getFullNameNoAccent()));
        } else if (StringUtils.hasText(request.getFullName())) {
            person.setFullNameNoAccent(StringUtil.getFirstNameNoAccent(request.getFullName()));
        }
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getPlaceOfBirth() != null) person.setPlaceOfBirth(request.getPlaceOfBirth());
        if (request.getEthnicity() != null) person.setEthnicity(request.getEthnicity());
        if (request.getPersonalIdentificationNumber() != null) person.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        if (request.getDateOfIssue() != null) person.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null) person.setCardPlace(request.getCardPlace());
        if (request.getNationality() != null) person.setNationality(request.getNationality());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getPermanentAddress() != null) person.setPermanentAddress(request.getPermanentAddress());
        if (request.getTemporaryAddress() != null) person.setTemporaryAddress(request.getTemporaryAddress());
        if (request.getAvatarUrl() != null) person.setAvatarUrl(request.getAvatarUrl());
    }

    private void updatePersonForSelf(Person person, StudentSelfUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            person.setFullName(request.getFullName().trim());
            person.setFullNameNoAccent(StringUtil.getFirstNameNoAccent(request.getFullName()));
        }
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getPlaceOfBirth() != null) person.setPlaceOfBirth(request.getPlaceOfBirth());
        if (request.getEthnicity() != null) person.setEthnicity(request.getEthnicity());
        if (request.getDateOfIssue() != null) person.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null) person.setCardPlace(request.getCardPlace());
        if (request.getNationality() != null) person.setNationality(request.getNationality());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getPermanentAddress() != null) person.setPermanentAddress(request.getPermanentAddress());
        if (request.getTemporaryAddress() != null) person.setTemporaryAddress(request.getTemporaryAddress());
        if (request.getAvatarUrl() != null) person.setAvatarUrl(request.getAvatarUrl());
    }

    private void validateStudentProgramSelection(UUID majorId, UUID trainingProgramId, UUID academicCohortId) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(trainingProgramId)
                .orElseThrow(() -> new BusinessException("Chương trình đào tạo không tồn tại"));
        if (majorId != null && trainingProgram.getMajorId() != null && !majorId.equals(trainingProgram.getMajorId())) {
            throw new BusinessException("Ngành không khớp với chương trình đào tạo");
        }
        if (academicCohortId != null && trainingProgram.getAcademicCohortId() != null && !academicCohortId.equals(trainingProgram.getAcademicCohortId())) {
            throw new BusinessException("Khóa học không khớp với chương trình đào tạo");
        }
    }
}
