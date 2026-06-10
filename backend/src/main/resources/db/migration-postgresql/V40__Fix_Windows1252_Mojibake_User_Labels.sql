CREATE OR REPLACE FUNCTION fix_win1252_mojibake_vietnamese(input_text TEXT)
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
        first_pass := convert_from(convert_to(input_text, 'WIN1252'), 'UTF8');
    EXCEPTION WHEN OTHERS THEN
        RETURN input_text;
    END;

    BEGIN
        second_pass := convert_from(convert_to(first_pass, 'WIN1252'), 'UTF8');
        RETURN second_pass;
    EXCEPTION WHEN OTHERS THEN
        RETURN first_pass;
    END;
END;
$$;

UPDATE Persons
SET
    FullName = fix_win1252_mojibake_vietnamese(FullName),
    FullNameNoAccent = fix_win1252_mojibake_vietnamese(FullNameNoAccent),
    PlaceOfBirth = fix_win1252_mojibake_vietnamese(PlaceOfBirth),
    Ethnicity = fix_win1252_mojibake_vietnamese(Ethnicity),
    CardPlace = fix_win1252_mojibake_vietnamese(CardPlace),
    Nationality = fix_win1252_mojibake_vietnamese(Nationality),
    PermanentAddress = fix_win1252_mojibake_vietnamese(PermanentAddress),
    TemporaryAddress = fix_win1252_mojibake_vietnamese(TemporaryAddress),
    Note = fix_win1252_mojibake_vietnamese(Note);

UPDATE Users
SET LockReason = fix_win1252_mojibake_vietnamese(LockReason);

UPDATE Roles
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Permissions
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description),
    Module = fix_win1252_mojibake_vietnamese(Module);

UPDATE PermissionApis
SET Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Menus
SET MenuTitle = fix_win1252_mojibake_vietnamese(MenuTitle);

UPDATE PasswordResetRequests
SET
    FullName = fix_win1252_mojibake_vietnamese(FullName),
    AdminNote = fix_win1252_mojibake_vietnamese(AdminNote);

UPDATE Departments
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Majors
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Specializations
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Classes
SET ClassName = fix_win1252_mojibake_vietnamese(ClassName);

UPDATE Divisions
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Positions
SET Name = fix_win1252_mojibake_vietnamese(Name);

UPDATE Buildings
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Floors
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

UPDATE Rooms
SET
    Name = fix_win1252_mojibake_vietnamese(Name),
    Description = fix_win1252_mojibake_vietnamese(Description);

DROP FUNCTION fix_win1252_mojibake_vietnamese(TEXT);
