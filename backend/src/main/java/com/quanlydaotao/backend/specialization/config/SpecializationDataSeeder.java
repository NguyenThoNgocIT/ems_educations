package com.quanlydaotao.backend.specialization.config;

import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import com.quanlydaotao.backend.specialization.repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SpecializationDataSeeder implements ApplicationRunner {
    private final DepartmentRepository departmentRepository;
    private final MajorRepository majorRepository;
    private final SpecializationRepository specializationRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<SeedSpecialization> seeds = List.of(
                new SeedSpecialization("AI", "Trí tuệ nhân tạo", "Định hướng AI, học máy và ứng dụng thông minh", "CNTT", "CNTT01"),
                new SeedSpecialization("DATA", "Khoa học dữ liệu", "Phân tích dữ liệu, khai phá dữ liệu và trực quan hóa", "CNTT", "CNTT01"),
                new SeedSpecialization("SE", "Công nghệ phần mềm", "Phát triển, kiểm thử và quản trị dự án phần mềm", "CNTT", "CNTT02"),
                new SeedSpecialization("WEBMOB", "Web và di động", "Phát triển ứng dụng web, mobile và dịch vụ số", "CNTT", "CNTT02"),
                new SeedSpecialization("ACC", "Kế toán doanh nghiệp", "Kế toán tài chính, kế toán quản trị trong doanh nghiệp", "KTDL", "KTDL01"),
                new SeedSpecialization("AUDIT", "Kiểm toán", "Kiểm toán nội bộ, kiểm toán độc lập và kiểm soát rủi ro", "KTDL", "KTDL01"),
                new SeedSpecialization("MKT", "Marketing", "Quản trị thương hiệu, truyền thông và marketing số", "QTKD", "QTKD01"),
                new SeedSpecialization("LOG", "Logistics và chuỗi cung ứng", "Quản trị vận hành, logistics và chuỗi cung ứng", "QTKD", "QTKD01"),
                new SeedSpecialization("ENG-BUS", "Tiếng Anh thương mại", "Tiếng Anh trong môi trường kinh doanh và thương mại", "NN", "NN01"),
                new SeedSpecialization("ENG-TRANS", "Biên phiên dịch tiếng Anh", "Biên dịch, phiên dịch và giao tiếp liên văn hóa", "NN", "NN01")
        );

        for (SeedSpecialization seed : seeds) {
            Department department = departmentRepository.findByCode(seed.departmentCode()).orElse(null);
            Major major = majorRepository.findByCode(seed.majorCode()).orElse(null);
            if (department == null || major == null || !department.getDepartmentId().equals(major.getDepartmentId())) {
                continue;
            }

            specializationRepository.findByCode(seed.code()).ifPresentOrElse(existing -> {
                existing.setDepartmentId(department.getDepartmentId());
                existing.setMajorId(major.getMajorId());
                existing.setName(seed.name());
                existing.setDescription(seed.description());
                existing.setIsActive(true);
                existing.setDeletedAt(null);
                specializationRepository.save(existing);
            }, () -> {
                Specialization specialization = new Specialization();
                specialization.setDepartmentId(department.getDepartmentId());
                specialization.setMajorId(major.getMajorId());
                specialization.setCode(seed.code());
                specialization.setName(seed.name());
                specialization.setDescription(seed.description());
                specialization.setIsActive(true);
                specializationRepository.save(specialization);
            });
        }
    }

    private record SeedSpecialization(
            String code,
            String name,
            String description,
            String departmentCode,
            String majorCode
    ) {
    }
}
