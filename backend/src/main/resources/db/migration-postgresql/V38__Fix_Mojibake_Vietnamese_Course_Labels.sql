CREATE OR REPLACE FUNCTION fix_mojibake_vietnamese_label(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF input_text IS NULL THEN
        RETURN NULL;
    END IF;

    -- Fix common case: UTF-8 Vietnamese text was decoded/stored as Latin-1 text.
    RETURN convert_from(convert_to(input_text, 'LATIN1'), 'UTF8');
EXCEPTION WHEN OTHERS THEN
    RETURN input_text;
END;
$$;

UPDATE Courses
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description)
WHERE Name LIKE '%Ã%'
   OR Name LIKE '%Â%'
   OR Name LIKE '%áº%'
   OR Name LIKE '%á»%'
   OR Description LIKE '%Ã%'
   OR Description LIKE '%Â%'
   OR Description LIKE '%áº%'
   OR Description LIKE '%á»%';

UPDATE CourseClasses
SET
    Status = fix_mojibake_vietnamese_label(Status)
WHERE Status LIKE '%Ã%'
   OR Status LIKE '%Â%'
   OR Status LIKE '%áº%'
   OR Status LIKE '%á»%';

UPDATE Semesters
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description)
WHERE Name LIKE '%Ã%'
   OR Name LIKE '%Â%'
   OR Name LIKE '%áº%'
   OR Name LIKE '%á»%'
   OR Description LIKE '%Ã%'
   OR Description LIKE '%Â%'
   OR Description LIKE '%áº%'
   OR Description LIKE '%á»%';

DROP FUNCTION fix_mojibake_vietnamese_label(TEXT);
