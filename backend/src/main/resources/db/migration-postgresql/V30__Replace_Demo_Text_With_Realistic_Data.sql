-- Replace visible demo/test labels with realistic operational text.

UPDATE StudentClasses
SET Note = 'Sinh viên được phân vào lớp hành chính theo ngành và khóa học'
WHERE Note ILIKE '%demo%'
   OR Note ILIKE '%test%';

UPDATE Schedules
SET Description = 'Lịch học chính thức theo kế hoạch đào tạo',
    Note = CASE
        WHEN Note IS NULL OR Note ILIKE '%demo%' OR Note ILIKE '%test%'
            THEN 'Sinh viên học tại phòng được phân công'
        ELSE Note
    END
WHERE Description ILIKE '%demo%'
   OR Description ILIKE '%test%'
   OR Note ILIKE '%demo%'
   OR Note ILIKE '%test%';

UPDATE Classes
SET Note = CASE
    WHEN ClassPhase = 'SPECIALIZATION' THEN 'Lớp chuyên ngành theo định hướng đào tạo'
    ELSE 'Lớp hành chính được khởi tạo theo kế hoạch tuyển sinh'
END
WHERE Note ILIKE '%demo%'
   OR Note ILIKE '%test%';
