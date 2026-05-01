-- ==============================================================================
-- AFSMS (Automated Faculty Student Management System) - Master Database Schema
-- RDBMS: PostgreSQL 15+
-- ==============================================================================

-- ==============================================================================
-- 0. EXTENSII
-- ==============================================================================


-- ==============================================================================
-- 1. SECURITY & USER MODULE
-- ==============================================================================

CREATE TABLE ROLE (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE PERMISSION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE OPERATION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE USER_ACCOUNT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_subject VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    account_status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE AUTH_SESSION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_account_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address VARCHAR(45)
);

CREATE TABLE USER_ROLE (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE CASCADE,
    role_id UUID REFERENCES ROLE(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROLE_PERMISSION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES ROLE(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES PERMISSION(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ROLE_OPERATION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES ROLE(id) ON DELETE CASCADE,
    operation_id UUID REFERENCES OPERATION(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE USER_GROUP (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE USER_GROUP_MEMBER (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES USER_GROUP(id) ON DELETE CASCADE,
    user_account_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OUTLOOK_NOTIFICATION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sent_by_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    user_group_id UUID REFERENCES USER_GROUP(id) ON DELETE CASCADE,
    recipients TEXT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_preview TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(50)
);

-- ==============================================================================
-- 2. ACADEMIC DATA MODULE
-- ==============================================================================

CREATE TABLE ACADEMIC_YEAR (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_start INT NOT NULL,
    year_end INT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE SPECIALIZATION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    degree_level VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE STUDY_FORMATION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialization_id UUID REFERENCES SPECIALIZATION(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    education_form VARCHAR(50) NOT NULL,
    study_year INT NOT NULL,
    group_index INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE STUDENT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    study_formation_id UUID REFERENCES STUDY_FORMATION(id) ON DELETE SET NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    enrollment_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ENROLLED'
);

CREATE TABLE CURRICULUM (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    specialization_id UUID REFERENCES SPECIALIZATION(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    status VARCHAR(50) DEFAULT 'DRAFT'
);

CREATE TABLE CURRICULUM_SNAPSHOT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID REFERENCES CURRICULUM(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    disciplines_serialized TEXT NOT NULL,
    snapshot_status VARCHAR(50) DEFAULT 'ACTIVE'
);

CREATE TABLE DISCIPLINE (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculum_id UUID REFERENCES CURRICULUM(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    semester INT NOT NULL,
    evaluation_type VARCHAR(50) NOT NULL,
    ects_credits INT NOT NULL,
    contact_hours INT NOT NULL
);

CREATE TABLE GRADE (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES STUDENT(id) ON DELETE CASCADE,
    discipline_id UUID REFERENCES DISCIPLINE(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES ACADEMIC_YEAR(id) ON DELETE CASCADE,
    curriculum_snapshot_id UUID REFERENCES CURRICULUM_SNAPSHOT(id) ON DELETE CASCADE,
    graded_by_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    value DECIMAL(4, 2) NOT NULL CHECK (value >= 1 AND value <= 10),
    exam_session VARCHAR(50) NOT NULL,
    grading_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'MANUAL',
    validated BOOLEAN DEFAULT FALSE
);

-- ==============================================================================
-- 3. DATA IMPORT & VALIDATION MODULE
-- ==============================================================================

CREATE TABLE DATA_IMPORT_JOB (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiated_by_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    source_type VARCHAR(50) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PROCESSING',
    imported_records INT DEFAULT 0,
    rejected_records INT DEFAULT 0
);

CREATE TABLE DATA_TRANSFORMATION_RULE (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    input_field VARCHAR(100) NOT NULL,
    output_field VARCHAR(100) NOT NULL,
    expression TEXT NOT NULL,
    execution_order INT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IMPORT_JOB_RULE (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID REFERENCES DATA_IMPORT_JOB(id) ON DELETE CASCADE,
    transformation_rule_id UUID REFERENCES DATA_TRANSFORMATION_RULE(id) ON DELETE CASCADE,
    applied_order INT NOT NULL
);

CREATE TABLE VALIDATION_ERROR (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_job_id UUID REFERENCES DATA_IMPORT_JOB(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    field_name VARCHAR(100) NOT NULL,
    error_code VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    resolution_hint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. DOCUMENT MANAGEMENT MODULE
-- ==============================================================================

CREATE TABLE DOCUMENT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    file_path VARCHAR(500),
    original_filename VARCHAR(255)
);

-- ==============================================================================
-- 5. REPORTS MODULE
-- ==============================================================================

CREATE TABLE REPORT_DEFINITION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    visibility VARCHAR(50) DEFAULT 'PRIVATE',
    default_sort VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE REPORT_REQUEST (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_definition_id UUID REFERENCES REPORT_DEFINITION(id) ON DELETE CASCADE,
    requested_by_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    filter_json JSONB
);

CREATE TABLE E_GRADE_CENTRALIZER (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_request_id UUID REFERENCES REPORT_REQUEST(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES SPECIALIZATION(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES ACADEMIC_YEAR(id) ON DELETE CASCADE,
    study_year INT NOT NULL,
    education_form VARCHAR(50) NOT NULL,
    ordering VARCHAR(50) DEFAULT 'ALPHABETICAL',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE REPORT_ROW (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    centralizer_id UUID REFERENCES E_GRADE_CENTRALIZER(id) ON DELETE CASCADE,
    student_id UUID REFERENCES STUDENT(id) ON DELETE CASCADE,
    student_full_name VARCHAR(255) NOT NULL,
    average_grade DECIMAL(4, 2),
    credits_accumulated INT,
    row_payload_json JSONB
);

CREATE TABLE REPORT_EXPORT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_request_id UUID REFERENCES REPORT_REQUEST(id) ON DELETE CASCADE,
    exported_by_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    format VARCHAR(10) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. AUDIT & RECOVERY MODULE (ROLLBACK CORE)
-- ==============================================================================

CREATE TABLE RECOVERY_POINT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    point_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
    backup_reference VARCHAR(255),
    transaction_reference VARCHAR(255),
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE ROLLBACK_OPERATION (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    triggered_by_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    recovery_point_id UUID REFERENCES RECOVERY_POINT(id) ON DELETE SET NULL,
    target_point_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS'
);

CREATE TABLE BACKUP_JOB (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_type VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE,
    storage_location VARCHAR(500) NOT NULL,
    checksum VARCHAR(255),
    status VARCHAR(50) DEFAULT 'RUNNING'
);

CREATE TABLE BACKUP_JOB_RECOVERY_POINT (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_job_id UUID REFERENCES BACKUP_JOB(id) ON DELETE CASCADE,
    recovery_point_id UUID REFERENCES RECOVERY_POINT(id) ON DELETE CASCADE,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AUDIT_LOG_ENTRY (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES USER_ACCOUNT(id) ON DELETE SET NULL,
    operation_id UUID REFERENCES OPERATION(id) ON DELETE SET NULL,
    action_type VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    data_import_job_id UUID REFERENCES DATA_IMPORT_JOB(id) ON DELETE SET NULL,
    report_request_id UUID REFERENCES REPORT_REQUEST(id) ON DELETE SET NULL,
    report_export_id UUID REFERENCES REPORT_EXPORT(id) ON DELETE SET NULL,
    grade_id UUID REFERENCES GRADE(id) ON DELETE SET NULL,
    before_snapshot_json JSONB,
    after_snapshot_json JSONB,
    source_ip VARCHAR(45),
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- ==============================================================================
-- 7. PERFORMANȚĂ (INDEXURI PENTRU RAPORTARE ȘI CĂUTARE)
-- ==============================================================================

-- Baza academică
CREATE INDEX idx_student_registration ON STUDENT(registration_number);
CREATE INDEX idx_student_formation ON STUDENT(study_formation_id);
CREATE INDEX idx_grade_student ON GRADE(student_id);
CREATE INDEX idx_grade_snapshot ON GRADE(curriculum_snapshot_id);

-- Documente și Căutare
CREATE INDEX idx_document_author ON DOCUMENT(author_id);
CREATE INDEX idx_document_type_date ON DOCUMENT(type, created_at);

-- Audit și Rollback
CREATE INDEX idx_audit_entity ON AUDIT_LOG_ENTRY(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON AUDIT_LOG_ENTRY(actor_user_id);
CREATE INDEX idx_audit_date ON AUDIT_LOG_ENTRY(occurred_at);
