-- Older PostgreSQL migrations quoted these columns, so PostgreSQL kept their mixed-case names.
-- Hibernate uses unquoted identifiers for these mappings and therefore queries lowercase names.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'positions'
          AND column_name = 'Level'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'positions'
          AND column_name = 'level'
    ) THEN
        ALTER TABLE Positions RENAME COLUMN "Level" TO level;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'degrees'
          AND column_name = 'Level'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'degrees'
          AND column_name = 'level'
    ) THEN
        ALTER TABLE Degrees RENAME COLUMN "Level" TO level;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'courseprerequisites'
          AND column_name = 'Type'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'courseprerequisites'
          AND column_name = 'type'
    ) THEN
        ALTER TABLE CoursePrerequisites RENAME COLUMN "Type" TO type;
    END IF;
END $$;
