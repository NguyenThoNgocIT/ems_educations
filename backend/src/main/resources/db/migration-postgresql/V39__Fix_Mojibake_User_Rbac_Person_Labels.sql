CREATE OR REPLACE FUNCTION fix_mojibake_vietnamese_label(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    first_pass TEXT;
    second_pass TEXT;
BEGIN
    IF input_text IS NULL THEN
        RETURN NULL;
    END IF;

    BEGIN
        first_pass := convert_from(convert_to(input_text, 'LATIN1'), 'UTF8');
    EXCEPTION WHEN OTHERS THEN
        RETURN input_text;
    END;

    BEGIN
        second_pass := convert_from(convert_to(first_pass, 'LATIN1'), 'UTF8');
        RETURN second_pass;
    EXCEPTION WHEN OTHERS THEN
        RETURN first_pass;
    END;
END;
$$;

UPDATE Persons
SET
    FullName = fix_mojibake_vietnamese_label(FullName),
    FullNameNoAccent = fix_mojibake_vietnamese_label(FullNameNoAccent),
    PlaceOfBirth = fix_mojibake_vietnamese_label(PlaceOfBirth),
    Ethnicity = fix_mojibake_vietnamese_label(Ethnicity),
    CardPlace = fix_mojibake_vietnamese_label(CardPlace),
    Nationality = fix_mojibake_vietnamese_label(Nationality),
    PermanentAddress = fix_mojibake_vietnamese_label(PermanentAddress),
    TemporaryAddress = fix_mojibake_vietnamese_label(TemporaryAddress),
    Note = fix_mojibake_vietnamese_label(Note);

UPDATE Users
SET LockReason = fix_mojibake_vietnamese_label(LockReason);

UPDATE Roles
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Permissions
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description),
    Module = fix_mojibake_vietnamese_label(Module);

UPDATE PermissionApis
SET Description = fix_mojibake_vietnamese_label(Description);

UPDATE Menus
SET MenuTitle = fix_mojibake_vietnamese_label(MenuTitle);

UPDATE PasswordResetRequests
SET
    FullName = fix_mojibake_vietnamese_label(FullName),
    AdminNote = fix_mojibake_vietnamese_label(AdminNote);

UPDATE Departments
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Majors
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Specializations
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Classes
SET ClassName = fix_mojibake_vietnamese_label(ClassName);

UPDATE Divisions
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Positions
SET Name = fix_mojibake_vietnamese_label(Name);

UPDATE Buildings
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Floors
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

UPDATE Rooms
SET
    Name = fix_mojibake_vietnamese_label(Name),
    Description = fix_mojibake_vietnamese_label(Description);

DROP FUNCTION fix_mojibake_vietnamese_label(TEXT);
