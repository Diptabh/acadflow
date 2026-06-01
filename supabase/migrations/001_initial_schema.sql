-- AcadFlow Database Schema
-- PostgreSQL via Supabase

-- ============================================================
-- USERS (Extension of Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'faculty', 'hod', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    university_roll VARCHAR(20) UNIQUE NOT NULL,
    upid VARCHAR(10),
    name VARCHAR(100) NOT NULL,
    programme VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    section VARCHAR(5),
    mobile VARCHAR(15),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- FACULTY
-- ============================================================
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    department VARCHAR(50) NOT NULL,
    signature_url TEXT,
    mobile VARCHAR(15),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    programme VARCHAR(50) NOT NULL,
    semester INTEGER NOT NULL,
    full_marks_ca1 INTEGER DEFAULT 20,
    full_marks_ca2 INTEGER DEFAULT 20,
    full_marks_ca3 INTEGER DEFAULT 50,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- COURSE OUTCOMES
-- ============================================================
CREATE TABLE IF NOT EXISTS course_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    co_number VARCHAR(10) NOT NULL,  -- CO1, CO2, CO3...
    description TEXT,
    bloom_level VARCHAR(5),  -- BL1-BL6
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CA3 ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ca3_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    date DATE,
    submitted_by UUID REFERENCES faculty(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    topsheet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CA3 QUESTION MARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS ca3_question_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES ca3_assessments(id) ON DELETE CASCADE,
    question_number VARCHAR(10) NOT NULL,
    marks_allotted INTEGER NOT NULL,
    marks_awarded INTEGER NOT NULL DEFAULT 0,
    co_id UUID REFERENCES course_outcomes(id) ON DELETE SET NULL,
    bloom_level VARCHAR(5),
    ar_reference VARCHAR(10),
    remarks VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CA2 ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ca2_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    assignment_title TEXT,
    submission_url TEXT,
    date DATE,
    submitted_by UUID REFERENCES faculty(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    topsheet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CA2 CRITERIA MARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS ca2_criteria_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES ca2_assessments(id) ON DELETE CASCADE,
    criteria_name VARCHAR(100) NOT NULL,
    marks_allotted INTEGER NOT NULL,
    marks_awarded INTEGER NOT NULL DEFAULT 0,
    co_id UUID REFERENCES course_outcomes(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CA1 ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS ca1_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    ppt_title TEXT,
    ppt_url TEXT,
    date DATE,
    submitted_by UUID REFERENCES faculty(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    topsheet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CA1 CRITERIA MARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS ca1_criteria_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES ca1_assessments(id) ON DELETE CASCADE,
    criteria_name VARCHAR(100) NOT NULL,
    marks_allotted INTEGER NOT NULL,
    marks_awarded INTEGER NOT NULL DEFAULT 0,
    co_id UUID REFERENCES course_outcomes(id) ON DELETE SET NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- COMBINED MARKSHEET
-- ============================================================
CREATE TABLE IF NOT EXISTS combined_marksheet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    ca1_total NUMERIC(5,2) DEFAULT 0,
    ca2_total NUMERIC(5,2) DEFAULT 0,
    ca3_total NUMERIC(5,2) DEFAULT 0,
    internal_total NUMERIC(5,2) DEFAULT 0,
    grade VARCHAR(5),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_university_roll ON students(university_roll);
CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_subjects_faculty_id ON subjects(faculty_id);
CREATE INDEX IF NOT EXISTS idx_course_outcomes_subject_id ON course_outcomes(subject_id);
CREATE INDEX IF NOT EXISTS idx_ca1_assessments_student_id ON ca1_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_ca1_assessments_subject_id ON ca1_assessments(subject_id);
CREATE INDEX IF NOT EXISTS idx_ca2_assessments_student_id ON ca2_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_ca2_assessments_subject_id ON ca2_assessments(subject_id);
CREATE INDEX IF NOT EXISTS idx_ca3_assessments_student_id ON ca3_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_ca3_assessments_subject_id ON ca3_assessments(subject_id);
CREATE INDEX IF NOT EXISTS idx_combined_marksheet_student_id ON combined_marksheet(student_id);
CREATE INDEX IF NOT EXISTS idx_combined_marksheet_subject_id ON combined_marksheet(subject_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca1_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca1_criteria_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca2_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca2_criteria_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca3_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ca3_question_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE combined_marksheet ENABLE ROW LEVEL SECURITY;

-- Users: Admin can manage all, others can read their own
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
    );

-- Students: Faculty can see all, students see own
-- (Policies to be refined based on auth implementation)

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at
    BEFORE UPDATE ON faculty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ca1_assessments_updated_at
    BEFORE UPDATE ON ca1_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ca2_assessments_updated_at
    BEFORE UPDATE ON ca2_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ca3_assessments_updated_at
    BEFORE UPDATE ON ca3_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
