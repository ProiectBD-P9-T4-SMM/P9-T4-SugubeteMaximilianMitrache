--
-- PostgreSQL database dump
--


-- Dumped from database version 17.11 (Debian 17.11-0+deb13u1)
-- Dumped by pg_dump version 17.11 (Debian 17.11-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.validation_error DROP CONSTRAINT IF EXISTS validation_error_import_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_role DROP CONSTRAINT IF EXISTS user_role_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_role DROP CONSTRAINT IF EXISTS user_role_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_group_member DROP CONSTRAINT IF EXISTS user_group_member_user_account_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_group_member DROP CONSTRAINT IF EXISTS user_group_member_group_id_fkey;
ALTER TABLE IF EXISTS ONLY public.study_formation DROP CONSTRAINT IF EXISTS study_formation_specialization_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student DROP CONSTRAINT IF EXISTS student_study_formation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_curriculum DROP CONSTRAINT IF EXISTS student_curriculum_study_formation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_curriculum DROP CONSTRAINT IF EXISTS student_curriculum_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.student_curriculum DROP CONSTRAINT IF EXISTS student_curriculum_curriculum_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rollback_operation DROP CONSTRAINT IF EXISTS rollback_operation_triggered_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rollback_operation DROP CONSTRAINT IF EXISTS rollback_operation_recovery_point_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permission DROP CONSTRAINT IF EXISTS role_permission_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permission DROP CONSTRAINT IF EXISTS role_permission_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_operation DROP CONSTRAINT IF EXISTS role_operation_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_operation DROP CONSTRAINT IF EXISTS role_operation_operation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.report_row DROP CONSTRAINT IF EXISTS report_row_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.report_row DROP CONSTRAINT IF EXISTS report_row_centralizer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.report_request DROP CONSTRAINT IF EXISTS report_request_requested_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.report_request DROP CONSTRAINT IF EXISTS report_request_report_definition_id_fkey;
ALTER TABLE IF EXISTS ONLY public.report_export DROP CONSTRAINT IF EXISTS report_export_report_request_id_fkey;
ALTER TABLE IF EXISTS ONLY public.report_export DROP CONSTRAINT IF EXISTS report_export_exported_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.outlook_notification DROP CONSTRAINT IF EXISTS outlook_notification_user_group_id_fkey;
ALTER TABLE IF EXISTS ONLY public.outlook_notification DROP CONSTRAINT IF EXISTS outlook_notification_sent_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.import_job_rule DROP CONSTRAINT IF EXISTS import_job_rule_transformation_rule_id_fkey;
ALTER TABLE IF EXISTS ONLY public.import_job_rule DROP CONSTRAINT IF EXISTS import_job_rule_import_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade DROP CONSTRAINT IF EXISTS grade_student_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade DROP CONSTRAINT IF EXISTS grade_graded_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade DROP CONSTRAINT IF EXISTS grade_discipline_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade DROP CONSTRAINT IF EXISTS grade_curriculum_snapshot_id_fkey;
ALTER TABLE IF EXISTS ONLY public.grade DROP CONSTRAINT IF EXISTS grade_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.e_grade_centralizer DROP CONSTRAINT IF EXISTS e_grade_centralizer_specialization_id_fkey;
ALTER TABLE IF EXISTS ONLY public.e_grade_centralizer DROP CONSTRAINT IF EXISTS e_grade_centralizer_report_request_id_fkey;
ALTER TABLE IF EXISTS ONLY public.e_grade_centralizer DROP CONSTRAINT IF EXISTS e_grade_centralizer_academic_year_id_fkey;
ALTER TABLE IF EXISTS ONLY public.document DROP CONSTRAINT IF EXISTS document_author_id_fkey;
ALTER TABLE IF EXISTS ONLY public.document DROP CONSTRAINT IF EXISTS document_assigned_to_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.discipline DROP CONSTRAINT IF EXISTS discipline_curriculum_id_fkey;
ALTER TABLE IF EXISTS ONLY public.data_import_job DROP CONSTRAINT IF EXISTS data_import_job_initiated_by_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculum DROP CONSTRAINT IF EXISTS curriculum_specialization_id_fkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_snapshot DROP CONSTRAINT IF EXISTS curriculum_snapshot_curriculum_id_fkey;
ALTER TABLE IF EXISTS ONLY public.backup_job_recovery_point DROP CONSTRAINT IF EXISTS backup_job_recovery_point_recovery_point_id_fkey;
ALTER TABLE IF EXISTS ONLY public.backup_job_recovery_point DROP CONSTRAINT IF EXISTS backup_job_recovery_point_backup_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.auth_session DROP CONSTRAINT IF EXISTS auth_session_user_account_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_report_request_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_report_export_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_operation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_grade_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_data_import_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_actor_user_id_fkey;
DROP INDEX IF EXISTS public.idx_student_registration;
DROP INDEX IF EXISTS public.idx_student_formation;
DROP INDEX IF EXISTS public.idx_grade_student;
DROP INDEX IF EXISTS public.idx_grade_snapshot;
DROP INDEX IF EXISTS public.idx_document_type_date;
DROP INDEX IF EXISTS public.idx_document_author;
DROP INDEX IF EXISTS public.idx_audit_entity;
DROP INDEX IF EXISTS public.idx_audit_date;
DROP INDEX IF EXISTS public.idx_audit_actor;
ALTER TABLE IF EXISTS ONLY public.validation_error DROP CONSTRAINT IF EXISTS validation_error_pkey;
ALTER TABLE IF EXISTS ONLY public.user_role DROP CONSTRAINT IF EXISTS user_role_pkey;
ALTER TABLE IF EXISTS ONLY public.user_group DROP CONSTRAINT IF EXISTS user_group_pkey;
ALTER TABLE IF EXISTS ONLY public.user_group_member DROP CONSTRAINT IF EXISTS user_group_member_pkey;
ALTER TABLE IF EXISTS ONLY public.user_account DROP CONSTRAINT IF EXISTS user_account_username_key;
ALTER TABLE IF EXISTS ONLY public.user_account DROP CONSTRAINT IF EXISTS user_account_sso_subject_key;
ALTER TABLE IF EXISTS ONLY public.user_account DROP CONSTRAINT IF EXISTS user_account_pkey;
ALTER TABLE IF EXISTS ONLY public.user_account DROP CONSTRAINT IF EXISTS user_account_email_key;
ALTER TABLE IF EXISTS ONLY public.system_settings DROP CONSTRAINT IF EXISTS system_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.system_setting DROP CONSTRAINT IF EXISTS system_setting_pkey;
ALTER TABLE IF EXISTS ONLY public.system_setting DROP CONSTRAINT IF EXISTS system_setting_key_key;
ALTER TABLE IF EXISTS ONLY public.study_formation DROP CONSTRAINT IF EXISTS study_formation_pkey;
ALTER TABLE IF EXISTS ONLY public.study_formation DROP CONSTRAINT IF EXISTS study_formation_code_key;
ALTER TABLE IF EXISTS ONLY public.student DROP CONSTRAINT IF EXISTS student_registration_number_key;
ALTER TABLE IF EXISTS ONLY public.student DROP CONSTRAINT IF EXISTS student_pkey;
ALTER TABLE IF EXISTS ONLY public.student DROP CONSTRAINT IF EXISTS student_email_key;
ALTER TABLE IF EXISTS ONLY public.student_curriculum DROP CONSTRAINT IF EXISTS student_curriculum_pkey;
ALTER TABLE IF EXISTS ONLY public.specialization DROP CONSTRAINT IF EXISTS specialization_pkey;
ALTER TABLE IF EXISTS ONLY public.specialization DROP CONSTRAINT IF EXISTS specialization_code_key;
ALTER TABLE IF EXISTS ONLY public.rollback_operation DROP CONSTRAINT IF EXISTS rollback_operation_pkey;
ALTER TABLE IF EXISTS ONLY public.role DROP CONSTRAINT IF EXISTS role_pkey;
ALTER TABLE IF EXISTS ONLY public.role_permission DROP CONSTRAINT IF EXISTS role_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.role_operation DROP CONSTRAINT IF EXISTS role_operation_pkey;
ALTER TABLE IF EXISTS ONLY public.role DROP CONSTRAINT IF EXISTS role_code_key;
ALTER TABLE IF EXISTS ONLY public.report_row DROP CONSTRAINT IF EXISTS report_row_pkey;
ALTER TABLE IF EXISTS ONLY public.report_request DROP CONSTRAINT IF EXISTS report_request_pkey;
ALTER TABLE IF EXISTS ONLY public.report_export DROP CONSTRAINT IF EXISTS report_export_pkey;
ALTER TABLE IF EXISTS ONLY public.report_definition DROP CONSTRAINT IF EXISTS report_definition_pkey;
ALTER TABLE IF EXISTS ONLY public.report_definition DROP CONSTRAINT IF EXISTS report_definition_code_key;
ALTER TABLE IF EXISTS ONLY public.recovery_point DROP CONSTRAINT IF EXISTS recovery_point_pkey;
ALTER TABLE IF EXISTS ONLY public.permission DROP CONSTRAINT IF EXISTS permission_pkey;
ALTER TABLE IF EXISTS ONLY public.permission DROP CONSTRAINT IF EXISTS permission_code_key;
ALTER TABLE IF EXISTS ONLY public.outlook_notification DROP CONSTRAINT IF EXISTS outlook_notification_pkey;
ALTER TABLE IF EXISTS ONLY public.operation DROP CONSTRAINT IF EXISTS operation_pkey;
ALTER TABLE IF EXISTS ONLY public.operation DROP CONSTRAINT IF EXISTS operation_code_key;
ALTER TABLE IF EXISTS ONLY public.import_job_rule DROP CONSTRAINT IF EXISTS import_job_rule_pkey;
ALTER TABLE IF EXISTS ONLY public.grade DROP CONSTRAINT IF EXISTS grade_pkey;
ALTER TABLE IF EXISTS ONLY public.e_grade_centralizer DROP CONSTRAINT IF EXISTS e_grade_centralizer_pkey;
ALTER TABLE IF EXISTS ONLY public.document DROP CONSTRAINT IF EXISTS document_pkey;
ALTER TABLE IF EXISTS ONLY public.discipline DROP CONSTRAINT IF EXISTS discipline_pkey;
ALTER TABLE IF EXISTS ONLY public.discipline DROP CONSTRAINT IF EXISTS discipline_code_key;
ALTER TABLE IF EXISTS ONLY public.data_transformation_rule DROP CONSTRAINT IF EXISTS data_transformation_rule_pkey;
ALTER TABLE IF EXISTS ONLY public.data_import_job DROP CONSTRAINT IF EXISTS data_import_job_pkey;
ALTER TABLE IF EXISTS ONLY public.curriculum_snapshot DROP CONSTRAINT IF EXISTS curriculum_snapshot_pkey;
ALTER TABLE IF EXISTS ONLY public.curriculum DROP CONSTRAINT IF EXISTS curriculum_pkey;
ALTER TABLE IF EXISTS ONLY public.curriculum DROP CONSTRAINT IF EXISTS curriculum_code_key;
ALTER TABLE IF EXISTS ONLY public.backup_job_recovery_point DROP CONSTRAINT IF EXISTS backup_job_recovery_point_pkey;
ALTER TABLE IF EXISTS ONLY public.backup_job DROP CONSTRAINT IF EXISTS backup_job_pkey;
ALTER TABLE IF EXISTS ONLY public.backup_config DROP CONSTRAINT IF EXISTS backup_config_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_session DROP CONSTRAINT IF EXISTS auth_session_session_token_key;
ALTER TABLE IF EXISTS ONLY public.auth_session DROP CONSTRAINT IF EXISTS auth_session_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_log_entry DROP CONSTRAINT IF EXISTS audit_log_entry_pkey;
ALTER TABLE IF EXISTS ONLY public.academic_year DROP CONSTRAINT IF EXISTS academic_year_pkey;
ALTER TABLE IF EXISTS public.system_setting ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.validation_error;
DROP TABLE IF EXISTS public.user_role;
DROP TABLE IF EXISTS public.user_group_member;
DROP TABLE IF EXISTS public.user_group;
DROP TABLE IF EXISTS public.user_account;
DROP TABLE IF EXISTS public.system_settings;
DROP SEQUENCE IF EXISTS public.system_setting_id_seq;
DROP TABLE IF EXISTS public.system_setting;
DROP TABLE IF EXISTS public.study_formation;
DROP TABLE IF EXISTS public.student_curriculum;
DROP TABLE IF EXISTS public.student;
DROP TABLE IF EXISTS public.specialization;
DROP TABLE IF EXISTS public.rollback_operation;
DROP TABLE IF EXISTS public.role_permission;
DROP TABLE IF EXISTS public.role_operation;
DROP TABLE IF EXISTS public.role;
DROP TABLE IF EXISTS public.report_row;
DROP TABLE IF EXISTS public.report_request;
DROP TABLE IF EXISTS public.report_export;
DROP TABLE IF EXISTS public.report_definition;
DROP TABLE IF EXISTS public.recovery_point;
DROP TABLE IF EXISTS public.permission;
DROP TABLE IF EXISTS public.outlook_notification;
DROP TABLE IF EXISTS public.operation;
DROP TABLE IF EXISTS public.import_job_rule;
DROP TABLE IF EXISTS public.grade;
DROP TABLE IF EXISTS public.e_grade_centralizer;
DROP TABLE IF EXISTS public.document;
DROP TABLE IF EXISTS public.discipline;
DROP TABLE IF EXISTS public.data_transformation_rule;
DROP TABLE IF EXISTS public.data_import_job;
DROP TABLE IF EXISTS public.curriculum_snapshot;
DROP TABLE IF EXISTS public.curriculum;
DROP TABLE IF EXISTS public.backup_job_recovery_point;
DROP TABLE IF EXISTS public.backup_job;
DROP TABLE IF EXISTS public.backup_config;
DROP TABLE IF EXISTS public.auth_session;
DROP TABLE IF EXISTS public.audit_log_entry;
DROP TABLE IF EXISTS public.academic_year;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_year; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.academic_year (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    year_start integer NOT NULL,
    year_end integer NOT NULL,
    is_active boolean DEFAULT false
);


--
-- Name: audit_log_entry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log_entry (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_user_id uuid,
    operation_id uuid,
    action_type character varying(50) NOT NULL,
    module character varying(50) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id uuid NOT NULL,
    data_import_job_id uuid,
    report_request_id uuid,
    report_export_id uuid,
    grade_id uuid,
    before_snapshot_json jsonb,
    after_snapshot_json jsonb,
    source_ip character varying(45),
    occurred_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    success boolean DEFAULT true,
    error_message text
);


--
-- Name: auth_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_account_id uuid,
    session_token character varying(255) NOT NULL,
    issued_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp with time zone NOT NULL,
    ip_address character varying(45)
);


--
-- Name: backup_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cron_expression character varying(100) DEFAULT '0 0 * * *'::character varying,
    enabled boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: backup_job; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_job (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    backup_type character varying(50) NOT NULL,
    scheduled_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone,
    storage_location character varying(500) NOT NULL,
    checksum character varying(255),
    status character varying(50) DEFAULT 'RUNNING'::character varying
);


--
-- Name: backup_job_recovery_point; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_job_recovery_point (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    backup_job_id uuid,
    recovery_point_id uuid,
    linked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: curriculum; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curriculum (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    specialization_id uuid,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    valid_from date NOT NULL,
    valid_to date,
    status character varying(50) DEFAULT 'DRAFT'::character varying
);


--
-- Name: curriculum_snapshot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curriculum_snapshot (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    curriculum_id uuid,
    snapshot_date date NOT NULL,
    disciplines_serialized text NOT NULL,
    snapshot_status character varying(50) DEFAULT 'ACTIVE'::character varying
);


--
-- Name: data_import_job; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_import_job (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    initiated_by_user_id uuid,
    source_type character varying(50) NOT NULL,
    source_name character varying(255) NOT NULL,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone,
    status character varying(50) DEFAULT 'PROCESSING'::character varying,
    imported_records integer DEFAULT 0,
    rejected_records integer DEFAULT 0
);


--
-- Name: data_transformation_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_transformation_rule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    rule_type character varying(50) NOT NULL,
    input_field character varying(100) NOT NULL,
    output_field character varying(100) NOT NULL,
    expression text NOT NULL,
    execution_order integer NOT NULL,
    enabled boolean DEFAULT true
);


--
-- Name: discipline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discipline (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    curriculum_id uuid,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    semester integer NOT NULL,
    evaluation_type character varying(50) NOT NULL,
    ects_credits integer NOT NULL,
    contact_hours integer NOT NULL
);


--
-- Name: document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    author_id uuid,
    title character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'DRAFT'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    content text,
    file_path character varying(500),
    original_filename character varying(255),
    assigned_to_user_id uuid,
    revision_notes text
);


--
-- Name: e_grade_centralizer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.e_grade_centralizer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_request_id uuid,
    specialization_id uuid,
    academic_year_id uuid,
    study_year integer NOT NULL,
    education_form character varying(50) NOT NULL,
    ordering character varying(50) DEFAULT 'ALPHABETICAL'::character varying,
    generated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: grade; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grade (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid,
    discipline_id uuid,
    academic_year_id uuid,
    curriculum_snapshot_id uuid,
    graded_by_user_id uuid,
    value numeric(4,2) NOT NULL,
    exam_session character varying(50) NOT NULL,
    grading_date date NOT NULL,
    source character varying(50) DEFAULT 'MANUAL'::character varying,
    validated boolean DEFAULT false,
    CONSTRAINT grade_value_check CHECK (((value >= (0)::numeric) AND (value <= (10)::numeric)))
);


--
-- Name: import_job_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.import_job_rule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_job_id uuid,
    transformation_rule_id uuid,
    applied_order integer NOT NULL
);


--
-- Name: operation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.operation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    module character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    description text
);


--
-- Name: outlook_notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.outlook_notification (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sent_by_user_id uuid,
    user_group_id uuid,
    recipients text NOT NULL,
    subject character varying(255) NOT NULL,
    body_preview text,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    delivery_status character varying(50)
);


--
-- Name: permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    module character varying(50) NOT NULL,
    action character varying(50) NOT NULL,
    description text
);


--
-- Name: recovery_point; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recovery_point (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    point_in_time timestamp with time zone NOT NULL,
    backup_reference character varying(255),
    transaction_reference character varying(255),
    available boolean DEFAULT true
);


--
-- Name: report_definition; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_definition (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    report_type character varying(50) NOT NULL,
    visibility character varying(50) DEFAULT 'PRIVATE'::character varying,
    default_sort character varying(100),
    active boolean DEFAULT true
);


--
-- Name: report_export; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_export (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_request_id uuid,
    exported_by_user_id uuid,
    format character varying(10) NOT NULL,
    file_name character varying(255) NOT NULL,
    storage_path character varying(500) NOT NULL,
    exported_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: report_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_request (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    report_definition_id uuid,
    requested_by_user_id uuid,
    requested_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'PENDING'::character varying,
    filter_json jsonb
);


--
-- Name: report_row; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_row (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    centralizer_id uuid,
    student_id uuid,
    student_full_name character varying(255) NOT NULL,
    average_grade numeric(4,2),
    credits_accumulated integer,
    row_payload_json jsonb
);


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


--
-- Name: role_operation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_operation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid,
    operation_id uuid,
    granted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: role_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permission (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid,
    permission_id uuid,
    granted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: rollback_operation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rollback_operation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    triggered_by_user_id uuid,
    recovery_point_id uuid,
    target_point_in_time timestamp with time zone NOT NULL,
    reason text NOT NULL,
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone,
    status character varying(50) DEFAULT 'IN_PROGRESS'::character varying
);


--
-- Name: specialization; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialization (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    degree_level character varying(50) NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    study_formation_id uuid,
    registration_number character varying(50) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    enrollment_date date NOT NULL,
    status character varying(50) DEFAULT 'ENROLLED'::character varying
);


--
-- Name: student_curriculum; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_curriculum (
    student_id uuid NOT NULL,
    curriculum_id uuid NOT NULL,
    enrolled_at date DEFAULT CURRENT_DATE,
    status character varying(20) DEFAULT 'ACTIVE'::character varying,
    study_formation_id uuid
);


--
-- Name: study_formation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.study_formation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    specialization_id uuid,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    education_form character varying(50) NOT NULL,
    study_year integer NOT NULL,
    group_index integer NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: system_setting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_setting (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: system_setting_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.system_setting_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: system_setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.system_setting_id_seq OWNED BY public.system_setting.id;


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_settings (
    key character varying(100) NOT NULL,
    value text NOT NULL,
    category character varying(50) DEFAULT 'GENERAL'::character varying NOT NULL,
    label character varying(255),
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sso_subject character varying(255) NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    account_status character varying(50) DEFAULT 'ACTIVE'::character varying
);


--
-- Name: user_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_group_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_group_member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid,
    user_account_id uuid,
    joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    role_id uuid,
    assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: validation_error; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.validation_error (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    import_job_id uuid,
    entity_type character varying(50) NOT NULL,
    entity_id uuid,
    field_name character varying(100) NOT NULL,
    error_code character varying(50) NOT NULL,
    message text NOT NULL,
    resolution_hint text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: system_setting id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_setting ALTER COLUMN id SET DEFAULT nextval('public.system_setting_id_seq'::regclass);


--
-- Data for Name: academic_year; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.academic_year (id, year_start, year_end, is_active) FROM stdin;
5290bd9f-c045-4da4-ad00-d200c325e71e	2023	2024	t
752def98-9005-4244-a6a4-094f64ee017a	2025	2026	t
22d62efd-33fb-4e03-88e9-792df02df8d6	2026	2027	t
6432c0b1-78f0-4dd5-998a-c2888e12573d	2024	2025	t
f21efcfa-ebcc-4d4b-b23b-2cab502199d4	2022	2023	t
8db341d1-6ddc-439a-9160-d0480abbaef6	2021	2022	t
e57a19ab-7204-485c-b130-b1e08df9554c	2020	2021	t
e639f0df-e652-491a-bfc8-5a6ae3089509	2019	2020	t
4c793926-1fe9-45f5-ba32-c14eabea32e6	2018	2019	t
9dc4f888-c62a-4ab3-8aaf-9867cbe21840	2017	2018	t
6808fbed-3af0-433f-9438-de667a4d4eb9	2016	2017	t
915a9589-6a7c-4679-82eb-ae4e5a7a0a3a	2015	2016	t
12200eac-02d4-4c15-baff-e3a682100116	2014	2015	t
48a42042-2560-498f-a42e-c28bc902b377	2013	2014	t
ebcb9a97-a0b0-483a-9cc1-7ce5b0e3e044	2012	2013	t
\.


--
-- Data for Name: audit_log_entry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_log_entry (id, actor_user_id, operation_id, action_type, module, entity_type, entity_id, data_import_job_id, report_request_id, report_export_id, grade_id, before_snapshot_json, after_snapshot_json, source_ip, occurred_at, success, error_message) FROM stdin;
b2ecfd72-04ff-48c2-8a09-9e21eb91f386	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	a7e5409e-fa2c-4d9f-91ee-a2c504472b97	\N	\N	\N	\N	{"id": "a7e5409e-fa2c-4d9f-91ee-a2c504472b97", "email": "student1@mock.ucv.ro", "status": "ENROLLED", "last_name": "StudentFictiv1", "first_name": "Andrei", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT001"}	{"id": "a7e5409e-fa2c-4d9f-91ee-a2c504472b97", "email": "student1@mock.ucv.ro", "status": "ENROLLED", "last_name": "StudentFictiv55555", "first_name": "Andrei", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT001"}	\N	2026-04-30 12:22:55.829+03	t	\N
48b1f653-9560-4ac6-b20a-8c05d5f710bd	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	a7e5409e-fa2c-4d9f-91ee-a2c504472b97	\N	\N	\N	\N	{"id": "a7e5409e-fa2c-4d9f-91ee-a2c504472b97", "email": "student1@mock.ucv.ro", "status": "ENROLLED", "last_name": "StudentFictiv55555", "first_name": "Andrei", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT001"}	{"id": "a7e5409e-fa2c-4d9f-91ee-a2c504472b97", "email": "student1@mock.ucv.ro", "status": "INACTIVE", "last_name": "StudentFictiv55555", "first_name": "Andrei", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT001"}	\N	2026-04-30 12:23:06.914+03	t	\N
8b3d727f-1333-4153-9c5d-dc1f879dda03	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	a7e5409e-fa2c-4d9f-91ee-a2c504472b97	\N	\N	\N	\N	{"id": "a7e5409e-fa2c-4d9f-91ee-a2c504472b97", "email": "student1@mock.ucv.ro", "status": "INACTIVE", "last_name": "StudentFictiv55555", "first_name": "Andrei", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT001"}	{"id": "a7e5409e-fa2c-4d9f-91ee-a2c504472b97", "email": "student1@mock.ucv.ro", "status": "ENROLLED", "last_name": "StudentFictiv55555", "first_name": "Andrei", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT001"}	\N	2026-04-30 12:27:24.315+03	t	\N
e8371d75-b42d-4696-9494-b34c4a8bfca1	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	789ed788-48ae-4547-aefc-12c22dce1083	\N	\N	\N	\N	{"id": "789ed788-48ae-4547-aefc-12c22dce1083", "email": "student2@mock.ucv.ro", "status": "ENROLLED", "last_name": "StudentFictiv2", "first_name": "Marian", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT002"}	{"id": "789ed788-48ae-4547-aefc-12c22dce1083", "email": "student2@mock.ucv.ro", "status": "INACTIVE", "last_name": "StudentFictiv2", "first_name": "Marian", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT002"}	\N	2026-04-30 12:27:52.252+03	t	\N
3e84dab7-7186-422d-8aea-8530e2fca35c	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	789ed788-48ae-4547-aefc-12c22dce1083	\N	\N	\N	\N	{"id": "789ed788-48ae-4547-aefc-12c22dce1083", "email": "student2@mock.ucv.ro", "status": "INACTIVE", "last_name": "StudentFictiv2", "first_name": "Marian", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT002"}	{"id": "789ed788-48ae-4547-aefc-12c22dce1083", "email": "student2@mock.ucv.ro", "status": "ENROLLED", "last_name": "StudentFictiv2", "first_name": "Marian", "enrollment_date": "2021-09-30T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT002"}	\N	2026-04-30 12:28:02.815+03	t	\N
9e2312cf-75ec-440c-8b24-b2c48fa8255f	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	STUDENT	05d1d1fa-e550-4766-a132-ad0399640119	\N	\N	\N	\N	\N	{"id": "05d1d1fa-e550-4766-a132-ad0399640119", "email": "ana.ionescu99@test.ro", "status": "ACTIVE", "last_name": "Ionescu", "first_name": "Ana", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "e1a89eba-c777-4774-a5c7-7a064a70e313", "registration_number": "MAT5236"}	\N	2026-04-30 13:04:37.136+03	t	\N
0a1a8f14-4e70-4f42-970f-7ce7b45b6ebe	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	a9cfaa24-01b5-4cd8-8c20-e86644b0ea62	\N	\N	\N	\N	{"id": "a9cfaa24-01b5-4cd8-8c20-e86644b0ea62", "email": "daniel.barbu@student.ucv.ro", "status": "ENROLLED", "last_name": "Barbu", "first_name": "Daniel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "4752462f-e402-4896-a700-eb4d289005d3", "registration_number": "MAT0011"}	{"id": "a9cfaa24-01b5-4cd8-8c20-e86644b0ea62", "email": "daniel.barbu@student.ucv.ro", "status": "ENROLLED", "last_name": "Barbu", "first_name": "Daniel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "33eb807a-ac98-4aba-b2ca-3e4429164a6b", "registration_number": "MAT0011"}	\N	2026-04-30 13:18:09.617+03	t	\N
73adda4b-dc44-48d9-b3fb-f5558e7faf5b	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	230e55ab-734a-40ce-8c0d-39467894639a	\N	\N	\N	\N	{"id": "230e55ab-734a-40ce-8c0d-39467894639a", "email": "stefan.dima@student.ucv.ro", "status": "ENROLLED", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "303401d3-4a5a-4799-9da2-edac76853d0f", "registration_number": "MAT0015"}	{"id": "230e55ab-734a-40ce-8c0d-39467894639a", "email": "stefan.dima@student.ucv.ro", "status": "ENROLLED", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "4ab99334-f228-438a-9206-6289588018f9", "registration_number": "MAT0015"}	\N	2026-04-30 13:18:24.468+03	t	\N
7715ada7-a544-4c10-a102-2b61b6609767	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	a9cfaa24-01b5-4cd8-8c20-e86644b0ea62	\N	\N	\N	\N	{"id": "a9cfaa24-01b5-4cd8-8c20-e86644b0ea62", "email": "daniel.barbu@student.ucv.ro", "status": "ENROLLED", "last_name": "Barbu", "first_name": "Daniel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "33eb807a-ac98-4aba-b2ca-3e4429164a6b", "registration_number": "MAT0011"}	{"id": "a9cfaa24-01b5-4cd8-8c20-e86644b0ea62", "email": "daniel.barbu@student.ucv.ro", "status": "SUSPENDED", "last_name": "Barbu", "first_name": "Daniel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "ee250ac5-6cac-444d-a17e-7bcece0dc662", "registration_number": "MAT0011"}	\N	2026-04-30 13:18:41.617+03	t	\N
0be1eadf-193f-4aa2-95fc-206c2199d9d6	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	a9cfaa24-01b5-4cd8-8c20-e86644b0ea62	\N	\N	\N	\N	{"id": "a9cfaa24-01b5-4cd8-8c20-e86644b0ea62", "email": "daniel.barbu@student.ucv.ro", "status": "SUSPENDED", "last_name": "Barbu", "first_name": "Daniel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "ee250ac5-6cac-444d-a17e-7bcece0dc662", "registration_number": "MAT0011"}	{"id": "a9cfaa24-01b5-4cd8-8c20-e86644b0ea62", "email": "daniel.barbu@student.ucv.ro", "status": "ENROLLED", "last_name": "Barbu", "first_name": "Daniel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "33eb807a-ac98-4aba-b2ca-3e4429164a6b", "registration_number": "MAT0011"}	\N	2026-04-30 20:21:58.757+03	t	\N
e50990d5-afaf-40e3-813d-659d58ea8abd	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	230e55ab-734a-40ce-8c0d-39467894639a	\N	\N	\N	\N	{"id": "230e55ab-734a-40ce-8c0d-39467894639a", "email": "stefan.dima@student.ucv.ro", "status": "ENROLLED", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "4ab99334-f228-438a-9206-6289588018f9", "registration_number": "MAT0015"}	{"id": "230e55ab-734a-40ce-8c0d-39467894639a", "email": "stefan.dima@student.ucv.ro", "status": "ENROLLED", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "303401d3-4a5a-4799-9da2-edac76853d0f", "registration_number": "MAT0015"}	\N	2026-04-30 20:22:05.13+03	t	\N
4ab328b9-c2bb-4630-85ce-baff99fa5be2	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ADMINISTRATION	USER_ROLE	f1202f54-4042-4a1f-a1b9-4ffb95911ddf	\N	\N	\N	\N	{"id": "f1202f54-4042-4a1f-a1b9-4ffb95911ddf", "role_id": "8eda1ea4-55b7-45f0-adbe-7457cd039ee1", "user_id": "f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213", "assigned_at": "2026-04-30T09:55:15.378Z"}	{"id": "f1202f54-4042-4a1f-a1b9-4ffb95911ddf", "role_id": "45f9f1a1-835c-4306-b119-98339489e987", "user_id": "f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213", "assigned_at": "2026-04-30T09:55:15.378Z"}	\N	2026-04-30 20:22:15.992+03	t	\N
b2bf3406-3f6b-458b-a213-e4f9ad57c545	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ADMINISTRATION	USER_ROLE	f1202f54-4042-4a1f-a1b9-4ffb95911ddf	\N	\N	\N	\N	{"id": "f1202f54-4042-4a1f-a1b9-4ffb95911ddf", "role_id": "45f9f1a1-835c-4306-b119-98339489e987", "user_id": "f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213", "assigned_at": "2026-04-30T09:55:15.378Z"}	{"id": "f1202f54-4042-4a1f-a1b9-4ffb95911ddf", "role_id": "28befd85-a492-4b97-a133-a15fe755c8d0", "user_id": "f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213", "assigned_at": "2026-04-30T09:55:15.378Z"}	\N	2026-04-30 20:22:20.811+03	t	\N
d4d1f51b-d3ab-4d30-ad66-16c721e935e5	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	\N	2026-04-30 20:24:50.035+03	t	\N
c9d81a0d-ece5-4db2-ac24-424cc5a04556	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ADMINISTRATION	USER_ROLE	ec291f9a-a1ef-4473-ad45-ed74d205d5ea	\N	\N	\N	\N	{"id": "ec291f9a-a1ef-4473-ad45-ed74d205d5ea", "role_id": "28befd85-a492-4b97-a133-a15fe755c8d0", "user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "assigned_at": "2026-04-30T08:44:57.968Z"}	{"id": "ec291f9a-a1ef-4473-ad45-ed74d205d5ea", "role_id": "d15c7883-4bd0-49b4-8978-4b102217047e", "user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "assigned_at": "2026-04-30T08:44:57.968Z"}	\N	2026-04-30 20:27:53.892+03	t	\N
256b5ea8-965a-4b8b-bcfa-b4d60bcf91ed	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	f7f9f04b-84b0-4964-8d50-a2b540a52b99	\N	\N	\N	\N	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Tudose", "first_name": "Razvan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Mucose", "first_name": "Razvan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	\N	2026-04-30 20:31:07.5+03	t	\N
c6eb0f8a-306f-45a3-8a3a-86d9969d2e23	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	f7f9f04b-84b0-4964-8d50-a2b540a52b99	\N	\N	\N	\N	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Mucose", "first_name": "Razvan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Tudose", "first_name": "Razvan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	\N	2026-04-30 20:32:25.796+03	t	\N
33879045-5110-4887-b668-9113f68f70b0	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "SUSPENDED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	\N	2026-04-30 20:41:25.802+03	t	\N
1ec5cadf-cb21-4258-87de-cd790ec20e12	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	f7f9f04b-84b0-4964-8d50-a2b540a52b99	\N	\N	\N	\N	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Mucose", "first_name": "Razvan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Tudose", "first_name": "Razvan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	\N	2026-04-30 20:42:58.196+03	t	\N
f982c4e6-2050-4dfd-a8df-6040581231ab	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "SUSPENDED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	\N	2026-04-30 20:43:33.705+03	t	\N
8fbd5ba9-e5b4-4263-b915-b947750e8095	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "Chirita", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "fb2c4c32-0638-4e96-ac93-ee1d60a22142", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	\N	2026-04-30 21:27:03.308+03	t	\N
c28231c0-81ae-4025-b82a-ee1aa103e201	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	\N	2026-04-30 21:27:32.194+03	t	\N
b255c23f-1e45-4c16-98a0-664f04a1fbe6	898080e7-dbe3-4e20-990c-931c42585cab	\N	ROLLBACK_INSERT	AUDIT_SYSTEM	USER_ACCOUNT	892dac3e-8a12-40b2-82fc-aaccaf427b32	\N	\N	\N	\N	{"id": "892dac3e-8a12-40b2-82fc-aaccaf427b32", "email": "andreisugu@gmail.com", "username": "andreisugu", "full_name": "Sugubete Andrei", "sso_subject": "IDENT-andrei", "account_status": "ACTIVE"}	\N	\N	2026-05-04 09:02:08.145401+03	t	\N
0513b8af-742d-48cc-a133-b7001ca43074	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "GRADUATED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	\N	2026-04-30 21:29:57.4+03	t	\N
07bc69f7-ebfb-4f16-ba6a-de7c2de315c0	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	2e2c23e2-78f2-469d-8dd9-da8fa72bd712	\N	\N	\N	\N	{"id": "2e2c23e2-78f2-469d-8dd9-da8fa72bd712", "type": "XML", "title": "Cerere bursă merit – Popescu Andrei", "status": "PENDING_APPROVAL", "content": "<cerere><student>Popescu Andrei</student><tip>Merit</tip></cerere>", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "created_at": "2026-04-30T10:22:55.217Z"}	{"id": "2e2c23e2-78f2-469d-8dd9-da8fa72bd712", "type": "XML", "title": "Cerere bursă merit – Popescu Andrei", "status": "APPROVED", "content": "<cerere><student>Popescu Andrei</student><tip>Merit</tip></cerere>", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "created_at": "2026-04-30T10:22:55.217Z"}	\N	2026-04-30 21:30:28.448+03	t	\N
18bc9e51-718c-4cc9-bc25-4814c2dbcc71	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	b020bb32-8942-4680-9eb4-19ceea350924	\N	\N	\N	\N	{"id": "b020bb32-8942-4680-9eb4-19ceea350924", "type": "CSV", "title": "Raport prezențe IS An 3 – Sem 2", "status": "DRAFT", "content": "student_id,discipline,absente\\nMAT0011,Automatizări,2", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "created_at": "2026-04-30T10:22:55.217Z"}	{"id": "b020bb32-8942-4680-9eb4-19ceea350924", "type": "CSV", "title": "Raport prezențe IS An 3 – Sem 2", "status": "APPROVED", "content": "student_id,discipline,absente\\nMAT0011,Automatizări,2", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "created_at": "2026-04-30T10:22:55.217Z"}	\N	2026-04-30 21:30:31.995+03	t	\N
854eb8a2-8210-45dd-97a5-50d0724d49d4	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	ab0a8c07-8b51-4928-ac56-11f062e9158f	\N	\N	\N	\N	{"id": "ab0a8c07-8b51-4928-ac56-11f062e9158f", "type": "XLS", "title": "Centralizator note CTI An 1 – Sem 1", "status": "DRAFT", "content": "Centralizator CTI An 1 Sem 1.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "created_at": "2026-04-30T10:22:55.217Z"}	{"id": "ab0a8c07-8b51-4928-ac56-11f062e9158f", "type": "XLS", "title": "Centralizator note CTI An 1 – Sem 1", "status": "APPROVED", "content": "Centralizator CTI An 1 Sem 1.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "created_at": "2026-04-30T10:22:55.217Z"}	\N	2026-04-30 21:32:14.798+03	t	\N
80f5d9bb-cbd2-4086-ba11-fcb69ad3f4a4	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "ENROLLED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	\N	2026-04-30 21:32:28.199+03	t	\N
d9acbfc2-095e-4505-bb1d-e64494f62ffb	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	ACADEMIC_DATA	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "ENROLLED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "85c29e12-e636-465c-ae0a-91d567641529", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "ENROLLED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-04-30 21:32:37.324+03	t	\N
4af48374-09a3-4d87-adb3-9821397603fb	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "ENROLLED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "GRADUATED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-04-30 21:34:57.7+03	t	\N
908610c5-8f33-4e43-9d67-82f90e668a82	\N	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "GRADUATED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "ENROLLED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-04-30 21:35:02.946+03	t	\N
b25dc3d5-f849-46f6-8eca-62c416be3630	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	INSERT	DOCUMENT_FLOW	DOCUMENT	3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5	\N	\N	\N	\N	\N	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "DRAFT", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	\N	2026-05-01 12:12:20.577+03	t	\N
9ff14937-20d4-437e-9580-0adf17abe9cd	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5	\N	\N	\N	\N	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "DRAFT", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "APPROVED", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	\N	2026-05-01 12:17:30.4+03	t	\N
41fa656a-986a-46e2-95dc-e53b249a410d	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	daade39c-1087-47d9-b3b8-3c090b0c8a37	\N	\N	\N	\N	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT6734"}	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT6734"}	\N	2026-05-02 14:45:10.904+03	t	\N
eaf9c6dc-881a-4b12-899b-d99715c92448	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	44562408-fd88-4faa-bd46-20faa4cb1954	\N	\N	\N	\N	{"id": "44562408-fd88-4faa-bd46-20faa4cb1954", "type": "PDF", "title": "Cerere adeverință – Ionescu Maria", "status": "PENDING_APPROVAL", "content": "Adeverință calitate student.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "44562408-fd88-4faa-bd46-20faa4cb1954", "type": "PDF", "title": "Cerere adeverință – Ionescu Maria", "status": "APPROVED", "content": "Adeverință calitate student.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:17:34.86+03	t	\N
7a750064-169a-433f-ae67-6a6e2b2af23e	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	1d8232f6-b8cb-4142-8db2-f8a2b5d882d3	\N	\N	\N	\N	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "APPROVED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "REJECTED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:17:42.917+03	t	\N
2ebc3489-c2fc-4921-badf-983d594b6963	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	1d8232f6-b8cb-4142-8db2-f8a2b5d882d3	\N	\N	\N	\N	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "REJECTED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "APPROVED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:17:48.255+03	t	\N
c7e7c70e-7f36-44ce-8001-854a0114f60e	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	1d8232f6-b8cb-4142-8db2-f8a2b5d882d3	\N	\N	\N	\N	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "APPROVED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "REJECTED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:17:53.649+03	t	\N
dbf2641c-0b1e-4c8c-bba8-3d437d41640f	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	e6b83f50-8f25-4291-82a0-c27f72d39e45	\N	\N	\N	\N	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "APPROVED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "REJECTED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:18:06.191+03	t	\N
aa3f39f8-6f80-4331-ba34-ec2c6ba04702	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	DOCUMENT	e6b83f50-8f25-4291-82a0-c27f72d39e45	\N	\N	\N	\N	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "REJECTED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "APPROVED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:20:07.716+03	t	\N
e9e2e463-0970-409b-9b22-9c2b9155f520	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	1d8232f6-b8cb-4142-8db2-f8a2b5d882d3	\N	\N	\N	\N	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "REJECTED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "1d8232f6-b8cb-4142-8db2-f8a2b5d882d3", "type": "PDF", "title": "Structura an universitar 2025-2026", "status": "APPROVED", "content": "Sem1: Oct-Ian | Sem2: Feb-Iun.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:29:39.045+03	t	\N
b500458e-cd84-4400-a8b2-11dbf4552bfe	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	e6b83f50-8f25-4291-82a0-c27f72d39e45	\N	\N	\N	\N	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "APPROVED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "REJECTED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:29:42.614+03	t	\N
2dc40641-6043-4a89-9560-16e8f261eebe	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	e6b83f50-8f25-4291-82a0-c27f72d39e45	\N	\N	\N	\N	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "REJECTED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "e6b83f50-8f25-4291-82a0-c27f72d39e45", "type": "PDF", "title": "Regulament de examinare 2025-2026", "status": "APPROVED", "content": "Regulament examene 2025-2026.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:35:30.916+03	t	\N
24979e2a-54da-43bb-ab5e-608ec61db47e	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	44562408-fd88-4faa-bd46-20faa4cb1954	\N	\N	\N	\N	{"id": "44562408-fd88-4faa-bd46-20faa4cb1954", "type": "PDF", "title": "Cerere adeverință – Ionescu Maria", "status": "APPROVED", "content": "Adeverință calitate student.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	{"id": "44562408-fd88-4faa-bd46-20faa4cb1954", "type": "PDF", "title": "Cerere adeverință – Ionescu Maria", "status": "REJECTED", "content": "Adeverință calitate student.", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": null, "created_at": "2026-04-30T10:22:55.217Z", "original_filename": null}	\N	2026-05-01 12:35:32.992+03	t	\N
df3257d3-28d5-403a-a02f-b1ca7c421835	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ADMINISTRATION	USER_ACCOUNT	a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c	\N	\N	\N	\N	\N	{"id": "a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c", "email": "ceva@gmail.com", "username": "mitmar", "full_name": "Mitrache Nicusor", "sso_subject": "mitmar_001", "account_status": "ACTIVE"}	\N	2026-05-04 23:02:13.066257+03	t	\N
1013a6f6-9107-4d83-b0c9-ad8975ed76b2	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5	\N	\N	\N	\N	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "APPROVED", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "REJECTED", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	\N	2026-05-01 12:38:41.924+03	t	\N
89d1fd82-e380-4f04-a61f-eb5b85531d5b	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5	\N	\N	\N	\N	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "REJECTED", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	{"id": "3fa6cf7d-1e71-4001-b0b6-4eb32db9a5e5", "type": "Docx", "title": "Managementul Clasei de Elevi", "status": "APPROVED", "content": "Managementul Clasei de Elevi", "author_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea", "file_path": "file-1777626740551-122113924.docx", "created_at": "2026-05-01T09:12:20.562Z", "original_filename": "Proiect_Managementul_Clasei_FINAL_30PAG.docx"}	\N	2026-05-01 12:38:45.085+03	t	\N
9952e09a-a871-4948-9741-21951f8a6ab6	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N	INSERT	ACADEMIC_DATA	STUDENT	daade39c-1087-47d9-b3b8-3c090b0c8a37	\N	\N	\N	\N	\N	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT6734"}	\N	2026-05-01 12:41:49.341+03	t	\N
3e27846a-6ba0-42fc-9892-3524cf9b15d8	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	\N	2026-05-01 14:07:14.514+03	t	\N
0c1f2cc3-39be-4840-9314-ba5eb8f039b1	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	\N	2026-05-01 14:07:23.023+03	t	\N
9cc47501-12d6-4ae7-a247-0eb7d97e05d4	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "25fb3f6d-6f4b-4e99-8055-d6a4223910c0", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "a17934e7-225e-4baf-ba3d-c9fa4745f456", "registration_number": "MAT0014"}	\N	2026-05-01 14:07:44.742+03	t	\N
6d562faf-74fb-4659-b9ac-11b65b41b691	\N	\N	INSERT	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "DRAFT", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf"}	\N	2026-05-01 14:08:31.019+03	t	\N
e26cf60c-f5bd-4231-ba59-bcbdad116273	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "DRAFT", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf"}	\N	2026-05-01 14:08:40.959+03	t	\N
422b2094-47c3-42a9-a45e-84399567fc4b	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf"}	\N	2026-05-01 14:08:42.145+03	t	\N
6372d5c0-8fc3-4fe0-b26e-a026bdfa0cd3	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	\N	2026-05-01 14:10:40.572+03	t	\N
58cfbe9b-9a04-4833-a291-7cceed23e6ea	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	\N	2026-05-01 14:10:47.767+03	t	\N
0490de21-ecd6-42db-99b5-908bb626e5ab	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	\N	2026-05-01 14:10:55.327+03	t	\N
ff0d8cf5-3714-475c-97e8-1e29a63da8ad	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	\N	2026-05-01 14:12:37.411+03	t	\N
f75afdd0-31a4-4113-8c51-9f4d12464e11	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	f7f9f04b-84b0-4964-8d50-a2b540a52b99	\N	\N	\N	\N	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan.tudose@student.ucv.ro", "status": "ENROLLED", "last_name": "Tudose", "first_name": "Razvan", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "2bb88f87-336c-4f57-848e-db8d76b2eaa7", "registration_number": "MAT0016"}	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan@test.com", "status": "ENROLLED", "last_name": "Testescu", "first_name": "Razvan", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0016"}	\N	2026-05-01 14:13:42.266+03	t	\N
c8a88c12-163e-4673-9420-0af5889601ff	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	f7f9f04b-84b0-4964-8d50-a2b540a52b99	\N	\N	\N	\N	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan@test.com", "status": "ENROLLED", "last_name": "Testescu", "first_name": "Razvan", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0016"}	{"id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "email": "razvan@test.com", "status": "ENROLLED", "last_name": "Testescu", "first_name": "Razvan", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0016"}	\N	2026-05-01 14:14:33.565+03	t	\N
6ebbb977-e747-4c63-91f7-ebb7ba676725	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	\N	2026-05-01 14:15:28.654+03	t	\N
ba834067-9c65-4e99-95c7-60b2ded118a7	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	\N	2026-05-01 14:16:09.687+03	t	\N
c68bb829-f67e-4af3-b720-9e73091f6551	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "ENROLLED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-05-01 14:16:15.435+03	t	\N
65c2206a-b16e-4b8c-a40d-a65be0ed4bd5	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	bc4f25e2-8d72-4e82-982e-e5c4bbf205fd	\N	\N	\N	\N	{"id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "email": "stefan.dima@student.ucv.ro", "status": "ENROLLED", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "8129b6e3-a208-4266-bfd8-5d0307ad5c39", "registration_number": "MAT0009"}	{"id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "email": "stefan.dima@student.ucv.ro", "status": "ACTIVE", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "8129b6e3-a208-4266-bfd8-5d0307ad5c39", "registration_number": "MAT0009"}	\N	2026-05-01 14:16:19.731+03	t	\N
f11559db-9eeb-4d7b-8617-7c81b87b5e24	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	3339a0a8-2c83-4ff9-8ea6-48077e1d063f	\N	\N	\N	\N	{"id": "3339a0a8-2c83-4ff9-8ea6-48077e1d063f", "email": "cosmin.dumitrescu@student.ucv.ro", "status": "ENROLLED", "last_name": "Dumitrescu", "first_name": "Cosmin", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "08638cdd-220a-4830-b1af-7459389ba03e", "registration_number": "MAT0011"}	{"id": "3339a0a8-2c83-4ff9-8ea6-48077e1d063f", "email": "cosmin.dumitrescu@student.ucv.ro", "status": "GRADUATED", "last_name": "Dumitrescu", "first_name": "Cosmin", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "9a101578-fcfe-4188-a53c-bb5bb78d72b7", "registration_number": "MAT0011"}	\N	2026-05-01 14:16:38.072+03	t	\N
8178e200-6008-4740-9b7b-7eb721b96ecd	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	bc4f25e2-8d72-4e82-982e-e5c4bbf205fd	\N	\N	\N	\N	{"id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "email": "stefan.dima@student.ucv.ro", "status": "ACTIVE", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "8129b6e3-a208-4266-bfd8-5d0307ad5c39", "registration_number": "MAT0009"}	{"id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "email": "stefan.dima@student.ucv.ro", "status": "ACTIVE", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "8129b6e3-a208-4266-bfd8-5d0307ad5c39", "registration_number": "MAT0009"}	\N	2026-05-01 14:16:58.256+03	t	\N
7e7a69e9-6084-47da-bea9-f3004ffb8400	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	de9994d8-8e74-4b53-8639-90f7ee31c9f1	\N	\N	\N	\N	{"id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "email": "victor.iordache@student.ucv.ro", "status": "ENROLLED", "last_name": "Iordache", "first_name": "Victor", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "3847a306-ecdd-4bf3-b78f-66c826464261", "registration_number": "MAT0015"}	{"id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "email": "victor.iordache@student.ucv.ro", "status": "ENROLLED", "last_name": "Iordache", "first_name": "Victor", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "3847a306-ecdd-4bf3-b78f-66c826464261", "registration_number": "MAT0015"}	\N	2026-05-01 14:17:11.037+03	t	\N
aa977875-8981-4474-af0d-5cc4240624db	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	de9994d8-8e74-4b53-8639-90f7ee31c9f1	\N	\N	\N	\N	{"id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "email": "victor.iordache@student.ucv.ro", "status": "ENROLLED", "last_name": "Iordache", "first_name": "Victor", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "3847a306-ecdd-4bf3-b78f-66c826464261", "registration_number": "MAT0015"}	{"id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "email": "victor.iordache@student.ucv.ro", "status": "ENROLLED", "last_name": "Iordache", "first_name": "Victor", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "46e9db9a-a5b7-4d0e-a899-e120e1a5ce47", "registration_number": "MAT0015"}	\N	2026-05-01 14:17:21.282+03	t	\N
c0dc6cc0-4141-4370-ae5a-e8eed7e8ead8	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	15dd0140-3cd2-42ba-a820-f0cfd055bc68	\N	\N	\N	\N	{"id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "email": "gabriel.ionascu@doctorand.ucv.ro", "status": "ENROLLED", "last_name": "Ionascu", "first_name": "Gabriel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "5a105954-3612-494e-973b-927ca8b2983c", "registration_number": "MAT0021"}	{"id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "email": "gabriel.ionascu@doctorand.ucv.ro", "status": "ENROLLED", "last_name": "Ionascu", "first_name": "Gabriel", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "5a105954-3612-494e-973b-927ca8b2983c", "registration_number": "MAT0021"}	\N	2026-05-01 14:17:30.913+03	t	\N
e3594fbd-fd0e-4b94-bbb4-4a98d49e8959	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "INACTIVE", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-05-01 14:18:00.296+03	t	\N
8810affb-cbd4-4d4a-b3bb-2e26fa2314e3	\N	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "INACTIVE", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-05-01 14:18:13.975+03	t	\N
19537662-1cbf-4926-aac1-6a0efb9eda99	\N	\N	INSERT	ACADEMIC_DATA	STUDENT	ac64775c-28a2-4435-997c-c5602bd31d3d	\N	\N	\N	\N	\N	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": "346d6afb-6a81-4f0a-93b5-cf00020a59e7", "registration_number": "MAT7264"}	\N	2026-05-01 14:18:37.722+03	t	\N
c918bcfe-88a0-492f-9182-62d449cb403c	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	41ac354f-468e-4d97-b86a-c10845a84d17	\N	\N	\N	\N	{"id": "41ac354f-468e-4d97-b86a-c10845a84d17", "email": "mihai.dumitru@student.ucv.ro", "status": "ENROLLED", "last_name": "Dumitru", "first_name": "Mihai", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "bd9c4914-7a76-4fdd-806a-c36009f0b077", "registration_number": "MAT0005"}	{"id": "41ac354f-468e-4d97-b86a-c10845a84d17", "email": "mihai.dumitru@student.ucv.ro", "status": "SUSPENDED", "last_name": "Dumitru", "first_name": "Mihai", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "4844ac20-ecf9-4585-aaa3-e3f1a39306ee", "registration_number": "MAT0005"}	\N	2026-05-01 15:04:01.578+03	t	\N
63e4a93e-21d8-48f2-9535-22f9c713558c	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	5a578163-0ae7-4809-ba99-3499c1061217	\N	\N	\N	\N	{"id": "5a578163-0ae7-4809-ba99-3499c1061217", "value": "6.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-03-16T22:00:00.000Z", "discipline_id": "83c2947f-c384-451c-a2db-a0d33c840961", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": null}	{"id": "5a578163-0ae7-4809-ba99-3499c1061217", "value": "7.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-03-15T22:00:00.000Z", "discipline_id": "83c2947f-c384-451c-a2db-a0d33c840961", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": null}	\N	2026-05-01 15:21:46.418+03	t	\N
82726a95-6721-4b5e-93c4-1af6728e062e	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	06174c02-9b51-450b-96a5-2afc867c455e	\N	\N	\N	\N	{"id": "06174c02-9b51-450b-96a5-2afc867c455e", "value": "6.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "VARA", "grading_date": "2026-03-16T22:00:00.000Z", "discipline_id": "d1cdd4cf-b6b9-4f54-b6c2-f37f096fdfd2", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": null}	{"id": "06174c02-9b51-450b-96a5-2afc867c455e", "value": "6.00", "source": "MANUAL", "validated": false, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "VARA", "grading_date": "2026-03-15T22:00:00.000Z", "discipline_id": "d1cdd4cf-b6b9-4f54-b6c2-f37f096fdfd2", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": null}	\N	2026-05-01 15:21:51.008+03	t	\N
aa06d675-27fa-456f-8f08-e47d2ea0a526	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	06174c02-9b51-450b-96a5-2afc867c455e	\N	\N	\N	\N	{"id": "06174c02-9b51-450b-96a5-2afc867c455e", "value": "6.00", "source": "MANUAL", "validated": false, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "VARA", "grading_date": "2026-03-15T22:00:00.000Z", "discipline_id": "d1cdd4cf-b6b9-4f54-b6c2-f37f096fdfd2", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": null}	{"id": "06174c02-9b51-450b-96a5-2afc867c455e", "value": "10.00", "source": "MANUAL", "validated": false, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "RESTANTA", "grading_date": "2026-03-14T22:00:00.000Z", "discipline_id": "d1cdd4cf-b6b9-4f54-b6c2-f37f096fdfd2", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": null}	\N	2026-05-01 15:22:00.795+03	t	\N
85a047a5-7046-4313-9adb-c13c51f0cfff	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	f677fe07-7dd1-4aad-b43a-14d67d7d1eec	\N	\N	\N	\N	\N	\N	\N	2026-05-01 15:30:31.789+03	t	\N
11b16300-be5d-47b2-aee3-604e6180053f	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	ac64775c-28a2-4435-997c-c5602bd31d3d	\N	\N	\N	\N	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": "346d6afb-6a81-4f0a-93b5-cf00020a59e7", "registration_number": "MAT7264"}	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": "346d6afb-6a81-4f0a-93b5-cf00020a59e7", "registration_number": "MAT7264"}	\N	2026-05-01 15:49:58.847+03	t	\N
68d6efb3-6e58-484b-8a55-f3c94b2ca4c1	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ADMINISTRATION	USER_ROLE	b1f8eacc-2cfe-4ed6-8ae4-c8809394309c	\N	\N	\N	\N	\N	{"id": "b1f8eacc-2cfe-4ed6-8ae4-c8809394309c", "role_id": "8eda1ea4-55b7-45f0-adbe-7457cd039ee1", "user_id": "a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c", "assigned_at": "2026-05-04T20:02:15.742Z"}	\N	2026-05-04 23:02:15.742299+03	t	\N
09d826ba-75ea-4179-9703-69cfeb7f2bd9	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "a17934e7-225e-4baf-ba3d-c9fa4745f456", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": "a17934e7-225e-4baf-ba3d-c9fa4745f456", "registration_number": "MAT0014"}	\N	2026-05-01 15:50:25.563+03	t	\N
9bfa90e2-f19e-4697-a59a-0041081e1b5e	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	ac64775c-28a2-4435-997c-c5602bd31d3d	\N	\N	\N	\N	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": "346d6afb-6a81-4f0a-93b5-cf00020a59e7", "registration_number": "MAT7264"}	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7264"}	\N	2026-05-01 15:56:05.671+03	t	\N
361c1522-30e9-45a6-8185-e8d73d8da087	\N	\N	INSERT	ACADEMIC_DATA	STUDENT	9c3401dc-e893-421b-8c26-85aa67c8cee4	\N	\N	\N	\N	\N	{"id": "9c3401dc-e893-421b-8c26-85aa67c8cee4", "email": "", "status": "ACTIVE", "last_name": "", "first_name": "", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT8786"}	\N	2026-05-01 15:59:15.068+03	t	\N
a84f2bd3-31c4-4390-bb53-14162063a45d	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	9c3401dc-e893-421b-8c26-85aa67c8cee4	\N	\N	\N	\N	{"id": "9c3401dc-e893-421b-8c26-85aa67c8cee4", "email": "", "status": "ACTIVE", "last_name": "", "first_name": "", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT8786"}	{"id": "9c3401dc-e893-421b-8c26-85aa67c8cee4", "email": "", "status": "INACTIVE", "last_name": "", "first_name": "", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT8786"}	\N	2026-05-01 16:00:17.617+03	t	\N
37bfa916-ba05-4537-aae5-5e2098849cf1	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	ac64775c-28a2-4435-997c-c5602bd31d3d	\N	\N	\N	\N	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7264"}	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7264"}	\N	2026-05-01 16:06:33.056+03	t	\N
7029e920-a39e-496e-8828-49434056936b	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "SUSPENDED", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": "7c3114ef-a011-4452-8b05-9366a9f959a0", "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "ACTIVE", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-29T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0004"}	\N	2026-05-01 16:06:40.825+03	t	\N
b26d85c7-43ae-4852-9245-f86cff41fa3d	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	daade39c-1087-47d9-b3b8-3c090b0c8a37	\N	\N	\N	\N	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT6734"}	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT6734"}	\N	2026-05-01 16:08:08.306+03	t	\N
678771d3-a8c7-4d3f-8c2a-4f8599a33998	\N	\N	INSERT	ACADEMIC_DATA	STUDENT	5563f3cc-6579-48df-851a-c80a9d72df96	\N	\N	\N	\N	\N	{"id": "5563f3cc-6579-48df-851a-c80a9d72df96", "email": "aaaaa@s.s", "status": "ACTIVE", "last_name": "testestestest", "first_name": "AAAA", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7661"}	\N	2026-05-01 16:09:12.795+03	t	\N
8e7b15be-bd0f-437a-872b-04f49b36f37e	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	f2a6fb78-97a0-49ca-a511-2a3bea2876e4	\N	\N	\N	\N	{"id": "f2a6fb78-97a0-49ca-a511-2a3bea2876e4", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "exam_session": "IARNA", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "f2a6fb78-97a0-49ca-a511-2a3bea2876e4", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "exam_session": "IARNA", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 16:13:22.305+03	t	\N
cbc5f096-cf6a-4283-8e9d-93f18463a37e	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	f2a6fb78-97a0-49ca-a511-2a3bea2876e4	\N	\N	\N	\N	{"id": "f2a6fb78-97a0-49ca-a511-2a3bea2876e4", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "exam_session": "IARNA", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "f2a6fb78-97a0-49ca-a511-2a3bea2876e4", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "exam_session": "IARNA", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 16:13:23.443+03	t	\N
99d510b6-3064-4a25-b170-75ba3233cf81	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	04bfda6c-98c2-4039-85c7-418f82f77862	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:15:54.124+03	t	\N
72346329-2473-4d6a-bdc6-25dd12722e12	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	54487888-249c-4887-96cd-372487756fb2	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:17:47.37+03	t	\N
1be857e5-ce69-4f79-ab6f-f8ca4ddbbaa7	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	e8696ee8-f722-49fd-87a0-c03d18922800	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:17:49.086+03	t	\N
b3286a86-53e7-4817-ba55-9ec9d43b714c	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	dcb6c47c-6573-44c8-a41e-94307f11d022	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:19:12.93+03	t	\N
d4b0d05c-79b4-4877-ac74-37d1e22066e2	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	5e435ff5-1d21-4fdc-b750-e10b0ed3662a	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:19:15.203+03	t	\N
e083672f-1bfd-4c3f-884f-e8c8742e46ce	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	eae81a29-f731-4b4f-9954-590fee398484	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:19:16.304+03	t	\N
d40332e4-2697-4804-a861-9310835c5660	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	9fe4c987-4231-4951-a6b6-92ec04338f4d	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:19:18.45+03	t	\N
cd44e712-7faf-4eed-b7f5-0dc43a0cec85	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	3114d388-d542-4c30-a4d4-95ee4f63af91	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:19:20.97+03	t	\N
d345676d-200e-477f-bf0c-a9c52fa08db9	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	4c3b548c-c5a9-4ae3-b7e5-6c5af0b223e6	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:19:22.561+03	t	\N
79bc8e7b-b099-4d17-91e5-9397e8273496	\N	\N	GENERATE	REPORTS	E_GRADE_CENTRALIZER	47269b23-42a8-4ee6-b3ba-b47f938e2541	\N	\N	\N	\N	\N	\N	\N	2026-05-01 16:21:24.611+03	t	\N
8a62b000-c695-4f38-81ec-0100d38e60b0	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	28cdad92-b849-4dbd-9a7e-70f74b7f3d8d	\N	\N	\N	\N	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-29T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 16:56:22.628+03	t	\N
38daff9a-482a-418c-9727-c20487fc4963	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	28cdad92-b849-4dbd-9a7e-70f74b7f3d8d	\N	\N	\N	\N	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-29T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.04", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-28T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 16:56:25.428+03	t	\N
d52606d5-182f-4001-aa19-57e185cfe02e	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	28cdad92-b849-4dbd-9a7e-70f74b7f3d8d	\N	\N	\N	\N	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.04", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-28T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-27T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 16:56:28.709+03	t	\N
9ce7bf39-484d-433e-90f6-063214d761d1	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	28cdad92-b849-4dbd-9a7e-70f74b7f3d8d	\N	\N	\N	\N	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-27T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": false, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-27T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 17:37:42.083+03	t	\N
08fcb7e6-3edd-4ea0-926f-32c569928db7	\N	\N	UPDATE	ACADEMIC_DATA	GRADE	28cdad92-b849-4dbd-9a7e-70f74b7f3d8d	\N	\N	\N	\N	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": false, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-27T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "28cdad92-b849-4dbd-9a7e-70f74b7f3d8d", "value": "0.00", "source": "MANUAL", "validated": true, "student_id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "exam_session": "IARNA", "grading_date": "2026-04-27T21:00:00.000Z", "discipline_id": "e2c30122-a28c-4809-ba35-979dea6eeca3", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": null, "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-01 17:37:43.628+03	t	\N
6e681d1d-a316-4b41-9f82-fe8607a16a22	\N	\N	INSERT	ACADEMIC_DATA	CURRICULUM	620d8527-df5a-4b9a-a4ec-070328cfc36c	\N	\N	\N	\N	\N	{"id": "620d8527-df5a-4b9a-a4ec-070328cfc36c", "code": "sadasdas", "name": "sadasdddddddd", "status": "ACTIVE", "valid_to": null, "valid_from": "2020-08-31T21:00:00.000Z", "specialization_id": "ef25c7b5-c008-40a2-8f35-59c53f110cf2"}	\N	2026-05-01 17:41:53.124+03	t	\N
b3860a95-bfd8-4d49-8ac4-5553d7275b18	\N	\N	INSERT	ACADEMIC_DATA	DISCIPLINE	d192cbed-d144-4863-ba05-b42e73aa68ab	\N	\N	\N	\N	\N	{"id": "d192cbed-d144-4863-ba05-b42e73aa68ab", "code": "AMAMMAMA0000001", "name": "Am Invatat AI", "semester": 5, "ects_credits": 5, "contact_hours": 56, "curriculum_id": "620d8527-df5a-4b9a-a4ec-070328cfc36c", "evaluation_type": "EXAMEN"}	\N	2026-05-01 17:42:13.581+03	t	\N
b111ab6c-74b8-410d-aec3-b36954fb3925	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-27T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-27T21:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	\N	2026-05-01 18:13:05.339+03	t	\N
0b3565a9-e8df-4967-80d7-d8122c5db191	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	ac64775c-28a2-4435-997c-c5602bd31d3d	\N	\N	\N	\N	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "ACTIVE", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7264"}	{"id": "ac64775c-28a2-4435-997c-c5602bd31d3d", "email": "asdadsada@ceva.mail", "status": "SUSPENDED", "last_name": "bgbbbbbbbbbbbb", "first_name": "aaaaaaaaa", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7264"}	\N	2026-05-01 18:51:59.057+03	t	\N
6777bcf4-5e19-4d7c-9dab-b8d54ca98a57	\N	\N	UPDATE	ACADEMIC_DATA	STUDENT	5563f3cc-6579-48df-851a-c80a9d72df96	\N	\N	\N	\N	{"id": "5563f3cc-6579-48df-851a-c80a9d72df96", "email": "aaaaa@s.s", "status": "ACTIVE", "last_name": "testestestest", "first_name": "AAAA", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7661"}	{"id": "5563f3cc-6579-48df-851a-c80a9d72df96", "email": "aaaaa@s.s", "status": "ACTIVE", "last_name": "testestestest", "first_name": "AAAA", "enrollment_date": "2026-04-30T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT7661"}	\N	2026-05-01 18:52:32.858+03	t	\N
e634fe7a-e579-495d-853a-7ac3a2219dfc	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": null}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-01 19:11:22.122+03	t	\N
cba9baec-f653-4261-b69e-da42eea98e70	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-01 19:11:31.204+03	t	\N
14219e1b-2235-44f8-972f-c4edd0dc5271	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-01 19:11:32.417+03	t	\N
179814c3-6ca6-48fe-ac58-89ac7f072354	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-01 19:19:00.791+03	t	\N
7320b3f6-a5f6-47b7-81c7-321068b966cd	\N	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-01 19:19:04.113+03	t	\N
fc5a5542-5578-4b84-a601-b92c2562db07	65cbf637-fde9-4a43-954f-a8806682d462	\N	RECOVERY	ADMIN_SYSTEM	DATABASE	00000000-0000-0000-0000-000000000000	\N	\N	\N	\N	\N	{"restored_file": "manual_backup_2026-05-01T17-45-56-592Z.json"}	\N	2026-05-02 13:39:28.73+03	t	\N
cce5a646-0e4a-4fae-a2f6-c785948e1313	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "3cd49142-4f34-4de7-8e86-640e2ce97e22", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:49:51.473+03	t	\N
1308e357-8c60-44b0-9c29-ed648147bc69	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:49:53.102+03	t	\N
ddc6a3b6-3852-44a8-9a11-c8e4d443e5d8	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:49:54.743+03	t	\N
46ee9c62-b064-4235-ad62-2924214b2fad	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:50:05.793+03	t	\N
668a55e2-a18c-4b0e-82cc-77feab66f517	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:50:08.143+03	t	\N
7ed37b1f-9f3a-4bbe-ba6a-ec74b01c87b5	8c7932d4-e1b5-48a8-b3dd-accbf190617f	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:50:19.476+03	t	\N
2029759a-5fb9-41ad-992c-9db435dcf355	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:50:47.019+03	t	\N
74e15a2f-c3f4-4f92-ba6c-12e2fe1df244	3cd49142-4f34-4de7-8e86-640e2ce97e22	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "3cd49142-4f34-4de7-8e86-640e2ce97e22", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 13:50:56.818+03	t	\N
16067924-618c-4f5b-b18a-b9daf1516569	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ADMINISTRATION	USER_ROLE	899fcdd7-71d2-4d8d-bc5f-9a92941cc27f	\N	\N	\N	\N	{"id": "899fcdd7-71d2-4d8d-bc5f-9a92941cc27f", "role_id": "d15c7883-4bd0-49b4-8978-4b102217047e", "user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "assigned_at": "2026-05-02T11:20:26.257Z"}	{"id": "899fcdd7-71d2-4d8d-bc5f-9a92941cc27f", "role_id": "28befd85-a492-4b97-a133-a15fe755c8d0", "user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "assigned_at": "2026-05-02T11:20:26.257Z"}	\N	2026-05-02 14:21:38.156+03	t	\N
e08bdddc-6002-4b5a-8392-40b30836d206	65cbf637-fde9-4a43-954f-a8806682d462	\N	RECOVERY	ADMIN_SYSTEM	DATABASE	00000000-0000-0000-0000-000000000000	\N	\N	\N	\N	\N	{"restored_file": "manual_backup_2026-05-02T11-22-48-256Z.json"}	\N	2026-05-02 14:43:15.032+03	t	\N
b1d5f08e-ced5-444d-bd37-20aa3ada5e85	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	6b0ba2f3-59c4-4065-8988-f300f82b6e6e	\N	\N	\N	\N	{"id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "email": "amceva@nuammail.test2", "status": "ENROLLED", "last_name": "aa", "first_name": "testulet2", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9998"}	{"id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "email": "amceva@nuammail.test2", "status": "ENROLLED", "last_name": "aa", "first_name": "testulet2", "enrollment_date": "2026-04-28T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9998"}	\N	2026-05-02 14:44:12.715+03	t	\N
a797424e-a07a-4360-85c3-28798b104a8f	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	\N	\N	\N	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-26T21:00:00.000Z", "study_formation_id": "a17934e7-225e-4baf-ba3d-c9fa4745f456", "registration_number": "MAT0014"}	{"id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "email": "monica.chirita@student.ucv.ro", "status": "ENROLLED", "last_name": "ChiritaAAAAAAAAAAAAAA", "first_name": "Monica", "enrollment_date": "2026-04-26T21:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0014"}	\N	2026-05-02 14:44:42.128+03	t	\N
01c5ede5-ba8a-4a3f-aa15-168c8b276a4c	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ADMINISTRATION	USER_ACCOUNT	a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c	\N	\N	\N	\N	{"id": "a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c", "email": "ceva@gmail.com", "username": "mitmar", "full_name": "Mitrache Nicusor", "sso_subject": "mitmar_001", "account_status": "ACTIVE"}	{"id": "a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c", "email": "nicusormitmar@gmail.com", "username": "mitmar", "full_name": "Mitrache Marian Nicusor", "sso_subject": "mitmar_001", "account_status": "ACTIVE"}	\N	2026-05-04 23:02:45.507711+03	t	\N
7d6efa46-f79c-4e64-8649-3d964f3dff87	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	15a02caf-4e4a-44b5-8d09-4734c69ce015	\N	\N	\N	\N	{"id": "15a02caf-4e4a-44b5-8d09-4734c69ce015", "value": "4.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "3fa77956-91a3-4a42-87ca-40c20471adfd", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "15a02caf-4e4a-44b5-8d09-4734c69ce015", "value": "4.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "3fa77956-91a3-4a42-87ca-40c20471adfd", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 14:45:43.25+03	t	\N
2a0f3440-7201-421b-8706-57bedc67881f	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "revision_notes": null, "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "revision_notes": null, "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-02 17:20:28.39+03	t	\N
ab1eea35-8e27-46d1-8417-283ece4a8d60	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	62412179-6803-40dc-8be3-ddb31d0a4513	\N	\N	\N	\N	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "APPROVED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "revision_notes": null, "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	{"id": "62412179-6803-40dc-8be3-ddb31d0a4513", "type": "info", "title": "blocuri comuniste", "status": "REJECTED", "content": "blocuri comuniste", "author_id": null, "file_path": "file-1777633710622-434640698.pdf", "created_at": "2026-05-01T11:08:30.713Z", "revision_notes": null, "original_filename": "Analiza-blocurilor-comuniste.pdf", "assigned_to_user_id": "df3cfe57-9cb4-4b35-9ab2-6f3903e748ea"}	\N	2026-05-02 17:20:32.021+03	t	\N
ef315492-e254-47e4-8548-f3793efb8557	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	4aa172c4-e325-473f-b70c-28f1cfd77aa7	\N	\N	\N	\N	{"id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "email": "amcevamail@ammail.test1", "status": "ENROLLED", "last_name": "ab", "first_name": "testulet1", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9999"}	{"id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "email": "amcevamail@ammail.test1", "status": "ENROLLED", "last_name": "ab", "first_name": "testulet1", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9999"}	\N	2026-05-02 18:35:23.687+03	t	\N
8c2b4e48-c4c6-4318-8e39-9330dbdb34c6	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	fba3ce25-088a-4929-a8c7-a7bc50444804	\N	\N	\N	\N	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-26T00:00:00.000Z", "study_formation_id": "07980534-a5d4-4095-b4c7-68b4f639c7b5", "registration_number": "MAT0012"}	{"id": "fba3ce25-088a-4929-a8c7-a7bc50444804", "email": "violeta.cristea@student.ucv.ro", "status": "SUSPENDED", "last_name": "Cristea", "first_name": "Violeta", "enrollment_date": "2026-04-26T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0012"}	\N	2026-05-02 18:35:40.225+03	t	\N
d28b7c09-09f4-41ff-90a9-28814e29664b	8c7932d4-e1b5-48a8-b3dd-accbf190617f	\N	UPDATE	ACADEMIC_DATA	GRADE	3d02cb94-2cbe-4047-8568-f95d3238515d	\N	\N	\N	\N	{"id": "3d02cb94-2cbe-4047-8568-f95d3238515d", "value": "7.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "40ce9225-9c1c-4ea3-a284-85b0cfe678b5", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "3cd49142-4f34-4de7-8e86-640e2ce97e22", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "3d02cb94-2cbe-4047-8568-f95d3238515d", "value": "7.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "40ce9225-9c1c-4ea3-a284-85b0cfe678b5", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 23:38:02.173+03	t	\N
0cc1be5f-dc00-4260-b25e-00a10084f63f	8c7932d4-e1b5-48a8-b3dd-accbf190617f	\N	UPDATE	ACADEMIC_DATA	GRADE	3d02cb94-2cbe-4047-8568-f95d3238515d	\N	\N	\N	\N	{"id": "3d02cb94-2cbe-4047-8568-f95d3238515d", "value": "7.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "40ce9225-9c1c-4ea3-a284-85b0cfe678b5", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "3d02cb94-2cbe-4047-8568-f95d3238515d", "value": "7.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-04-30T21:00:00.000Z", "discipline_id": "40ce9225-9c1c-4ea3-a284-85b0cfe678b5", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 23:38:06.727+03	t	\N
1f92b5ec-720c-4d7d-b2f2-423a871969cd	8c7932d4-e1b5-48a8-b3dd-accbf190617f	\N	UPDATE	ACADEMIC_DATA	GRADE	b7ed3f5d-dfae-4b0d-97f9-11f24f2182d4	\N	\N	\N	\N	{"id": "b7ed3f5d-dfae-4b0d-97f9-11f24f2182d4", "value": "5.00", "source": "MANUAL", "validated": false, "student_id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "exam_session": "SUMMER", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "456b3838-f756-4418-ab36-96986832d404", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "b7ed3f5d-dfae-4b0d-97f9-11f24f2182d4", "value": "5.00", "source": "MANUAL", "validated": true, "student_id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "exam_session": "SUMMER", "grading_date": "2026-05-01T21:00:00.000Z", "discipline_id": "456b3838-f756-4418-ab36-96986832d404", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-02 23:38:46.727+03	t	\N
cb2c9546-a4f2-4de0-9a88-80236d24da30	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	15a02caf-4e4a-44b5-8d09-4734c69ce015	\N	\N	\N	\N	{"id": "15a02caf-4e4a-44b5-8d09-4734c69ce015", "value": "4.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-02T00:00:00.000Z", "discipline_id": "3fa77956-91a3-4a42-87ca-40c20471adfd", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "15a02caf-4e4a-44b5-8d09-4734c69ce015", "value": "4.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-02T00:00:00.000Z", "discipline_id": "3fa77956-91a3-4a42-87ca-40c20471adfd", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-03 17:29:45.615+03	t	\N
f0ac1a9a-7253-4d23-a89f-8f88e7b15fe8	898080e7-dbe3-4e20-990c-931c42585cab	\N	UPDATE	ACADEMIC_DATA	GRADE	15a02caf-4e4a-44b5-8d09-4734c69ce015	\N	\N	\N	\N	{"id": "15a02caf-4e4a-44b5-8d09-4734c69ce015", "value": "4.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-02T00:00:00.000Z", "discipline_id": "3fa77956-91a3-4a42-87ca-40c20471adfd", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "15a02caf-4e4a-44b5-8d09-4734c69ce015", "value": "4.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-02T00:00:00.000Z", "discipline_id": "3fa77956-91a3-4a42-87ca-40c20471adfd", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "898080e7-dbe3-4e20-990c-931c42585cab", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-03 17:29:47.253+03	t	\N
6291c843-8e20-45a1-85a4-1aa93f99c053	f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213	\N	UPDATE	ACADEMIC_DATA	STUDENT	9deac7ae-7049-4ca6-99e4-94ce5585d722	\N	\N	\N	\N	{"id": "9deac7ae-7049-4ca6-99e4-94ce5585d722", "email": "cristian.marin@student.ucv.ro", "status": "ENROLLED", "last_name": "Marin", "first_name": "Cristian", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": "43c173f9-3dee-4030-ab3a-56580ab8a0ce", "registration_number": "MAT0007"}	{"id": "9deac7ae-7049-4ca6-99e4-94ce5585d722", "email": "cristian.marin@student.ucv.ro", "status": "INACTIVE", "last_name": "Marin", "first_name": "Cristian", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": "43c173f9-3dee-4030-ab3a-56580ab8a0ce", "registration_number": "MAT0007"}	\N	2026-05-04 00:46:11.178+03	t	\N
19db1191-b0f2-4782-abcf-1287a34d1ebd	8c7932d4-e1b5-48a8-b3dd-accbf190617f	\N	UPDATE	ACADEMIC_DATA	GRADE	b40efb93-188b-4bc5-9f9c-cfc92a7a9a68	\N	\N	\N	\N	{"id": "b40efb93-188b-4bc5-9f9c-cfc92a7a9a68", "value": "10.00", "source": "MANUAL", "validated": false, "student_id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "b40efb93-188b-4bc5-9f9c-cfc92a7a9a68", "value": "10.00", "source": "MANUAL", "validated": true, "student_id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 00:48:42.961+03	t	\N
570a63b7-7e40-4423-9a50-9d340cb24fdd	8c7932d4-e1b5-48a8-b3dd-accbf190617f	\N	UPDATE	ACADEMIC_DATA	GRADE	b40efb93-188b-4bc5-9f9c-cfc92a7a9a68	\N	\N	\N	\N	{"id": "b40efb93-188b-4bc5-9f9c-cfc92a7a9a68", "value": "10.00", "source": "MANUAL", "validated": true, "student_id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "b40efb93-188b-4bc5-9f9c-cfc92a7a9a68", "value": "10.00", "source": "MANUAL", "validated": true, "student_id": "f7f9f04b-84b0-4964-8d50-a2b540a52b99", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 00:48:43.269+03	t	\N
2b07978c-2d46-4ba6-a20c-5474157dc196	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ADMINISTRATION	USER_ACCOUNT	4197ae30-6bd6-40e5-b664-518f8e58cff2	\N	\N	\N	\N	{"id": "4197ae30-6bd6-40e5-b664-518f8e58cff2", "email": "student@ucv.ro", "username": "student", "full_name": "Student Fictiv", "sso_subject": "stud_ucv_001", "account_status": "ACTIVE"}	{"id": "4197ae30-6bd6-40e5-b664-518f8e58cff2", "email": "amceva@nuammail.test2", "username": "student", "full_name": "Student Fictiv", "sso_subject": "stud_ucv_001", "account_status": "ACTIVE"}	\N	2026-05-04 08:42:57.332+03	t	\N
dd8c4a5f-3ee9-488c-b67b-29e942e43bd0	4197ae30-6bd6-40e5-b664-518f8e58cff2	\N	INSERT	DOCUMENT_FLOW	DOCUMENT	76f1236d-7087-471b-b910-b1e372982b02	\N	\N	\N	\N	\N	{"id": "76f1236d-7087-471b-b910-b1e372982b02", "type": "ss", "title": "ss", "status": "DRAFT", "content": "ss", "author_id": "4197ae30-6bd6-40e5-b664-518f8e58cff2", "file_path": "file-1777873490359-277535579.pptx", "created_at": "2026-05-04T05:44:50.367Z", "revision_notes": null, "original_filename": "AFSMS_Presentation.pptx", "assigned_to_user_id": null}	\N	2026-05-04 08:44:50.513+03	t	\N
be43bebb-fc01-4eba-aaad-5b34322efd5b	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	6b0ba2f3-59c4-4065-8988-f300f82b6e6e	\N	\N	\N	\N	{"id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "email": "amceva@nuammail.test2", "status": "ENROLLED", "last_name": "aa", "first_name": "testulet2", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9998"}	{"id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "email": "amceva@nuammail.test2", "status": "ENROLLED", "last_name": "aa", "first_name": "testulet2", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9998"}	\N	2026-05-04 08:46:43.729+03	t	\N
5a4e781a-975f-46e5-b92e-cee1ed543ad9	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	76f1236d-7087-471b-b910-b1e372982b02	\N	\N	\N	\N	{"id": "76f1236d-7087-471b-b910-b1e372982b02", "type": "ss", "title": "ss", "status": "DRAFT", "content": "ss", "author_id": "4197ae30-6bd6-40e5-b664-518f8e58cff2", "file_path": "file-1777873490359-277535579.pptx", "created_at": "2026-05-04T05:44:50.367Z", "revision_notes": null, "original_filename": "AFSMS_Presentation.pptx", "assigned_to_user_id": null}	{"id": "76f1236d-7087-471b-b910-b1e372982b02", "type": "ss", "title": "ss", "status": "APPROVED", "content": "ss", "author_id": "4197ae30-6bd6-40e5-b664-518f8e58cff2", "file_path": "file-1777873490359-277535579.pptx", "created_at": "2026-05-04T05:44:50.367Z", "revision_notes": null, "original_filename": "AFSMS_Presentation.pptx", "assigned_to_user_id": null}	\N	2026-05-04 08:49:07.786+03	t	\N
fa55a4b2-123c-4716-ac28-3dcc47d180bf	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	INSERT	ACADEMIC_DATA	GRADE	28cd3e34-ff2a-408e-a85c-71f75cffc0b1	\N	\N	\N	\N	\N	{"id": "28cd3e34-ff2a-408e-a85c-71f75cffc0b1", "value": "5.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:50:51.938+03	t	\N
57a3ef4b-f943-4c33-b989-e99d1ed68053	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	INSERT	ACADEMIC_DATA	GRADE	47c71c77-84cf-4ca4-8ffa-8be29627e777	\N	\N	\N	\N	\N	{"id": "47c71c77-84cf-4ca4-8ffa-8be29627e777", "value": "6.00", "source": "MANUAL", "validated": false, "student_id": "b35f25a3-5b21-43f9-971a-b0fc1ac2809f", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:50:52.132+03	t	\N
1a7b62eb-eed2-47c8-b913-77d95f0f6910	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	INSERT	ACADEMIC_DATA	GRADE	56c09d6d-a8fc-445b-8e45-26868ad6d0d5	\N	\N	\N	\N	\N	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:50:52.321+03	t	\N
7bfe6c20-4e51-4647-9f79-ef68a93f39e3	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	UPDATE	ACADEMIC_DATA	GRADE	56c09d6d-a8fc-445b-8e45-26868ad6d0d5	\N	\N	\N	\N	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:52:21.976+03	t	\N
429feaa3-c072-4c53-8903-080fb7cfeeb6	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	UPDATE	ACADEMIC_DATA	GRADE	56c09d6d-a8fc-445b-8e45-26868ad6d0d5	\N	\N	\N	\N	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:52:25.326+03	t	\N
4249fb76-5131-4ea3-a973-4b0c72e1244a	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	UPDATE	ACADEMIC_DATA	GRADE	56c09d6d-a8fc-445b-8e45-26868ad6d0d5	\N	\N	\N	\N	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:52:26.046+03	t	\N
a3474774-789c-4e6d-b558-647a744599bf	f9b7a621-1309-482d-9d06-5f6b8e4283c1	\N	UPDATE	ACADEMIC_DATA	GRADE	56c09d6d-a8fc-445b-8e45-26868ad6d0d5	\N	\N	\N	\N	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:52:27.646+03	t	\N
26abdcb7-825f-4acf-a4a3-291e77edd07f	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ADMINISTRATION	USER_ACCOUNT	892dac3e-8a12-40b2-82fc-aaccaf427b32	\N	\N	\N	\N	\N	{"id": "892dac3e-8a12-40b2-82fc-aaccaf427b32", "email": "andreisugu@gmail.com", "username": "andreisugu", "full_name": "Sugubete Andrei", "sso_subject": "IDENT-andrei", "account_status": "ACTIVE"}	\N	2026-05-04 08:53:44.225+03	t	\N
c4dc22cf-9367-43af-92db-fbdf50687a84	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ADMINISTRATION	USER_ROLE	ebfb3a68-9646-4cb2-a207-940d59c488cd	\N	\N	\N	\N	\N	{"id": "ebfb3a68-9646-4cb2-a207-940d59c488cd", "role_id": "28befd85-a492-4b97-a133-a15fe755c8d0", "user_id": "892dac3e-8a12-40b2-82fc-aaccaf427b32", "assigned_at": "2026-05-04T05:54:06.579Z"}	\N	2026-05-04 08:54:06.579+03	t	\N
ca05b9c3-9c91-484d-9609-762eed042e06	65cbf637-fde9-4a43-954f-a8806682d462	\N	ROLLBACK_UPDATE	AUDIT_SYSTEM	GRADE	56c09d6d-a8fc-445b-8e45-26868ad6d0d5	\N	\N	\N	\N	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "56c09d6d-a8fc-445b-8e45-26868ad6d0d5", "value": "1.00", "source": "MANUAL", "validated": true, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "3c72b05d-4f60-4c65-bf09-b5782dc65cf8", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "f9b7a621-1309-482d-9d06-5f6b8e4283c1", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 08:58:28.505+03	t	\N
200173c1-b8fd-4a95-9f95-7735f88db6c6	65cbf637-fde9-4a43-954f-a8806682d462	\N	RECOVERY	ADMIN_SYSTEM	DATABASE	00000000-0000-0000-0000-000000000000	\N	\N	\N	\N	\N	{"restored_file": "manual_backup_2026-05-04T05-58-39-130Z.json"}	\N	2026-05-04 09:00:01.138917+03	t	\N
7004b798-f524-4c07-8a00-224ae2f139bc	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	7b06af27-d66b-4862-842e-81a361cb07c9	\N	\N	\N	\N	{"id": "7b06af27-d66b-4862-842e-81a361cb07c9", "value": "7.00", "source": "MANUAL", "validated": false, "student_id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "bf03eda5-5eb2-451a-b6b2-b5b9dcd0554f", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "7b06af27-d66b-4862-842e-81a361cb07c9", "value": "7.00", "source": "MANUAL", "validated": true, "student_id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "bf03eda5-5eb2-451a-b6b2-b5b9dcd0554f", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 22:57:01.392186+03	t	\N
e49ebee8-376d-48e9-948d-ac7e4cf6d596	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "3cd49142-4f34-4de7-8e86-640e2ce97e22", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 22:57:03.978359+03	t	\N
f6ebfbcf-527b-490b-8808-9e8be050f8b9	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	19ba7c80-1f97-46f5-8e44-2d540af8c7e7	\N	\N	\N	\N	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "19ba7c80-1f97-46f5-8e44-2d540af8c7e7", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "RETAKE", "grading_date": "2026-04-30T00:00:00.000Z", "discipline_id": "06ae96ac-8656-4ace-93b0-d0dec49f8a72", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 22:57:06.648074+03	t	\N
d9f81315-a80c-42d6-89fc-83f281eb440c	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	3d02cb94-2cbe-4047-8568-f95d3238515d	\N	\N	\N	\N	{"id": "3d02cb94-2cbe-4047-8568-f95d3238515d", "value": "7.00", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-05-01T00:00:00.000Z", "discipline_id": "40ce9225-9c1c-4ea3-a284-85b0cfe678b5", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "8c7932d4-e1b5-48a8-b3dd-accbf190617f", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "3d02cb94-2cbe-4047-8568-f95d3238515d", "value": "7.01", "source": "MANUAL", "validated": true, "student_id": "4aa172c4-e325-473f-b70c-28f1cfd77aa7", "exam_session": "WINTER", "grading_date": "2026-05-01T00:00:00.000Z", "discipline_id": "40ce9225-9c1c-4ea3-a284-85b0cfe678b5", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 22:57:10.21967+03	t	\N
89128c35-c6c8-43bb-81a9-845f10ad65c9	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	6b0ba2f3-59c4-4065-8988-f300f82b6e6e	\N	\N	\N	\N	{"id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "email": "amceva@nuammail.test2", "status": "ENROLLED", "last_name": "aa", "first_name": "testulet2", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9998"}	{"id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "email": "amceva@nuammail.test2", "status": "ENROLLED", "last_name": "aa", "first_name": "testulet2", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT9998"}	\N	2026-05-04 22:57:48.426436+03	t	\N
63b99910-2833-4f8e-b663-49512400c2e9	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	\N	\N	\N	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "ACTIVE", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0004"}	{"id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "email": "elena.constantin@student.ucv.ro", "status": "ACTIVE", "last_name": "Constantin", "first_name": "Elena", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0004"}	\N	2026-05-04 22:57:58.301009+03	t	\N
3cf8ed3f-2e09-4e43-ae00-38d05490a0e6	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	15dd0140-3cd2-42ba-a820-f0cfd055bc68	\N	\N	\N	\N	{"id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "email": "gabriel.ionascu@doctorand.ucv.ro", "status": "ENROLLED", "last_name": "Ionascu", "first_name": "Gabriel", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": "5a105954-3612-494e-973b-927ca8b2983c", "registration_number": "MAT0021"}	{"id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "email": "gabriel.ionascu@doctorand.ucv.ro", "status": "ENROLLED", "last_name": "Ionascu", "first_name": "Gabriel", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0021"}	\N	2026-05-04 22:58:08.457479+03	t	\N
dac2831f-43da-4d16-8363-daaf7bcc4e48	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	daade39c-1087-47d9-b3b8-3c090b0c8a37	\N	\N	\N	\N	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT6734"}	{"id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "email": "nicusormitmar@gmail.com", "status": "ACTIVE", "last_name": "Mitrache", "first_name": "Marian", "enrollment_date": "2026-04-29T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT6734"}	\N	2026-05-04 22:58:41.239391+03	t	\N
d0de5483-84c1-45d6-a2e0-e840078eed65	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	de9994d8-8e74-4b53-8639-90f7ee31c9f1	\N	\N	\N	\N	{"id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "email": "victor.iordache@student.ucv.ro", "status": "ENROLLED", "last_name": "Iordache", "first_name": "Victor", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": "46e9db9a-a5b7-4d0e-a899-e120e1a5ce47", "registration_number": "MAT0015"}	{"id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "email": "victor.iordache@student.ucv.ro", "status": "ENROLLED", "last_name": "Iordache", "first_name": "Victor", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0015"}	\N	2026-05-04 22:58:55.978265+03	t	\N
43725794-e783-4d2e-a5c9-064657eda3cf	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	05298c22-5988-423f-b525-68b59978eedb	\N	\N	\N	\N	{"id": "05298c22-5988-423f-b525-68b59978eedb", "email": "diana.matei@doctorand.ucv.ro", "status": "ENROLLED", "last_name": "Matei", "first_name": "Diana", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": "584afaa1-e3de-421e-891d-a4d762fc9d38", "registration_number": "MAT0020"}	{"id": "05298c22-5988-423f-b525-68b59978eedb", "email": "diana.matei@doctorand.ucv.ro", "status": "ENROLLED", "last_name": "Matei", "first_name": "Diana", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0020"}	\N	2026-05-04 22:59:09.750031+03	t	\N
29704849-0253-4d12-9109-5e5fa93609c9	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	ed6f50c8-503b-494a-ac8d-3ef5e34cac9e	\N	\N	\N	\N	{"id": "ed6f50c8-503b-494a-ac8d-3ef5e34cac9e", "email": "newstudent99@uni.ro", "status": "ENROLLED", "last_name": "Student", "first_name": "Nou", "enrollment_date": "2026-05-02T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT248434"}	{"id": "ed6f50c8-503b-494a-ac8d-3ef5e34cac9e", "email": "newstudent99@uni.ro", "status": "ENROLLED", "last_name": "Student", "first_name": "Nou", "enrollment_date": "2026-05-02T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT248434"}	\N	2026-05-04 22:59:20.324629+03	t	\N
03732d8e-fda0-46fa-8a04-2471aea49c79	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	STUDENT	bc4f25e2-8d72-4e82-982e-e5c4bbf205fd	\N	\N	\N	\N	{"id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "email": "stefan.dima@student.ucv.ro", "status": "ACTIVE", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": "8129b6e3-a208-4266-bfd8-5d0307ad5c39", "registration_number": "MAT0009"}	{"id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "email": "stefan.dima@student.ucv.ro", "status": "ACTIVE", "last_name": "Dima", "first_name": "Stefan", "enrollment_date": "2026-04-28T00:00:00.000Z", "study_formation_id": null, "registration_number": "MAT0009"}	\N	2026-05-04 22:59:35.383401+03	t	\N
afce0254-a0b5-4189-8295-c9e5943d3187	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	a27375b3-436a-47ef-b4b3-634ccfec26da	\N	\N	\N	\N	\N	{"id": "a27375b3-436a-47ef-b4b3-634ccfec26da", "value": "10.00", "source": "MANUAL", "validated": false, "student_id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:28.817056+03	t	\N
6cf60d90-be20-4a53-9349-9683801773ea	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	573cec79-8eb3-4d98-a644-2549b38043f3	\N	\N	\N	\N	\N	{"id": "573cec79-8eb3-4d98-a644-2549b38043f3", "value": "9.00", "source": "MANUAL", "validated": false, "student_id": "5ca4d768-d4d9-4545-afcf-6f38c01958ca", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:29.016221+03	t	\N
1dd903ca-bb53-4dea-8f1d-9a3d20af5f6c	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	3d1ab565-da84-433e-bb88-6bbbfa475d6d	\N	\N	\N	\N	\N	{"id": "3d1ab565-da84-433e-bb88-6bbbfa475d6d", "value": "8.00", "source": "MANUAL", "validated": false, "student_id": "bc4f25e2-8d72-4e82-982e-e5c4bbf205fd", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:29.208996+03	t	\N
b82c735d-a618-48b8-8b6a-c96184c9162a	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	1a333a74-d6c6-40d0-b7bf-d224e2763067	\N	\N	\N	\N	\N	{"id": "1a333a74-d6c6-40d0-b7bf-d224e2763067", "value": "7.00", "source": "MANUAL", "validated": false, "student_id": "15dd0140-3cd2-42ba-a820-f0cfd055bc68", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:29.400873+03	t	\N
f7bf2ec0-c76d-4921-b118-bfdbfb85d012	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	bbba9879-63ed-4cde-bd85-8ccc9ee0519d	\N	\N	\N	\N	\N	{"id": "bbba9879-63ed-4cde-bd85-8ccc9ee0519d", "value": "6.00", "source": "MANUAL", "validated": false, "student_id": "de9994d8-8e74-4b53-8639-90f7ee31c9f1", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:29.590293+03	t	\N
ecb6c6b9-a9ee-465f-b839-fc6614204641	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	23ace774-ca5c-4aa5-8213-5366c21429a8	\N	\N	\N	\N	\N	{"id": "23ace774-ca5c-4aa5-8213-5366c21429a8", "value": "5.00", "source": "MANUAL", "validated": false, "student_id": "05298c22-5988-423f-b525-68b59978eedb", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:29.780031+03	t	\N
e2dab79f-7767-499f-b144-5e43ddc7ee5a	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	5c886a85-c7c8-4917-9baa-8baefd84f084	\N	\N	\N	\N	\N	{"id": "5c886a85-c7c8-4917-9baa-8baefd84f084", "value": "4.00", "source": "MANUAL", "validated": false, "student_id": "daade39c-1087-47d9-b3b8-3c090b0c8a37", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:29.97576+03	t	\N
7645ff8c-2d0e-4162-99a3-f18acb3303f6	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	ACADEMIC_DATA	GRADE	25856812-c38a-45b8-835c-c206e736a8ec	\N	\N	\N	\N	\N	{"id": "25856812-c38a-45b8-835c-c206e736a8ec", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "ed6f50c8-503b-494a-ac8d-3ef5e34cac9e", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:30.161363+03	t	\N
74affe1b-b22f-4b46-a81d-b583c170c16d	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	25856812-c38a-45b8-835c-c206e736a8ec	\N	\N	\N	\N	{"id": "25856812-c38a-45b8-835c-c206e736a8ec", "value": "3.00", "source": "MANUAL", "validated": false, "student_id": "ed6f50c8-503b-494a-ac8d-3ef5e34cac9e", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "25856812-c38a-45b8-835c-c206e736a8ec", "value": "3.00", "source": "MANUAL", "validated": true, "student_id": "ed6f50c8-503b-494a-ac8d-3ef5e34cac9e", "exam_session": "WINTER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "59a68013-b5fa-4790-892e-2730e349d4e9", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-04 23:00:40.686516+03	t	\N
9bb0b8cb-3519-495e-a426-24dd416547eb	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	ACADEMIC_DATA	GRADE	6da04f72-0d85-49da-adff-88bbe522d9ef	\N	\N	\N	\N	{"id": "6da04f72-0d85-49da-adff-88bbe522d9ef", "value": "8.00", "source": "MANUAL", "validated": false, "student_id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "exam_session": "SUMMER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "8165cf30-c51b-4e8d-941a-5bcf0a89c52d", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	{"id": "6da04f72-0d85-49da-adff-88bbe522d9ef", "value": "8.00", "source": "MANUAL", "validated": true, "student_id": "6b0ba2f3-59c4-4065-8988-f300f82b6e6e", "exam_session": "SUMMER", "grading_date": "2026-05-04T00:00:00.000Z", "discipline_id": "8165cf30-c51b-4e8d-941a-5bcf0a89c52d", "academic_year_id": "5290bd9f-c045-4da4-ad00-d200c325e71e", "graded_by_user_id": "65cbf637-fde9-4a43-954f-a8806682d462", "curriculum_snapshot_id": "fbd994de-5086-49c9-bb41-5cf7a137cebf"}	\N	2026-05-05 16:30:12.257105+03	t	\N
660e2071-b50c-4061-8ef7-35f63f774ba0	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	DOCUMENT_FLOW	DOCUMENT	f0f3d2a9-acae-4425-b2a7-944583b911e4	\N	\N	\N	\N	\N	{"id": "f0f3d2a9-acae-4425-b2a7-944583b911e4", "type": "REQUIREMENT", "title": "Prezentare Powerpoint AFSMS", "status": "DRAFT", "content": "Prezentare Powerpoint AFSMS", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": "file-1777987970184-352639072.pptx", "created_at": "2026-05-05T13:32:50.189Z", "revision_notes": null, "original_filename": "AFSMS_Presentation.pptx", "assigned_to_user_id": null}	\N	2026-05-05 16:32:50.355569+03	t	\N
09bbb9f0-eed2-45e5-8963-1c298cbb4e64	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	f0f3d2a9-acae-4425-b2a7-944583b911e4	\N	\N	\N	\N	{"id": "f0f3d2a9-acae-4425-b2a7-944583b911e4", "type": "REQUIREMENT", "title": "Prezentare Powerpoint AFSMS", "status": "DRAFT", "content": "Prezentare Powerpoint AFSMS", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": "file-1777987970184-352639072.pptx", "created_at": "2026-05-05T13:32:50.189Z", "revision_notes": null, "original_filename": "AFSMS_Presentation.pptx", "assigned_to_user_id": null}	{"id": "f0f3d2a9-acae-4425-b2a7-944583b911e4", "type": "REQUIREMENT", "title": "Prezentare Powerpoint AFSMS", "status": "APPROVED", "content": "Prezentare Powerpoint AFSMS", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": "file-1777987970184-352639072.pptx", "created_at": "2026-05-05T13:32:50.189Z", "revision_notes": null, "original_filename": "AFSMS_Presentation.pptx", "assigned_to_user_id": null}	\N	2026-05-05 16:32:59.744941+03	t	\N
f9f729d6-389b-48e6-988b-7b31adfcb490	65cbf637-fde9-4a43-954f-a8806682d462	\N	INSERT	DOCUMENT_FLOW	DOCUMENT	bbdbf7fc-3053-49cb-8b49-4b96c70948df	\N	\N	\N	\N	\N	{"id": "bbdbf7fc-3053-49cb-8b49-4b96c70948df", "type": "GUIDE", "title": "Walkrough Complet AFSMS", "status": "DRAFT", "content": "AFSMS — Comprehensive Walkthrough Guide\\nAutomated Faculty Student Management System\\nProject P9-T4 · Sugubete, Maximilian, Mitrache\\nWhat Is This System?\\nAFSMS (Automated Faculty Student Management System) is a full-stack web application built for\\nthe Faculty of Automation, Computers and Electronics at the University of Craiova. It man-\\nages the complete academic lifecycle: student records, curricula, grades, document workflows,\\naudit trails, backups, and notifications — all in one place, behind a role-based access control\\nsystem that mirrors the real university structure.\\nThe system has two halves: a React + Vite frontend deployed as a GitHub Pages SPA, and a\\nNode.js / Express backend connected to a PostgreSQL database.\\n1 Part 1 — The Database Layer (Bottom)\\nEverything starts here. The schema is in src/schema.sql and defines 8 logical modules.\\nModule 1 — Security & Users\\nThe foundation of all access control.\\n• ROLE — defines the four roles in the system: STUDENT, PROFESSOR, SECRETARIAT, ADMIN. Each\\nrole has a unique code used throughout the backend for permission checks.\\n• PERMISSION / OPERATION — fine-grained action definitions (e.g., READ_GRADES, EXPORT_REPORT)\\nthat can be linked to roles via ROLE_PERMISSION and ROLE_OPERATION junction tables.\\n• USER_ACCOUNT — every person in the system has a record here. The critical field is sso_subject,\\na unique identifier that comes from the university’s SSO (Single Sign-On) system. This is\\nwhat ties a university identity to an AFSMS account. The field account_status can be ACTIVE\\nor SUSPENDED.\\n• USER_ROLE — maps users to roles. A user has exactly one active role at a time.\\n• AUTH_SESSION — stores session tokens with expiry and IP address for traceability.\\n• USER_GROUP / USER_GROUP_MEMBER — a simple grouping mechanism used for mass email\\nnotifications. A group like “Year 1 CTI” contains user accounts.\\n• OUTLOOK_NOTIFICATION — records of every bulk email sent through the system, including\\nrecipient list, subject, body preview, and delivery status.\\n1\\n\\n-- 1 of 13 --\\n\\nModule 2 — Academic Data\\nThe core of what makes the system academic.\\n• ACADEMIC_YEAR — records like 2025/2026. Only one can be is_active = TRUE at a time.\\nUsed as a reference point for curricula and reports.\\n• SPECIALIZATION — a program of study (e.g., “Calculatoare și Tehnologia Informației”, “Au-\\ntomatică și Informatică Aplicată”). Has a degree_level field (LICENTA, MASTER).\\n• STUDY_FORMATION — a specific group of students, e.g., “CTI Year 2 Group A”. Has study_year,\\neducation_form (ZI/ID/IFR), and group_index.\\n• STUDENT — the student record, linked to a study formation. Contains registration_number\\n(e.g. MAT1234), names, email, enrollment date, and status (ENROLLED, ACTIVE, GRADUATED,\\nWITHDRAWN).\\n• CURRICULUM — a plan of study for a specialization, with a valid_from date. Can be snap-\\nshotted.\\n• CURRICULUM_SNAPSHOT — an immutable copy of a curriculum at a point in time. Used to\\npreserve the rules a student was enrolled under, even after the curriculum changes.\\n• DISCIPLINE — a course/subject belonging to a curriculum. Has semester, ects_credits,\\nand evaluation_type (EXAM, COLLOCVIU, VP).\\n• STUDENT_CURRICULUM — the enrollment record: which student is in which curriculum, under\\nwhich study formation.\\n• GRADE — the result. Linked to a student, a discipline, and optionally a curriculum snapshot.\\nFields: value (1–10, 0 = absent), exam_session, grading_date, and graded_by_user_id (the\\nprofessor who entered it).\\n• DATA_IMPORT_JOB — records of bulk Excel/CSV imports, so you know when a batch of grades\\nwas uploaded and by whom.\\nModule 3 — Documents\\nDOCUMENT — a file or record that goes through an approval workflow. Has type, status (DRAFT,\\nPENDING, APPROVED, REJECTED, MODIFICATION), author_id, assigned_to_user_id, file_path, and\\ncontent (extracted text for full-text search). Supports physical file storage on disk.\\nModule 4 — Reports\\n• REPORT_DEFINITION — a named, reusable report template (e.g., “Electronic Grade Central-\\nizer”). Has visibility (PUBLIC / PRIVATE).\\n• REPORT_REQUEST — an instance of running a report, with filters stored as JSON.\\n• E_GRADE_CENTRALIZER — the specific data model for the grade centralizer report.\\n• REPORT_ROW — individual rows of a generated report.\\n• REPORT_EXPORT — tracks every time a report was exported (PDF, CSV, XLSX, XML), by whom,\\nand where the file was stored.\\n2\\n\\n-- 2 of 13 --\\n\\nModule 5 — Audit & Recovery\\nThe most architecturally interesting module.\\n• AUDIT_LOG_ENTRY — the central ledger. Every create, update, and delete in the system\\nwrites a record here with: actor_user_id, action_type (INSERT, UPDATE, DELETE, ROLL-\\nBACK, PITR), entity_type (the table name), entity_id, before_snapshot_json, and after_snapshot_jso\\nThis is what makes rollback possible.\\n• AUDIT_LOG_ARCHIVE — a mirror table. Logs older than 5 years are automatically moved\\nhere (not deleted), satisfying the institutional 5-year retention policy.\\n• BACKUP_JOB — records of every backup run: type (AUTOMATIC, MANUAL), start/end times,\\nstorage location (a JSON file path), and status.\\n• BACKUP_CONFIG — a single-row table controlling the backup scheduler: enabled (boolean),\\ncron_expression (e.g., 0 2 * * * for 2 AM daily).\\n• RECOVERY_POINT / ROLLBACK_OPERATION — structural tables for tracking recovery operations.\\nModule 6 — System Configuration\\nSYSTEM_SETTING — a key-value store for institutional metadata: faculty name, institution name,\\ndean’s name, system email, portal notices. Editable by Admin from the UI.\\nPerformance Indexes\\nThe schema defines indexes on the most-queried paths: STUDENT(registration_number), STUDENT(study_fo\\nGRADE(student_id), DOCUMENT(author_id, type, created_at), AUDIT_LOG_ENTRY(entity_type,\\nentity_id), AUDIT_LOG_ENTRY(actor_user_id), AUDIT_LOG_ENTRY(occurred_at).\\n2 Part 2 — The Backend\\nThe backend is a Node.js / Express 5 application (backend/src/server.js). It listens on port\\n8080 (configurable via PORT env variable) and exposes a REST API under /api/.\\nServer Bootstrap\\nOn startup, the server does three things before taking requests:\\n1. Initializes the scheduler (schedulerService.initScheduler()), which reads BACKUP_CONFIG\\nfrom the database and either starts a cron job for automatic backups or skips it. It also\\nalways schedules the audit log archiving job (runs daily at 1 AM).\\n2. Applies security headers to every response: X-Content-Type-Options: nosniff, X-Frame-\\nOptions: DENY, Referrer-Policy: strict-origin-when-cross-origin, a minimal CSP, and\\nremoves X-Powered-By.\\n3\\n\\n-- 3 of 13 --\\n\\n3. Initializes the SYSTEM_SETTING table with default values (faculty name, dean name, etc.)\\non first run, using ON CONFLICT DO NOTHING so it never overwrites saved values.\\nCORS is controlled by the ALLOWED_ORIGINS environment variable (comma-separated list). The\\nfrontend origin (http://localhost:5173 for dev and the GitHub Pages URL for production) is\\nalways allowed.\\nA UTF-8 middleware intercepts every response and ensures application/json and application/xml\\ncontent types always include ; charset=utf-8, which is essential for Romanian diacritics (ș, ț,\\nă, â, î).\\nDatabase Layer (src/db.js)\\nWraps pg.Pool from the pg package. Key exports: db.query(sql, params) for simple queries\\nand db.transaction(async (client) => {...}) for atomic multi-step operations. The trans-\\naction helper manages BEGIN / COMMIT / ROLLBACK automatically.\\nConnection string is assembled from DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD environ-\\nment variables.\\nMiddleware\\nauthMiddleware.js exports two functions:\\nrequireAuth — extracts the Authorization: Bearer <token> header, verifies the JWT against\\nJWT_SECRET, and attaches { userId, role, fullName } to req.user. Returns 401 if missing, 403\\nif invalid or expired.\\nrequireRole(allowedRoles) — a factory that returns middleware checking whether req.user.role\\nis in the provided array. Returns 403 if not. Used on every route that has access restrictions.\\nerrorHandler.js — the global error handler (last middleware). Formats all errors into a con-\\nsistent { error: true, message, code } JSON structure. Recognizes PostgreSQL error codes\\n(e.g., 23505 for unique violations, 23503 for FK violations) and maps them to user-friendly mes-\\nsages with resolution hints. Also recognizes custom error properties (err.customMessage, err.customCode)\\nset by the audit service.\\nRoutes Overview\\nAll routes are prefixed /api/. Here is what each file owns:\\n• /api/mock-sso — simulates the university’s Identity Provider. Accepts a login request with\\nemail, role, and full_name, and issues a signed JWT (SSO_MOCK_SECRET) that the frontend\\ncan then exchange for a real AFSMS session token. This exists only because the real uni-\\nversity SSO is not publicly accessible.\\n• /api/auth — handles two flows:\\n– POST /exchange-token — the main login flow. Receives the SSO token, verifies it, finds\\nor creates the user in USER_ACCOUNT, syncs the role, auto-creates the STUDENT record if\\nthe role is STUDENT, and issues an AFSMS JWT (JWT_SECRET, 8-hour expiry).\\n– POST /register — a direct registration path (no SSO), assigns STUDENT role by default.\\n4\\n\\n-- 4 of 13 --\\n\\n• /api/academic — the largest route file (∼49 KB). Covers:\\n– GET /dashboard/stats — role-aware statistics for the dashboard card grid. Each role\\nsees different numbers.\\n– Student CRUD: list, add, update, delete, import from Excel/CSV.\\n– Curriculum CRUD: list, add, update, delete, snapshot.\\n– Discipline CRUD: list, add, update, delete.\\n– Study Formation CRUD.\\n– Grade entry: add individual grade, bulk Excel import, fetch grades per student or\\ndiscipline.\\n• /api/admin — ADMIN-only (except user listing which is also accessible to SECRETARIAT and\\nPROFESSOR for the document forward workflow):\\n– Role management (create, update, delete roles).\\n– User management (create, update, delete users, assign roles, suspend accounts).\\n– Backup management (trigger manual backup, list backup history, download backups,\\nupdate backup schedule, restore from a JSON backup file).\\n• /api/audit — the audit and recovery endpoints:\\n– GET / — paginated list of audit log entries, joined with user names.\\n– POST /rollback/:logId — reverses a single audit log entry (undo an INSERT by delet-\\ning, undo an UPDATE by restoring before_snapshot_json, undo a DELETE by re-inserting).\\n– POST /pitr — Point-in-Time Recovery. Takes a targetTimestamp and replays all audit\\nlog entries after that timestamp in reverse order, effectively winding the database\\nback.\\n• /api/documents — document lifecycle:\\n– GET / — advanced search with filters (type, author, date range, content keyword, au-\\nthor keyword).\\n– POST / — upload a new document with file. Extracts text from PDF, DOCX, XLSX, TXT,\\nCSV, XML for full-text search.\\n– PUT /:id/status — update document status (approve, reject, request modification).\\n– PUT /:id/forward — forward document to a specific user.\\n– PUT /:id/reupload — replace the file on a document in MODIFICATION status.\\n– GET /download/:id — stream the file to the browser.\\n– DELETE /:id — soft-delete the record and remove the physical file.\\n• /api/reports — the centralizer and export engine:\\n– GET /centralizer — runs the master query that joins students, formations, disci-\\nplines, and grades through a dynamic filter set (specialization, study year, education\\nform, semester, discipline, group index, academic year, degree level, and free-text\\nsearch). Returns the raw data.\\n– GET /centralizer/export — same query, but exports to CSV, XLSX, or XML depending\\non format query param.\\n– GET /transcript/:studentId — generates a full academic transcript for a student.\\n• /api/notifications — mass email:\\n5\\n\\n-- 5 of 13 --\\n\\n– POST /send — resolves recipients (either a USER_GROUP or a STUDY_FORMATION), calls the\\nconfigured email service, and logs the send in OUTLOOK_NOTIFICATION.\\n• /api/groups — user group management (CRUD for groups and members).\\n• /api/lookup — read-only reference data endpoint. Returns formations, specializations,\\nacademic years, and curricula in lightweight format for populating dropdowns in the UI.\\n• /api/public — unauthenticated endpoint exposing a portal notice and the faculty/institu-\\ntion name from SYSTEM_SETTING, used by the public-facing landing page.\\n• /api/config — ADMIN-only system configuration:\\n– System settings (key-value pairs).\\n– Academic year management.\\n– Specialization management.\\n– Backup schedule configuration (enable/disable, set cron expression).\\nServices\\nauditService.js — the backbone of data integrity. Provides:\\n• logAudit(client, actorUserId, actionType, moduleName, entityType, entityId, before,\\nafter) — the raw insert function. Always called inside a transaction using the same client\\nso the audit entry and the data change are atomic.\\n• auditableUpdate(actorUserId, moduleName, tableName, id, updateFields) — fetches the\\nbefore snapshot, performs the UPDATE, then logs.\\n• auditableInsert(actorUserId, moduleName, tableName, insertFields) — performs the\\nINSERT, then logs with null before snapshot.\\n• auditableDelete(actorUserId, moduleName, tableName, id) — fetches before snapshot,\\nperforms the DELETE, then logs with null after snapshot.\\n• archiveOldLogs() — moves entries older than 5 years from AUDIT_LOG_ENTRY to AUDIT_LOG_ARCHIVE.\\nEvery data-modifying route in the system that goes through one of these functions automati-\\ncally gets a full audit trail with before/after snapshots.\\nbackupService.js — iterates through the TABLES_TO_BACKUP list (16 tables), dumps all rows from\\neach as JSON, writes a timestamped file to backend/backups/, and records the backup job in\\nBACKUP_JOB.\\nschedulerService.js — uses node-cron to manage two scheduled jobs:\\n• Automatic backup — reads BACKUP_CONFIG on startup and starts a cron job if enabled.\\n• Audit archiving — always scheduled, runs daily at 1 AM.\\nProvides updateSchedule(cronExpression, enabled) called by the admin backup config route.\\nemailService.js — a router that selects the right implementation based on environment vari-\\nables: Graph API (graphEmailService.js) for Microsoft 365 integration, SMTP (smtpEmailService.js)\\n6\\n\\n-- 6 of 13 --\\n\\nfor standard mail servers, or Mock (mockEmailService.js) for development (just logs to con-\\nsole). The sendBulk({ from, recipients, subject, text, html }) interface is the same re-\\ngardless of implementation.\\nimportService.js — parses Excel/CSV grade sheets uploaded by professors and bulk-inserts\\ngrades with proper validation and audit logging.\\n3 Part 3 — Authentication Flow\\nUnderstanding how a user logs in is key to understanding the whole system.\\n1. The user lands on the AFSMS login page and clicks “Login via University SSO”.\\n2. The frontend calls POST /api/mock-sso/login with email and role. The mock SSO returns\\na signed JWT (ssoToken).\\n3. The frontend immediately calls POST /api/auth/exchange-token with that ssoToken.\\n4. The backend verifies the SSO token signature, looks up or creates the user in USER_ACCOUNT,\\nsyncs the role from the SSO claims, auto-creates a STUDENT record if needed, and issues a\\nnew short-lived AFSMS JWT (8 hours).\\n5. The frontend stores this AFSMS token in the AuthContext and sends it as Authorization:\\nBearer <token> on every subsequent API call.\\n6. requireAuth verifies every protected request. requireRole enforces access control per\\nroute.\\nIn production with a real university SSO, only step 2 changes — the frontend redirects to the\\nreal Identity Provider, which redirects back with a real token. Steps 3–6 remain identical.\\n4 Part 4 — The Frontend\\nThe frontend is a React 18 + Vite SPA with React Router v6, deployed to GitHub Pages. No UI\\ncomponent library — all styling is custom CSS.\\nContexts\\nAuthContext — wraps the entire app. Stores the decoded user object ({ userId, role, fullName\\n}), the raw token, and provides login() / logout() methods. login() stores the token in localStorage;\\non page refresh it reads the token back and re-validates it.\\nLanguageContext — provides { t, language, setLanguage }. The t(key) function looks up a\\nkey in the translations.js map (supports en and ro). Used across all pages and navigation to\\nsupport bilingual display.\\n7\\n\\n-- 7 of 13 --\\n\\nRouting (App.jsx)\\nRoutes fall into three categories:\\nPublic — accessible to anyone (no authentication required):\\n• / — PublicPortal (the landing page for unauthenticated visitors)\\n• /login — Login\\n• /register — Register\\n• /system-diagrams — SystemDiagramsPage (architecture diagram viewer)\\nProtected — requires any authenticated user. Wrapped in ProtectedRoute which redirects to\\n/login if no token:\\n• /dashboard, /documents, /privacy, /contact, /help, /shortcuts, /docs/:role?\\nRole-restricted — inside the protected zone but additionally checked by RoleRoute:\\n• /my-grades — STUDENT only\\n• /students — PROFESSOR, SECRETARIAT, ADMIN\\n• /disciplines — ADMIN, SECRETARIAT\\n• /grades/list — PROFESSOR, ADMIN, SECRETARIAT\\n• /centralizer — SECRETARIAT, ADMIN\\n• /groups — SECRETARIAT, ADMIN\\n• /audit — ADMIN only\\nPage-by-Page Tour\\nPublicPortal — The unauthenticated landing page. Fetches the portal notice and institution\\nname from /api/public. Shows the faculty branding and a call to action to log in.\\nLogin — Presents a form. On submit it calls the mock SSO then exchanges the token. On suc-\\ncess, updates AuthContext and navigates to /dashboard.\\nRegister — Direct registration (non-SSO path). Creates a user account with STUDENT role.\\nDashboard — The home screen after login. Shows a role-specific stats grid (different cards de-\\npending on whether you’re an Admin, Secretariat, Professor, or Student) and a recent activity\\nfeed pulled from the audit log. Has offline detection — if navigator.onLine is false or the net-\\nwork call fails, it shows an offline banner with a retry button.\\nStudents — Available to PROFESSOR, SECRETARIAT, ADMIN. Lists all students from /api/academic/students\\nwith their formation name, enrollment status, and plan count. Supports add, edit, delete, and\\nbulk Excel/CSV import. Professors see a read-only view.\\nDisciplines — Available to ADMIN and SECRETARIAT. Manages curricula and their disciplines.\\nAllows creating curricula for specializations, adding/editing/deleting disciplines, and taking cur-\\nriculum snapshots.\\n8\\n\\n-- 8 of 13 --\\n\\nGradesList — Available to PROFESSOR, ADMIN, SECRETARIAT. Allows entering and viewing grades\\nby student and discipline. Professors see their own grades; Secretariat and Admin can see all.\\nSupports bulk import from Excel.\\nMyGrades — STUDENT only. Displays the authenticated student’s grades, GPA, ECTS credits\\nearned, and their percentile rank among all students.\\nCentralizer — Available to SECRETARIAT and ADMIN. A powerful filtered view of all grades\\nacross the faculty. Filters: specialization, degree level, study year, education form, semester,\\ngroup, curriculum, discipline, academic year, and free-text search. Results can be exported\\nto PDF (client-side generation via pdfUtils.js / centralizerGenerator.js), CSV, XLSX, or XML\\n(server-side). The PDF generation uses jsPDF or a custom utility that formats the data as a styled\\ntable.\\nDocuments — Available to all authenticated users (with role-appropriate actions). Students can\\nsubmit documents (upload files). Professors and Secretariat can review, approve, reject, request\\nmodifications, and forward documents to other users. Full-text search across title and content.\\nSupports downloading the original file.\\nUserGroups — Available to SECRETARIAT and ADMIN. Create and manage user groups, add/re-\\nmove members. Groups are used as targets for mass notification emails.\\nAuditLogs — ADMIN only. Paginated table of all audit log entries showing actor, action type,\\nmodule, entity type, entity ID, and timestamp. Expanding a row reveals the before/after JSON\\nsnapshots. Two recovery actions available per row: Single Rollback (undo that one action) and\\nPoint-in-Time Recovery (restore the entire database to the state at that entry’s timestamp).\\nDashboard for Admin specifically shows: total users, total students, active curricula, and audit\\nactions in the last 24 hours.\\nDocumentation — a role-aware help page rendered from structured content. Shows different\\nsections based on the role route parameter, so each type of user can navigate directly to their\\nrelevant docs.\\nHelp, Contact, Privacy, Shortcuts — informational pages. Shortcuts renders the keyboard\\nshortcut map from the useKeyboardShortcuts hook.\\nFrontend Services (src/services/api.js)\\nAn Axios instance pre-configured with baseURL (pointing to the backend, configurable via VITE_API_URL\\nenv var) and a request interceptor that automatically injects the Authorization: Bearer header\\nfrom localStorage. Exports named service objects: auditService, adminService, academicService,\\ndocumentsService, reportsService, etc., each wrapping the relevant API endpoints.\\nUtilities\\ntranslations.js — the full bilingual string map. Every user-visible string has an en and ro key.\\nconstants.js — shared enumerations like document types, status values, and role lists. Kept\\nin sync between frontend and backend.\\npdfUtils.js / centralizerGenerator.js / transcriptGenerator.js — client-side PDF/document\\ngeneration utilities. Used by the Centralizer and the student transcript feature to generate\\ndownload-ready documents directly in the browser without a server round-trip.\\nmockData.js — seed data used for offline/demo mode and testing.\\n9\\n\\n-- 9 of 13 --\\n\\nuseKeyboardShortcuts.js — a custom React hook that registers global keyboard shortcuts (e.g.,\\nAlt+D for dashboard, Alt+S for students) and cleans them up on unmount.\\n5 Part 5 — Data Integrity: The Audit & Rollback System\\nThis is the most distinctive engineering choice in the project.\\nHow It Works\\nEvery write operation (INSERT, UPDATE, DELETE) that flows through auditableInsert, auditableUpdate,\\nor auditableDelete in auditService.js captures a JSON snapshot of the record’s state before\\nand after the operation, within the same database transaction. If the transaction rolls back, the\\naudit entry also rolls back.\\nThis means AUDIT_LOG_ENTRY is a complete history of every row in the system.\\nSingle-Record Rollback\\nWhen an Admin clicks “Rollback” on an audit log entry:\\n1. The POST /api/audit/rollback/:logId endpoint fetches the log entry.\\n2. If the original action was INSERT: it deletes the record (undoing the creation).\\n3. If the original action was UPDATE: it restores the before_snapshot_json columns to the\\nrecord.\\n4. If the original action was DELETE: it re-inserts the before_snapshot_json back into the table.\\n5. The rollback itself is logged as a new audit entry (action type ROLLBACK_INSERT, ROLLBACK_UPDATE,\\nor ROLLBACK_DELETE), so the rollback is itself auditable and reversible.\\nThe implementation validates entity_type against a whitelist (STUDENT, GRADE, USER_ACCOUNT,\\nDOCUMENT, STUDY_FORMATION, DISCIPLINE) to prevent SQL injection.\\nPoint-in-Time Recovery (PITR)\\nThis is the full database rewind feature. When triggered with a targetTimestamp:\\n1. All AUDIT_LOG_ENTRY records with occurred_at > targetTimestamp are fetched in descend-\\ning order (most recent first).\\n2. Each entry is reversed: INSERTs become DELETEs, UPDATEs restore their before_snapshot_json,\\nDELETEs re-insert their before_snapshot_json.\\n3. The entire operation is wrapped in a single database transaction — either all reversals\\nsucceed or none do.\\n4. A PITR log entry is written recording who triggered it, the target timestamp, and how many\\nactions were reversed.\\nThis effectively winds the database back to a consistent snapshot at any point for which audit\\nlogs exist.\\n10\\n\\n-- 10 of 13 --\\n\\nBackup System\\nThe backup system is a complement to the audit system. While audit logs allow surgical rollback,\\nbackups provide a full safety net:\\n• Manual backup — triggered from the Admin UI, calls createBackup() which dumps all 16\\ntables to a timestamped JSON file in backend/backups/.\\n• Automatic backup — scheduled via cron expression configured in the Admin UI. The\\nscheduler reads BACKUP_CONFIG on startup.\\n• Restore from backup — the Admin can upload a backup JSON file; the system truncates\\naffected tables and re-inserts all rows from the snapshot.\\n• Audit archiving — runs daily at 1 AM. Logs older than 5 years are moved to AUDIT_LOG_ARCHIVE\\nto manage active table size while satisfying the institutional 5-year retention policy.\\n6 Part 6 — The Email Notification System\\nThe system supports three email backends, selected at startup by environment variable:\\nGraph API (graphEmailService.js) — uses @microsoft/microsoft-graph-client with Azure iden-\\ntity credentials to send via Microsoft 365. Configured by AZURE_TENANT_ID, AZURE_CLIENT_ID,\\nAZURE_CLIENT_SECRET, GRAPH_SENDER_EMAIL.\\nSMTP (smtpEmailService.js) — uses nodemailer with standard SMTP credentials. Configured\\nby SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.\\nMock (mockEmailService.js) — logs the email payload to the console. Used in development.\\nThe emailService.js router checks for the presence of the Azure credentials first; if not found,\\nfalls back to SMTP; if not found, falls back to Mock.\\nThe notification flow: Admin or Secretariat selects a group (from USER_GROUP) or a study forma-\\ntion, writes a subject and body, and clicks Send. The backend resolves the member emails, calls\\nemailService.sendBulk(), and records the send in OUTLOOK_NOTIFICATION.\\n7 Part 7 — The Document Workflow\\nDocuments go through a defined lifecycle:\\n1. Any authenticated user uploads a document (POST /api/documents). Status becomes DRAFT.\\n2. The uploader or a Secretariat/Admin changes the status to PENDING to submit it for review.\\n3. Secretariat or Admin reviews it:\\n• APPROVED — document is accepted.\\n• REJECTED — document is declined (with optional revision notes).\\n• MODIFICATION — document is sent back with revision notes.\\n4. If MODIFICATION, the author can re-upload a new file version (PUT /:id/reupload). Status\\nresets to PENDING.\\n11\\n\\n-- 11 of 13 --\\n\\n5. A document can also be forwarded to a specific user (PUT /:id/forward), setting assigned_to_user_id.\\nAll status changes go through auditableUpdate so the full workflow history is in the audit log.\\nFile storage: uploaded files are stored on disk under backend/uploads/. The system accepts\\nPDF, DOCX, XLSX, CSV, XML, TXT, images, PPT, ZIP, RAR, and video files. For PDF, DOCX, XLSX,\\nTXT, and CSV uploads, the system extracts text content and stores it in the content column for\\nfull-text search.\\n8 Part 8 — Reports & The Centralizer\\nThe grade centralizer is the main reporting feature. It is a dynamic, filtered view of the intersec-\\ntion of students, disciplines, and grades.\\nThe backend query (getCentralizerData in reports.js) performs a complex multi-join: it starts\\nfrom STUDENT, joins through STUDENT_CURRICULUM → STUDY_FORMATION → CURRICULUM → SPECIALIZATION,\\nthen uses a lateral join to get all disciplines either from the curriculum or from existing grades\\nfor that student. Grades are outer-joined so students without grades still appear.\\nFilters available: specialization, degree level, study year, education form, curriculum, discipline,\\ngroup index, academic year, semester, evaluation type, and a free-text code/name search.\\nExport formats:\\n• CSV — via PapaParse, flat rows.\\n• XLSX — via the xlsx library, formatted workbook.\\n• XML — via xml2js, structured document.\\n• PDF — generated client-side via the centralizerGenerator.js utility.\\nThe student transcript (GET /api/reports/transcript/:studentId) generates a per-student aca-\\ndemic record with all grades organized by semester and curriculum.\\n9 Part 9 — Configuration & System Settings\\nThe Admin has access to a configuration panel (routes under /api/config, frontend in the Dash-\\nboard admin section) covering:\\nSystem Settings — edit the key-value store: faculty name, institution name, dean name, dean\\nsecretary, system email, portal notice. These values are consumed by the public portal and\\nembedded in generated documents.\\nAcademic Years — create and manage academic year records. Setting one as is_active auto-\\nmatically deactivates all others.\\nSpecializations — manage academic programs. Toggle active/inactive, set degree level.\\nBackup Schedule — toggle automatic backups on/off and configure the cron expression. Changes\\ntake effect immediately (the scheduler updates its live job).\\n12\\n\\n-- 12 of 13 --\\n\\n10 Part 10 — How to Run the Project\\nPrerequisites: Node.js 18+, PostgreSQL 15+.\\nBackend setup:\\n1. Navigate to backend/.\\n2. Copy .env.example to .env and fill in DB_* variables, JWT_SECRET, SSO_MOCK_SECRET, and\\noptionally email credentials.\\n3. Run npm install.\\n4. Create the database schema by running src/schema.sql against your PostgreSQL instance.\\n5. Optionally run any seed_*.js scripts for initial data.\\n6. Start with npm run dev (nodemon) or npm start.\\nFrontend setup:\\n1. From the project root.\\n2. Copy .env.example to .env.local and set VITE_API_URL to your backend URL (e.g., http://localhost:8\\n3. Run npm install.\\n4. Start with npm run dev (opens on port 5173 by default).\\nFirst login: The mock SSO endpoint (POST /api/mock-sso/login) accepts { email, role, full_name\\n}. Use role ADMIN for full access on first setup. The frontend’s login page calls this automatically\\nwhen you click the SSO login button.\\nSummary: Architecture in One Paragraph\\nAFSMS is a layered system. At the bottom is a PostgreSQL schema organized into six func-\\ntional modules (security, academics, documents, reports, audit/recovery, configuration). The\\nNode.js/Express backend sits on top, exposing a versioned REST API that enforces JWT authen-\\ntication and role-based access control on every route. All writes are mediated through the audit\\nservice, which captures before/after snapshots within the same transaction, enabling single-\\nrecord rollback and full point-in-time database recovery. The React frontend consumes this API\\nthrough an Axios service layer, routes users based on their role, and provides specialized pages\\nfor each persona — students see their grades, professors manage grade entry, secretariat han-\\ndles students and documents, and the admin has full visibility including the audit log and system\\nconfiguration.\\nEnd of AFSMS Walkthrough Guide\\n13\\n\\n-- 13 of 13 --\\n\\n", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": "file-1777988007133-62277626.pdf", "created_at": "2026-05-05T13:33:27.134Z", "revision_notes": null, "original_filename": "AFSMS Walkthrough Guide.pdf", "assigned_to_user_id": null}	\N	2026-05-05 16:33:30.409789+03	t	\N
9c4df602-9c1d-464a-8a40-5c5754f442ac	65cbf637-fde9-4a43-954f-a8806682d462	\N	UPDATE	DOCUMENT_FLOW	DOCUMENT	bbdbf7fc-3053-49cb-8b49-4b96c70948df	\N	\N	\N	\N	{"id": "bbdbf7fc-3053-49cb-8b49-4b96c70948df", "type": "GUIDE", "title": "Walkrough Complet AFSMS", "status": "DRAFT", "content": "AFSMS — Comprehensive Walkthrough Guide\\nAutomated Faculty Student Management System\\nProject P9-T4 · Sugubete, Maximilian, Mitrache\\nWhat Is This System?\\nAFSMS (Automated Faculty Student Management System) is a full-stack web application built for\\nthe Faculty of Automation, Computers and Electronics at the University of Craiova. It man-\\nages the complete academic lifecycle: student records, curricula, grades, document workflows,\\naudit trails, backups, and notifications — all in one place, behind a role-based access control\\nsystem that mirrors the real university structure.\\nThe system has two halves: a React + Vite frontend deployed as a GitHub Pages SPA, and a\\nNode.js / Express backend connected to a PostgreSQL database.\\n1 Part 1 — The Database Layer (Bottom)\\nEverything starts here. The schema is in src/schema.sql and defines 8 logical modules.\\nModule 1 — Security & Users\\nThe foundation of all access control.\\n• ROLE — defines the four roles in the system: STUDENT, PROFESSOR, SECRETARIAT, ADMIN. Each\\nrole has a unique code used throughout the backend for permission checks.\\n• PERMISSION / OPERATION — fine-grained action definitions (e.g., READ_GRADES, EXPORT_REPORT)\\nthat can be linked to roles via ROLE_PERMISSION and ROLE_OPERATION junction tables.\\n• USER_ACCOUNT — every person in the system has a record here. The critical field is sso_subject,\\na unique identifier that comes from the university’s SSO (Single Sign-On) system. This is\\nwhat ties a university identity to an AFSMS account. The field account_status can be ACTIVE\\nor SUSPENDED.\\n• USER_ROLE — maps users to roles. A user has exactly one active role at a time.\\n• AUTH_SESSION — stores session tokens with expiry and IP address for traceability.\\n• USER_GROUP / USER_GROUP_MEMBER — a simple grouping mechanism used for mass email\\nnotifications. A group like “Year 1 CTI” contains user accounts.\\n• OUTLOOK_NOTIFICATION — records of every bulk email sent through the system, including\\nrecipient list, subject, body preview, and delivery status.\\n1\\n\\n-- 1 of 13 --\\n\\nModule 2 — Academic Data\\nThe core of what makes the system academic.\\n• ACADEMIC_YEAR — records like 2025/2026. Only one can be is_active = TRUE at a time.\\nUsed as a reference point for curricula and reports.\\n• SPECIALIZATION — a program of study (e.g., “Calculatoare și Tehnologia Informației”, “Au-\\ntomatică și Informatică Aplicată”). Has a degree_level field (LICENTA, MASTER).\\n• STUDY_FORMATION — a specific group of students, e.g., “CTI Year 2 Group A”. Has study_year,\\neducation_form (ZI/ID/IFR), and group_index.\\n• STUDENT — the student record, linked to a study formation. Contains registration_number\\n(e.g. MAT1234), names, email, enrollment date, and status (ENROLLED, ACTIVE, GRADUATED,\\nWITHDRAWN).\\n• CURRICULUM — a plan of study for a specialization, with a valid_from date. Can be snap-\\nshotted.\\n• CURRICULUM_SNAPSHOT — an immutable copy of a curriculum at a point in time. Used to\\npreserve the rules a student was enrolled under, even after the curriculum changes.\\n• DISCIPLINE — a course/subject belonging to a curriculum. Has semester, ects_credits,\\nand evaluation_type (EXAM, COLLOCVIU, VP).\\n• STUDENT_CURRICULUM — the enrollment record: which student is in which curriculum, under\\nwhich study formation.\\n• GRADE — the result. Linked to a student, a discipline, and optionally a curriculum snapshot.\\nFields: value (1–10, 0 = absent), exam_session, grading_date, and graded_by_user_id (the\\nprofessor who entered it).\\n• DATA_IMPORT_JOB — records of bulk Excel/CSV imports, so you know when a batch of grades\\nwas uploaded and by whom.\\nModule 3 — Documents\\nDOCUMENT — a file or record that goes through an approval workflow. Has type, status (DRAFT,\\nPENDING, APPROVED, REJECTED, MODIFICATION), author_id, assigned_to_user_id, file_path, and\\ncontent (extracted text for full-text search). Supports physical file storage on disk.\\nModule 4 — Reports\\n• REPORT_DEFINITION — a named, reusable report template (e.g., “Electronic Grade Central-\\nizer”). Has visibility (PUBLIC / PRIVATE).\\n• REPORT_REQUEST — an instance of running a report, with filters stored as JSON.\\n• E_GRADE_CENTRALIZER — the specific data model for the grade centralizer report.\\n• REPORT_ROW — individual rows of a generated report.\\n• REPORT_EXPORT — tracks every time a report was exported (PDF, CSV, XLSX, XML), by whom,\\nand where the file was stored.\\n2\\n\\n-- 2 of 13 --\\n\\nModule 5 — Audit & Recovery\\nThe most architecturally interesting module.\\n• AUDIT_LOG_ENTRY — the central ledger. Every create, update, and delete in the system\\nwrites a record here with: actor_user_id, action_type (INSERT, UPDATE, DELETE, ROLL-\\nBACK, PITR), entity_type (the table name), entity_id, before_snapshot_json, and after_snapshot_jso\\nThis is what makes rollback possible.\\n• AUDIT_LOG_ARCHIVE — a mirror table. Logs older than 5 years are automatically moved\\nhere (not deleted), satisfying the institutional 5-year retention policy.\\n• BACKUP_JOB — records of every backup run: type (AUTOMATIC, MANUAL), start/end times,\\nstorage location (a JSON file path), and status.\\n• BACKUP_CONFIG — a single-row table controlling the backup scheduler: enabled (boolean),\\ncron_expression (e.g., 0 2 * * * for 2 AM daily).\\n• RECOVERY_POINT / ROLLBACK_OPERATION — structural tables for tracking recovery operations.\\nModule 6 — System Configuration\\nSYSTEM_SETTING — a key-value store for institutional metadata: faculty name, institution name,\\ndean’s name, system email, portal notices. Editable by Admin from the UI.\\nPerformance Indexes\\nThe schema defines indexes on the most-queried paths: STUDENT(registration_number), STUDENT(study_fo\\nGRADE(student_id), DOCUMENT(author_id, type, created_at), AUDIT_LOG_ENTRY(entity_type,\\nentity_id), AUDIT_LOG_ENTRY(actor_user_id), AUDIT_LOG_ENTRY(occurred_at).\\n2 Part 2 — The Backend\\nThe backend is a Node.js / Express 5 application (backend/src/server.js). It listens on port\\n8080 (configurable via PORT env variable) and exposes a REST API under /api/.\\nServer Bootstrap\\nOn startup, the server does three things before taking requests:\\n1. Initializes the scheduler (schedulerService.initScheduler()), which reads BACKUP_CONFIG\\nfrom the database and either starts a cron job for automatic backups or skips it. It also\\nalways schedules the audit log archiving job (runs daily at 1 AM).\\n2. Applies security headers to every response: X-Content-Type-Options: nosniff, X-Frame-\\nOptions: DENY, Referrer-Policy: strict-origin-when-cross-origin, a minimal CSP, and\\nremoves X-Powered-By.\\n3\\n\\n-- 3 of 13 --\\n\\n3. Initializes the SYSTEM_SETTING table with default values (faculty name, dean name, etc.)\\non first run, using ON CONFLICT DO NOTHING so it never overwrites saved values.\\nCORS is controlled by the ALLOWED_ORIGINS environment variable (comma-separated list). The\\nfrontend origin (http://localhost:5173 for dev and the GitHub Pages URL for production) is\\nalways allowed.\\nA UTF-8 middleware intercepts every response and ensures application/json and application/xml\\ncontent types always include ; charset=utf-8, which is essential for Romanian diacritics (ș, ț,\\nă, â, î).\\nDatabase Layer (src/db.js)\\nWraps pg.Pool from the pg package. Key exports: db.query(sql, params) for simple queries\\nand db.transaction(async (client) => {...}) for atomic multi-step operations. The trans-\\naction helper manages BEGIN / COMMIT / ROLLBACK automatically.\\nConnection string is assembled from DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD environ-\\nment variables.\\nMiddleware\\nauthMiddleware.js exports two functions:\\nrequireAuth — extracts the Authorization: Bearer <token> header, verifies the JWT against\\nJWT_SECRET, and attaches { userId, role, fullName } to req.user. Returns 401 if missing, 403\\nif invalid or expired.\\nrequireRole(allowedRoles) — a factory that returns middleware checking whether req.user.role\\nis in the provided array. Returns 403 if not. Used on every route that has access restrictions.\\nerrorHandler.js — the global error handler (last middleware). Formats all errors into a con-\\nsistent { error: true, message, code } JSON structure. Recognizes PostgreSQL error codes\\n(e.g., 23505 for unique violations, 23503 for FK violations) and maps them to user-friendly mes-\\nsages with resolution hints. Also recognizes custom error properties (err.customMessage, err.customCode)\\nset by the audit service.\\nRoutes Overview\\nAll routes are prefixed /api/. Here is what each file owns:\\n• /api/mock-sso — simulates the university’s Identity Provider. Accepts a login request with\\nemail, role, and full_name, and issues a signed JWT (SSO_MOCK_SECRET) that the frontend\\ncan then exchange for a real AFSMS session token. This exists only because the real uni-\\nversity SSO is not publicly accessible.\\n• /api/auth — handles two flows:\\n– POST /exchange-token — the main login flow. Receives the SSO token, verifies it, finds\\nor creates the user in USER_ACCOUNT, syncs the role, auto-creates the STUDENT record if\\nthe role is STUDENT, and issues an AFSMS JWT (JWT_SECRET, 8-hour expiry).\\n– POST /register — a direct registration path (no SSO), assigns STUDENT role by default.\\n4\\n\\n-- 4 of 13 --\\n\\n• /api/academic — the largest route file (∼49 KB). Covers:\\n– GET /dashboard/stats — role-aware statistics for the dashboard card grid. Each role\\nsees different numbers.\\n– Student CRUD: list, add, update, delete, import from Excel/CSV.\\n– Curriculum CRUD: list, add, update, delete, snapshot.\\n– Discipline CRUD: list, add, update, delete.\\n– Study Formation CRUD.\\n– Grade entry: add individual grade, bulk Excel import, fetch grades per student or\\ndiscipline.\\n• /api/admin — ADMIN-only (except user listing which is also accessible to SECRETARIAT and\\nPROFESSOR for the document forward workflow):\\n– Role management (create, update, delete roles).\\n– User management (create, update, delete users, assign roles, suspend accounts).\\n– Backup management (trigger manual backup, list backup history, download backups,\\nupdate backup schedule, restore from a JSON backup file).\\n• /api/audit — the audit and recovery endpoints:\\n– GET / — paginated list of audit log entries, joined with user names.\\n– POST /rollback/:logId — reverses a single audit log entry (undo an INSERT by delet-\\ning, undo an UPDATE by restoring before_snapshot_json, undo a DELETE by re-inserting).\\n– POST /pitr — Point-in-Time Recovery. Takes a targetTimestamp and replays all audit\\nlog entries after that timestamp in reverse order, effectively winding the database\\nback.\\n• /api/documents — document lifecycle:\\n– GET / — advanced search with filters (type, author, date range, content keyword, au-\\nthor keyword).\\n– POST / — upload a new document with file. Extracts text from PDF, DOCX, XLSX, TXT,\\nCSV, XML for full-text search.\\n– PUT /:id/status — update document status (approve, reject, request modification).\\n– PUT /:id/forward — forward document to a specific user.\\n– PUT /:id/reupload — replace the file on a document in MODIFICATION status.\\n– GET /download/:id — stream the file to the browser.\\n– DELETE /:id — soft-delete the record and remove the physical file.\\n• /api/reports — the centralizer and export engine:\\n– GET /centralizer — runs the master query that joins students, formations, disci-\\nplines, and grades through a dynamic filter set (specialization, study year, education\\nform, semester, discipline, group index, academic year, degree level, and free-text\\nsearch). Returns the raw data.\\n– GET /centralizer/export — same query, but exports to CSV, XLSX, or XML depending\\non format query param.\\n– GET /transcript/:studentId — generates a full academic transcript for a student.\\n• /api/notifications — mass email:\\n5\\n\\n-- 5 of 13 --\\n\\n– POST /send — resolves recipients (either a USER_GROUP or a STUDY_FORMATION), calls the\\nconfigured email service, and logs the send in OUTLOOK_NOTIFICATION.\\n• /api/groups — user group management (CRUD for groups and members).\\n• /api/lookup — read-only reference data endpoint. Returns formations, specializations,\\nacademic years, and curricula in lightweight format for populating dropdowns in the UI.\\n• /api/public — unauthenticated endpoint exposing a portal notice and the faculty/institu-\\ntion name from SYSTEM_SETTING, used by the public-facing landing page.\\n• /api/config — ADMIN-only system configuration:\\n– System settings (key-value pairs).\\n– Academic year management.\\n– Specialization management.\\n– Backup schedule configuration (enable/disable, set cron expression).\\nServices\\nauditService.js — the backbone of data integrity. Provides:\\n• logAudit(client, actorUserId, actionType, moduleName, entityType, entityId, before,\\nafter) — the raw insert function. Always called inside a transaction using the same client\\nso the audit entry and the data change are atomic.\\n• auditableUpdate(actorUserId, moduleName, tableName, id, updateFields) — fetches the\\nbefore snapshot, performs the UPDATE, then logs.\\n• auditableInsert(actorUserId, moduleName, tableName, insertFields) — performs the\\nINSERT, then logs with null before snapshot.\\n• auditableDelete(actorUserId, moduleName, tableName, id) — fetches before snapshot,\\nperforms the DELETE, then logs with null after snapshot.\\n• archiveOldLogs() — moves entries older than 5 years from AUDIT_LOG_ENTRY to AUDIT_LOG_ARCHIVE.\\nEvery data-modifying route in the system that goes through one of these functions automati-\\ncally gets a full audit trail with before/after snapshots.\\nbackupService.js — iterates through the TABLES_TO_BACKUP list (16 tables), dumps all rows from\\neach as JSON, writes a timestamped file to backend/backups/, and records the backup job in\\nBACKUP_JOB.\\nschedulerService.js — uses node-cron to manage two scheduled jobs:\\n• Automatic backup — reads BACKUP_CONFIG on startup and starts a cron job if enabled.\\n• Audit archiving — always scheduled, runs daily at 1 AM.\\nProvides updateSchedule(cronExpression, enabled) called by the admin backup config route.\\nemailService.js — a router that selects the right implementation based on environment vari-\\nables: Graph API (graphEmailService.js) for Microsoft 365 integration, SMTP (smtpEmailService.js)\\n6\\n\\n-- 6 of 13 --\\n\\nfor standard mail servers, or Mock (mockEmailService.js) for development (just logs to con-\\nsole). The sendBulk({ from, recipients, subject, text, html }) interface is the same re-\\ngardless of implementation.\\nimportService.js — parses Excel/CSV grade sheets uploaded by professors and bulk-inserts\\ngrades with proper validation and audit logging.\\n3 Part 3 — Authentication Flow\\nUnderstanding how a user logs in is key to understanding the whole system.\\n1. The user lands on the AFSMS login page and clicks “Login via University SSO”.\\n2. The frontend calls POST /api/mock-sso/login with email and role. The mock SSO returns\\na signed JWT (ssoToken).\\n3. The frontend immediately calls POST /api/auth/exchange-token with that ssoToken.\\n4. The backend verifies the SSO token signature, looks up or creates the user in USER_ACCOUNT,\\nsyncs the role from the SSO claims, auto-creates a STUDENT record if needed, and issues a\\nnew short-lived AFSMS JWT (8 hours).\\n5. The frontend stores this AFSMS token in the AuthContext and sends it as Authorization:\\nBearer <token> on every subsequent API call.\\n6. requireAuth verifies every protected request. requireRole enforces access control per\\nroute.\\nIn production with a real university SSO, only step 2 changes — the frontend redirects to the\\nreal Identity Provider, which redirects back with a real token. Steps 3–6 remain identical.\\n4 Part 4 — The Frontend\\nThe frontend is a React 18 + Vite SPA with React Router v6, deployed to GitHub Pages. No UI\\ncomponent library — all styling is custom CSS.\\nContexts\\nAuthContext — wraps the entire app. Stores the decoded user object ({ userId, role, fullName\\n}), the raw token, and provides login() / logout() methods. login() stores the token in localStorage;\\non page refresh it reads the token back and re-validates it.\\nLanguageContext — provides { t, language, setLanguage }. The t(key) function looks up a\\nkey in the translations.js map (supports en and ro). Used across all pages and navigation to\\nsupport bilingual display.\\n7\\n\\n-- 7 of 13 --\\n\\nRouting (App.jsx)\\nRoutes fall into three categories:\\nPublic — accessible to anyone (no authentication required):\\n• / — PublicPortal (the landing page for unauthenticated visitors)\\n• /login — Login\\n• /register — Register\\n• /system-diagrams — SystemDiagramsPage (architecture diagram viewer)\\nProtected — requires any authenticated user. Wrapped in ProtectedRoute which redirects to\\n/login if no token:\\n• /dashboard, /documents, /privacy, /contact, /help, /shortcuts, /docs/:role?\\nRole-restricted — inside the protected zone but additionally checked by RoleRoute:\\n• /my-grades — STUDENT only\\n• /students — PROFESSOR, SECRETARIAT, ADMIN\\n• /disciplines — ADMIN, SECRETARIAT\\n• /grades/list — PROFESSOR, ADMIN, SECRETARIAT\\n• /centralizer — SECRETARIAT, ADMIN\\n• /groups — SECRETARIAT, ADMIN\\n• /audit — ADMIN only\\nPage-by-Page Tour\\nPublicPortal — The unauthenticated landing page. Fetches the portal notice and institution\\nname from /api/public. Shows the faculty branding and a call to action to log in.\\nLogin — Presents a form. On submit it calls the mock SSO then exchanges the token. On suc-\\ncess, updates AuthContext and navigates to /dashboard.\\nRegister — Direct registration (non-SSO path). Creates a user account with STUDENT role.\\nDashboard — The home screen after login. Shows a role-specific stats grid (different cards de-\\npending on whether you’re an Admin, Secretariat, Professor, or Student) and a recent activity\\nfeed pulled from the audit log. Has offline detection — if navigator.onLine is false or the net-\\nwork call fails, it shows an offline banner with a retry button.\\nStudents — Available to PROFESSOR, SECRETARIAT, ADMIN. Lists all students from /api/academic/students\\nwith their formation name, enrollment status, and plan count. Supports add, edit, delete, and\\nbulk Excel/CSV import. Professors see a read-only view.\\nDisciplines — Available to ADMIN and SECRETARIAT. Manages curricula and their disciplines.\\nAllows creating curricula for specializations, adding/editing/deleting disciplines, and taking cur-\\nriculum snapshots.\\n8\\n\\n-- 8 of 13 --\\n\\nGradesList — Available to PROFESSOR, ADMIN, SECRETARIAT. Allows entering and viewing grades\\nby student and discipline. Professors see their own grades; Secretariat and Admin can see all.\\nSupports bulk import from Excel.\\nMyGrades — STUDENT only. Displays the authenticated student’s grades, GPA, ECTS credits\\nearned, and their percentile rank among all students.\\nCentralizer — Available to SECRETARIAT and ADMIN. A powerful filtered view of all grades\\nacross the faculty. Filters: specialization, degree level, study year, education form, semester,\\ngroup, curriculum, discipline, academic year, and free-text search. Results can be exported\\nto PDF (client-side generation via pdfUtils.js / centralizerGenerator.js), CSV, XLSX, or XML\\n(server-side). The PDF generation uses jsPDF or a custom utility that formats the data as a styled\\ntable.\\nDocuments — Available to all authenticated users (with role-appropriate actions). Students can\\nsubmit documents (upload files). Professors and Secretariat can review, approve, reject, request\\nmodifications, and forward documents to other users. Full-text search across title and content.\\nSupports downloading the original file.\\nUserGroups — Available to SECRETARIAT and ADMIN. Create and manage user groups, add/re-\\nmove members. Groups are used as targets for mass notification emails.\\nAuditLogs — ADMIN only. Paginated table of all audit log entries showing actor, action type,\\nmodule, entity type, entity ID, and timestamp. Expanding a row reveals the before/after JSON\\nsnapshots. Two recovery actions available per row: Single Rollback (undo that one action) and\\nPoint-in-Time Recovery (restore the entire database to the state at that entry’s timestamp).\\nDashboard for Admin specifically shows: total users, total students, active curricula, and audit\\nactions in the last 24 hours.\\nDocumentation — a role-aware help page rendered from structured content. Shows different\\nsections based on the role route parameter, so each type of user can navigate directly to their\\nrelevant docs.\\nHelp, Contact, Privacy, Shortcuts — informational pages. Shortcuts renders the keyboard\\nshortcut map from the useKeyboardShortcuts hook.\\nFrontend Services (src/services/api.js)\\nAn Axios instance pre-configured with baseURL (pointing to the backend, configurable via VITE_API_URL\\nenv var) and a request interceptor that automatically injects the Authorization: Bearer header\\nfrom localStorage. Exports named service objects: auditService, adminService, academicService,\\ndocumentsService, reportsService, etc., each wrapping the relevant API endpoints.\\nUtilities\\ntranslations.js — the full bilingual string map. Every user-visible string has an en and ro key.\\nconstants.js — shared enumerations like document types, status values, and role lists. Kept\\nin sync between frontend and backend.\\npdfUtils.js / centralizerGenerator.js / transcriptGenerator.js — client-side PDF/document\\ngeneration utilities. Used by the Centralizer and the student transcript feature to generate\\ndownload-ready documents directly in the browser without a server round-trip.\\nmockData.js — seed data used for offline/demo mode and testing.\\n9\\n\\n-- 9 of 13 --\\n\\nuseKeyboardShortcuts.js — a custom React hook that registers global keyboard shortcuts (e.g.,\\nAlt+D for dashboard, Alt+S for students) and cleans them up on unmount.\\n5 Part 5 — Data Integrity: The Audit & Rollback System\\nThis is the most distinctive engineering choice in the project.\\nHow It Works\\nEvery write operation (INSERT, UPDATE, DELETE) that flows through auditableInsert, auditableUpdate,\\nor auditableDelete in auditService.js captures a JSON snapshot of the record’s state before\\nand after the operation, within the same database transaction. If the transaction rolls back, the\\naudit entry also rolls back.\\nThis means AUDIT_LOG_ENTRY is a complete history of every row in the system.\\nSingle-Record Rollback\\nWhen an Admin clicks “Rollback” on an audit log entry:\\n1. The POST /api/audit/rollback/:logId endpoint fetches the log entry.\\n2. If the original action was INSERT: it deletes the record (undoing the creation).\\n3. If the original action was UPDATE: it restores the before_snapshot_json columns to the\\nrecord.\\n4. If the original action was DELETE: it re-inserts the before_snapshot_json back into the table.\\n5. The rollback itself is logged as a new audit entry (action type ROLLBACK_INSERT, ROLLBACK_UPDATE,\\nor ROLLBACK_DELETE), so the rollback is itself auditable and reversible.\\nThe implementation validates entity_type against a whitelist (STUDENT, GRADE, USER_ACCOUNT,\\nDOCUMENT, STUDY_FORMATION, DISCIPLINE) to prevent SQL injection.\\nPoint-in-Time Recovery (PITR)\\nThis is the full database rewind feature. When triggered with a targetTimestamp:\\n1. All AUDIT_LOG_ENTRY records with occurred_at > targetTimestamp are fetched in descend-\\ning order (most recent first).\\n2. Each entry is reversed: INSERTs become DELETEs, UPDATEs restore their before_snapshot_json,\\nDELETEs re-insert their before_snapshot_json.\\n3. The entire operation is wrapped in a single database transaction — either all reversals\\nsucceed or none do.\\n4. A PITR log entry is written recording who triggered it, the target timestamp, and how many\\nactions were reversed.\\nThis effectively winds the database back to a consistent snapshot at any point for which audit\\nlogs exist.\\n10\\n\\n-- 10 of 13 --\\n\\nBackup System\\nThe backup system is a complement to the audit system. While audit logs allow surgical rollback,\\nbackups provide a full safety net:\\n• Manual backup — triggered from the Admin UI, calls createBackup() which dumps all 16\\ntables to a timestamped JSON file in backend/backups/.\\n• Automatic backup — scheduled via cron expression configured in the Admin UI. The\\nscheduler reads BACKUP_CONFIG on startup.\\n• Restore from backup — the Admin can upload a backup JSON file; the system truncates\\naffected tables and re-inserts all rows from the snapshot.\\n• Audit archiving — runs daily at 1 AM. Logs older than 5 years are moved to AUDIT_LOG_ARCHIVE\\nto manage active table size while satisfying the institutional 5-year retention policy.\\n6 Part 6 — The Email Notification System\\nThe system supports three email backends, selected at startup by environment variable:\\nGraph API (graphEmailService.js) — uses @microsoft/microsoft-graph-client with Azure iden-\\ntity credentials to send via Microsoft 365. Configured by AZURE_TENANT_ID, AZURE_CLIENT_ID,\\nAZURE_CLIENT_SECRET, GRAPH_SENDER_EMAIL.\\nSMTP (smtpEmailService.js) — uses nodemailer with standard SMTP credentials. Configured\\nby SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.\\nMock (mockEmailService.js) — logs the email payload to the console. Used in development.\\nThe emailService.js router checks for the presence of the Azure credentials first; if not found,\\nfalls back to SMTP; if not found, falls back to Mock.\\nThe notification flow: Admin or Secretariat selects a group (from USER_GROUP) or a study forma-\\ntion, writes a subject and body, and clicks Send. The backend resolves the member emails, calls\\nemailService.sendBulk(), and records the send in OUTLOOK_NOTIFICATION.\\n7 Part 7 — The Document Workflow\\nDocuments go through a defined lifecycle:\\n1. Any authenticated user uploads a document (POST /api/documents). Status becomes DRAFT.\\n2. The uploader or a Secretariat/Admin changes the status to PENDING to submit it for review.\\n3. Secretariat or Admin reviews it:\\n• APPROVED — document is accepted.\\n• REJECTED — document is declined (with optional revision notes).\\n• MODIFICATION — document is sent back with revision notes.\\n4. If MODIFICATION, the author can re-upload a new file version (PUT /:id/reupload). Status\\nresets to PENDING.\\n11\\n\\n-- 11 of 13 --\\n\\n5. A document can also be forwarded to a specific user (PUT /:id/forward), setting assigned_to_user_id.\\nAll status changes go through auditableUpdate so the full workflow history is in the audit log.\\nFile storage: uploaded files are stored on disk under backend/uploads/. The system accepts\\nPDF, DOCX, XLSX, CSV, XML, TXT, images, PPT, ZIP, RAR, and video files. For PDF, DOCX, XLSX,\\nTXT, and CSV uploads, the system extracts text content and stores it in the content column for\\nfull-text search.\\n8 Part 8 — Reports & The Centralizer\\nThe grade centralizer is the main reporting feature. It is a dynamic, filtered view of the intersec-\\ntion of students, disciplines, and grades.\\nThe backend query (getCentralizerData in reports.js) performs a complex multi-join: it starts\\nfrom STUDENT, joins through STUDENT_CURRICULUM → STUDY_FORMATION → CURRICULUM → SPECIALIZATION,\\nthen uses a lateral join to get all disciplines either from the curriculum or from existing grades\\nfor that student. Grades are outer-joined so students without grades still appear.\\nFilters available: specialization, degree level, study year, education form, curriculum, discipline,\\ngroup index, academic year, semester, evaluation type, and a free-text code/name search.\\nExport formats:\\n• CSV — via PapaParse, flat rows.\\n• XLSX — via the xlsx library, formatted workbook.\\n• XML — via xml2js, structured document.\\n• PDF — generated client-side via the centralizerGenerator.js utility.\\nThe student transcript (GET /api/reports/transcript/:studentId) generates a per-student aca-\\ndemic record with all grades organized by semester and curriculum.\\n9 Part 9 — Configuration & System Settings\\nThe Admin has access to a configuration panel (routes under /api/config, frontend in the Dash-\\nboard admin section) covering:\\nSystem Settings — edit the key-value store: faculty name, institution name, dean name, dean\\nsecretary, system email, portal notice. These values are consumed by the public portal and\\nembedded in generated documents.\\nAcademic Years — create and manage academic year records. Setting one as is_active auto-\\nmatically deactivates all others.\\nSpecializations — manage academic programs. Toggle active/inactive, set degree level.\\nBackup Schedule — toggle automatic backups on/off and configure the cron expression. Changes\\ntake effect immediately (the scheduler updates its live job).\\n12\\n\\n-- 12 of 13 --\\n\\n10 Part 10 — How to Run the Project\\nPrerequisites: Node.js 18+, PostgreSQL 15+.\\nBackend setup:\\n1. Navigate to backend/.\\n2. Copy .env.example to .env and fill in DB_* variables, JWT_SECRET, SSO_MOCK_SECRET, and\\noptionally email credentials.\\n3. Run npm install.\\n4. Create the database schema by running src/schema.sql against your PostgreSQL instance.\\n5. Optionally run any seed_*.js scripts for initial data.\\n6. Start with npm run dev (nodemon) or npm start.\\nFrontend setup:\\n1. From the project root.\\n2. Copy .env.example to .env.local and set VITE_API_URL to your backend URL (e.g., http://localhost:8\\n3. Run npm install.\\n4. Start with npm run dev (opens on port 5173 by default).\\nFirst login: The mock SSO endpoint (POST /api/mock-sso/login) accepts { email, role, full_name\\n}. Use role ADMIN for full access on first setup. The frontend’s login page calls this automatically\\nwhen you click the SSO login button.\\nSummary: Architecture in One Paragraph\\nAFSMS is a layered system. At the bottom is a PostgreSQL schema organized into six func-\\ntional modules (security, academics, documents, reports, audit/recovery, configuration). The\\nNode.js/Express backend sits on top, exposing a versioned REST API that enforces JWT authen-\\ntication and role-based access control on every route. All writes are mediated through the audit\\nservice, which captures before/after snapshots within the same transaction, enabling single-\\nrecord rollback and full point-in-time database recovery. The React frontend consumes this API\\nthrough an Axios service layer, routes users based on their role, and provides specialized pages\\nfor each persona — students see their grades, professors manage grade entry, secretariat han-\\ndles students and documents, and the admin has full visibility including the audit log and system\\nconfiguration.\\nEnd of AFSMS Walkthrough Guide\\n13\\n\\n-- 13 of 13 --\\n\\n", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": "file-1777988007133-62277626.pdf", "created_at": "2026-05-05T13:33:27.134Z", "revision_notes": null, "original_filename": "AFSMS Walkthrough Guide.pdf", "assigned_to_user_id": null}	{"id": "bbdbf7fc-3053-49cb-8b49-4b96c70948df", "type": "GUIDE", "title": "Walkrough Complet AFSMS", "status": "APPROVED", "content": "AFSMS — Comprehensive Walkthrough Guide\\nAutomated Faculty Student Management System\\nProject P9-T4 · Sugubete, Maximilian, Mitrache\\nWhat Is This System?\\nAFSMS (Automated Faculty Student Management System) is a full-stack web application built for\\nthe Faculty of Automation, Computers and Electronics at the University of Craiova. It man-\\nages the complete academic lifecycle: student records, curricula, grades, document workflows,\\naudit trails, backups, and notifications — all in one place, behind a role-based access control\\nsystem that mirrors the real university structure.\\nThe system has two halves: a React + Vite frontend deployed as a GitHub Pages SPA, and a\\nNode.js / Express backend connected to a PostgreSQL database.\\n1 Part 1 — The Database Layer (Bottom)\\nEverything starts here. The schema is in src/schema.sql and defines 8 logical modules.\\nModule 1 — Security & Users\\nThe foundation of all access control.\\n• ROLE — defines the four roles in the system: STUDENT, PROFESSOR, SECRETARIAT, ADMIN. Each\\nrole has a unique code used throughout the backend for permission checks.\\n• PERMISSION / OPERATION — fine-grained action definitions (e.g., READ_GRADES, EXPORT_REPORT)\\nthat can be linked to roles via ROLE_PERMISSION and ROLE_OPERATION junction tables.\\n• USER_ACCOUNT — every person in the system has a record here. The critical field is sso_subject,\\na unique identifier that comes from the university’s SSO (Single Sign-On) system. This is\\nwhat ties a university identity to an AFSMS account. The field account_status can be ACTIVE\\nor SUSPENDED.\\n• USER_ROLE — maps users to roles. A user has exactly one active role at a time.\\n• AUTH_SESSION — stores session tokens with expiry and IP address for traceability.\\n• USER_GROUP / USER_GROUP_MEMBER — a simple grouping mechanism used for mass email\\nnotifications. A group like “Year 1 CTI” contains user accounts.\\n• OUTLOOK_NOTIFICATION — records of every bulk email sent through the system, including\\nrecipient list, subject, body preview, and delivery status.\\n1\\n\\n-- 1 of 13 --\\n\\nModule 2 — Academic Data\\nThe core of what makes the system academic.\\n• ACADEMIC_YEAR — records like 2025/2026. Only one can be is_active = TRUE at a time.\\nUsed as a reference point for curricula and reports.\\n• SPECIALIZATION — a program of study (e.g., “Calculatoare și Tehnologia Informației”, “Au-\\ntomatică și Informatică Aplicată”). Has a degree_level field (LICENTA, MASTER).\\n• STUDY_FORMATION — a specific group of students, e.g., “CTI Year 2 Group A”. Has study_year,\\neducation_form (ZI/ID/IFR), and group_index.\\n• STUDENT — the student record, linked to a study formation. Contains registration_number\\n(e.g. MAT1234), names, email, enrollment date, and status (ENROLLED, ACTIVE, GRADUATED,\\nWITHDRAWN).\\n• CURRICULUM — a plan of study for a specialization, with a valid_from date. Can be snap-\\nshotted.\\n• CURRICULUM_SNAPSHOT — an immutable copy of a curriculum at a point in time. Used to\\npreserve the rules a student was enrolled under, even after the curriculum changes.\\n• DISCIPLINE — a course/subject belonging to a curriculum. Has semester, ects_credits,\\nand evaluation_type (EXAM, COLLOCVIU, VP).\\n• STUDENT_CURRICULUM — the enrollment record: which student is in which curriculum, under\\nwhich study formation.\\n• GRADE — the result. Linked to a student, a discipline, and optionally a curriculum snapshot.\\nFields: value (1–10, 0 = absent), exam_session, grading_date, and graded_by_user_id (the\\nprofessor who entered it).\\n• DATA_IMPORT_JOB — records of bulk Excel/CSV imports, so you know when a batch of grades\\nwas uploaded and by whom.\\nModule 3 — Documents\\nDOCUMENT — a file or record that goes through an approval workflow. Has type, status (DRAFT,\\nPENDING, APPROVED, REJECTED, MODIFICATION), author_id, assigned_to_user_id, file_path, and\\ncontent (extracted text for full-text search). Supports physical file storage on disk.\\nModule 4 — Reports\\n• REPORT_DEFINITION — a named, reusable report template (e.g., “Electronic Grade Central-\\nizer”). Has visibility (PUBLIC / PRIVATE).\\n• REPORT_REQUEST — an instance of running a report, with filters stored as JSON.\\n• E_GRADE_CENTRALIZER — the specific data model for the grade centralizer report.\\n• REPORT_ROW — individual rows of a generated report.\\n• REPORT_EXPORT — tracks every time a report was exported (PDF, CSV, XLSX, XML), by whom,\\nand where the file was stored.\\n2\\n\\n-- 2 of 13 --\\n\\nModule 5 — Audit & Recovery\\nThe most architecturally interesting module.\\n• AUDIT_LOG_ENTRY — the central ledger. Every create, update, and delete in the system\\nwrites a record here with: actor_user_id, action_type (INSERT, UPDATE, DELETE, ROLL-\\nBACK, PITR), entity_type (the table name), entity_id, before_snapshot_json, and after_snapshot_jso\\nThis is what makes rollback possible.\\n• AUDIT_LOG_ARCHIVE — a mirror table. Logs older than 5 years are automatically moved\\nhere (not deleted), satisfying the institutional 5-year retention policy.\\n• BACKUP_JOB — records of every backup run: type (AUTOMATIC, MANUAL), start/end times,\\nstorage location (a JSON file path), and status.\\n• BACKUP_CONFIG — a single-row table controlling the backup scheduler: enabled (boolean),\\ncron_expression (e.g., 0 2 * * * for 2 AM daily).\\n• RECOVERY_POINT / ROLLBACK_OPERATION — structural tables for tracking recovery operations.\\nModule 6 — System Configuration\\nSYSTEM_SETTING — a key-value store for institutional metadata: faculty name, institution name,\\ndean’s name, system email, portal notices. Editable by Admin from the UI.\\nPerformance Indexes\\nThe schema defines indexes on the most-queried paths: STUDENT(registration_number), STUDENT(study_fo\\nGRADE(student_id), DOCUMENT(author_id, type, created_at), AUDIT_LOG_ENTRY(entity_type,\\nentity_id), AUDIT_LOG_ENTRY(actor_user_id), AUDIT_LOG_ENTRY(occurred_at).\\n2 Part 2 — The Backend\\nThe backend is a Node.js / Express 5 application (backend/src/server.js). It listens on port\\n8080 (configurable via PORT env variable) and exposes a REST API under /api/.\\nServer Bootstrap\\nOn startup, the server does three things before taking requests:\\n1. Initializes the scheduler (schedulerService.initScheduler()), which reads BACKUP_CONFIG\\nfrom the database and either starts a cron job for automatic backups or skips it. It also\\nalways schedules the audit log archiving job (runs daily at 1 AM).\\n2. Applies security headers to every response: X-Content-Type-Options: nosniff, X-Frame-\\nOptions: DENY, Referrer-Policy: strict-origin-when-cross-origin, a minimal CSP, and\\nremoves X-Powered-By.\\n3\\n\\n-- 3 of 13 --\\n\\n3. Initializes the SYSTEM_SETTING table with default values (faculty name, dean name, etc.)\\non first run, using ON CONFLICT DO NOTHING so it never overwrites saved values.\\nCORS is controlled by the ALLOWED_ORIGINS environment variable (comma-separated list). The\\nfrontend origin (http://localhost:5173 for dev and the GitHub Pages URL for production) is\\nalways allowed.\\nA UTF-8 middleware intercepts every response and ensures application/json and application/xml\\ncontent types always include ; charset=utf-8, which is essential for Romanian diacritics (ș, ț,\\nă, â, î).\\nDatabase Layer (src/db.js)\\nWraps pg.Pool from the pg package. Key exports: db.query(sql, params) for simple queries\\nand db.transaction(async (client) => {...}) for atomic multi-step operations. The trans-\\naction helper manages BEGIN / COMMIT / ROLLBACK automatically.\\nConnection string is assembled from DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD environ-\\nment variables.\\nMiddleware\\nauthMiddleware.js exports two functions:\\nrequireAuth — extracts the Authorization: Bearer <token> header, verifies the JWT against\\nJWT_SECRET, and attaches { userId, role, fullName } to req.user. Returns 401 if missing, 403\\nif invalid or expired.\\nrequireRole(allowedRoles) — a factory that returns middleware checking whether req.user.role\\nis in the provided array. Returns 403 if not. Used on every route that has access restrictions.\\nerrorHandler.js — the global error handler (last middleware). Formats all errors into a con-\\nsistent { error: true, message, code } JSON structure. Recognizes PostgreSQL error codes\\n(e.g., 23505 for unique violations, 23503 for FK violations) and maps them to user-friendly mes-\\nsages with resolution hints. Also recognizes custom error properties (err.customMessage, err.customCode)\\nset by the audit service.\\nRoutes Overview\\nAll routes are prefixed /api/. Here is what each file owns:\\n• /api/mock-sso — simulates the university’s Identity Provider. Accepts a login request with\\nemail, role, and full_name, and issues a signed JWT (SSO_MOCK_SECRET) that the frontend\\ncan then exchange for a real AFSMS session token. This exists only because the real uni-\\nversity SSO is not publicly accessible.\\n• /api/auth — handles two flows:\\n– POST /exchange-token — the main login flow. Receives the SSO token, verifies it, finds\\nor creates the user in USER_ACCOUNT, syncs the role, auto-creates the STUDENT record if\\nthe role is STUDENT, and issues an AFSMS JWT (JWT_SECRET, 8-hour expiry).\\n– POST /register — a direct registration path (no SSO), assigns STUDENT role by default.\\n4\\n\\n-- 4 of 13 --\\n\\n• /api/academic — the largest route file (∼49 KB). Covers:\\n– GET /dashboard/stats — role-aware statistics for the dashboard card grid. Each role\\nsees different numbers.\\n– Student CRUD: list, add, update, delete, import from Excel/CSV.\\n– Curriculum CRUD: list, add, update, delete, snapshot.\\n– Discipline CRUD: list, add, update, delete.\\n– Study Formation CRUD.\\n– Grade entry: add individual grade, bulk Excel import, fetch grades per student or\\ndiscipline.\\n• /api/admin — ADMIN-only (except user listing which is also accessible to SECRETARIAT and\\nPROFESSOR for the document forward workflow):\\n– Role management (create, update, delete roles).\\n– User management (create, update, delete users, assign roles, suspend accounts).\\n– Backup management (trigger manual backup, list backup history, download backups,\\nupdate backup schedule, restore from a JSON backup file).\\n• /api/audit — the audit and recovery endpoints:\\n– GET / — paginated list of audit log entries, joined with user names.\\n– POST /rollback/:logId — reverses a single audit log entry (undo an INSERT by delet-\\ning, undo an UPDATE by restoring before_snapshot_json, undo a DELETE by re-inserting).\\n– POST /pitr — Point-in-Time Recovery. Takes a targetTimestamp and replays all audit\\nlog entries after that timestamp in reverse order, effectively winding the database\\nback.\\n• /api/documents — document lifecycle:\\n– GET / — advanced search with filters (type, author, date range, content keyword, au-\\nthor keyword).\\n– POST / — upload a new document with file. Extracts text from PDF, DOCX, XLSX, TXT,\\nCSV, XML for full-text search.\\n– PUT /:id/status — update document status (approve, reject, request modification).\\n– PUT /:id/forward — forward document to a specific user.\\n– PUT /:id/reupload — replace the file on a document in MODIFICATION status.\\n– GET /download/:id — stream the file to the browser.\\n– DELETE /:id — soft-delete the record and remove the physical file.\\n• /api/reports — the centralizer and export engine:\\n– GET /centralizer — runs the master query that joins students, formations, disci-\\nplines, and grades through a dynamic filter set (specialization, study year, education\\nform, semester, discipline, group index, academic year, degree level, and free-text\\nsearch). Returns the raw data.\\n– GET /centralizer/export — same query, but exports to CSV, XLSX, or XML depending\\non format query param.\\n– GET /transcript/:studentId — generates a full academic transcript for a student.\\n• /api/notifications — mass email:\\n5\\n\\n-- 5 of 13 --\\n\\n– POST /send — resolves recipients (either a USER_GROUP or a STUDY_FORMATION), calls the\\nconfigured email service, and logs the send in OUTLOOK_NOTIFICATION.\\n• /api/groups — user group management (CRUD for groups and members).\\n• /api/lookup — read-only reference data endpoint. Returns formations, specializations,\\nacademic years, and curricula in lightweight format for populating dropdowns in the UI.\\n• /api/public — unauthenticated endpoint exposing a portal notice and the faculty/institu-\\ntion name from SYSTEM_SETTING, used by the public-facing landing page.\\n• /api/config — ADMIN-only system configuration:\\n– System settings (key-value pairs).\\n– Academic year management.\\n– Specialization management.\\n– Backup schedule configuration (enable/disable, set cron expression).\\nServices\\nauditService.js — the backbone of data integrity. Provides:\\n• logAudit(client, actorUserId, actionType, moduleName, entityType, entityId, before,\\nafter) — the raw insert function. Always called inside a transaction using the same client\\nso the audit entry and the data change are atomic.\\n• auditableUpdate(actorUserId, moduleName, tableName, id, updateFields) — fetches the\\nbefore snapshot, performs the UPDATE, then logs.\\n• auditableInsert(actorUserId, moduleName, tableName, insertFields) — performs the\\nINSERT, then logs with null before snapshot.\\n• auditableDelete(actorUserId, moduleName, tableName, id) — fetches before snapshot,\\nperforms the DELETE, then logs with null after snapshot.\\n• archiveOldLogs() — moves entries older than 5 years from AUDIT_LOG_ENTRY to AUDIT_LOG_ARCHIVE.\\nEvery data-modifying route in the system that goes through one of these functions automati-\\ncally gets a full audit trail with before/after snapshots.\\nbackupService.js — iterates through the TABLES_TO_BACKUP list (16 tables), dumps all rows from\\neach as JSON, writes a timestamped file to backend/backups/, and records the backup job in\\nBACKUP_JOB.\\nschedulerService.js — uses node-cron to manage two scheduled jobs:\\n• Automatic backup — reads BACKUP_CONFIG on startup and starts a cron job if enabled.\\n• Audit archiving — always scheduled, runs daily at 1 AM.\\nProvides updateSchedule(cronExpression, enabled) called by the admin backup config route.\\nemailService.js — a router that selects the right implementation based on environment vari-\\nables: Graph API (graphEmailService.js) for Microsoft 365 integration, SMTP (smtpEmailService.js)\\n6\\n\\n-- 6 of 13 --\\n\\nfor standard mail servers, or Mock (mockEmailService.js) for development (just logs to con-\\nsole). The sendBulk({ from, recipients, subject, text, html }) interface is the same re-\\ngardless of implementation.\\nimportService.js — parses Excel/CSV grade sheets uploaded by professors and bulk-inserts\\ngrades with proper validation and audit logging.\\n3 Part 3 — Authentication Flow\\nUnderstanding how a user logs in is key to understanding the whole system.\\n1. The user lands on the AFSMS login page and clicks “Login via University SSO”.\\n2. The frontend calls POST /api/mock-sso/login with email and role. The mock SSO returns\\na signed JWT (ssoToken).\\n3. The frontend immediately calls POST /api/auth/exchange-token with that ssoToken.\\n4. The backend verifies the SSO token signature, looks up or creates the user in USER_ACCOUNT,\\nsyncs the role from the SSO claims, auto-creates a STUDENT record if needed, and issues a\\nnew short-lived AFSMS JWT (8 hours).\\n5. The frontend stores this AFSMS token in the AuthContext and sends it as Authorization:\\nBearer <token> on every subsequent API call.\\n6. requireAuth verifies every protected request. requireRole enforces access control per\\nroute.\\nIn production with a real university SSO, only step 2 changes — the frontend redirects to the\\nreal Identity Provider, which redirects back with a real token. Steps 3–6 remain identical.\\n4 Part 4 — The Frontend\\nThe frontend is a React 18 + Vite SPA with React Router v6, deployed to GitHub Pages. No UI\\ncomponent library — all styling is custom CSS.\\nContexts\\nAuthContext — wraps the entire app. Stores the decoded user object ({ userId, role, fullName\\n}), the raw token, and provides login() / logout() methods. login() stores the token in localStorage;\\non page refresh it reads the token back and re-validates it.\\nLanguageContext — provides { t, language, setLanguage }. The t(key) function looks up a\\nkey in the translations.js map (supports en and ro). Used across all pages and navigation to\\nsupport bilingual display.\\n7\\n\\n-- 7 of 13 --\\n\\nRouting (App.jsx)\\nRoutes fall into three categories:\\nPublic — accessible to anyone (no authentication required):\\n• / — PublicPortal (the landing page for unauthenticated visitors)\\n• /login — Login\\n• /register — Register\\n• /system-diagrams — SystemDiagramsPage (architecture diagram viewer)\\nProtected — requires any authenticated user. Wrapped in ProtectedRoute which redirects to\\n/login if no token:\\n• /dashboard, /documents, /privacy, /contact, /help, /shortcuts, /docs/:role?\\nRole-restricted — inside the protected zone but additionally checked by RoleRoute:\\n• /my-grades — STUDENT only\\n• /students — PROFESSOR, SECRETARIAT, ADMIN\\n• /disciplines — ADMIN, SECRETARIAT\\n• /grades/list — PROFESSOR, ADMIN, SECRETARIAT\\n• /centralizer — SECRETARIAT, ADMIN\\n• /groups — SECRETARIAT, ADMIN\\n• /audit — ADMIN only\\nPage-by-Page Tour\\nPublicPortal — The unauthenticated landing page. Fetches the portal notice and institution\\nname from /api/public. Shows the faculty branding and a call to action to log in.\\nLogin — Presents a form. On submit it calls the mock SSO then exchanges the token. On suc-\\ncess, updates AuthContext and navigates to /dashboard.\\nRegister — Direct registration (non-SSO path). Creates a user account with STUDENT role.\\nDashboard — The home screen after login. Shows a role-specific stats grid (different cards de-\\npending on whether you’re an Admin, Secretariat, Professor, or Student) and a recent activity\\nfeed pulled from the audit log. Has offline detection — if navigator.onLine is false or the net-\\nwork call fails, it shows an offline banner with a retry button.\\nStudents — Available to PROFESSOR, SECRETARIAT, ADMIN. Lists all students from /api/academic/students\\nwith their formation name, enrollment status, and plan count. Supports add, edit, delete, and\\nbulk Excel/CSV import. Professors see a read-only view.\\nDisciplines — Available to ADMIN and SECRETARIAT. Manages curricula and their disciplines.\\nAllows creating curricula for specializations, adding/editing/deleting disciplines, and taking cur-\\nriculum snapshots.\\n8\\n\\n-- 8 of 13 --\\n\\nGradesList — Available to PROFESSOR, ADMIN, SECRETARIAT. Allows entering and viewing grades\\nby student and discipline. Professors see their own grades; Secretariat and Admin can see all.\\nSupports bulk import from Excel.\\nMyGrades — STUDENT only. Displays the authenticated student’s grades, GPA, ECTS credits\\nearned, and their percentile rank among all students.\\nCentralizer — Available to SECRETARIAT and ADMIN. A powerful filtered view of all grades\\nacross the faculty. Filters: specialization, degree level, study year, education form, semester,\\ngroup, curriculum, discipline, academic year, and free-text search. Results can be exported\\nto PDF (client-side generation via pdfUtils.js / centralizerGenerator.js), CSV, XLSX, or XML\\n(server-side). The PDF generation uses jsPDF or a custom utility that formats the data as a styled\\ntable.\\nDocuments — Available to all authenticated users (with role-appropriate actions). Students can\\nsubmit documents (upload files). Professors and Secretariat can review, approve, reject, request\\nmodifications, and forward documents to other users. Full-text search across title and content.\\nSupports downloading the original file.\\nUserGroups — Available to SECRETARIAT and ADMIN. Create and manage user groups, add/re-\\nmove members. Groups are used as targets for mass notification emails.\\nAuditLogs — ADMIN only. Paginated table of all audit log entries showing actor, action type,\\nmodule, entity type, entity ID, and timestamp. Expanding a row reveals the before/after JSON\\nsnapshots. Two recovery actions available per row: Single Rollback (undo that one action) and\\nPoint-in-Time Recovery (restore the entire database to the state at that entry’s timestamp).\\nDashboard for Admin specifically shows: total users, total students, active curricula, and audit\\nactions in the last 24 hours.\\nDocumentation — a role-aware help page rendered from structured content. Shows different\\nsections based on the role route parameter, so each type of user can navigate directly to their\\nrelevant docs.\\nHelp, Contact, Privacy, Shortcuts — informational pages. Shortcuts renders the keyboard\\nshortcut map from the useKeyboardShortcuts hook.\\nFrontend Services (src/services/api.js)\\nAn Axios instance pre-configured with baseURL (pointing to the backend, configurable via VITE_API_URL\\nenv var) and a request interceptor that automatically injects the Authorization: Bearer header\\nfrom localStorage. Exports named service objects: auditService, adminService, academicService,\\ndocumentsService, reportsService, etc., each wrapping the relevant API endpoints.\\nUtilities\\ntranslations.js — the full bilingual string map. Every user-visible string has an en and ro key.\\nconstants.js — shared enumerations like document types, status values, and role lists. Kept\\nin sync between frontend and backend.\\npdfUtils.js / centralizerGenerator.js / transcriptGenerator.js — client-side PDF/document\\ngeneration utilities. Used by the Centralizer and the student transcript feature to generate\\ndownload-ready documents directly in the browser without a server round-trip.\\nmockData.js — seed data used for offline/demo mode and testing.\\n9\\n\\n-- 9 of 13 --\\n\\nuseKeyboardShortcuts.js — a custom React hook that registers global keyboard shortcuts (e.g.,\\nAlt+D for dashboard, Alt+S for students) and cleans them up on unmount.\\n5 Part 5 — Data Integrity: The Audit & Rollback System\\nThis is the most distinctive engineering choice in the project.\\nHow It Works\\nEvery write operation (INSERT, UPDATE, DELETE) that flows through auditableInsert, auditableUpdate,\\nor auditableDelete in auditService.js captures a JSON snapshot of the record’s state before\\nand after the operation, within the same database transaction. If the transaction rolls back, the\\naudit entry also rolls back.\\nThis means AUDIT_LOG_ENTRY is a complete history of every row in the system.\\nSingle-Record Rollback\\nWhen an Admin clicks “Rollback” on an audit log entry:\\n1. The POST /api/audit/rollback/:logId endpoint fetches the log entry.\\n2. If the original action was INSERT: it deletes the record (undoing the creation).\\n3. If the original action was UPDATE: it restores the before_snapshot_json columns to the\\nrecord.\\n4. If the original action was DELETE: it re-inserts the before_snapshot_json back into the table.\\n5. The rollback itself is logged as a new audit entry (action type ROLLBACK_INSERT, ROLLBACK_UPDATE,\\nor ROLLBACK_DELETE), so the rollback is itself auditable and reversible.\\nThe implementation validates entity_type against a whitelist (STUDENT, GRADE, USER_ACCOUNT,\\nDOCUMENT, STUDY_FORMATION, DISCIPLINE) to prevent SQL injection.\\nPoint-in-Time Recovery (PITR)\\nThis is the full database rewind feature. When triggered with a targetTimestamp:\\n1. All AUDIT_LOG_ENTRY records with occurred_at > targetTimestamp are fetched in descend-\\ning order (most recent first).\\n2. Each entry is reversed: INSERTs become DELETEs, UPDATEs restore their before_snapshot_json,\\nDELETEs re-insert their before_snapshot_json.\\n3. The entire operation is wrapped in a single database transaction — either all reversals\\nsucceed or none do.\\n4. A PITR log entry is written recording who triggered it, the target timestamp, and how many\\nactions were reversed.\\nThis effectively winds the database back to a consistent snapshot at any point for which audit\\nlogs exist.\\n10\\n\\n-- 10 of 13 --\\n\\nBackup System\\nThe backup system is a complement to the audit system. While audit logs allow surgical rollback,\\nbackups provide a full safety net:\\n• Manual backup — triggered from the Admin UI, calls createBackup() which dumps all 16\\ntables to a timestamped JSON file in backend/backups/.\\n• Automatic backup — scheduled via cron expression configured in the Admin UI. The\\nscheduler reads BACKUP_CONFIG on startup.\\n• Restore from backup — the Admin can upload a backup JSON file; the system truncates\\naffected tables and re-inserts all rows from the snapshot.\\n• Audit archiving — runs daily at 1 AM. Logs older than 5 years are moved to AUDIT_LOG_ARCHIVE\\nto manage active table size while satisfying the institutional 5-year retention policy.\\n6 Part 6 — The Email Notification System\\nThe system supports three email backends, selected at startup by environment variable:\\nGraph API (graphEmailService.js) — uses @microsoft/microsoft-graph-client with Azure iden-\\ntity credentials to send via Microsoft 365. Configured by AZURE_TENANT_ID, AZURE_CLIENT_ID,\\nAZURE_CLIENT_SECRET, GRAPH_SENDER_EMAIL.\\nSMTP (smtpEmailService.js) — uses nodemailer with standard SMTP credentials. Configured\\nby SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.\\nMock (mockEmailService.js) — logs the email payload to the console. Used in development.\\nThe emailService.js router checks for the presence of the Azure credentials first; if not found,\\nfalls back to SMTP; if not found, falls back to Mock.\\nThe notification flow: Admin or Secretariat selects a group (from USER_GROUP) or a study forma-\\ntion, writes a subject and body, and clicks Send. The backend resolves the member emails, calls\\nemailService.sendBulk(), and records the send in OUTLOOK_NOTIFICATION.\\n7 Part 7 — The Document Workflow\\nDocuments go through a defined lifecycle:\\n1. Any authenticated user uploads a document (POST /api/documents). Status becomes DRAFT.\\n2. The uploader or a Secretariat/Admin changes the status to PENDING to submit it for review.\\n3. Secretariat or Admin reviews it:\\n• APPROVED — document is accepted.\\n• REJECTED — document is declined (with optional revision notes).\\n• MODIFICATION — document is sent back with revision notes.\\n4. If MODIFICATION, the author can re-upload a new file version (PUT /:id/reupload). Status\\nresets to PENDING.\\n11\\n\\n-- 11 of 13 --\\n\\n5. A document can also be forwarded to a specific user (PUT /:id/forward), setting assigned_to_user_id.\\nAll status changes go through auditableUpdate so the full workflow history is in the audit log.\\nFile storage: uploaded files are stored on disk under backend/uploads/. The system accepts\\nPDF, DOCX, XLSX, CSV, XML, TXT, images, PPT, ZIP, RAR, and video files. For PDF, DOCX, XLSX,\\nTXT, and CSV uploads, the system extracts text content and stores it in the content column for\\nfull-text search.\\n8 Part 8 — Reports & The Centralizer\\nThe grade centralizer is the main reporting feature. It is a dynamic, filtered view of the intersec-\\ntion of students, disciplines, and grades.\\nThe backend query (getCentralizerData in reports.js) performs a complex multi-join: it starts\\nfrom STUDENT, joins through STUDENT_CURRICULUM → STUDY_FORMATION → CURRICULUM → SPECIALIZATION,\\nthen uses a lateral join to get all disciplines either from the curriculum or from existing grades\\nfor that student. Grades are outer-joined so students without grades still appear.\\nFilters available: specialization, degree level, study year, education form, curriculum, discipline,\\ngroup index, academic year, semester, evaluation type, and a free-text code/name search.\\nExport formats:\\n• CSV — via PapaParse, flat rows.\\n• XLSX — via the xlsx library, formatted workbook.\\n• XML — via xml2js, structured document.\\n• PDF — generated client-side via the centralizerGenerator.js utility.\\nThe student transcript (GET /api/reports/transcript/:studentId) generates a per-student aca-\\ndemic record with all grades organized by semester and curriculum.\\n9 Part 9 — Configuration & System Settings\\nThe Admin has access to a configuration panel (routes under /api/config, frontend in the Dash-\\nboard admin section) covering:\\nSystem Settings — edit the key-value store: faculty name, institution name, dean name, dean\\nsecretary, system email, portal notice. These values are consumed by the public portal and\\nembedded in generated documents.\\nAcademic Years — create and manage academic year records. Setting one as is_active auto-\\nmatically deactivates all others.\\nSpecializations — manage academic programs. Toggle active/inactive, set degree level.\\nBackup Schedule — toggle automatic backups on/off and configure the cron expression. Changes\\ntake effect immediately (the scheduler updates its live job).\\n12\\n\\n-- 12 of 13 --\\n\\n10 Part 10 — How to Run the Project\\nPrerequisites: Node.js 18+, PostgreSQL 15+.\\nBackend setup:\\n1. Navigate to backend/.\\n2. Copy .env.example to .env and fill in DB_* variables, JWT_SECRET, SSO_MOCK_SECRET, and\\noptionally email credentials.\\n3. Run npm install.\\n4. Create the database schema by running src/schema.sql against your PostgreSQL instance.\\n5. Optionally run any seed_*.js scripts for initial data.\\n6. Start with npm run dev (nodemon) or npm start.\\nFrontend setup:\\n1. From the project root.\\n2. Copy .env.example to .env.local and set VITE_API_URL to your backend URL (e.g., http://localhost:8\\n3. Run npm install.\\n4. Start with npm run dev (opens on port 5173 by default).\\nFirst login: The mock SSO endpoint (POST /api/mock-sso/login) accepts { email, role, full_name\\n}. Use role ADMIN for full access on first setup. The frontend’s login page calls this automatically\\nwhen you click the SSO login button.\\nSummary: Architecture in One Paragraph\\nAFSMS is a layered system. At the bottom is a PostgreSQL schema organized into six func-\\ntional modules (security, academics, documents, reports, audit/recovery, configuration). The\\nNode.js/Express backend sits on top, exposing a versioned REST API that enforces JWT authen-\\ntication and role-based access control on every route. All writes are mediated through the audit\\nservice, which captures before/after snapshots within the same transaction, enabling single-\\nrecord rollback and full point-in-time database recovery. The React frontend consumes this API\\nthrough an Axios service layer, routes users based on their role, and provides specialized pages\\nfor each persona — students see their grades, professors manage grade entry, secretariat han-\\ndles students and documents, and the admin has full visibility including the audit log and system\\nconfiguration.\\nEnd of AFSMS Walkthrough Guide\\n13\\n\\n-- 13 of 13 --\\n\\n", "author_id": "65cbf637-fde9-4a43-954f-a8806682d462", "file_path": "file-1777988007133-62277626.pdf", "created_at": "2026-05-05T13:33:27.134Z", "revision_notes": null, "original_filename": "AFSMS Walkthrough Guide.pdf", "assigned_to_user_id": null}	\N	2026-05-05 16:33:34.953654+03	t	\N
\.


--
-- Data for Name: auth_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_session (id, user_account_id, session_token, issued_at, expires_at, ip_address) FROM stdin;
\.


--
-- Data for Name: backup_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_config (id, cron_expression, enabled, updated_at) FROM stdin;
0a8e63fe-4657-478f-85e6-07960ecaec99	0 0 * * *	t	2026-05-02 14:22:52.529256+03
\.


--
-- Data for Name: backup_job; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_job (id, backup_type, scheduled_at, started_at, finished_at, storage_location, checksum, status) FROM stdin;
9260240c-dfcf-4b44-b828-fe5f35f7806e	MANUAL	\N	2026-05-01 20:35:38.893503+03	2026-05-01 20:35:38.893503+03	manual_backup_2026-05-01T17-35-38-856Z.json	\N	SUCCESS
42737154-dd7e-484d-bd27-b1926b1c0000	MANUAL	\N	2026-05-01 20:37:39.254738+03	2026-05-01 20:37:39.254738+03	manual_backup_2026-05-01T17-37-39-218Z.json	\N	SUCCESS
29fc2045-6d63-4f0b-a572-73aa84424832	MANUAL	\N	2026-05-01 20:37:57.068974+03	2026-05-01 20:37:57.068974+03	manual_backup_2026-05-01T17-37-57-033Z.json	\N	SUCCESS
0f9cee35-7134-466e-ab97-9f3cfb798442	AUTOMATIC	\N	2026-05-01 20:38:01.226323+03	2026-05-01 20:38:01.226323+03	automatic_backup_2026-05-01T17-38-01-188Z.json	\N	SUCCESS
520518a5-5668-43f3-ac61-3e216de83c21	MANUAL	\N	2026-05-01 20:38:05.888435+03	2026-05-01 20:38:05.888435+03	manual_backup_2026-05-01T17-38-05-853Z.json	\N	SUCCESS
8fe3526d-bcf9-443a-b836-30bb1cf9beea	TEST	\N	2026-05-01 20:38:43.43479+03	2026-05-01 20:38:43.43479+03	test_backup_2026-05-01T17-38-43-395Z.json	\N	SUCCESS
e9fa8c12-0ca6-4bea-8c50-a4aba9250a26	MANUAL	\N	2026-05-01 20:39:37.005743+03	2026-05-01 20:39:37.005743+03	manual_backup_2026-05-01T17-39-36-968Z.json	\N	SUCCESS
e98ceb4b-54a0-4053-a614-efd4d03ce969	MANUAL	\N	2026-05-01 20:39:42.058856+03	2026-05-01 20:39:42.058856+03	manual_backup_2026-05-01T17-39-42-020Z.json	\N	SUCCESS
1bb3dbfe-630e-4039-ba79-3c51bb587df1	MANUAL	\N	2026-05-01 20:40:06.005797+03	2026-05-01 20:40:06.005797+03	manual_backup_2026-05-01T17-40-05-970Z.json	\N	SUCCESS
1f6af120-9c9e-4adf-9361-873252599ceb	MANUAL	\N	2026-05-01 20:41:15.91201+03	2026-05-01 20:41:15.91201+03	manual_backup_2026-05-01T17-41-15-868Z.json	\N	SUCCESS
00a9cabb-5860-4692-b852-88636e420794	MANUAL	\N	2026-05-01 20:42:26.283338+03	2026-05-01 20:42:26.283338+03	manual_backup_2026-05-01T17-42-26-239Z.json	\N	SUCCESS
8e941025-098a-4272-ac48-7306731ecabb	MANUAL	\N	2026-05-01 20:43:35.528472+03	2026-05-01 20:43:35.528472+03	manual_backup_2026-05-01T17-43-35-496Z.json	\N	SUCCESS
78241b36-424f-48a6-b7e7-efa5008713dd	MANUAL	\N	2026-05-01 20:44:36.266165+03	2026-05-01 20:44:36.266165+03	manual_backup_2026-05-01T17-44-36-230Z.json	\N	SUCCESS
4cfe2a51-463d-45b1-87dd-73b2de7464aa	MANUAL	\N	2026-05-01 20:45:21.8687+03	2026-05-01 20:45:21.8687+03	manual_backup_2026-05-01T17-45-21-831Z.json	\N	SUCCESS
092f3ff7-38d7-4d2e-8ebe-eae779729969	MANUAL	\N	2026-05-01 20:45:43.126218+03	2026-05-01 20:45:43.126218+03	manual_backup_2026-05-01T17-45-43-088Z.json	\N	SUCCESS
44df6223-6e3d-4750-ae03-a5fea1c16c7d	MANUAL	\N	2026-05-01 20:45:56.632048+03	2026-05-01 20:45:56.632048+03	manual_backup_2026-05-01T17-45-56-592Z.json	\N	SUCCESS
c2443198-f1e0-490a-b44e-d389f770f8fc	MANUAL	\N	2026-05-02 11:37:00.959148+03	2026-05-02 11:37:00.959148+03	manual_backup_2026-05-02T08-37-00-879Z.json	\N	SUCCESS
290a5775-ce7f-4e64-ae78-3114bbe7a8ef	MANUAL	\N	2026-05-02 13:40:44.162506+03	2026-05-02 13:40:44.162506+03	manual_backup_2026-05-02T10-40-44-121Z.json	\N	SUCCESS
6cd8f57a-402c-4738-888c-054e9a39d3b3	MANUAL	\N	2026-05-02 14:22:48.296609+03	2026-05-02 14:22:48.296609+03	manual_backup_2026-05-02T11-22-48-256Z.json	\N	SUCCESS
3c62080d-745c-4870-9eee-57d5a35b440f	MANUAL	\N	2026-05-02 14:43:10.406864+03	2026-05-02 14:43:10.406864+03	manual_backup_2026-05-02T11-43-10-306Z.json	\N	SUCCESS
b2ed62ed-0bc6-4d6b-9974-53494afe9b71	MANUAL	\N	2026-05-02 18:31:45.988185+03	2026-05-02 18:31:45.988185+03	manual_backup_2026-05-02T15-31-45-960Z.json	\N	SUCCESS
80d3d619-2fb3-43de-8fa7-827960f5ac6e	AUTOMATIC	\N	2026-05-03 03:00:01.296592+03	2026-05-03 03:00:01.296592+03	automatic_backup_2026-05-03T00-00-01-176Z.json	\N	SUCCESS
2a6cc35c-154e-4ba0-88e3-8e5e3574ad78	AUTOMATIC	\N	2026-05-04 03:00:01.077192+03	2026-05-04 03:00:01.077192+03	automatic_backup_2026-05-04T00-00-01-044Z.json	\N	SUCCESS
8a685335-006f-4313-923c-b04de62d3cb0	MANUAL	\N	2026-05-04 08:58:39.155466+03	2026-05-04 08:58:39.155466+03	manual_backup_2026-05-04T05-58-39-130Z.json	\N	SUCCESS
29a6a15c-4925-4f75-912c-73bc8fad7d75	MANUAL	\N	2026-05-04 23:04:29.169776+03	2026-05-04 23:04:29.169776+03	manual_backup_2026-05-04T20-04-29-127Z.json	\N	SUCCESS
23fe4b25-8c89-40c8-8208-0dfb4c3fe54f	AUTOMATIC	\N	2026-05-05 03:00:01.091296+03	2026-05-05 03:00:01.091296+03	automatic_backup_2026-05-05T00-00-01-053Z.json	\N	SUCCESS
fea4823b-9385-4ba3-b5c6-28fdffe6d800	AUTOMATIC	\N	2026-05-06 03:00:01.375528+03	2026-05-06 03:00:01.375528+03	automatic_backup_2026-05-06T00-00-01-292Z.json	\N	SUCCESS
8de19110-2fd7-4ac4-90c5-4124c7a0a82c	AUTOMATIC	\N	2026-05-07 03:00:04.154843+03	2026-05-07 03:00:04.154843+03	automatic_backup_2026-05-07T00-00-03-996Z.json	\N	SUCCESS
c7089245-aa8e-4e7d-8af9-cc3e553435ea	AUTOMATIC	\N	2026-05-08 03:00:02.422482+03	2026-05-08 03:00:02.422482+03	automatic_backup_2026-05-08T00-00-02-190Z.json	\N	SUCCESS
94165116-63b4-4c9f-83cb-8a375893fe83	AUTOMATIC	\N	2026-05-09 03:00:02.294454+03	2026-05-09 03:00:02.294454+03	automatic_backup_2026-05-09T00-00-02-060Z.json	\N	SUCCESS
c5bac0e5-3698-4336-88c1-0adfe230a9ed	AUTOMATIC	\N	2026-05-10 03:00:04.137324+03	2026-05-10 03:00:04.137324+03	automatic_backup_2026-05-10T00-00-03-023Z.json	\N	SUCCESS
fab5e843-9915-477d-8909-0d129f2bbf8f	AUTOMATIC	\N	2026-05-11 03:00:06.348503+03	2026-05-11 03:00:06.348503+03	automatic_backup_2026-05-11T00-00-05-876Z.json	\N	SUCCESS
15111c42-2fff-445a-9231-cc18d4e47afc	AUTOMATIC	\N	2026-05-12 03:00:03.828232+03	2026-05-12 03:00:03.828232+03	automatic_backup_2026-05-12T00-00-03-584Z.json	\N	SUCCESS
7c0f7625-dc99-4cc8-8db4-651aee834238	AUTOMATIC	\N	2026-05-13 03:00:01.800414+03	2026-05-13 03:00:01.800414+03	automatic_backup_2026-05-13T00-00-01-660Z.json	\N	SUCCESS
9c87728a-c5dc-4f50-b13d-47cde35ddef6	AUTOMATIC	\N	2026-05-14 03:00:01.095776+03	2026-05-14 03:00:01.095776+03	automatic_backup_2026-05-14T00-00-01-064Z.json	\N	SUCCESS
75344ef9-b926-40b7-ab3a-fc57b5c9569a	AUTOMATIC	\N	2026-05-15 03:00:02.931451+03	2026-05-15 03:00:02.931451+03	automatic_backup_2026-05-15T00-00-02-744Z.json	\N	SUCCESS
2962109e-0b5c-4470-a351-4dd8700b6d77	AUTOMATIC	\N	2026-05-16 03:00:11.673715+03	2026-05-16 03:00:11.673715+03	automatic_backup_2026-05-16T00-00-11-240Z.json	\N	SUCCESS
1a9b417e-a737-403f-97d8-e74f9c77775e	AUTOMATIC	\N	2026-05-17 03:00:04.558986+03	2026-05-17 03:00:04.558986+03	automatic_backup_2026-05-17T00-00-03-651Z.json	\N	SUCCESS
2749e83e-fa9c-4fcf-ae01-eab0fbaa8e50	AUTOMATIC	\N	2026-05-18 03:00:04.06345+03	2026-05-18 03:00:04.06345+03	automatic_backup_2026-05-18T00-00-03-229Z.json	\N	SUCCESS
ccfada1a-5a81-4b80-a6a1-6392e7f3bc5e	AUTOMATIC	\N	2026-05-19 03:00:05.840377+03	2026-05-19 03:00:05.840377+03	automatic_backup_2026-05-19T00-00-04-939Z.json	\N	SUCCESS
3636bfba-890e-446c-b211-69abf532ddc9	AUTOMATIC	\N	2026-05-20 03:00:06.057465+03	2026-05-20 03:00:06.057465+03	automatic_backup_2026-05-20T00-00-04-774Z.json	\N	SUCCESS
51594fcf-da08-471b-b8b1-0e3edaa4963e	AUTOMATIC	\N	2026-05-21 03:00:07.078644+03	2026-05-21 03:00:07.078644+03	automatic_backup_2026-05-21T00-00-04-557Z.json	\N	SUCCESS
1d36a6b0-6cdf-46dd-b779-d3c31ae447b2	AUTOMATIC	\N	2026-05-22 03:00:03.755529+03	2026-05-22 03:00:03.755529+03	automatic_backup_2026-05-22T00-00-03-092Z.json	\N	SUCCESS
018a02aa-97c4-4b0b-b2cb-619fccd68c50	AUTOMATIC	\N	2026-05-23 03:00:03.083165+03	2026-05-23 03:00:03.083165+03	automatic_backup_2026-05-23T00-00-02-851Z.json	\N	SUCCESS
ebe2698f-1b76-44d6-b4cd-ce321b798409	AUTOMATIC	\N	2026-05-24 03:00:07.057632+03	2026-05-24 03:00:07.057632+03	automatic_backup_2026-05-24T00-00-06-384Z.json	\N	SUCCESS
3dba41c4-67d7-40c5-af05-1f4741240cac	AUTOMATIC	\N	2026-05-25 03:00:17.25241+03	2026-05-25 03:00:17.25241+03	automatic_backup_2026-05-25T00-00-16-726Z.json	\N	SUCCESS
c996e427-b760-4bdb-b2a8-d90ed6a47f2f	AUTOMATIC	\N	2026-05-26 03:00:02.84214+03	2026-05-26 03:00:02.84214+03	automatic_backup_2026-05-26T00-00-02-623Z.json	\N	SUCCESS
cb0a1e42-a976-4f6e-a813-08ac20b42884	AUTOMATIC	\N	2026-05-27 03:00:07.982058+03	2026-05-27 03:00:07.982058+03	automatic_backup_2026-05-27T00-00-05-349Z.json	\N	SUCCESS
137ab5b3-5568-41d7-8ce0-93ded87d0769	AUTOMATIC	\N	2026-05-28 03:00:04.042233+03	2026-05-28 03:00:04.042233+03	automatic_backup_2026-05-28T00-00-03-359Z.json	\N	SUCCESS
c3b0f600-4901-4f0e-a59d-739082c8683f	AUTOMATIC	\N	2026-05-29 03:00:03.522084+03	2026-05-29 03:00:03.522084+03	automatic_backup_2026-05-29T00-00-03-346Z.json	\N	SUCCESS
772bb7ec-7bce-477f-8efc-685fbce0324f	AUTOMATIC	\N	2026-06-01 03:00:06.969108+03	2026-06-01 03:00:06.969108+03	automatic_backup_2026-06-01T00-00-06-038Z.json	\N	SUCCESS
14960289-d1a1-45b0-99bd-0040b6487f0d	AUTOMATIC	\N	2026-06-02 03:00:07.377219+03	2026-06-02 03:00:07.377219+03	automatic_backup_2026-06-02T00-00-05-440Z.json	\N	SUCCESS
4fc77034-cbdb-43ad-98cd-177ee7f567c0	AUTOMATIC	\N	2026-06-03 03:00:08.845256+03	2026-06-03 03:00:08.845256+03	automatic_backup_2026-06-03T00-00-06-926Z.json	\N	SUCCESS
89e4ef0e-b515-480d-ac0a-97ae7d65f8b2	AUTOMATIC	\N	2026-06-04 03:00:07.65537+03	2026-06-04 03:00:07.65537+03	automatic_backup_2026-06-04T00-00-06-166Z.json	\N	SUCCESS
6e595a42-17b9-4c76-a2b3-0895ce36544f	AUTOMATIC	\N	2026-06-05 03:00:08.564105+03	2026-06-05 03:00:08.564105+03	automatic_backup_2026-06-05T00-00-04-043Z.json	\N	SUCCESS
927720a0-d2ab-4fa7-bbc8-1814800a8a37	AUTOMATIC	\N	2026-06-06 03:00:05.754738+03	2026-06-06 03:00:05.754738+03	automatic_backup_2026-06-06T00-00-04-643Z.json	\N	SUCCESS
4587d8f6-0ba9-4a41-bcd0-ed1659e65745	AUTOMATIC	\N	2026-06-07 03:00:03.876694+03	2026-06-07 03:00:03.876694+03	automatic_backup_2026-06-07T00-00-03-572Z.json	\N	SUCCESS
8a473f91-b644-44ed-a334-affbad1ec408	AUTOMATIC	\N	2026-06-08 03:00:11.564695+03	2026-06-08 03:00:11.564695+03	automatic_backup_2026-06-08T00-00-06-032Z.json	\N	SUCCESS
2039dee8-7c82-4841-8749-ffc347547541	AUTOMATIC	\N	2026-06-09 03:00:06.35322+03	2026-06-09 03:00:06.35322+03	automatic_backup_2026-06-09T00-00-04-726Z.json	\N	SUCCESS
b3086a83-411e-4479-8838-c7fdb48f01e2	AUTOMATIC	\N	2026-06-10 03:00:08.700576+03	2026-06-10 03:00:08.700576+03	automatic_backup_2026-06-10T00-00-08-023Z.json	\N	SUCCESS
c4225187-787b-4803-a33c-f9f8e499097d	AUTOMATIC	\N	2026-06-11 03:00:06.261907+03	2026-06-11 03:00:06.261907+03	automatic_backup_2026-06-11T00-00-04-743Z.json	\N	SUCCESS
eb52feaf-7681-44d8-a301-344f96f7abfc	AUTOMATIC	\N	2026-06-12 03:00:12.772108+03	2026-06-12 03:00:12.772108+03	automatic_backup_2026-06-12T00-00-12-527Z.json	\N	SUCCESS
21bcff0c-3372-4b22-8e1c-9789ec065ee8	AUTOMATIC	\N	2026-06-13 03:00:03.775737+03	2026-06-13 03:00:03.775737+03	automatic_backup_2026-06-13T00-00-03-542Z.json	\N	SUCCESS
72b61b21-90f4-4e18-922e-401b6ea75c5b	AUTOMATIC	\N	2026-06-14 03:00:05.876901+03	2026-06-14 03:00:05.876901+03	automatic_backup_2026-06-14T00-00-03-859Z.json	\N	SUCCESS
2c23293c-679b-40f9-b8e8-a41537add122	AUTOMATIC	\N	2026-06-15 03:00:10.344226+03	2026-06-15 03:00:10.344226+03	automatic_backup_2026-06-15T00-00-06-541Z.json	\N	SUCCESS
49ab4494-7244-4876-b07a-914f88d546d1	AUTOMATIC	\N	2026-06-16 03:00:06.795195+03	2026-06-16 03:00:06.795195+03	automatic_backup_2026-06-16T00-00-06-152Z.json	\N	SUCCESS
be951ec0-62c8-4ae8-95df-74bb39866211	AUTOMATIC	\N	2026-06-17 03:00:12.662856+03	2026-06-17 03:00:12.662856+03	automatic_backup_2026-06-17T00-00-12-303Z.json	\N	SUCCESS
e91e733f-3e50-4ce8-8095-ed3a1f0d9bbb	AUTOMATIC	\N	2026-06-18 03:00:05.567596+03	2026-06-18 03:00:05.567596+03	automatic_backup_2026-06-18T00-00-03-944Z.json	\N	SUCCESS
10c51cd8-7187-4706-b960-fc6546f9453b	AUTOMATIC	\N	2026-06-19 03:00:03.748219+03	2026-06-19 03:00:03.748219+03	automatic_backup_2026-06-19T00-00-03-272Z.json	\N	SUCCESS
e91e7dd0-a1a4-4276-8718-7807ca2b13b9	AUTOMATIC	\N	2026-06-20 03:00:14.354035+03	2026-06-20 03:00:14.354035+03	automatic_backup_2026-06-20T00-00-13-962Z.json	\N	SUCCESS
3b6e816c-acbd-4b37-af2f-32418fc1f52b	AUTOMATIC	\N	2026-06-21 03:00:10.854742+03	2026-06-21 03:00:10.854742+03	automatic_backup_2026-06-21T00-00-09-282Z.json	\N	SUCCESS
e3879d63-0bd5-45d5-a76a-a07c723e8bf0	AUTOMATIC	\N	2026-06-22 03:00:03.796671+03	2026-06-22 03:00:03.796671+03	automatic_backup_2026-06-22T00-00-03-618Z.json	\N	SUCCESS
92c4b15b-f029-48c6-af58-ebcd624b940c	AUTOMATIC	\N	2026-06-23 03:00:04.933192+03	2026-06-23 03:00:04.933192+03	automatic_backup_2026-06-23T00-00-04-535Z.json	\N	SUCCESS
db2f8b04-e6e5-41d6-aeed-f486ad9f2ea1	AUTOMATIC	\N	2026-06-25 03:00:14.745819+03	2026-06-25 03:00:14.745819+03	automatic_backup_2026-06-25T00-00-13-123Z.json	\N	SUCCESS
93e14704-15f1-4837-b62a-fb9754022846	AUTOMATIC	\N	2026-06-26 03:00:04.189871+03	2026-06-26 03:00:04.189871+03	automatic_backup_2026-06-26T00-00-03-859Z.json	\N	SUCCESS
55e62af6-b831-451b-b63a-860b59b78f8a	AUTOMATIC	\N	2026-06-27 03:00:07.277394+03	2026-06-27 03:00:07.277394+03	automatic_backup_2026-06-27T00-00-03-723Z.json	\N	SUCCESS
ed9e79e7-9717-4ca4-bbca-d8ef43d98f24	AUTOMATIC	\N	2026-06-28 03:00:11.841759+03	2026-06-28 03:00:11.841759+03	automatic_backup_2026-06-28T00-00-06-848Z.json	\N	SUCCESS
31f982cd-c7f1-420c-8753-08c984c00816	AUTOMATIC	\N	2026-06-29 03:00:06.12528+03	2026-06-29 03:00:06.12528+03	automatic_backup_2026-06-29T00-00-04-674Z.json	\N	SUCCESS
301ca099-68cc-4960-a23d-40a33484ba42	AUTOMATIC	\N	2026-06-30 03:00:10.143489+03	2026-06-30 03:00:10.143489+03	automatic_backup_2026-06-30T00-00-08-666Z.json	\N	SUCCESS
0e1e2081-a5d3-4381-82f5-385a9fd9a2f2	AUTOMATIC	\N	2026-07-01 03:00:07.29077+03	2026-07-01 03:00:07.29077+03	automatic_backup_2026-07-01T00-00-06-202Z.json	\N	SUCCESS
8d6718d5-cf07-470b-a38d-099875e8143d	AUTOMATIC	\N	2026-07-02 03:00:11.48633+03	2026-07-02 03:00:11.48633+03	automatic_backup_2026-07-02T00-00-11-033Z.json	\N	SUCCESS
d7ae5a17-4795-4383-93ac-168d97a99bc8	AUTOMATIC	\N	2026-07-03 03:00:23.93954+03	2026-07-03 03:00:23.93954+03	automatic_backup_2026-07-03T00-00-22-222Z.json	\N	SUCCESS
c8706dae-1c8f-4039-b246-22da0d231a01	AUTOMATIC	\N	2026-07-04 03:00:18.262884+03	2026-07-04 03:00:18.262884+03	automatic_backup_2026-07-04T00-00-16-823Z.json	\N	SUCCESS
ea1943eb-3917-44ee-9658-e1f68db5eef2	AUTOMATIC	\N	2026-07-05 03:00:20.658806+03	2026-07-05 03:00:20.658806+03	automatic_backup_2026-07-05T00-00-19-130Z.json	\N	SUCCESS
64b82eb1-2c89-43e7-ab0d-50fef00ec2d8	AUTOMATIC	\N	2026-07-06 03:00:06.3608+03	2026-07-06 03:00:06.3608+03	automatic_backup_2026-07-06T00-00-05-961Z.json	\N	SUCCESS
52012ff3-fe44-473b-8744-181dd9a106be	AUTOMATIC	\N	2026-07-07 03:00:04.077409+03	2026-07-07 03:00:04.077409+03	automatic_backup_2026-07-07T00-00-03-785Z.json	\N	SUCCESS
a2444108-0ab5-43ec-8d97-2da5f3411a29	AUTOMATIC	\N	2026-07-08 03:00:19.71467+03	2026-07-08 03:00:19.71467+03	automatic_backup_2026-07-08T00-00-19-469Z.json	\N	SUCCESS
0acbe5b6-0fb1-4991-8d88-dd37ff1b8260	AUTOMATIC	\N	2026-07-09 03:00:09.486001+03	2026-07-09 03:00:09.486001+03	automatic_backup_2026-07-09T00-00-08-857Z.json	\N	SUCCESS
b811557f-0cbb-4e21-9b86-e91418f29343	AUTOMATIC	\N	2026-07-10 03:00:10.565849+03	2026-07-10 03:00:10.565849+03	automatic_backup_2026-07-10T00-00-10-257Z.json	\N	SUCCESS
3ab310c0-f1c3-4023-b819-fd775520b430	AUTOMATIC	\N	2026-07-11 03:00:04.088278+03	2026-07-11 03:00:04.088278+03	automatic_backup_2026-07-11T00-00-03-585Z.json	\N	SUCCESS
b72cff88-30c8-47ef-8c72-10e866b07c9c	AUTOMATIC	\N	2026-07-12 03:00:03.887862+03	2026-07-12 03:00:03.887862+03	automatic_backup_2026-07-12T00-00-03-692Z.json	\N	SUCCESS
f1c8e3aa-248f-45b0-94e7-2d8c6d90565e	AUTOMATIC	\N	2026-07-13 03:00:10.394857+03	2026-07-13 03:00:10.394857+03	automatic_backup_2026-07-13T00-00-09-976Z.json	\N	SUCCESS
a2b065d9-4dec-4500-846b-39e0fc8404a3	AUTOMATIC	\N	2026-07-14 03:00:34.348529+03	2026-07-14 03:00:34.348529+03	automatic_backup_2026-07-14T00-00-31-421Z.json	\N	SUCCESS
f8cb33bd-1f74-47e8-9231-fa736fabbdf3	AUTOMATIC	\N	2026-07-15 03:00:07.282508+03	2026-07-15 03:00:07.282508+03	automatic_backup_2026-07-15T00-00-03-940Z.json	\N	SUCCESS
becb257a-8911-49a3-bbda-10b81f8ddbbd	AUTOMATIC	\N	2026-07-16 03:00:03.191895+03	2026-07-16 03:00:03.191895+03	automatic_backup_2026-07-16T00-00-03-071Z.json	\N	SUCCESS
51231f6d-bae0-40e9-b2df-68d2b9633d73	AUTOMATIC	\N	2026-07-17 03:00:06.399474+03	2026-07-17 03:00:06.399474+03	automatic_backup_2026-07-17T00-00-06-088Z.json	\N	SUCCESS
47b8452c-103d-45e5-9444-ec347d7d2c3b	AUTOMATIC	\N	2026-07-18 03:00:06.469715+03	2026-07-18 03:00:06.469715+03	automatic_backup_2026-07-18T00-00-04-528Z.json	\N	SUCCESS
e9112c54-e04f-4999-8f15-67267c8a31d0	AUTOMATIC	\N	2026-07-19 03:00:07.17973+03	2026-07-19 03:00:07.17973+03	automatic_backup_2026-07-19T00-00-06-638Z.json	\N	SUCCESS
3eb7638f-35a7-437f-84ad-c91f6463d3f1	AUTOMATIC	\N	2026-07-20 03:00:04.426942+03	2026-07-20 03:00:04.426942+03	automatic_backup_2026-07-20T00-00-04-165Z.json	\N	SUCCESS
9fc98c93-dd76-4ead-8ff8-08fc96da7845	AUTOMATIC	\N	2026-07-21 03:00:03.912987+03	2026-07-21 03:00:03.912987+03	automatic_backup_2026-07-21T00-00-03-367Z.json	\N	SUCCESS
2aac7fb8-dc9c-4438-900a-729b28e9dc0d	AUTOMATIC	\N	2026-07-22 03:00:06.192598+03	2026-07-22 03:00:06.192598+03	automatic_backup_2026-07-22T00-00-05-977Z.json	\N	SUCCESS
c5ada827-0da3-4ade-ac22-e70f7f8ee756	AUTOMATIC	\N	2026-07-23 03:00:04.502935+03	2026-07-23 03:00:04.502935+03	automatic_backup_2026-07-23T00-00-02-911Z.json	\N	SUCCESS
88294c4d-2987-429b-b8d2-c0a54d67ac52	AUTOMATIC	\N	2026-07-24 03:00:04.79021+03	2026-07-24 03:00:04.79021+03	automatic_backup_2026-07-24T00-00-04-500Z.json	\N	SUCCESS
732d63c1-6b2d-4028-acd3-3e4ac764f379	AUTOMATIC	\N	2026-07-25 03:00:04.87141+03	2026-07-25 03:00:04.87141+03	automatic_backup_2026-07-25T00-00-04-324Z.json	\N	SUCCESS
f0823e0c-4344-4f25-99a8-fe3ca023e626	AUTOMATIC	\N	2026-07-26 03:00:02.779849+03	2026-07-26 03:00:02.779849+03	automatic_backup_2026-07-26T00-00-02-411Z.json	\N	SUCCESS
a93f45cb-8d05-4b23-b50d-8d2981d5289d	AUTOMATIC	\N	2026-07-27 03:00:02.508169+03	2026-07-27 03:00:02.508169+03	automatic_backup_2026-07-27T00-00-02-350Z.json	\N	SUCCESS
352024b8-2ee4-45ba-ad5a-0c0ce119c7da	AUTOMATIC	\N	2026-07-28 03:00:03.37642+03	2026-07-28 03:00:03.37642+03	automatic_backup_2026-07-28T00-00-03-218Z.json	\N	SUCCESS
7e2d244d-4c0c-4318-b423-27849f4e1557	AUTOMATIC	\N	2026-07-29 03:00:02.347033+03	2026-07-29 03:00:02.347033+03	automatic_backup_2026-07-29T00-00-02-206Z.json	\N	SUCCESS
ab8ef521-d7d5-4331-9caa-dfc4773c6531	AUTOMATIC	\N	2026-07-30 03:00:03.579619+03	2026-07-30 03:00:03.579619+03	automatic_backup_2026-07-30T00-00-03-467Z.json	\N	SUCCESS
ac30b9a7-0316-40fd-8138-39949d3516eb	AUTOMATIC	\N	2026-07-31 03:00:04.294139+03	2026-07-31 03:00:04.294139+03	automatic_backup_2026-07-31T00-00-03-797Z.json	\N	SUCCESS
e2e94e60-7efb-4c47-97de-759743172829	AUTOMATIC	\N	2026-08-01 03:00:03.997877+03	2026-08-01 03:00:03.997877+03	automatic_backup_2026-08-01T00-00-03-780Z.json	\N	SUCCESS
8b8bcefd-4292-4165-a03f-cfc066d443c2	AUTOMATIC	\N	2026-08-02 03:00:03.288024+03	2026-08-02 03:00:03.288024+03	automatic_backup_2026-08-02T00-00-02-991Z.json	\N	SUCCESS
aa0be267-7c3c-4f75-8958-4b0051d54d0f	AUTOMATIC	\N	2026-08-03 03:00:03.969437+03	2026-08-03 03:00:03.969437+03	automatic_backup_2026-08-03T00-00-03-580Z.json	\N	SUCCESS
4ca5da37-c000-4afa-86a7-79a25db6fa48	AUTOMATIC	\N	2026-08-04 03:00:04.272609+03	2026-08-04 03:00:04.272609+03	automatic_backup_2026-08-04T00-00-03-913Z.json	\N	SUCCESS
0056227d-ee33-4736-879b-b9e60f69b53a	AUTOMATIC	\N	2026-08-05 03:00:05.021229+03	2026-08-05 03:00:05.021229+03	automatic_backup_2026-08-05T00-00-04-451Z.json	\N	SUCCESS
d8f08bc7-0aa4-4aab-97d7-c718af799721	AUTOMATIC	\N	2026-08-06 03:00:02.872415+03	2026-08-06 03:00:02.872415+03	automatic_backup_2026-08-06T00-00-02-643Z.json	\N	SUCCESS
d0f26be4-a9fa-4e1a-9508-c787c244ff01	AUTOMATIC	\N	2026-08-07 03:00:03.328068+03	2026-08-07 03:00:03.328068+03	automatic_backup_2026-08-07T00-00-03-049Z.json	\N	SUCCESS
60dd4b47-231e-428b-b347-e3222e8c695f	AUTOMATIC	\N	2026-08-08 03:00:03.353579+03	2026-08-08 03:00:03.353579+03	automatic_backup_2026-08-08T00-00-03-158Z.json	\N	SUCCESS
70eaebe5-799a-44a4-b6d3-b441f8e0074c	AUTOMATIC	\N	2026-08-09 03:00:02.952131+03	2026-08-09 03:00:02.952131+03	automatic_backup_2026-08-09T00-00-02-731Z.json	\N	SUCCESS
7da8cee0-2438-4fef-a6e4-50e6fa4c72dd	AUTOMATIC	\N	2026-08-10 03:00:03.174815+03	2026-08-10 03:00:03.174815+03	automatic_backup_2026-08-10T00-00-02-870Z.json	\N	SUCCESS
eb04845d-984e-4b01-978f-d2c3268a5175	AUTOMATIC	\N	2026-08-11 03:00:03.502986+03	2026-08-11 03:00:03.502986+03	automatic_backup_2026-08-11T00-00-03-299Z.json	\N	SUCCESS
082a4ac8-7473-4f8e-8a40-ef3ce4c7fcf3	AUTOMATIC	\N	2026-08-12 03:00:04.456921+03	2026-08-12 03:00:04.456921+03	automatic_backup_2026-08-12T00-00-04-206Z.json	\N	SUCCESS
d7015986-206a-4b13-b30e-50faefd679c7	AUTOMATIC	\N	2026-08-13 03:00:03.861182+03	2026-08-13 03:00:03.861182+03	automatic_backup_2026-08-13T00-00-03-626Z.json	\N	SUCCESS
5d2c2050-fe87-445e-b70b-391d0887d83d	AUTOMATIC	\N	2026-08-14 03:00:04.798047+03	2026-08-14 03:00:04.798047+03	automatic_backup_2026-08-14T00-00-04-524Z.json	\N	SUCCESS
2d15b496-e444-4e83-a353-30d518970c92	AUTOMATIC	\N	2026-08-15 03:00:04.091945+03	2026-08-15 03:00:04.091945+03	automatic_backup_2026-08-15T00-00-03-804Z.json	\N	SUCCESS
1f178f5c-62c5-44b8-be1e-a14593d08491	AUTOMATIC	\N	2026-08-16 03:00:04.959621+03	2026-08-16 03:00:04.959621+03	automatic_backup_2026-08-16T00-00-04-159Z.json	\N	SUCCESS
4e374ecf-e522-48ec-88ba-93935ae09815	AUTOMATIC	\N	2026-08-17 03:00:05.789695+03	2026-08-17 03:00:05.789695+03	automatic_backup_2026-08-17T00-00-04-746Z.json	\N	SUCCESS
05bf2ec3-4869-4834-9571-3a05721c81af	AUTOMATIC	\N	2026-08-18 03:00:04.690614+03	2026-08-18 03:00:04.690614+03	automatic_backup_2026-08-18T00-00-04-386Z.json	\N	SUCCESS
10f4ebcb-599f-4a51-8208-70a951fbbba1	AUTOMATIC	\N	2026-08-19 03:00:05.696095+03	2026-08-19 03:00:05.696095+03	automatic_backup_2026-08-19T00-00-05-423Z.json	\N	SUCCESS
1206b1c8-5e55-429c-8961-ffc8fa12d574	AUTOMATIC	\N	2026-08-20 03:00:03.368686+03	2026-08-20 03:00:03.368686+03	automatic_backup_2026-08-20T00-00-03-041Z.json	\N	SUCCESS
fc24ddd6-adda-4d2a-8306-74b2a97dacf7	AUTOMATIC	\N	2026-08-21 03:00:05.345154+03	2026-08-21 03:00:05.345154+03	automatic_backup_2026-08-21T00-00-05-059Z.json	\N	SUCCESS
c4899113-a5e1-482f-9d17-9cc5225472f4	AUTOMATIC	\N	2026-08-22 03:00:04.968758+03	2026-08-22 03:00:04.968758+03	automatic_backup_2026-08-22T00-00-04-220Z.json	\N	SUCCESS
55adfb18-4917-421e-bc7b-91f0edf9694c	AUTOMATIC	\N	2026-08-23 03:00:03.643653+03	2026-08-23 03:00:03.643653+03	automatic_backup_2026-08-23T00-00-02-692Z.json	\N	SUCCESS
a3636762-ac28-473b-8f6f-d0b3d0201a11	AUTOMATIC	\N	2026-08-24 03:00:04.497374+03	2026-08-24 03:00:04.497374+03	automatic_backup_2026-08-24T00-00-04-217Z.json	\N	SUCCESS
008bf0a0-506d-4889-9ab4-0ecc7101752e	AUTOMATIC	\N	2026-08-25 03:00:03.859669+03	2026-08-25 03:00:03.859669+03	automatic_backup_2026-08-25T00-00-03-709Z.json	\N	SUCCESS
69639ddd-a14b-49ba-ac6c-77abdd9ff257	AUTOMATIC	\N	2026-08-26 03:00:02.546429+03	2026-08-26 03:00:02.546429+03	automatic_backup_2026-08-26T00-00-02-464Z.json	\N	SUCCESS
fb5ba6e6-ce03-484e-afcd-614a8206fa0f	AUTOMATIC	\N	2026-08-27 03:00:03.243976+03	2026-08-27 03:00:03.243976+03	automatic_backup_2026-08-27T00-00-03-084Z.json	\N	SUCCESS
a2ef927f-4c1f-44ce-a928-493ce48be0e1	AUTOMATIC	\N	2026-08-28 03:00:06.260829+03	2026-08-28 03:00:06.260829+03	automatic_backup_2026-08-28T00-00-05-277Z.json	\N	SUCCESS
8cd16535-89b9-4ab6-9d27-33ec4cdc26f6	AUTOMATIC	\N	2026-08-29 03:00:00.995159+03	2026-08-29 03:00:00.995159+03	automatic_backup_2026-08-29T00-00-00-957Z.json	\N	SUCCESS
44af26ab-9a46-4242-9d13-b1e3cd1a5f83	AUTOMATIC	\N	2026-08-30 03:00:01.733514+03	2026-08-30 03:00:01.733514+03	automatic_backup_2026-08-30T00-00-01-670Z.json	\N	SUCCESS
6f87c548-3959-4055-8096-a8055f86e6e2	AUTOMATIC	\N	2026-08-31 03:00:01.434338+03	2026-08-31 03:00:01.434338+03	automatic_backup_2026-08-31T00-00-01-364Z.json	\N	SUCCESS
133ed693-bca0-4f7f-bfb9-da9a6859bbb7	AUTOMATIC	\N	2026-09-01 03:00:03.405009+03	2026-09-01 03:00:03.405009+03	automatic_backup_2026-09-01T00-00-03-234Z.json	\N	SUCCESS
118909fd-205f-4c04-9210-64fe70bf0d29	AUTOMATIC	\N	2026-09-02 03:00:02.504729+03	2026-09-02 03:00:02.504729+03	automatic_backup_2026-09-02T00-00-02-242Z.json	\N	SUCCESS
0062264b-228d-4215-b190-12323c8e1775	AUTOMATIC	\N	2026-09-03 03:00:01.344478+03	2026-09-03 03:00:01.344478+03	automatic_backup_2026-09-03T00-00-01-273Z.json	\N	SUCCESS
e9bb1017-a48e-4a94-b57c-dcd838747c0f	AUTOMATIC	\N	2026-09-04 03:00:05.558786+03	2026-09-04 03:00:05.558786+03	automatic_backup_2026-09-04T00-00-02-753Z.json	\N	SUCCESS
2ed7edb8-d44b-45e3-8546-830f3ff5b6cc	AUTOMATIC	\N	2026-09-05 03:00:01.600283+03	2026-09-05 03:00:01.600283+03	automatic_backup_2026-09-05T00-00-01-490Z.json	\N	SUCCESS
c0f257b6-ea3f-4265-a416-d4687eb76fb4	AUTOMATIC	\N	2026-09-06 03:00:01.528739+03	2026-09-06 03:00:01.528739+03	automatic_backup_2026-09-06T00-00-01-473Z.json	\N	SUCCESS
791275d4-1f96-461b-93a0-9c4936c62830	AUTOMATIC	\N	2026-09-07 03:00:03.829444+03	2026-09-07 03:00:03.829444+03	automatic_backup_2026-09-07T00-00-03-533Z.json	\N	SUCCESS
c0ff17db-3196-4d86-bb16-09f73865c999	AUTOMATIC	\N	2026-09-08 03:00:03.202985+03	2026-09-08 03:00:03.202985+03	automatic_backup_2026-09-08T00-00-03-041Z.json	\N	SUCCESS
71931df6-3abc-4a7b-9ebc-c0844d4f4ce0	AUTOMATIC	\N	2026-09-09 03:00:03.18227+03	2026-09-09 03:00:03.18227+03	automatic_backup_2026-09-09T00-00-03-033Z.json	\N	SUCCESS
6eb0f15c-a438-421b-a598-3be7944db667	AUTOMATIC	\N	2026-09-10 03:00:02.212206+03	2026-09-10 03:00:02.212206+03	automatic_backup_2026-09-10T00-00-01-978Z.json	\N	SUCCESS
003d5f91-611f-4596-b024-03c2068f7412	AUTOMATIC	\N	2026-09-11 03:00:02.039241+03	2026-09-11 03:00:02.039241+03	automatic_backup_2026-09-11T00-00-01-858Z.json	\N	SUCCESS
4491c960-473b-4b40-80ac-afa123dc7216	AUTOMATIC	\N	2026-09-12 03:00:01.568288+03	2026-09-12 03:00:01.568288+03	automatic_backup_2026-09-12T00-00-01-477Z.json	\N	SUCCESS
e2d0b104-9ecc-4d54-8a65-0d5990329d2a	AUTOMATIC	\N	2026-09-13 03:00:01.560135+03	2026-09-13 03:00:01.560135+03	automatic_backup_2026-09-13T00-00-01-493Z.json	\N	SUCCESS
72a2855d-1341-4330-ad50-3981512ac766	AUTOMATIC	\N	2026-09-14 03:00:03.462101+03	2026-09-14 03:00:03.462101+03	automatic_backup_2026-09-14T00-00-03-334Z.json	\N	SUCCESS
0252032b-0b3e-4141-81ce-787232f0429c	AUTOMATIC	\N	2026-09-15 03:00:03.038739+03	2026-09-15 03:00:03.038739+03	automatic_backup_2026-09-15T00-00-02-831Z.json	\N	SUCCESS
baaa7312-be3d-4b63-b325-db47e13c6ba0	AUTOMATIC	\N	2026-09-16 03:00:04.207734+03	2026-09-16 03:00:04.207734+03	automatic_backup_2026-09-16T00-00-04-025Z.json	\N	SUCCESS
0a3f8828-9143-408c-9cbd-4ac7addc3086	AUTOMATIC	\N	2026-09-17 03:00:04.651771+03	2026-09-17 03:00:04.651771+03	automatic_backup_2026-09-17T00-00-04-605Z.json	\N	SUCCESS
4f3e9639-c54c-49ae-8a5a-e2c4a58c7b97	AUTOMATIC	\N	2026-09-18 03:00:02.910629+03	2026-09-18 03:00:02.910629+03	automatic_backup_2026-09-18T00-00-02-631Z.json	\N	SUCCESS
bd23ed70-fae7-4d26-ac48-54b3cbe349a4	AUTOMATIC	\N	2026-09-19 03:00:01.765987+03	2026-09-19 03:00:01.765987+03	automatic_backup_2026-09-19T00-00-01-642Z.json	\N	SUCCESS
c1d082ed-1833-4d15-b20b-f21583dd00ef	AUTOMATIC	\N	2026-09-20 03:00:01.992969+03	2026-09-20 03:00:01.992969+03	automatic_backup_2026-09-20T00-00-01-791Z.json	\N	SUCCESS
02117c11-ffa1-42ce-a122-ea7517bccca7	AUTOMATIC	\N	2026-09-21 03:00:01.800531+03	2026-09-21 03:00:01.800531+03	automatic_backup_2026-09-21T00-00-01-643Z.json	\N	SUCCESS
649e1a78-592a-4452-b13b-cb3767aec1ef	AUTOMATIC	\N	2026-09-22 03:00:01.504363+03	2026-09-22 03:00:01.504363+03	automatic_backup_2026-09-22T00-00-01-416Z.json	\N	SUCCESS
4af9d3e9-c034-4bab-abf4-ba5b065805a0	AUTOMATIC	\N	2026-09-23 03:00:01.697503+03	2026-09-23 03:00:01.697503+03	automatic_backup_2026-09-23T00-00-01-565Z.json	\N	SUCCESS
cf99bd44-1e40-4806-9e8d-2d0371b8253e	AUTOMATIC	\N	2026-09-24 03:00:04.755879+03	2026-09-24 03:00:04.755879+03	automatic_backup_2026-09-24T00-00-04-246Z.json	\N	SUCCESS
a02d8ab4-5832-426e-b723-942968fd19b0	AUTOMATIC	\N	2026-09-25 03:00:01.474994+03	2026-09-25 03:00:01.474994+03	automatic_backup_2026-09-25T00-00-01-380Z.json	\N	SUCCESS
4e2966dc-f885-4776-b9aa-f61dc6678413	AUTOMATIC	\N	2026-09-26 03:00:02.648244+03	2026-09-26 03:00:02.648244+03	automatic_backup_2026-09-26T00-00-02-381Z.json	\N	SUCCESS
b0392d0d-81e5-448a-a46c-499c5314b28d	AUTOMATIC	\N	2026-09-27 03:00:02.345024+03	2026-09-27 03:00:02.345024+03	automatic_backup_2026-09-27T00-00-02-123Z.json	\N	SUCCESS
144edc09-1bf4-4ffe-a156-9482810e9d6f	AUTOMATIC	\N	2026-09-28 03:00:01.891737+03	2026-09-28 03:00:01.891737+03	automatic_backup_2026-09-28T00-00-01-776Z.json	\N	SUCCESS
93229792-07c8-41c1-b2d8-0a3b0c72c72a	AUTOMATIC	\N	2026-09-29 03:00:01.493285+03	2026-09-29 03:00:01.493285+03	automatic_backup_2026-09-29T00-00-01-417Z.json	\N	SUCCESS
e22b7438-3ca3-46cf-8eab-f36ffbb5b7b6	AUTOMATIC	\N	2026-09-30 03:00:01.784873+03	2026-09-30 03:00:01.784873+03	automatic_backup_2026-09-30T00-00-01-710Z.json	\N	SUCCESS
f5ddf9eb-d8c8-4cef-9b95-27f0f28b7ce1	AUTOMATIC	\N	2026-10-01 03:00:01.552622+03	2026-10-01 03:00:01.552622+03	automatic_backup_2026-10-01T00-00-01-365Z.json	\N	SUCCESS
04541981-8818-4859-b49d-d5d31faf280a	AUTOMATIC	\N	2026-10-02 03:00:01.513934+03	2026-10-02 03:00:01.513934+03	automatic_backup_2026-10-02T00-00-01-416Z.json	\N	SUCCESS
f618e37f-794d-4147-a36f-6ff1d5345891	AUTOMATIC	\N	2026-10-03 03:00:02.153742+03	2026-10-03 03:00:02.153742+03	automatic_backup_2026-10-03T00-00-01-820Z.json	\N	SUCCESS
3f5895a4-9667-4408-9ae7-e7f57716e8ca	AUTOMATIC	\N	2026-10-04 03:00:04.279696+03	2026-10-04 03:00:04.279696+03	automatic_backup_2026-10-04T00-00-03-219Z.json	\N	SUCCESS
a03805b8-f4ec-46e3-921a-23c58c0e1951	AUTOMATIC	\N	2026-10-05 03:00:01.763699+03	2026-10-05 03:00:01.763699+03	automatic_backup_2026-10-05T00-00-01-423Z.json	\N	SUCCESS
1c91e74c-eda1-4ed2-95fe-62820a81a96a	AUTOMATIC	\N	2026-10-06 03:00:01.871501+03	2026-10-06 03:00:01.871501+03	automatic_backup_2026-10-06T00-00-01-722Z.json	\N	SUCCESS
4b7806ea-5688-402f-87de-a6db16a56721	AUTOMATIC	\N	2026-10-07 03:00:02.043479+03	2026-10-07 03:00:02.043479+03	automatic_backup_2026-10-07T00-00-01-996Z.json	\N	SUCCESS
5751cb53-6702-455f-95b0-12ebcef5c448	AUTOMATIC	\N	2026-10-08 03:00:01.333747+03	2026-10-08 03:00:01.333747+03	automatic_backup_2026-10-08T00-00-01-242Z.json	\N	SUCCESS
e9c9951a-fac7-4dc9-967a-03cd6dc6d85f	AUTOMATIC	\N	2026-10-09 03:00:02.904067+03	2026-10-09 03:00:02.904067+03	automatic_backup_2026-10-09T00-00-02-829Z.json	\N	SUCCESS
e5a53f99-c714-4c65-bc51-c0ac1fc41310	AUTOMATIC	\N	2026-10-10 03:00:01.350741+03	2026-10-10 03:00:01.350741+03	automatic_backup_2026-10-10T00-00-01-270Z.json	\N	SUCCESS
882c3e40-00c7-46c7-9d3b-df25f13e8519	AUTOMATIC	\N	2026-10-11 03:00:01.418635+03	2026-10-11 03:00:01.418635+03	automatic_backup_2026-10-11T00-00-01-317Z.json	\N	SUCCESS
80ab8e85-5fb9-4202-9dbe-75af26a216c1	AUTOMATIC	\N	2026-10-12 03:00:01.568956+03	2026-10-12 03:00:01.568956+03	automatic_backup_2026-10-12T00-00-01-438Z.json	\N	SUCCESS
bdebec8d-be1b-433a-a28a-1a43c6524b8f	AUTOMATIC	\N	2026-10-13 03:00:02.055096+03	2026-10-13 03:00:02.055096+03	automatic_backup_2026-10-13T00-00-01-756Z.json	\N	SUCCESS
32831356-46ca-4b03-9404-7391c9ce51e0	AUTOMATIC	\N	2026-10-14 03:00:01.601744+03	2026-10-14 03:00:01.601744+03	automatic_backup_2026-10-14T00-00-01-497Z.json	\N	SUCCESS
b5e807b5-c4e4-40ff-9b80-1903756ae3b8	AUTOMATIC	\N	2026-10-15 03:00:01.310001+03	2026-10-15 03:00:01.310001+03	automatic_backup_2026-10-15T00-00-01-225Z.json	\N	SUCCESS
a96e1978-927c-4fbb-abe8-9d81c4811733	AUTOMATIC	\N	2026-10-16 03:00:02.008059+03	2026-10-16 03:00:02.008059+03	automatic_backup_2026-10-16T00-00-01-890Z.json	\N	SUCCESS
fe27e32f-194b-46b4-9cb4-7d608ccaf6ef	AUTOMATIC	\N	2026-10-17 03:00:01.822986+03	2026-10-17 03:00:01.822986+03	automatic_backup_2026-10-17T00-00-01-620Z.json	\N	SUCCESS
a4d04124-72a6-418c-8b10-fb2ff4267e7f	AUTOMATIC	\N	2026-10-18 03:00:01.667638+03	2026-10-18 03:00:01.667638+03	automatic_backup_2026-10-18T00-00-01-538Z.json	\N	SUCCESS
807cb262-f895-4c51-b982-6985f66255dd	AUTOMATIC	\N	2026-10-19 03:00:01.282277+03	2026-10-19 03:00:01.282277+03	automatic_backup_2026-10-19T00-00-01-171Z.json	\N	SUCCESS
b32cf31b-07e1-4ac4-a9c4-2b4a6b4e57ae	AUTOMATIC	\N	2026-10-20 03:00:01.744275+03	2026-10-20 03:00:01.744275+03	automatic_backup_2026-10-20T00-00-01-635Z.json	\N	SUCCESS
75d92b40-e699-4efc-9b17-a24c3cf00603	AUTOMATIC	\N	2026-10-21 03:00:01.367518+03	2026-10-21 03:00:01.367518+03	automatic_backup_2026-10-21T00-00-01-293Z.json	\N	SUCCESS
c62a8b08-5ebe-42d7-8c6e-71ddf4102fee	AUTOMATIC	\N	2026-10-22 03:00:02.079874+03	2026-10-22 03:00:02.079874+03	automatic_backup_2026-10-22T00-00-01-994Z.json	\N	SUCCESS
3175a500-15ce-4b9f-a7af-d0858415bbe1	AUTOMATIC	\N	2026-10-23 03:00:01.384012+03	2026-10-23 03:00:01.384012+03	automatic_backup_2026-10-23T00-00-01-281Z.json	\N	SUCCESS
91c50357-7906-411f-a255-5405a4e40fa3	AUTOMATIC	\N	2026-10-24 03:00:01.474561+03	2026-10-24 03:00:01.474561+03	automatic_backup_2026-10-24T00-00-01-399Z.json	\N	SUCCESS
94630e68-9275-499a-b178-4a617c12e318	AUTOMATIC	\N	2026-10-25 03:00:02.211949+03	2026-10-25 03:00:02.211949+03	automatic_backup_2026-10-25T00-00-02-073Z.json	\N	SUCCESS
f9a9cf39-9d6a-4a7d-958d-da9921604826	AUTOMATIC	\N	2026-10-26 02:00:02.033023+02	2026-10-26 02:00:02.033023+02	automatic_backup_2026-10-26T00-00-01-858Z.json	\N	SUCCESS
c9831c26-0083-4bf5-b1f3-ded65eceeb52	AUTOMATIC	\N	2026-10-27 02:00:01.429386+02	2026-10-27 02:00:01.429386+02	automatic_backup_2026-10-27T00-00-01-363Z.json	\N	SUCCESS
61e0a75f-fcb5-4fc5-a8af-7461418db624	AUTOMATIC	\N	2026-10-28 02:00:04.503597+02	2026-10-28 02:00:04.503597+02	automatic_backup_2026-10-28T00-00-03-633Z.json	\N	SUCCESS
909a255b-1547-4501-a839-1ed184ea903c	AUTOMATIC	\N	2026-10-29 02:00:01.622927+02	2026-10-29 02:00:01.622927+02	automatic_backup_2026-10-29T00-00-01-469Z.json	\N	SUCCESS
62ef8d31-4108-4e86-86fc-6c9aa8840f83	AUTOMATIC	\N	2026-10-30 02:00:01.407964+02	2026-10-30 02:00:01.407964+02	automatic_backup_2026-10-30T00-00-01-323Z.json	\N	SUCCESS
79b71271-433c-4b8f-8e89-699984fec3a2	AUTOMATIC	\N	2026-10-31 02:00:01.371142+02	2026-10-31 02:00:01.371142+02	automatic_backup_2026-10-31T00-00-01-281Z.json	\N	SUCCESS
71e6ecd8-2178-4639-b9a6-acbff26a354c	AUTOMATIC	\N	2026-11-01 02:00:02.060253+02	2026-11-01 02:00:02.060253+02	automatic_backup_2026-11-01T00-00-01-724Z.json	\N	SUCCESS
99b5ae79-799c-4235-ad8a-43cc0df0d755	AUTOMATIC	\N	2026-11-02 02:00:01.990277+02	2026-11-02 02:00:01.990277+02	automatic_backup_2026-11-02T00-00-01-823Z.json	\N	SUCCESS
4827b64e-0fb6-43de-b37b-73687cfccc74	AUTOMATIC	\N	2026-11-03 02:00:02.057678+02	2026-11-03 02:00:02.057678+02	automatic_backup_2026-11-03T00-00-01-938Z.json	\N	SUCCESS
b7f6791b-14b7-4f29-bd82-6820e9d31332	AUTOMATIC	\N	2026-11-04 02:00:41.468983+02	2026-11-04 02:00:41.468983+02	automatic_backup_2026-11-04T00-00-41-376Z.json	\N	SUCCESS
d1dd2d8c-3fa3-421b-9ae5-d2664ee65043	AUTOMATIC	\N	2026-11-05 02:00:02.157088+02	2026-11-05 02:00:02.157088+02	automatic_backup_2026-11-05T00-00-02-008Z.json	\N	SUCCESS
bb3cb07d-3276-4e1e-a9d7-7ec97a6d61b2	AUTOMATIC	\N	2026-11-06 02:00:01.669795+02	2026-11-06 02:00:01.669795+02	automatic_backup_2026-11-06T00-00-01-227Z.json	\N	SUCCESS
67e432d2-9274-4714-839e-ffd8d986bb45	AUTOMATIC	\N	2026-11-07 02:00:01.213601+02	2026-11-07 02:00:01.213601+02	automatic_backup_2026-11-07T00-00-01-162Z.json	\N	SUCCESS
949a8009-a86f-4b97-a8b6-0e84779558fe	AUTOMATIC	\N	2026-11-08 02:00:03.845961+02	2026-11-08 02:00:03.845961+02	automatic_backup_2026-11-08T00-00-02-920Z.json	\N	SUCCESS
\.


--
-- Data for Name: backup_job_recovery_point; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_job_recovery_point (id, backup_job_id, recovery_point_id, linked_at) FROM stdin;
\.


--
-- Data for Name: curriculum; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.curriculum (id, specialization_id, code, name, valid_from, valid_to, status) FROM stdin;
0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CURR-CTI-2023	Plan Învățământ Calculatoare și Tehnologia Informației - 2023	2023-08-30	\N	ACTIVE
68afd343-656e-4602-a7da-d1d6e70ec860	2d1be959-ddff-42eb-9e43-afdddca62643	CURR-IS-2023	Plan Învățământ Ingineria Sistemelor - 2023	2023-08-30	\N	ACTIVE
77115daf-b96d-498b-be99-34926420cef3	bd2406b8-9e06-499a-94d0-0b4472e0cebf	CURR-AC-2023	Plan Învățământ Automatică și Informatică Aplicată - 2023	2023-08-30	\N	ACTIVE
620d8527-df5a-4b9a-a4ec-070328cfc36c	ef25c7b5-c008-40a2-8f35-59c53f110cf2	sadasdas	sadasdddddddd	2020-08-30	\N	ACTIVE
\.


--
-- Data for Name: curriculum_snapshot; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.curriculum_snapshot (id, curriculum_id, snapshot_date, disciplines_serialized, snapshot_status) FROM stdin;
fbd994de-5086-49c9-bb41-5cf7a137cebf	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2023-08-30	{"version": 1.0, "status": "locked"}	ACTIVE
b0d856f3-251e-4631-a6c9-7e85fd75fc41	68afd343-656e-4602-a7da-d1d6e70ec860	2023-08-30	{"version": 1.0, "status": "locked"}	ACTIVE
daf41d85-9526-4e1a-889b-04cf2235d69d	77115daf-b96d-498b-be99-34926420cef3	2023-08-30	{"version": 1.0, "status": "locked"}	ACTIVE
\.


--
-- Data for Name: data_import_job; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_import_job (id, initiated_by_user_id, source_type, source_name, started_at, finished_at, status, imported_records, rejected_records) FROM stdin;
\.


--
-- Data for Name: data_transformation_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_transformation_rule (id, name, rule_type, input_field, output_field, expression, execution_order, enabled) FROM stdin;
\.


--
-- Data for Name: discipline; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discipline (id, curriculum_id, code, name, semester, evaluation_type, ects_credits, contact_hours) FROM stdin;
d56461fc-716a-4af9-85f1-13fa686472cb	68afd343-656e-4602-a7da-d1d6e70ec860	SYS-001	Sisteme de Operare	1	EXAMEN	5	56
b6381e45-a23b-4599-b1e1-49979ac5e576	68afd343-656e-4602-a7da-d1d6e70ec860	NET-001	Rețele de Calculatoare	1	EXAMEN	5	56
7a9f7903-7671-4f2a-9b0c-11813aa8cd61	68afd343-656e-4602-a7da-d1d6e70ec860	SEC-001	Securitate Cibernetică	2	EXAMEN	4	42
9f7c9cc3-8989-4fde-96ea-2d520ccc10cc	77115daf-b96d-498b-be99-34926420cef3	AUTO-001	Sisteme Automate	1	EXAMEN	5	56
dbad4abb-eb38-495d-9adf-fe50bb954612	77115daf-b96d-498b-be99-34926420cef3	CTRL-001	Teoria Controlului	1	EXAMEN	4	42
e14f1b5a-b719-4412-bf75-65c6703c7894	77115daf-b96d-498b-be99-34926420cef3	SIMU-001	Simulare și Modelare	2	EXAMEN	5	56
06ae96ac-8656-4ace-93b0-d0dec49f8a72	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL101	Analiza matematica	1	EXAMEN	5	56
611b84d6-4327-4f42-b754-36edb5269f5c	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL102	Algebra liniara, geometrie analitica si diferentiala	1	EXAMEN	5	56
7e3f6552-538a-4edd-ad52-435fc70a4d25	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL103	Programarea calculatoarelor si limbaje de programare	1	EXAMEN	5	56
e2c30122-a28c-4809-ba35-979dea6eeca3	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL104	Proiectare logica I	1	EXAMEN	5	56
0e8c9347-1c4b-4883-828d-e07266206ae9	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL105	Fizica I - Elemente generale	1	EXAMEN	4	56
23fde772-9f78-40cb-8552-907ec05d82cb	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL106	Informatica aplicata	1	COLOCVIU	4	56
456b3838-f756-4418-ab36-96986832d404	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL107	Engleza tehnica 1	1	COLOCVIU	2	56
40ce9225-9c1c-4ea3-a284-85b0cfe678b5	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL115	Educatie fizică si sport I	1	COLOCVIU	1	56
eff18891-ce59-4c29-b218-cc5ec1da6722	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL208	Matematici speciale	2	EXAMEN	5	56
bf03eda5-5eb2-451a-b6b2-b5b9dcd0554f	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL209	Grafica asistata de calculator	2	COLOCVIU	4	56
df89e555-8c62-4c51-8467-c6b9b6f5f32c	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL210	Proiectarea algoritmilor	2	EXAMEN	5	56
31feef96-ee8c-45c8-85f8-39a429c6b97e	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL211	Proiectare logica II	2	EXAMEN	5	56
f404fbed-8c52-4faf-968c-66589a81eb71	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL212	Fizică II - Elemente de mecanică	2	EXAMEN	4	56
b4e78772-914a-4f6a-a905-59aded7a9ade	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL213	Fizică III - Electrotehnica	2	EXAMEN	5	56
8165cf30-c51b-4e8d-941a-5bcf0a89c52d	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL214	Engleza tehnica 2	2	COLOCVIU	2	56
cc11e250-4d4f-430a-9793-e8d86d2021c7	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL216	Educatie fizică si sport II	2	COLOCVIU	1	56
0a2f304b-6f0d-4170-be85-e228c3d95e47	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL319	Structuri de date si algoritmi	3	EXAMEN	5	56
6050ee2e-7760-4f2f-8acd-d8c6b1ada6ee	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL320	Arhitectura sistemelor de calcul	3	EXAMEN	5	56
536a66a9-8108-4760-8847-705c8958b7c7	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL321	Programarea orientata pe obiecte	3	EXAMEN	5	56
358b4fdd-d3a4-4f86-9f16-7146a5f6ef38	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL322	Dispozitive electronice si electronica analogica	3	EXAMEN	5	56
d674b0c0-4835-45f3-93e1-9cb12f577dab	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL323	Teoria sistemelor	3	EXAMEN	4	56
6e685025-bd8a-4dc9-aedb-02039a77ad15	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL324	Economie generala	3	COLOCVIU	4	56
e980ce35-ba91-40a1-b697-446c929e350b	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL325	Engleza tehnica 3	3	COLOCVIU	2	56
e348c18d-3644-43b7-9363-426166debb22	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL334	Educatie fizică si sport III	3	COLOCVIU	1	56
ec29f121-3dd2-4a6e-95e3-1d0ad90b39f2	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL426	Structura si organizarea calculatoarelor	4	EXAMEN	4	56
fb1d6c6f-f2d5-42c5-816d-4f8e5b4120cb	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL427	Inteligenta artificiala	4	EXAMEN	4	56
8eac347b-4312-4df2-b71e-65791c3c4497	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL428	Elemente de grafica pe calculator	4	EXAMEN	4	56
8521992f-01a0-4637-9235-253bb6874968	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL429	Proiectarea aplicaţiilor orientate pe obiecte	4	EXAMEN	4	56
864d2dc6-2520-42d0-9c7f-aea31425a3a4	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL430	Metode numerice	4	EXAMEN	4	56
d185755f-f3e6-4b5f-aa66-94069a16c068	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL431	Masuratori electronice, senzori si traductoare	4	COLOCVIU	4	56
b14811e9-9aeb-497b-bdba-6070f5588193	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL432	Engleza tehnica 4	4	COLOCVIU	2	56
fbb76249-94d5-45fc-a217-053dc55d0e2b	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL433	Practica 1 (90 ore)	4	COLOCVIU	4	56
a34e21b5-e83f-49c5-bc75-2d6a2054ec2f	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL538	Electronica digitala	5	EXAMEN	4	56
877de3c3-1889-457c-be39-43235e55b4d9	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL539	Baze de date	5	EXAMEN	5	56
0e10c4e8-0375-488c-a23e-cc5872ae3e39	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL540	Sisteme de operare	5	EXAMEN	5	56
3c72b05d-4f60-4c65-bf09-b5782dc65cf8	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL541	Protocoale de comunicatii	5	EXAMEN	5	56
7eb72ac8-efdb-4d33-9319-2765a97e1044	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL542	Sisteme concurente si distribuite	5	EXAMEN	5	56
06300bef-7fb5-4808-a1d8-d29977cfea47	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL543	Modelare si simulare	5	COLOCVIU	4	56
412265e7-f90e-457a-b827-018932e57071	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL544	Proiect I - Calculatoare numerice	5	COLOCVIU	2	56
59a68013-b5fa-4790-892e-2730e349d4e9	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL645	Algoritmi paraleli si distribuiti	6	EXAMEN	4	56
ca29563e-ffba-4645-912b-9d9c0642108d	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL646	Inginerie software	6	EXAMEN	4	56
e5c7e117-f413-4463-96aa-8a5b07d11a97	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL647	Proiectarea aplicatiilor Web	6	EXAMEN	4	56
2d8a873c-cea2-4287-a0ba-caf58f4fa060	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL648	Retele de calculatoare	6	EXAMEN	4	56
411de866-5bba-46a3-a7c4-2b6ec4bb82a7	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL649	Proiectarea cu microprocesoare	6	EXAMEN	4	56
82e315ae-018c-4b56-b4a0-ac2f95315fab	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL650	Limbaje formale si automate	6	COLOCVIU	4	56
5b9181b1-0051-43c1-a12a-5c89390b3d4f	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL651	Proiect II - Utilizarea bazelor de date	6	COLOCVIU	2	56
8a3610f8-7bdd-4854-a946-74cc311d4993	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL652	Practica 2 (90 ore)	6	COLOCVIU	4	56
456d8841-c890-476b-a423-5e201099af90	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL755	Managementul proiectelor software	7	EXAMEN	5	56
7e73b226-a9a8-4932-957e-2e8a51e3c7e3	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL756	Comert electronic	7	EXAMEN	5	56
0f9a10db-b927-478d-92d8-c23b0c8bf267	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL757	Securitatea datelor	7	EXAMEN	4	56
3fa77956-91a3-4a42-87ca-40c20471adfd	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL760	Invatare automata	7	COLOCVIU	4	56
67ac8093-be8a-4439-9c6e-0db60fc8c57a	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL866	Practica pentru elaborare proiect de diploma	8	COLOCVIU	6	56
90303f18-2f15-416f-a9de-d84c965e4781	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL867	Calcul mobil	8	EXAMEN	4	56
91ccfb68-5b85-4704-80e9-cfa65df7b88b	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL876	Elaborare proiect de diploma	8	COLOCVIU	4	56
c2e8f84b-d600-4cb6-9fb7-77de9cf52b8e	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	D27CRL879	Sustinere proiect diploma	8	EXAMEN	10	56
d192cbed-d144-4863-ba05-b42e73aa68ab	620d8527-df5a-4b9a-a4ec-070328cfc36c	AMAMMAMA0000001	Am Invatat AI	5	EXAMEN	5	56
\.


--
-- Data for Name: document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.document (id, author_id, title, type, status, created_at, content, file_path, original_filename, assigned_to_user_id, revision_notes) FROM stdin;
65b13766-9a5b-44d0-a346-00f6f49f3c06	65cbf637-fde9-4a43-954f-a8806682d462	Plan invățământ CTI 2025-2026	PDF	APPROVED	2026-04-30 13:22:55.217+03	Plan aprobat CTI 2025-2026.	\N	\N	\N	\N
b020bb32-8942-4680-9eb4-19ceea350924	65cbf637-fde9-4a43-954f-a8806682d462	Raport prezențe IS An 3 – Sem 2	CSV	APPROVED	2026-04-30 13:22:55.217+03	student_id,discipline,absente\nMAT0011,Automatizări,2	\N	\N	\N	\N
ab0a8c07-8b51-4928-ac56-11f062e9158f	65cbf637-fde9-4a43-954f-a8806682d462	Centralizator note CTI An 1 – Sem 1	XLS	APPROVED	2026-04-30 13:22:55.217+03	Centralizator CTI An 1 Sem 1.	\N	\N	\N	\N
1d8232f6-b8cb-4142-8db2-f8a2b5d882d3	65cbf637-fde9-4a43-954f-a8806682d462	Structura an universitar 2025-2026	PDF	APPROVED	2026-04-30 13:22:55.217+03	Sem1: Oct-Ian | Sem2: Feb-Iun.	\N	\N	\N	\N
e6b83f50-8f25-4291-82a0-c27f72d39e45	65cbf637-fde9-4a43-954f-a8806682d462	Regulament de examinare 2025-2026	PDF	APPROVED	2026-04-30 13:22:55.217+03	Regulament examene 2025-2026.	\N	\N	\N	\N
62412179-6803-40dc-8be3-ddb31d0a4513	\N	blocuri comuniste	info	REJECTED	2026-05-01 14:08:30.713+03	blocuri comuniste	file-1777633710622-434640698.pdf	Analiza-blocurilor-comuniste.pdf	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	\N
76f1236d-7087-471b-b910-b1e372982b02	4197ae30-6bd6-40e5-b664-518f8e58cff2	ss	ss	APPROVED	2026-05-04 08:44:50.367+03	ss	file-1777873490359-277535579.pptx	AFSMS_Presentation.pptx	\N	\N
f0f3d2a9-acae-4425-b2a7-944583b911e4	65cbf637-fde9-4a43-954f-a8806682d462	Prezentare Powerpoint AFSMS	REQUIREMENT	APPROVED	2026-05-05 16:32:50.189+03	Prezentare Powerpoint AFSMS	file-1777987970184-352639072.pptx	AFSMS_Presentation.pptx	\N	\N
bbdbf7fc-3053-49cb-8b49-4b96c70948df	65cbf637-fde9-4a43-954f-a8806682d462	Walkrough Complet AFSMS	GUIDE	APPROVED	2026-05-05 16:33:27.134+03	AFSMS — Comprehensive Walkthrough Guide\nAutomated Faculty Student Management System\nProject P9-T4 · Sugubete, Maximilian, Mitrache\nWhat Is This System?\nAFSMS (Automated Faculty Student Management System) is a full-stack web application built for\nthe Faculty of Automation, Computers and Electronics at the University of Craiova. It man-\nages the complete academic lifecycle: student records, curricula, grades, document workflows,\naudit trails, backups, and notifications — all in one place, behind a role-based access control\nsystem that mirrors the real university structure.\nThe system has two halves: a React + Vite frontend deployed as a GitHub Pages SPA, and a\nNode.js / Express backend connected to a PostgreSQL database.\n1 Part 1 — The Database Layer (Bottom)\nEverything starts here. The schema is in src/schema.sql and defines 8 logical modules.\nModule 1 — Security & Users\nThe foundation of all access control.\n• ROLE — defines the four roles in the system: STUDENT, PROFESSOR, SECRETARIAT, ADMIN. Each\nrole has a unique code used throughout the backend for permission checks.\n• PERMISSION / OPERATION — fine-grained action definitions (e.g., READ_GRADES, EXPORT_REPORT)\nthat can be linked to roles via ROLE_PERMISSION and ROLE_OPERATION junction tables.\n• USER_ACCOUNT — every person in the system has a record here. The critical field is sso_subject,\na unique identifier that comes from the university’s SSO (Single Sign-On) system. This is\nwhat ties a university identity to an AFSMS account. The field account_status can be ACTIVE\nor SUSPENDED.\n• USER_ROLE — maps users to roles. A user has exactly one active role at a time.\n• AUTH_SESSION — stores session tokens with expiry and IP address for traceability.\n• USER_GROUP / USER_GROUP_MEMBER — a simple grouping mechanism used for mass email\nnotifications. A group like “Year 1 CTI” contains user accounts.\n• OUTLOOK_NOTIFICATION — records of every bulk email sent through the system, including\nrecipient list, subject, body preview, and delivery status.\n1\n\n-- 1 of 13 --\n\nModule 2 — Academic Data\nThe core of what makes the system academic.\n• ACADEMIC_YEAR — records like 2025/2026. Only one can be is_active = TRUE at a time.\nUsed as a reference point for curricula and reports.\n• SPECIALIZATION — a program of study (e.g., “Calculatoare și Tehnologia Informației”, “Au-\ntomatică și Informatică Aplicată”). Has a degree_level field (LICENTA, MASTER).\n• STUDY_FORMATION — a specific group of students, e.g., “CTI Year 2 Group A”. Has study_year,\neducation_form (ZI/ID/IFR), and group_index.\n• STUDENT — the student record, linked to a study formation. Contains registration_number\n(e.g. MAT1234), names, email, enrollment date, and status (ENROLLED, ACTIVE, GRADUATED,\nWITHDRAWN).\n• CURRICULUM — a plan of study for a specialization, with a valid_from date. Can be snap-\nshotted.\n• CURRICULUM_SNAPSHOT — an immutable copy of a curriculum at a point in time. Used to\npreserve the rules a student was enrolled under, even after the curriculum changes.\n• DISCIPLINE — a course/subject belonging to a curriculum. Has semester, ects_credits,\nand evaluation_type (EXAM, COLLOCVIU, VP).\n• STUDENT_CURRICULUM — the enrollment record: which student is in which curriculum, under\nwhich study formation.\n• GRADE — the result. Linked to a student, a discipline, and optionally a curriculum snapshot.\nFields: value (1–10, 0 = absent), exam_session, grading_date, and graded_by_user_id (the\nprofessor who entered it).\n• DATA_IMPORT_JOB — records of bulk Excel/CSV imports, so you know when a batch of grades\nwas uploaded and by whom.\nModule 3 — Documents\nDOCUMENT — a file or record that goes through an approval workflow. Has type, status (DRAFT,\nPENDING, APPROVED, REJECTED, MODIFICATION), author_id, assigned_to_user_id, file_path, and\ncontent (extracted text for full-text search). Supports physical file storage on disk.\nModule 4 — Reports\n• REPORT_DEFINITION — a named, reusable report template (e.g., “Electronic Grade Central-\nizer”). Has visibility (PUBLIC / PRIVATE).\n• REPORT_REQUEST — an instance of running a report, with filters stored as JSON.\n• E_GRADE_CENTRALIZER — the specific data model for the grade centralizer report.\n• REPORT_ROW — individual rows of a generated report.\n• REPORT_EXPORT — tracks every time a report was exported (PDF, CSV, XLSX, XML), by whom,\nand where the file was stored.\n2\n\n-- 2 of 13 --\n\nModule 5 — Audit & Recovery\nThe most architecturally interesting module.\n• AUDIT_LOG_ENTRY — the central ledger. Every create, update, and delete in the system\nwrites a record here with: actor_user_id, action_type (INSERT, UPDATE, DELETE, ROLL-\nBACK, PITR), entity_type (the table name), entity_id, before_snapshot_json, and after_snapshot_jso\nThis is what makes rollback possible.\n• AUDIT_LOG_ARCHIVE — a mirror table. Logs older than 5 years are automatically moved\nhere (not deleted), satisfying the institutional 5-year retention policy.\n• BACKUP_JOB — records of every backup run: type (AUTOMATIC, MANUAL), start/end times,\nstorage location (a JSON file path), and status.\n• BACKUP_CONFIG — a single-row table controlling the backup scheduler: enabled (boolean),\ncron_expression (e.g., 0 2 * * * for 2 AM daily).\n• RECOVERY_POINT / ROLLBACK_OPERATION — structural tables for tracking recovery operations.\nModule 6 — System Configuration\nSYSTEM_SETTING — a key-value store for institutional metadata: faculty name, institution name,\ndean’s name, system email, portal notices. Editable by Admin from the UI.\nPerformance Indexes\nThe schema defines indexes on the most-queried paths: STUDENT(registration_number), STUDENT(study_fo\nGRADE(student_id), DOCUMENT(author_id, type, created_at), AUDIT_LOG_ENTRY(entity_type,\nentity_id), AUDIT_LOG_ENTRY(actor_user_id), AUDIT_LOG_ENTRY(occurred_at).\n2 Part 2 — The Backend\nThe backend is a Node.js / Express 5 application (backend/src/server.js). It listens on port\n8080 (configurable via PORT env variable) and exposes a REST API under /api/.\nServer Bootstrap\nOn startup, the server does three things before taking requests:\n1. Initializes the scheduler (schedulerService.initScheduler()), which reads BACKUP_CONFIG\nfrom the database and either starts a cron job for automatic backups or skips it. It also\nalways schedules the audit log archiving job (runs daily at 1 AM).\n2. Applies security headers to every response: X-Content-Type-Options: nosniff, X-Frame-\nOptions: DENY, Referrer-Policy: strict-origin-when-cross-origin, a minimal CSP, and\nremoves X-Powered-By.\n3\n\n-- 3 of 13 --\n\n3. Initializes the SYSTEM_SETTING table with default values (faculty name, dean name, etc.)\non first run, using ON CONFLICT DO NOTHING so it never overwrites saved values.\nCORS is controlled by the ALLOWED_ORIGINS environment variable (comma-separated list). The\nfrontend origin (http://localhost:5173 for dev and the GitHub Pages URL for production) is\nalways allowed.\nA UTF-8 middleware intercepts every response and ensures application/json and application/xml\ncontent types always include ; charset=utf-8, which is essential for Romanian diacritics (ș, ț,\nă, â, î).\nDatabase Layer (src/db.js)\nWraps pg.Pool from the pg package. Key exports: db.query(sql, params) for simple queries\nand db.transaction(async (client) => {...}) for atomic multi-step operations. The trans-\naction helper manages BEGIN / COMMIT / ROLLBACK automatically.\nConnection string is assembled from DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD environ-\nment variables.\nMiddleware\nauthMiddleware.js exports two functions:\nrequireAuth — extracts the Authorization: Bearer <token> header, verifies the JWT against\nJWT_SECRET, and attaches { userId, role, fullName } to req.user. Returns 401 if missing, 403\nif invalid or expired.\nrequireRole(allowedRoles) — a factory that returns middleware checking whether req.user.role\nis in the provided array. Returns 403 if not. Used on every route that has access restrictions.\nerrorHandler.js — the global error handler (last middleware). Formats all errors into a con-\nsistent { error: true, message, code } JSON structure. Recognizes PostgreSQL error codes\n(e.g., 23505 for unique violations, 23503 for FK violations) and maps them to user-friendly mes-\nsages with resolution hints. Also recognizes custom error properties (err.customMessage, err.customCode)\nset by the audit service.\nRoutes Overview\nAll routes are prefixed /api/. Here is what each file owns:\n• /api/mock-sso — simulates the university’s Identity Provider. Accepts a login request with\nemail, role, and full_name, and issues a signed JWT (SSO_MOCK_SECRET) that the frontend\ncan then exchange for a real AFSMS session token. This exists only because the real uni-\nversity SSO is not publicly accessible.\n• /api/auth — handles two flows:\n– POST /exchange-token — the main login flow. Receives the SSO token, verifies it, finds\nor creates the user in USER_ACCOUNT, syncs the role, auto-creates the STUDENT record if\nthe role is STUDENT, and issues an AFSMS JWT (JWT_SECRET, 8-hour expiry).\n– POST /register — a direct registration path (no SSO), assigns STUDENT role by default.\n4\n\n-- 4 of 13 --\n\n• /api/academic — the largest route file (∼49 KB). Covers:\n– GET /dashboard/stats — role-aware statistics for the dashboard card grid. Each role\nsees different numbers.\n– Student CRUD: list, add, update, delete, import from Excel/CSV.\n– Curriculum CRUD: list, add, update, delete, snapshot.\n– Discipline CRUD: list, add, update, delete.\n– Study Formation CRUD.\n– Grade entry: add individual grade, bulk Excel import, fetch grades per student or\ndiscipline.\n• /api/admin — ADMIN-only (except user listing which is also accessible to SECRETARIAT and\nPROFESSOR for the document forward workflow):\n– Role management (create, update, delete roles).\n– User management (create, update, delete users, assign roles, suspend accounts).\n– Backup management (trigger manual backup, list backup history, download backups,\nupdate backup schedule, restore from a JSON backup file).\n• /api/audit — the audit and recovery endpoints:\n– GET / — paginated list of audit log entries, joined with user names.\n– POST /rollback/:logId — reverses a single audit log entry (undo an INSERT by delet-\ning, undo an UPDATE by restoring before_snapshot_json, undo a DELETE by re-inserting).\n– POST /pitr — Point-in-Time Recovery. Takes a targetTimestamp and replays all audit\nlog entries after that timestamp in reverse order, effectively winding the database\nback.\n• /api/documents — document lifecycle:\n– GET / — advanced search with filters (type, author, date range, content keyword, au-\nthor keyword).\n– POST / — upload a new document with file. Extracts text from PDF, DOCX, XLSX, TXT,\nCSV, XML for full-text search.\n– PUT /:id/status — update document status (approve, reject, request modification).\n– PUT /:id/forward — forward document to a specific user.\n– PUT /:id/reupload — replace the file on a document in MODIFICATION status.\n– GET /download/:id — stream the file to the browser.\n– DELETE /:id — soft-delete the record and remove the physical file.\n• /api/reports — the centralizer and export engine:\n– GET /centralizer — runs the master query that joins students, formations, disci-\nplines, and grades through a dynamic filter set (specialization, study year, education\nform, semester, discipline, group index, academic year, degree level, and free-text\nsearch). Returns the raw data.\n– GET /centralizer/export — same query, but exports to CSV, XLSX, or XML depending\non format query param.\n– GET /transcript/:studentId — generates a full academic transcript for a student.\n• /api/notifications — mass email:\n5\n\n-- 5 of 13 --\n\n– POST /send — resolves recipients (either a USER_GROUP or a STUDY_FORMATION), calls the\nconfigured email service, and logs the send in OUTLOOK_NOTIFICATION.\n• /api/groups — user group management (CRUD for groups and members).\n• /api/lookup — read-only reference data endpoint. Returns formations, specializations,\nacademic years, and curricula in lightweight format for populating dropdowns in the UI.\n• /api/public — unauthenticated endpoint exposing a portal notice and the faculty/institu-\ntion name from SYSTEM_SETTING, used by the public-facing landing page.\n• /api/config — ADMIN-only system configuration:\n– System settings (key-value pairs).\n– Academic year management.\n– Specialization management.\n– Backup schedule configuration (enable/disable, set cron expression).\nServices\nauditService.js — the backbone of data integrity. Provides:\n• logAudit(client, actorUserId, actionType, moduleName, entityType, entityId, before,\nafter) — the raw insert function. Always called inside a transaction using the same client\nso the audit entry and the data change are atomic.\n• auditableUpdate(actorUserId, moduleName, tableName, id, updateFields) — fetches the\nbefore snapshot, performs the UPDATE, then logs.\n• auditableInsert(actorUserId, moduleName, tableName, insertFields) — performs the\nINSERT, then logs with null before snapshot.\n• auditableDelete(actorUserId, moduleName, tableName, id) — fetches before snapshot,\nperforms the DELETE, then logs with null after snapshot.\n• archiveOldLogs() — moves entries older than 5 years from AUDIT_LOG_ENTRY to AUDIT_LOG_ARCHIVE.\nEvery data-modifying route in the system that goes through one of these functions automati-\ncally gets a full audit trail with before/after snapshots.\nbackupService.js — iterates through the TABLES_TO_BACKUP list (16 tables), dumps all rows from\neach as JSON, writes a timestamped file to backend/backups/, and records the backup job in\nBACKUP_JOB.\nschedulerService.js — uses node-cron to manage two scheduled jobs:\n• Automatic backup — reads BACKUP_CONFIG on startup and starts a cron job if enabled.\n• Audit archiving — always scheduled, runs daily at 1 AM.\nProvides updateSchedule(cronExpression, enabled) called by the admin backup config route.\nemailService.js — a router that selects the right implementation based on environment vari-\nables: Graph API (graphEmailService.js) for Microsoft 365 integration, SMTP (smtpEmailService.js)\n6\n\n-- 6 of 13 --\n\nfor standard mail servers, or Mock (mockEmailService.js) for development (just logs to con-\nsole). The sendBulk({ from, recipients, subject, text, html }) interface is the same re-\ngardless of implementation.\nimportService.js — parses Excel/CSV grade sheets uploaded by professors and bulk-inserts\ngrades with proper validation and audit logging.\n3 Part 3 — Authentication Flow\nUnderstanding how a user logs in is key to understanding the whole system.\n1. The user lands on the AFSMS login page and clicks “Login via University SSO”.\n2. The frontend calls POST /api/mock-sso/login with email and role. The mock SSO returns\na signed JWT (ssoToken).\n3. The frontend immediately calls POST /api/auth/exchange-token with that ssoToken.\n4. The backend verifies the SSO token signature, looks up or creates the user in USER_ACCOUNT,\nsyncs the role from the SSO claims, auto-creates a STUDENT record if needed, and issues a\nnew short-lived AFSMS JWT (8 hours).\n5. The frontend stores this AFSMS token in the AuthContext and sends it as Authorization:\nBearer <token> on every subsequent API call.\n6. requireAuth verifies every protected request. requireRole enforces access control per\nroute.\nIn production with a real university SSO, only step 2 changes — the frontend redirects to the\nreal Identity Provider, which redirects back with a real token. Steps 3–6 remain identical.\n4 Part 4 — The Frontend\nThe frontend is a React 18 + Vite SPA with React Router v6, deployed to GitHub Pages. No UI\ncomponent library — all styling is custom CSS.\nContexts\nAuthContext — wraps the entire app. Stores the decoded user object ({ userId, role, fullName\n}), the raw token, and provides login() / logout() methods. login() stores the token in localStorage;\non page refresh it reads the token back and re-validates it.\nLanguageContext — provides { t, language, setLanguage }. The t(key) function looks up a\nkey in the translations.js map (supports en and ro). Used across all pages and navigation to\nsupport bilingual display.\n7\n\n-- 7 of 13 --\n\nRouting (App.jsx)\nRoutes fall into three categories:\nPublic — accessible to anyone (no authentication required):\n• / — PublicPortal (the landing page for unauthenticated visitors)\n• /login — Login\n• /register — Register\n• /system-diagrams — SystemDiagramsPage (architecture diagram viewer)\nProtected — requires any authenticated user. Wrapped in ProtectedRoute which redirects to\n/login if no token:\n• /dashboard, /documents, /privacy, /contact, /help, /shortcuts, /docs/:role?\nRole-restricted — inside the protected zone but additionally checked by RoleRoute:\n• /my-grades — STUDENT only\n• /students — PROFESSOR, SECRETARIAT, ADMIN\n• /disciplines — ADMIN, SECRETARIAT\n• /grades/list — PROFESSOR, ADMIN, SECRETARIAT\n• /centralizer — SECRETARIAT, ADMIN\n• /groups — SECRETARIAT, ADMIN\n• /audit — ADMIN only\nPage-by-Page Tour\nPublicPortal — The unauthenticated landing page. Fetches the portal notice and institution\nname from /api/public. Shows the faculty branding and a call to action to log in.\nLogin — Presents a form. On submit it calls the mock SSO then exchanges the token. On suc-\ncess, updates AuthContext and navigates to /dashboard.\nRegister — Direct registration (non-SSO path). Creates a user account with STUDENT role.\nDashboard — The home screen after login. Shows a role-specific stats grid (different cards de-\npending on whether you’re an Admin, Secretariat, Professor, or Student) and a recent activity\nfeed pulled from the audit log. Has offline detection — if navigator.onLine is false or the net-\nwork call fails, it shows an offline banner with a retry button.\nStudents — Available to PROFESSOR, SECRETARIAT, ADMIN. Lists all students from /api/academic/students\nwith their formation name, enrollment status, and plan count. Supports add, edit, delete, and\nbulk Excel/CSV import. Professors see a read-only view.\nDisciplines — Available to ADMIN and SECRETARIAT. Manages curricula and their disciplines.\nAllows creating curricula for specializations, adding/editing/deleting disciplines, and taking cur-\nriculum snapshots.\n8\n\n-- 8 of 13 --\n\nGradesList — Available to PROFESSOR, ADMIN, SECRETARIAT. Allows entering and viewing grades\nby student and discipline. Professors see their own grades; Secretariat and Admin can see all.\nSupports bulk import from Excel.\nMyGrades — STUDENT only. Displays the authenticated student’s grades, GPA, ECTS credits\nearned, and their percentile rank among all students.\nCentralizer — Available to SECRETARIAT and ADMIN. A powerful filtered view of all grades\nacross the faculty. Filters: specialization, degree level, study year, education form, semester,\ngroup, curriculum, discipline, academic year, and free-text search. Results can be exported\nto PDF (client-side generation via pdfUtils.js / centralizerGenerator.js), CSV, XLSX, or XML\n(server-side). The PDF generation uses jsPDF or a custom utility that formats the data as a styled\ntable.\nDocuments — Available to all authenticated users (with role-appropriate actions). Students can\nsubmit documents (upload files). Professors and Secretariat can review, approve, reject, request\nmodifications, and forward documents to other users. Full-text search across title and content.\nSupports downloading the original file.\nUserGroups — Available to SECRETARIAT and ADMIN. Create and manage user groups, add/re-\nmove members. Groups are used as targets for mass notification emails.\nAuditLogs — ADMIN only. Paginated table of all audit log entries showing actor, action type,\nmodule, entity type, entity ID, and timestamp. Expanding a row reveals the before/after JSON\nsnapshots. Two recovery actions available per row: Single Rollback (undo that one action) and\nPoint-in-Time Recovery (restore the entire database to the state at that entry’s timestamp).\nDashboard for Admin specifically shows: total users, total students, active curricula, and audit\nactions in the last 24 hours.\nDocumentation — a role-aware help page rendered from structured content. Shows different\nsections based on the role route parameter, so each type of user can navigate directly to their\nrelevant docs.\nHelp, Contact, Privacy, Shortcuts — informational pages. Shortcuts renders the keyboard\nshortcut map from the useKeyboardShortcuts hook.\nFrontend Services (src/services/api.js)\nAn Axios instance pre-configured with baseURL (pointing to the backend, configurable via VITE_API_URL\nenv var) and a request interceptor that automatically injects the Authorization: Bearer header\nfrom localStorage. Exports named service objects: auditService, adminService, academicService,\ndocumentsService, reportsService, etc., each wrapping the relevant API endpoints.\nUtilities\ntranslations.js — the full bilingual string map. Every user-visible string has an en and ro key.\nconstants.js — shared enumerations like document types, status values, and role lists. Kept\nin sync between frontend and backend.\npdfUtils.js / centralizerGenerator.js / transcriptGenerator.js — client-side PDF/document\ngeneration utilities. Used by the Centralizer and the student transcript feature to generate\ndownload-ready documents directly in the browser without a server round-trip.\nmockData.js — seed data used for offline/demo mode and testing.\n9\n\n-- 9 of 13 --\n\nuseKeyboardShortcuts.js — a custom React hook that registers global keyboard shortcuts (e.g.,\nAlt+D for dashboard, Alt+S for students) and cleans them up on unmount.\n5 Part 5 — Data Integrity: The Audit & Rollback System\nThis is the most distinctive engineering choice in the project.\nHow It Works\nEvery write operation (INSERT, UPDATE, DELETE) that flows through auditableInsert, auditableUpdate,\nor auditableDelete in auditService.js captures a JSON snapshot of the record’s state before\nand after the operation, within the same database transaction. If the transaction rolls back, the\naudit entry also rolls back.\nThis means AUDIT_LOG_ENTRY is a complete history of every row in the system.\nSingle-Record Rollback\nWhen an Admin clicks “Rollback” on an audit log entry:\n1. The POST /api/audit/rollback/:logId endpoint fetches the log entry.\n2. If the original action was INSERT: it deletes the record (undoing the creation).\n3. If the original action was UPDATE: it restores the before_snapshot_json columns to the\nrecord.\n4. If the original action was DELETE: it re-inserts the before_snapshot_json back into the table.\n5. The rollback itself is logged as a new audit entry (action type ROLLBACK_INSERT, ROLLBACK_UPDATE,\nor ROLLBACK_DELETE), so the rollback is itself auditable and reversible.\nThe implementation validates entity_type against a whitelist (STUDENT, GRADE, USER_ACCOUNT,\nDOCUMENT, STUDY_FORMATION, DISCIPLINE) to prevent SQL injection.\nPoint-in-Time Recovery (PITR)\nThis is the full database rewind feature. When triggered with a targetTimestamp:\n1. All AUDIT_LOG_ENTRY records with occurred_at > targetTimestamp are fetched in descend-\ning order (most recent first).\n2. Each entry is reversed: INSERTs become DELETEs, UPDATEs restore their before_snapshot_json,\nDELETEs re-insert their before_snapshot_json.\n3. The entire operation is wrapped in a single database transaction — either all reversals\nsucceed or none do.\n4. A PITR log entry is written recording who triggered it, the target timestamp, and how many\nactions were reversed.\nThis effectively winds the database back to a consistent snapshot at any point for which audit\nlogs exist.\n10\n\n-- 10 of 13 --\n\nBackup System\nThe backup system is a complement to the audit system. While audit logs allow surgical rollback,\nbackups provide a full safety net:\n• Manual backup — triggered from the Admin UI, calls createBackup() which dumps all 16\ntables to a timestamped JSON file in backend/backups/.\n• Automatic backup — scheduled via cron expression configured in the Admin UI. The\nscheduler reads BACKUP_CONFIG on startup.\n• Restore from backup — the Admin can upload a backup JSON file; the system truncates\naffected tables and re-inserts all rows from the snapshot.\n• Audit archiving — runs daily at 1 AM. Logs older than 5 years are moved to AUDIT_LOG_ARCHIVE\nto manage active table size while satisfying the institutional 5-year retention policy.\n6 Part 6 — The Email Notification System\nThe system supports three email backends, selected at startup by environment variable:\nGraph API (graphEmailService.js) — uses @microsoft/microsoft-graph-client with Azure iden-\ntity credentials to send via Microsoft 365. Configured by AZURE_TENANT_ID, AZURE_CLIENT_ID,\nAZURE_CLIENT_SECRET, GRAPH_SENDER_EMAIL.\nSMTP (smtpEmailService.js) — uses nodemailer with standard SMTP credentials. Configured\nby SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.\nMock (mockEmailService.js) — logs the email payload to the console. Used in development.\nThe emailService.js router checks for the presence of the Azure credentials first; if not found,\nfalls back to SMTP; if not found, falls back to Mock.\nThe notification flow: Admin or Secretariat selects a group (from USER_GROUP) or a study forma-\ntion, writes a subject and body, and clicks Send. The backend resolves the member emails, calls\nemailService.sendBulk(), and records the send in OUTLOOK_NOTIFICATION.\n7 Part 7 — The Document Workflow\nDocuments go through a defined lifecycle:\n1. Any authenticated user uploads a document (POST /api/documents). Status becomes DRAFT.\n2. The uploader or a Secretariat/Admin changes the status to PENDING to submit it for review.\n3. Secretariat or Admin reviews it:\n• APPROVED — document is accepted.\n• REJECTED — document is declined (with optional revision notes).\n• MODIFICATION — document is sent back with revision notes.\n4. If MODIFICATION, the author can re-upload a new file version (PUT /:id/reupload). Status\nresets to PENDING.\n11\n\n-- 11 of 13 --\n\n5. A document can also be forwarded to a specific user (PUT /:id/forward), setting assigned_to_user_id.\nAll status changes go through auditableUpdate so the full workflow history is in the audit log.\nFile storage: uploaded files are stored on disk under backend/uploads/. The system accepts\nPDF, DOCX, XLSX, CSV, XML, TXT, images, PPT, ZIP, RAR, and video files. For PDF, DOCX, XLSX,\nTXT, and CSV uploads, the system extracts text content and stores it in the content column for\nfull-text search.\n8 Part 8 — Reports & The Centralizer\nThe grade centralizer is the main reporting feature. It is a dynamic, filtered view of the intersec-\ntion of students, disciplines, and grades.\nThe backend query (getCentralizerData in reports.js) performs a complex multi-join: it starts\nfrom STUDENT, joins through STUDENT_CURRICULUM → STUDY_FORMATION → CURRICULUM → SPECIALIZATION,\nthen uses a lateral join to get all disciplines either from the curriculum or from existing grades\nfor that student. Grades are outer-joined so students without grades still appear.\nFilters available: specialization, degree level, study year, education form, curriculum, discipline,\ngroup index, academic year, semester, evaluation type, and a free-text code/name search.\nExport formats:\n• CSV — via PapaParse, flat rows.\n• XLSX — via the xlsx library, formatted workbook.\n• XML — via xml2js, structured document.\n• PDF — generated client-side via the centralizerGenerator.js utility.\nThe student transcript (GET /api/reports/transcript/:studentId) generates a per-student aca-\ndemic record with all grades organized by semester and curriculum.\n9 Part 9 — Configuration & System Settings\nThe Admin has access to a configuration panel (routes under /api/config, frontend in the Dash-\nboard admin section) covering:\nSystem Settings — edit the key-value store: faculty name, institution name, dean name, dean\nsecretary, system email, portal notice. These values are consumed by the public portal and\nembedded in generated documents.\nAcademic Years — create and manage academic year records. Setting one as is_active auto-\nmatically deactivates all others.\nSpecializations — manage academic programs. Toggle active/inactive, set degree level.\nBackup Schedule — toggle automatic backups on/off and configure the cron expression. Changes\ntake effect immediately (the scheduler updates its live job).\n12\n\n-- 12 of 13 --\n\n10 Part 10 — How to Run the Project\nPrerequisites: Node.js 18+, PostgreSQL 15+.\nBackend setup:\n1. Navigate to backend/.\n2. Copy .env.example to .env and fill in DB_* variables, JWT_SECRET, SSO_MOCK_SECRET, and\noptionally email credentials.\n3. Run npm install.\n4. Create the database schema by running src/schema.sql against your PostgreSQL instance.\n5. Optionally run any seed_*.js scripts for initial data.\n6. Start with npm run dev (nodemon) or npm start.\nFrontend setup:\n1. From the project root.\n2. Copy .env.example to .env.local and set VITE_API_URL to your backend URL (e.g., http://localhost:8\n3. Run npm install.\n4. Start with npm run dev (opens on port 5173 by default).\nFirst login: The mock SSO endpoint (POST /api/mock-sso/login) accepts { email, role, full_name\n}. Use role ADMIN for full access on first setup. The frontend’s login page calls this automatically\nwhen you click the SSO login button.\nSummary: Architecture in One Paragraph\nAFSMS is a layered system. At the bottom is a PostgreSQL schema organized into six func-\ntional modules (security, academics, documents, reports, audit/recovery, configuration). The\nNode.js/Express backend sits on top, exposing a versioned REST API that enforces JWT authen-\ntication and role-based access control on every route. All writes are mediated through the audit\nservice, which captures before/after snapshots within the same transaction, enabling single-\nrecord rollback and full point-in-time database recovery. The React frontend consumes this API\nthrough an Axios service layer, routes users based on their role, and provides specialized pages\nfor each persona — students see their grades, professors manage grade entry, secretariat han-\ndles students and documents, and the admin has full visibility including the audit log and system\nconfiguration.\nEnd of AFSMS Walkthrough Guide\n13\n\n-- 13 of 13 --\n\n	file-1777988007133-62277626.pdf	AFSMS Walkthrough Guide.pdf	\N	\N
\.


--
-- Data for Name: e_grade_centralizer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.e_grade_centralizer (id, report_request_id, specialization_id, academic_year_id, study_year, education_form, ordering, generated_at) FROM stdin;
\.


--
-- Data for Name: grade; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.grade (id, student_id, discipline_id, academic_year_id, curriculum_snapshot_id, graded_by_user_id, value, exam_session, grading_date, source, validated) FROM stdin;
43b36fba-de38-4c28-94cd-bb1f01aee05b	daade39c-1087-47d9-b3b8-3c090b0c8a37	31feef96-ee8c-45c8-85f8-39a429c6b97e	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	9.30	IARNA	2026-04-29	MANUAL	t
ad772f1f-eb50-45ca-8718-6f497f2c2191	daade39c-1087-47d9-b3b8-3c090b0c8a37	ca29563e-ffba-4645-912b-9d9c0642108d	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	4.00	VARA	2026-04-29	MANUAL	t
f2a6fb78-97a0-49ca-a511-2a3bea2876e4	15dd0140-3cd2-42ba-a820-f0cfd055bc68	e2c30122-a28c-4809-ba35-979dea6eeca3	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	3.00	IARNA	2026-04-29	MANUAL	t
bafc4e56-d97d-4413-9e1e-7bfc299c72e3	daade39c-1087-47d9-b3b8-3c090b0c8a37	e980ce35-ba91-40a1-b697-446c929e350b	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	4.00	VARA	2026-04-29	MANUAL	t
fa6bcd18-32bb-452b-9823-e9b27b37ebd0	5ca4d768-d4d9-4545-afcf-6f38c01958ca	06300bef-7fb5-4808-a1d8-d29977cfea47	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	6.00	VARA	2026-04-29	MANUAL	t
80ce7fae-1bd9-43ac-8174-892ec98f26b0	5ca4d768-d4d9-4545-afcf-6f38c01958ca	8165cf30-c51b-4e8d-941a-5bcf0a89c52d	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	5.00	VARA	2026-04-29	MANUAL	t
12196e95-fc97-422e-9d25-7240a9fe3783	5c60534a-63df-45ee-a9b1-85fb09cb1c78	91ccfb68-5b85-4704-80e9-cfa65df7b88b	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	10.00	SUMMER	2026-04-29	MANUAL	t
0df0b23c-2ee0-4c9c-bd27-36eea27d1f2f	fb8e5778-ab4c-45d1-b26d-6b0930f56f87	cc11e250-4d4f-430a-9793-e8d86d2021c7	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	8.00	WINTER	2026-04-29	MANUAL	t
28cdad92-b849-4dbd-9a7e-70f74b7f3d8d	ac64775c-28a2-4435-997c-c5602bd31d3d	e2c30122-a28c-4809-ba35-979dea6eeca3	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	\N	0.00	IARNA	2026-04-26	MANUAL	t
b7ed3f5d-dfae-4b0d-97f9-11f24f2182d4	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	456b3838-f756-4418-ab36-96986832d404	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	8c7932d4-e1b5-48a8-b3dd-accbf190617f	5.00	SUMMER	2026-05-02	MANUAL	t
15a02caf-4e4a-44b5-8d09-4734c69ce015	daade39c-1087-47d9-b3b8-3c090b0c8a37	3fa77956-91a3-4a42-87ca-40c20471adfd	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	898080e7-dbe3-4e20-990c-931c42585cab	4.00	WINTER	2026-05-02	MANUAL	t
b40efb93-188b-4bc5-9f9c-cfc92a7a9a68	f7f9f04b-84b0-4964-8d50-a2b540a52b99	06ae96ac-8656-4ace-93b0-d0dec49f8a72	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	8c7932d4-e1b5-48a8-b3dd-accbf190617f	10.00	WINTER	2026-05-04	MANUAL	t
28cd3e34-ff2a-408e-a85c-71f75cffc0b1	4aa172c4-e325-473f-b70c-28f1cfd77aa7	3c72b05d-4f60-4c65-bf09-b5782dc65cf8	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	f9b7a621-1309-482d-9d06-5f6b8e4283c1	5.00	WINTER	2026-05-04	MANUAL	f
47c71c77-84cf-4ca4-8ffa-8be29627e777	b35f25a3-5b21-43f9-971a-b0fc1ac2809f	3c72b05d-4f60-4c65-bf09-b5782dc65cf8	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	f9b7a621-1309-482d-9d06-5f6b8e4283c1	6.00	WINTER	2026-05-04	MANUAL	f
56c09d6d-a8fc-445b-8e45-26868ad6d0d5	daade39c-1087-47d9-b3b8-3c090b0c8a37	3c72b05d-4f60-4c65-bf09-b5782dc65cf8	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	f9b7a621-1309-482d-9d06-5f6b8e4283c1	1.00	WINTER	2026-05-04	MANUAL	t
7b06af27-d66b-4862-842e-81a361cb07c9	6b0ba2f3-59c4-4065-8988-f300f82b6e6e	bf03eda5-5eb2-451a-b6b2-b5b9dcd0554f	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	7.00	WINTER	2026-05-04	MANUAL	t
19ba7c80-1f97-46f5-8e44-2d540af8c7e7	4aa172c4-e325-473f-b70c-28f1cfd77aa7	06ae96ac-8656-4ace-93b0-d0dec49f8a72	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	3.00	RETAKE	2026-04-30	MANUAL	f
3d02cb94-2cbe-4047-8568-f95d3238515d	4aa172c4-e325-473f-b70c-28f1cfd77aa7	40ce9225-9c1c-4ea3-a284-85b0cfe678b5	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	7.01	WINTER	2026-05-01	MANUAL	t
a27375b3-436a-47ef-b4b3-634ccfec26da	6b0ba2f3-59c4-4065-8988-f300f82b6e6e	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	10.00	WINTER	2026-05-04	MANUAL	f
573cec79-8eb3-4d98-a644-2549b38043f3	5ca4d768-d4d9-4545-afcf-6f38c01958ca	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	9.00	WINTER	2026-05-04	MANUAL	f
3d1ab565-da84-433e-bb88-6bbbfa475d6d	bc4f25e2-8d72-4e82-982e-e5c4bbf205fd	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	8.00	WINTER	2026-05-04	MANUAL	f
1a333a74-d6c6-40d0-b7bf-d224e2763067	15dd0140-3cd2-42ba-a820-f0cfd055bc68	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	7.00	WINTER	2026-05-04	MANUAL	f
bbba9879-63ed-4cde-bd85-8ccc9ee0519d	de9994d8-8e74-4b53-8639-90f7ee31c9f1	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	6.00	WINTER	2026-05-04	MANUAL	f
23ace774-ca5c-4aa5-8213-5366c21429a8	05298c22-5988-423f-b525-68b59978eedb	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	5.00	WINTER	2026-05-04	MANUAL	f
5c886a85-c7c8-4917-9baa-8baefd84f084	daade39c-1087-47d9-b3b8-3c090b0c8a37	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	4.00	WINTER	2026-05-04	MANUAL	f
25856812-c38a-45b8-835c-c206e736a8ec	ed6f50c8-503b-494a-ac8d-3ef5e34cac9e	59a68013-b5fa-4790-892e-2730e349d4e9	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	3.00	WINTER	2026-05-04	MANUAL	t
6da04f72-0d85-49da-adff-88bbe522d9ef	6b0ba2f3-59c4-4065-8988-f300f82b6e6e	8165cf30-c51b-4e8d-941a-5bcf0a89c52d	5290bd9f-c045-4da4-ad00-d200c325e71e	fbd994de-5086-49c9-bb41-5cf7a137cebf	65cbf637-fde9-4a43-954f-a8806682d462	8.00	SUMMER	2026-05-04	MANUAL	t
\.


--
-- Data for Name: import_job_rule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.import_job_rule (id, import_job_id, transformation_rule_id, applied_order) FROM stdin;
\.


--
-- Data for Name: operation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.operation (id, code, module, action, description) FROM stdin;
\.


--
-- Data for Name: outlook_notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.outlook_notification (id, sent_by_user_id, user_group_id, recipients, subject, body_preview, sent_at, delivery_status) FROM stdin;
987345c1-0e8f-4abb-90be-4e9159c8ee38	898080e7-dbe3-4e20-990c-931c42585cab	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro	t	t	2026-05-04 09:00:57.58515+03	SENT
cd485f76-ce4f-4621-ab4d-bbf1b3fe4429	898080e7-dbe3-4e20-990c-931c42585cab	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro	t	t	2026-05-04 09:00:59.305441+03	SENT
bfa7203d-e8e7-42b9-aff2-a7977907a7e3	65cbf637-fde9-4a43-954f-a8806682d462	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro, secretariat@mock.ucv.ro	AM TESTAT PE 04 05 2026	ACEST MESAJ S-A TRIMIS	2026-05-04 23:04:06.644491+03	SENT
224bb0b8-ca55-48f9-ba15-cf605450454f	65cbf637-fde9-4a43-954f-a8806682d462	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro, secretariat@mock.ucv.ro	ddd	aaaaa	2026-05-05 16:22:03.706312+03	SENT
411a4777-cffd-458f-afc3-ec7f04274b01	65cbf637-fde9-4a43-954f-a8806682d462	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro, secretariat@mock.ucv.ro	gggggg	ggggggg	2026-05-05 16:53:58.185265+03	SENT
78c2b4a9-ac95-485e-af2e-f4f454218d0f	65cbf637-fde9-4a43-954f-a8806682d462	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro, secretariat@mock.ucv.ro	a	aaadsadasdasd	2026-05-05 16:59:15.057017+03	SENT
4688084c-b441-4511-8aad-652fb2226711	65cbf637-fde9-4a43-954f-a8806682d462	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	prof1@mock.ucv.ro, secretariat@ucv.ro, secretariat@mock.ucv.ro	gsadgas	gsadgdsagsadgasgads	2026-05-05 16:59:35.146323+03	SENT
\.


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permission (id, code, module, action, description) FROM stdin;
\.


--
-- Data for Name: recovery_point; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recovery_point (id, point_in_time, backup_reference, transaction_reference, available) FROM stdin;
\.


--
-- Data for Name: report_definition; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_definition (id, code, name, report_type, visibility, default_sort, active) FROM stdin;
\.


--
-- Data for Name: report_export; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_export (id, report_request_id, exported_by_user_id, format, file_name, storage_path, exported_at) FROM stdin;
\.


--
-- Data for Name: report_request; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_request (id, report_definition_id, requested_by_user_id, requested_at, status, filter_json) FROM stdin;
\.


--
-- Data for Name: report_row; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_row (id, centralizer_id, student_id, student_full_name, average_grade, credits_accumulated, row_payload_json) FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role (id, code, name, description) FROM stdin;
28befd85-a492-4b97-a133-a15fe755c8d0	ADMIN	Administrator	Acces complet la sistem, inclusiv rollback.
d15c7883-4bd0-49b4-8978-4b102217047e	SECRETARIAT	Secretariat	Gestionează studenții, cataloagele și documentele.
45f9f1a1-835c-4306-b119-98339489e987	PROFESSOR	Profesor	Introduce și validează notele studenților.
8eda1ea4-55b7-45f0-adbe-7457cd039ee1	STUDENT	Student	Acces read-only la propriile date.
\.


--
-- Data for Name: role_operation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_operation (id, role_id, operation_id, granted_at) FROM stdin;
\.


--
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permission (id, role_id, permission_id, granted_at) FROM stdin;
\.


--
-- Data for Name: rollback_operation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rollback_operation (id, triggered_by_user_id, recovery_point_id, target_point_in_time, reason, started_at, finished_at, status) FROM stdin;
\.


--
-- Data for Name: specialization; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.specialization (id, code, name, degree_level, is_active) FROM stdin;
0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI	Calculatoare și Tehnologia Informației	Licență	t
2d1be959-ddff-42eb-9e43-afdddca62643	IS	Ingineria Sistemelor	Licență	t
bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC	Automatică și Informatică Aplicată	Licență	t
8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE	Inginerie Electronică și Telecomunicații	Licență	t
eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC	Securitatea Sistemelor Cibernetice	Masterat	t
ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA	Inteligență Artificială și Machine Learning	Masterat	t
6147e737-6538-44eb-8a1b-923af9954203	SDSI	Școala Doctorală – Sisteme Informatice	Doctorat	t
68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA	Școala Doctorală – Sisteme Automate	Doctorat	t
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student (id, study_formation_id, registration_number, first_name, last_name, email, enrollment_date, status) FROM stdin;
41ac354f-468e-4d97-b86a-c10845a84d17	4844ac20-ecf9-4585-aaa3-e3f1a39306ee	MAT0005	Mihai	Dumitru	mihai.dumitru@student.ucv.ro	2026-04-28	SUSPENDED
9c3401dc-e893-421b-8c26-85aa67c8cee4	\N	MAT8786				2026-04-29	INACTIVE
ac64775c-28a2-4435-997c-c5602bd31d3d	\N	MAT7264	aaaaaaaaa	bgbbbbbbbbbbbb	asdadsada@ceva.mail	2026-04-29	SUSPENDED
5563f3cc-6579-48df-851a-c80a9d72df96	\N	MAT7661	AAAA	testestestest	aaaaa@s.s	2026-04-29	ACTIVE
f7f9f04b-84b0-4964-8d50-a2b540a52b99	\N	MAT0016	Razvan	Testescu	razvan@test.com	2026-04-27	ENROLLED
3339a0a8-2c83-4ff9-8ea6-48077e1d063f	9a101578-fcfe-4188-a53c-bb5bb78d72b7	MAT0011	Cosmin	Dumitrescu	cosmin.dumitrescu@student.ucv.ro	2026-04-28	GRADUATED
33aa1a0d-c8dd-4d76-bde6-9bf4d60be2f3	86222df7-9e80-494b-beea-f3778c05fe7d	MAT0001	Andrei	Popescu	andrei.popescu@student.ucv.ro	2026-04-28	ENROLLED
c062f85a-89eb-4301-abf7-f4f94ac83d13	346d6afb-6a81-4f0a-93b5-cf00020a59e7	MAT0002	Maria	Ionescu	maria.ionescu@student.ucv.ro	2026-04-28	ENROLLED
cb0d4bfc-e921-4476-917b-118e3629b5d4	1ca38f09-f67a-4fc1-9708-41ec46e857fe	MAT0003	Alexandru	Gheorghe	alex.gheorghe@student.ucv.ro	2026-04-28	ENROLLED
1bfc632d-2b6a-431c-aad3-d0e73d0d8b3b	696d4d24-4bec-455d-aa4f-8428fbcb5d2a	MAT0006	Ana	Stanescu	ana.stanescu@student.ucv.ro	2026-04-28	ENROLLED
2be0013e-30cd-4b9f-b82f-1eb79c3a0e57	9018165f-bee9-407e-a81a-f8ae1c92ea73	MAT0008	Bogdan	Nicolescu	bogdan.nicolescu@student.ucv.ro	2026-04-28	ENROLLED
0829e638-af27-435f-b714-e17e4c1ea210	6e4f9c6c-9bc5-44b0-94ba-16fc923a9b05	MAT0010	Andreea	Niculae	andreea.niculae@student.ucv.ro	2026-04-28	ENROLLED
7a40bf11-7466-470e-a4b3-9c805fe2777c	5a8a4cac-006f-4d22-8363-96bf06c4c8e5	MAT0013	Marian	Stan	marian.stan@student.ucv.ro	2026-04-28	ENROLLED
5c60534a-63df-45ee-a9b1-85fb09cb1c78	46189d88-8aa2-4a61-9d5d-2b9685fb0e1c	MAT0017	Simona	Florescu	simona.florescu@student.ucv.ro	2026-04-28	ENROLLED
e4390126-0078-4fb4-9ae0-89f9d52ebbfc	9a101578-fcfe-4188-a53c-bb5bb78d72b7	MAT0018	Laura	Serban	laura.serban@student.ucv.ro	2026-04-28	ENROLLED
fb8e5778-ab4c-45d1-b26d-6b0930f56f87	918f9cec-3a68-4b1b-a155-f25bd2e64e77	MAT0019	Liviu	Oprea	liviu.oprea@doctorand.ucv.ro	2026-04-28	ENROLLED
b35f25a3-5b21-43f9-971a-b0fc1ac2809f	\N	MAT0014	Monica	ChiritaAAAAAAAAAAAAAA	monica.chirita@student.ucv.ro	2026-04-27	ENROLLED
4aa172c4-e325-473f-b70c-28f1cfd77aa7	\N	MAT9999	testulet1	ab	amcevamail@ammail.test1	2026-04-29	ENROLLED
fba3ce25-088a-4929-a8c7-a7bc50444804	\N	MAT0012	Violeta	Cristea	violeta.cristea@student.ucv.ro	2026-04-26	SUSPENDED
6a8f6958-b8c2-4f6f-93fd-3415fe2e532e	\N	MAT366391	Fictiv	Student	student@ucv.ro	2026-05-02	ENROLLED
9deac7ae-7049-4ca6-99e4-94ce5585d722	43c173f9-3dee-4030-ab3a-56580ab8a0ce	MAT0007	Cristian	Marin	cristian.marin@student.ucv.ro	2026-04-28	INACTIVE
6b0ba2f3-59c4-4065-8988-f300f82b6e6e	\N	MAT9998	testulet2	aa	amceva@nuammail.test2	2026-04-29	ENROLLED
5ca4d768-d4d9-4545-afcf-6f38c01958ca	\N	MAT0004	Elena	Constantin	elena.constantin@student.ucv.ro	2026-04-28	ACTIVE
15dd0140-3cd2-42ba-a820-f0cfd055bc68	\N	MAT0021	Gabriel	Ionascu	gabriel.ionascu@doctorand.ucv.ro	2026-04-28	ENROLLED
daade39c-1087-47d9-b3b8-3c090b0c8a37	\N	MAT6734	Marian	Mitrache	nicusormitmar@gmail.com	2026-04-29	ACTIVE
de9994d8-8e74-4b53-8639-90f7ee31c9f1	\N	MAT0015	Victor	Iordache	victor.iordache@student.ucv.ro	2026-04-28	ENROLLED
05298c22-5988-423f-b525-68b59978eedb	\N	MAT0020	Diana	Matei	diana.matei@doctorand.ucv.ro	2026-04-28	ENROLLED
ed6f50c8-503b-494a-ac8d-3ef5e34cac9e	\N	MAT248434	Nou	Student	newstudent99@uni.ro	2026-05-02	ENROLLED
bc4f25e2-8d72-4e82-982e-e5c4bbf205fd	\N	MAT0009	Stefan	Dima	stefan.dima@student.ucv.ro	2026-04-28	ACTIVE
\.


--
-- Data for Name: student_curriculum; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_curriculum (student_id, curriculum_id, enrolled_at, status, study_formation_id) FROM stdin;
6b0ba2f3-59c4-4065-8988-f300f82b6e6e	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	096d4c94-28b0-4bce-a3aa-822ea05d53a4
5ca4d768-d4d9-4545-afcf-6f38c01958ca	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	4224a3c8-ab1a-4c47-a6f5-e4d82de8d960
15dd0140-3cd2-42ba-a820-f0cfd055bc68	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	346d6afb-6a81-4f0a-93b5-cf00020a59e7
daade39c-1087-47d9-b3b8-3c090b0c8a37	68afd343-656e-4602-a7da-d1d6e70ec860	2026-05-04	ACTIVE	29648427-859c-410f-b8df-0119ef4b13cb
daade39c-1087-47d9-b3b8-3c090b0c8a37	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	43c173f9-3dee-4030-ab3a-56580ab8a0ce
de9994d8-8e74-4b53-8639-90f7ee31c9f1	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	bd9c4914-7a76-4fdd-806a-c36009f0b077
05298c22-5988-423f-b525-68b59978eedb	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	43c173f9-3dee-4030-ab3a-56580ab8a0ce
ed6f50c8-503b-494a-ac8d-3ef5e34cac9e	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	ab3463d5-2316-48c2-b99f-696b8cfd12ee
bc4f25e2-8d72-4e82-982e-e5c4bbf205fd	0e21fe26-1e2f-4d00-b78c-2f2ba64b4146	2026-05-04	ACTIVE	43c173f9-3dee-4030-ab3a-56580ab8a0ce
\.


--
-- Data for Name: study_formation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.study_formation (id, specialization_id, code, name, education_form, study_year, group_index, is_active) FROM stdin;
86222df7-9e80-494b-beea-f3778c05fe7d	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-11A	CTI IF – An 1, Gr.1, Sgr.A	IF	1	1	t
346d6afb-6a81-4f0a-93b5-cf00020a59e7	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-11B	CTI IF – An 1, Gr.1, Sgr.B	IF	1	1	t
1ca38f09-f67a-4fc1-9708-41ec46e857fe	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-12A	CTI IF – An 1, Gr.2, Sgr.A	IF	1	2	t
1440aa6e-7a9e-490f-a9ee-503c892cfc44	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-12B	CTI IF – An 1, Gr.2, Sgr.B	IF	1	2	t
304c26e0-1789-42db-b1fc-2e4de02b547b	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-13A	CTI IF – An 1, Gr.3, Sgr.A	IF	1	3	t
bdf4be94-e62f-48d5-9b69-be5da79abbcf	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-13B	CTI IF – An 1, Gr.3, Sgr.B	IF	1	3	t
81be5931-de56-47b0-bba4-0e1182146e9f	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-14A	CTI IF – An 1, Gr.4, Sgr.A	IF	1	4	t
10a8fcad-ae77-416b-a0a8-310ad24325ce	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-14B	CTI IF – An 1, Gr.4, Sgr.B	IF	1	4	t
7c3114ef-a011-4452-8b05-9366a9f959a0	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-21A	CTI IF – An 2, Gr.1, Sgr.A	IF	2	1	t
bd9c4914-7a76-4fdd-806a-c36009f0b077	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-21B	CTI IF – An 2, Gr.1, Sgr.B	IF	2	1	t
36cbcd00-e20e-4363-ab0a-cafe7dd3d4d4	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-22A	CTI IF – An 2, Gr.2, Sgr.A	IF	2	2	t
4e971efb-e591-441b-a27b-9e7eb8434f67	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-22B	CTI IF – An 2, Gr.2, Sgr.B	IF	2	2	t
180f3c4b-70ff-48df-95cd-db963890a4db	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-23A	CTI IF – An 2, Gr.3, Sgr.A	IF	2	3	t
096d4c94-28b0-4bce-a3aa-822ea05d53a4	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-23B	CTI IF – An 2, Gr.3, Sgr.B	IF	2	3	t
a6599f08-9e54-40a3-8c15-225b4d93324a	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-24A	CTI IF – An 2, Gr.4, Sgr.A	IF	2	4	t
9d4d7486-3e63-47c1-a35b-6db1a1b1fdd5	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-24B	CTI IF – An 2, Gr.4, Sgr.B	IF	2	4	t
696d4d24-4bec-455d-aa4f-8428fbcb5d2a	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-31A	CTI IF – An 3, Gr.1, Sgr.A	IF	3	1	t
ab3463d5-2316-48c2-b99f-696b8cfd12ee	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-31B	CTI IF – An 3, Gr.1, Sgr.B	IF	3	1	t
c5842cbd-6b23-4d70-9435-32fbce7dc5b5	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-32A	CTI IF – An 3, Gr.2, Sgr.A	IF	3	2	t
43c173f9-3dee-4030-ab3a-56580ab8a0ce	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-32B	CTI IF – An 3, Gr.2, Sgr.B	IF	3	2	t
d697ff77-221e-4cab-9f0c-a1af7ff5445a	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-33A	CTI IF – An 3, Gr.3, Sgr.A	IF	3	3	t
70f4c323-2ec2-46c9-a9d1-b2ae66aed418	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-33B	CTI IF – An 3, Gr.3, Sgr.B	IF	3	3	t
ebfc8877-a268-466c-9f42-710e335fe42e	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-34A	CTI IF – An 3, Gr.4, Sgr.A	IF	3	4	t
0fc13a53-b2c5-4cef-9c26-3f4f3c90b83a	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-34B	CTI IF – An 3, Gr.4, Sgr.B	IF	3	4	t
9018165f-bee9-407e-a81a-f8ae1c92ea73	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-41A	CTI IF – An 4, Gr.1, Sgr.A	IF	4	1	t
4d1d25bd-16e1-412f-8f91-20d0595433b8	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-41B	CTI IF – An 4, Gr.1, Sgr.B	IF	4	1	t
b0d3be3a-904a-46c3-81b5-90d1610fac1c	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-42A	CTI IF – An 4, Gr.2, Sgr.A	IF	4	2	t
800101db-384f-48a0-8645-37effe1e8af7	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-42B	CTI IF – An 4, Gr.2, Sgr.B	IF	4	2	t
17ae7673-0e76-45d2-aff7-043ae0433169	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-43A	CTI IF – An 4, Gr.3, Sgr.A	IF	4	3	t
74396706-a0ab-4072-9988-57a95a0fff16	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-43B	CTI IF – An 4, Gr.3, Sgr.B	IF	4	3	t
ddc8bfcb-0430-42f5-b191-cc8af927d9ef	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-44A	CTI IF – An 4, Gr.4, Sgr.A	IF	4	4	t
07873979-45d4-40ed-a33d-133008786a2b	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IF-44B	CTI IF – An 4, Gr.4, Sgr.B	IF	4	4	t
8129b6e3-a208-4266-bfd8-5d0307ad5c39	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-11A	CTI IFR – An 1, Gr.1, Sgr.A	IFR	1	1	t
507ca9e6-cd92-4dea-8f49-695457b6e6f1	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-11B	CTI IFR – An 1, Gr.1, Sgr.B	IFR	1	1	t
27d132b0-fa4e-4369-ab6f-d1e8d654b94b	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-12A	CTI IFR – An 1, Gr.2, Sgr.A	IFR	1	2	t
72dba32e-7dac-45b8-b67a-e2825d962f70	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-12B	CTI IFR – An 1, Gr.2, Sgr.B	IFR	1	2	t
153c6747-563f-4973-a337-7858129aedee	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-13A	CTI IFR – An 1, Gr.3, Sgr.A	IFR	1	3	t
1a03176a-3e2c-4f10-9151-28dd1de28dd8	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-13B	CTI IFR – An 1, Gr.3, Sgr.B	IFR	1	3	t
9a3b820b-ddab-4e52-ac10-791cdcd994f2	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-14A	CTI IFR – An 1, Gr.4, Sgr.A	IFR	1	4	t
655ad843-0137-4e64-abc6-736339bcb638	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-14B	CTI IFR – An 1, Gr.4, Sgr.B	IFR	1	4	t
6e4f9c6c-9bc5-44b0-94ba-16fc923a9b05	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-21A	CTI IFR – An 2, Gr.1, Sgr.A	IFR	2	1	t
6bb9fc6c-57f1-4049-acf9-65e0145d5222	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-21B	CTI IFR – An 2, Gr.1, Sgr.B	IFR	2	1	t
cf74a755-acef-46b9-87e2-9edbb831cf47	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-22A	CTI IFR – An 2, Gr.2, Sgr.A	IFR	2	2	t
f60926bf-f24d-4f0d-acb4-67ef6b3e5e01	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-22B	CTI IFR – An 2, Gr.2, Sgr.B	IFR	2	2	t
60e11704-030a-47f6-bbff-0e494f40fd53	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-23A	CTI IFR – An 2, Gr.3, Sgr.A	IFR	2	3	t
9663e0b5-0557-4b6d-bd74-62928370b93d	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-23B	CTI IFR – An 2, Gr.3, Sgr.B	IFR	2	3	t
e451d642-cafc-468d-97b2-0de6169b4049	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-24A	CTI IFR – An 2, Gr.4, Sgr.A	IFR	2	4	t
4224a3c8-ab1a-4c47-a6f5-e4d82de8d960	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-24B	CTI IFR – An 2, Gr.4, Sgr.B	IFR	2	4	t
8b1a45fd-ec2c-416b-a93e-ffb220523160	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-31A	CTI IFR – An 3, Gr.1, Sgr.A	IFR	3	1	t
db032973-5817-4d86-884d-6c1e2297ee7b	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-31B	CTI IFR – An 3, Gr.1, Sgr.B	IFR	3	1	t
de932b8c-7d6d-40eb-9275-4ef832a64dc7	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-32A	CTI IFR – An 3, Gr.2, Sgr.A	IFR	3	2	t
8af98ef6-f397-4ef7-8926-ae0e069bff9b	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-32B	CTI IFR – An 3, Gr.2, Sgr.B	IFR	3	2	t
be91613f-aabe-4e1a-871c-6347101c537b	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-33A	CTI IFR – An 3, Gr.3, Sgr.A	IFR	3	3	t
bcf839aa-977f-4854-9236-0ceaedfbd490	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-33B	CTI IFR – An 3, Gr.3, Sgr.B	IFR	3	3	t
6f359630-873b-44ff-99d7-3cf3706ea726	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-34A	CTI IFR – An 3, Gr.4, Sgr.A	IFR	3	4	t
95517c55-8142-4d04-bfde-5153f87f2f15	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-34B	CTI IFR – An 3, Gr.4, Sgr.B	IFR	3	4	t
88e249c0-7fed-4a4e-8347-6c0a6cdf5dfa	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-41A	CTI IFR – An 4, Gr.1, Sgr.A	IFR	4	1	t
27f676fe-df2e-436b-a27b-b66d169299e5	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-41B	CTI IFR – An 4, Gr.1, Sgr.B	IFR	4	1	t
ef104d0f-b025-45a1-ae41-68308613127d	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-42A	CTI IFR – An 4, Gr.2, Sgr.A	IFR	4	2	t
914787a4-d7af-4df4-a379-4a16b7e43960	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-42B	CTI IFR – An 4, Gr.2, Sgr.B	IFR	4	2	t
caf82373-9e0b-47ac-a9f3-c507206d2958	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-43A	CTI IFR – An 4, Gr.3, Sgr.A	IFR	4	3	t
9c5f9174-6190-44e6-a1c2-340fd4a15454	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-43B	CTI IFR – An 4, Gr.3, Sgr.B	IFR	4	3	t
0c0d2007-d704-4e53-aff4-8569099ce2ac	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-44A	CTI IFR – An 4, Gr.4, Sgr.A	IFR	4	4	t
7456d71e-c53b-47d0-a371-5b7341be0304	0222e3fc-b40c-4bc8-b115-73b24e0529a9	CTI-IFR-44B	CTI IFR – An 4, Gr.4, Sgr.B	IFR	4	4	t
08638cdd-220a-4830-b1af-7459389ba03e	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-11A	IS IF – An 1, Gr.1, Sgr.A	IF	1	1	t
193511b5-1072-489e-973e-59a479305a99	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-11B	IS IF – An 1, Gr.1, Sgr.B	IF	1	1	t
d4efb9fb-ee06-463e-bfc6-f7a9faa80de5	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-12A	IS IF – An 1, Gr.2, Sgr.A	IF	1	2	t
86b37e6f-c40f-4899-b422-48258825d582	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-12B	IS IF – An 1, Gr.2, Sgr.B	IF	1	2	t
8eea7bea-0ef9-4e0f-ab8c-36db13fd26ad	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-13A	IS IF – An 1, Gr.3, Sgr.A	IF	1	3	t
247d51b9-6ff1-4af7-b069-16b5402ebc79	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-13B	IS IF – An 1, Gr.3, Sgr.B	IF	1	3	t
ff151860-4cb4-415c-a7e3-d4880780707c	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-14A	IS IF – An 1, Gr.4, Sgr.A	IF	1	4	t
6f3b0f24-7f0d-4b51-a91c-3767431d63ce	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-14B	IS IF – An 1, Gr.4, Sgr.B	IF	1	4	t
73a351f4-43a6-4842-96a4-5c467a173217	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-21A	IS IF – An 2, Gr.1, Sgr.A	IF	2	1	t
85c29e12-e636-465c-ae0a-91d567641529	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-21B	IS IF – An 2, Gr.1, Sgr.B	IF	2	1	t
ed012a38-3400-44f2-9a4f-db0ab5275a72	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-22A	IS IF – An 2, Gr.2, Sgr.A	IF	2	2	t
193c0c3a-7d22-4417-9729-5f5730d7cbf3	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-22B	IS IF – An 2, Gr.2, Sgr.B	IF	2	2	t
6d94c495-7270-4f01-9009-1ed4eda372df	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-23A	IS IF – An 2, Gr.3, Sgr.A	IF	2	3	t
9660511a-764f-480d-8651-679fe4326c1f	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-23B	IS IF – An 2, Gr.3, Sgr.B	IF	2	3	t
169b65d5-538c-4f0b-86bb-c106c0e4ac54	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-24A	IS IF – An 2, Gr.4, Sgr.A	IF	2	4	t
79b45f57-3cb9-41bd-a70e-fc1f9a3cb293	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-24B	IS IF – An 2, Gr.4, Sgr.B	IF	2	4	t
feaf91ac-6067-4dcb-aaa4-65b2fa5e1c75	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-31A	IS IF – An 3, Gr.1, Sgr.A	IF	3	1	t
eaa81c4a-402c-477d-8a0c-38bfb9b96f5d	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-31B	IS IF – An 3, Gr.1, Sgr.B	IF	3	1	t
b0dbdcdc-45ef-4e10-8936-2911dc790eae	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-32A	IS IF – An 3, Gr.2, Sgr.A	IF	3	2	t
b3bfbb81-4cae-40d6-9f07-e1853e6e80d2	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-32B	IS IF – An 3, Gr.2, Sgr.B	IF	3	2	t
f11171be-a4b1-468f-bd7d-2e6de595014a	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-33A	IS IF – An 3, Gr.3, Sgr.A	IF	3	3	t
435b4bfa-762a-4057-b506-6d5847ad93cb	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-33B	IS IF – An 3, Gr.3, Sgr.B	IF	3	3	t
3815b5d0-50d9-449a-a1de-806dd6214d85	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-34A	IS IF – An 3, Gr.4, Sgr.A	IF	3	4	t
7e8979d5-4336-4194-b8bf-a8a14df727a9	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-34B	IS IF – An 3, Gr.4, Sgr.B	IF	3	4	t
1d2d6e9f-cc51-41fa-a0cd-79ab5dcb883b	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-41A	IS IF – An 4, Gr.1, Sgr.A	IF	4	1	t
0a6bf50a-d9a5-4444-9c98-5d299e6d1b21	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-41B	IS IF – An 4, Gr.1, Sgr.B	IF	4	1	t
3d644f9b-7ce3-4ded-b0b8-0c7a55f02d2f	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-42A	IS IF – An 4, Gr.2, Sgr.A	IF	4	2	t
41ffb12e-3e4e-420f-a897-3fcfeb9aa73e	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-42B	IS IF – An 4, Gr.2, Sgr.B	IF	4	2	t
c11e2b84-fcec-4a0e-8876-70dccccbb044	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-43A	IS IF – An 4, Gr.3, Sgr.A	IF	4	3	t
49109baf-632f-495b-a806-7ede71a756ae	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-43B	IS IF – An 4, Gr.3, Sgr.B	IF	4	3	t
950920d8-db34-403d-b240-8378940dffa1	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-44A	IS IF – An 4, Gr.4, Sgr.A	IF	4	4	t
25a792c2-6f6d-492b-9cfc-abc2697a565a	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IF-44B	IS IF – An 4, Gr.4, Sgr.B	IF	4	4	t
4e767f64-a5c9-4380-9040-9bc65c502a4b	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-11A	IS IFR – An 1, Gr.1, Sgr.A	IFR	1	1	t
0a0ddcdd-0d66-4e68-9189-04f39630e20b	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-11B	IS IFR – An 1, Gr.1, Sgr.B	IFR	1	1	t
5cf046b0-5b9e-44bb-a618-fae97b2b2a28	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-12A	IS IFR – An 1, Gr.2, Sgr.A	IFR	1	2	t
0b06ece9-0ebd-495d-a78f-4a2cbd3fcef7	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-12B	IS IFR – An 1, Gr.2, Sgr.B	IFR	1	2	t
e4cbf5b7-31a6-4d5f-9f5e-61ef1dee5e1b	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-13A	IS IFR – An 1, Gr.3, Sgr.A	IFR	1	3	t
671933dc-ed17-49ce-a473-0e59e6ebe233	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-13B	IS IFR – An 1, Gr.3, Sgr.B	IFR	1	3	t
a118f316-10a5-439f-bbf3-84a1cd83b61a	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-14A	IS IFR – An 1, Gr.4, Sgr.A	IFR	1	4	t
6f5dde18-0d20-425c-917b-7e9c443cff92	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-14B	IS IFR – An 1, Gr.4, Sgr.B	IFR	1	4	t
f88ea9d7-78cc-4305-ac37-4f66e6d92dcc	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-21A	IS IFR – An 2, Gr.1, Sgr.A	IFR	2	1	t
2a230770-c57c-4cf9-bf47-c2be6beb56e1	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-21B	IS IFR – An 2, Gr.1, Sgr.B	IFR	2	1	t
dbf63153-d7eb-4628-bda5-0b51b97dabbc	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-22A	IS IFR – An 2, Gr.2, Sgr.A	IFR	2	2	t
ad9327b0-8ade-47c2-8d97-8ed4325bcfcf	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-22B	IS IFR – An 2, Gr.2, Sgr.B	IFR	2	2	t
26c871bd-8063-4386-beec-80fa482bb64f	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-23A	IS IFR – An 2, Gr.3, Sgr.A	IFR	2	3	t
bf4f497b-5bdc-4865-b136-c433d1e8f5ac	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-23B	IS IFR – An 2, Gr.3, Sgr.B	IFR	2	3	t
04c1becd-8ad0-4350-a737-552bf73906bc	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-24A	IS IFR – An 2, Gr.4, Sgr.A	IFR	2	4	t
ede1c13a-ec59-41a2-b7e3-b39163cfa19a	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-24B	IS IFR – An 2, Gr.4, Sgr.B	IFR	2	4	t
2da94c4c-f058-4034-801a-655e3daeae27	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-31A	IS IFR – An 3, Gr.1, Sgr.A	IFR	3	1	t
096e1e98-b827-47e9-a208-5df31a8c44b3	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-31B	IS IFR – An 3, Gr.1, Sgr.B	IFR	3	1	t
29648427-859c-410f-b8df-0119ef4b13cb	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-32A	IS IFR – An 3, Gr.2, Sgr.A	IFR	3	2	t
4d9d2a7e-bc71-4f51-9570-789e63c3a78d	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-32B	IS IFR – An 3, Gr.2, Sgr.B	IFR	3	2	t
694119c4-c1d3-441f-87e1-b16ede4a1d34	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-33A	IS IFR – An 3, Gr.3, Sgr.A	IFR	3	3	t
6bebdfbe-95b2-465f-864b-fc8b74887886	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-33B	IS IFR – An 3, Gr.3, Sgr.B	IFR	3	3	t
24a85334-2714-4436-86b8-5cdd030bd04d	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-34A	IS IFR – An 3, Gr.4, Sgr.A	IFR	3	4	t
4db4d8f9-4803-47cd-95c5-608de9b9bf6a	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-34B	IS IFR – An 3, Gr.4, Sgr.B	IFR	3	4	t
6d54b41a-074f-48ff-be2f-30697758a9e0	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-41A	IS IFR – An 4, Gr.1, Sgr.A	IFR	4	1	t
e740f0fe-9879-4cee-964b-31835341f100	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-41B	IS IFR – An 4, Gr.1, Sgr.B	IFR	4	1	t
21ec168b-66e5-41a5-981a-0d94e3172a32	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-42A	IS IFR – An 4, Gr.2, Sgr.A	IFR	4	2	t
dc4bd933-13b5-4608-9541-ece26fbe219d	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-42B	IS IFR – An 4, Gr.2, Sgr.B	IFR	4	2	t
ca595df7-0c83-4cfb-84a6-0c7824a2729f	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-43A	IS IFR – An 4, Gr.3, Sgr.A	IFR	4	3	t
fa5e7613-872f-46d8-b5ea-6f2305d2e2ba	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-43B	IS IFR – An 4, Gr.3, Sgr.B	IFR	4	3	t
7c8d2cb1-78f8-48e9-93e6-ff284916be06	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-44A	IS IFR – An 4, Gr.4, Sgr.A	IFR	4	4	t
4844ac20-ecf9-4585-aaa3-e3f1a39306ee	2d1be959-ddff-42eb-9e43-afdddca62643	IS-IFR-44B	IS IFR – An 4, Gr.4, Sgr.B	IFR	4	4	t
5a8a4cac-006f-4d22-8363-96bf06c4c8e5	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-11A	AC IF – An 1, Gr.1, Sgr.A	IF	1	1	t
a17934e7-225e-4baf-ba3d-c9fa4745f456	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-11B	AC IF – An 1, Gr.1, Sgr.B	IF	1	1	t
066c98be-b478-4501-8197-cacb07694c4b	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-12A	AC IF – An 1, Gr.2, Sgr.A	IF	1	2	t
7692e41b-a005-4a43-94e8-a43ab1efd35f	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-12B	AC IF – An 1, Gr.2, Sgr.B	IF	1	2	t
b169e341-d0c6-4453-a8e1-6723688e4121	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-13A	AC IF – An 1, Gr.3, Sgr.A	IF	1	3	t
1675b7ec-8e3f-4e42-9212-48bd3ea8a949	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-13B	AC IF – An 1, Gr.3, Sgr.B	IF	1	3	t
b296e9c9-7643-46a4-b286-4fd930ad31d2	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-14A	AC IF – An 1, Gr.4, Sgr.A	IF	1	4	t
276f5243-5637-4d9e-9eea-4eebb34196db	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-14B	AC IF – An 1, Gr.4, Sgr.B	IF	1	4	t
fb2c4c32-0638-4e96-ac93-ee1d60a22142	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-21A	AC IF – An 2, Gr.1, Sgr.A	IF	2	1	t
820fabc2-fbe2-4dd8-bce8-44a2a0eb04f6	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-21B	AC IF – An 2, Gr.1, Sgr.B	IF	2	1	t
fa1eef94-eb19-428e-b7b9-2a931e697347	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-22A	AC IF – An 2, Gr.2, Sgr.A	IF	2	2	t
eca0f3fc-2f5b-4a68-89bf-d48df8241fc0	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-22B	AC IF – An 2, Gr.2, Sgr.B	IF	2	2	t
1fad4268-9ab2-469d-9d35-08a866a682ba	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-23A	AC IF – An 2, Gr.3, Sgr.A	IF	2	3	t
11b31e7c-ace6-408f-a3d1-daf4e39b8934	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-23B	AC IF – An 2, Gr.3, Sgr.B	IF	2	3	t
7ea069b3-fa0b-46b0-8e7f-f83972591a37	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-24A	AC IF – An 2, Gr.4, Sgr.A	IF	2	4	t
05d76561-4dfc-4325-8ee1-fd90999cf039	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-24B	AC IF – An 2, Gr.4, Sgr.B	IF	2	4	t
172827b2-721b-4e5f-a4c2-64c8a716ac1f	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-31A	AC IF – An 3, Gr.1, Sgr.A	IF	3	1	t
61efd821-2777-4712-a494-cd5d6295ac8f	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-31B	AC IF – An 3, Gr.1, Sgr.B	IF	3	1	t
0b6aab40-f2e0-402d-93b3-85aa84f4bf00	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-32A	AC IF – An 3, Gr.2, Sgr.A	IF	3	2	t
41f7c541-0158-44e5-af0a-66d8749de613	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-32B	AC IF – An 3, Gr.2, Sgr.B	IF	3	2	t
d11b33ad-0ed5-4372-a4fc-16f9717a2953	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-33A	AC IF – An 3, Gr.3, Sgr.A	IF	3	3	t
627280bf-c21c-422f-a4d3-c3fd817f0905	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-33B	AC IF – An 3, Gr.3, Sgr.B	IF	3	3	t
29877931-6f9b-45c4-8893-584886d8ba8d	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-34A	AC IF – An 3, Gr.4, Sgr.A	IF	3	4	t
c4c5f667-a26e-4ef7-a41f-8ccb318bc138	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-34B	AC IF – An 3, Gr.4, Sgr.B	IF	3	4	t
a121befa-84a0-4567-b5d7-2aa3fb0273ed	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-41A	AC IF – An 4, Gr.1, Sgr.A	IF	4	1	t
44ca6860-cbb5-4704-bec6-795827090055	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-41B	AC IF – An 4, Gr.1, Sgr.B	IF	4	1	t
733402a6-b911-4710-a4c5-ca5f603f9b7a	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-42A	AC IF – An 4, Gr.2, Sgr.A	IF	4	2	t
cbf81458-18f7-41ca-9435-ce7a59d1d4e5	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-42B	AC IF – An 4, Gr.2, Sgr.B	IF	4	2	t
86df8968-4eac-425e-bd81-15f37a327947	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-43A	AC IF – An 4, Gr.3, Sgr.A	IF	4	3	t
25c6016d-831b-4489-a309-052c436d4852	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-43B	AC IF – An 4, Gr.3, Sgr.B	IF	4	3	t
1a4c2d28-8387-425c-a8b5-bd359b5bb8c4	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-44A	AC IF – An 4, Gr.4, Sgr.A	IF	4	4	t
25fb3f6d-6f4b-4e99-8055-d6a4223910c0	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IF-44B	AC IF – An 4, Gr.4, Sgr.B	IF	4	4	t
45e8ed9d-b9ba-4056-9e7f-9fad31f914d0	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-11A	AC IFR – An 1, Gr.1, Sgr.A	IFR	1	1	t
07175f39-1ef0-4614-b6f7-384c165e1d95	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-11B	AC IFR – An 1, Gr.1, Sgr.B	IFR	1	1	t
6d2b1a03-7899-4ca2-a66d-49e129f610d5	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-12A	AC IFR – An 1, Gr.2, Sgr.A	IFR	1	2	t
036f94e7-34d5-404b-9d44-883d83d3080b	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-12B	AC IFR – An 1, Gr.2, Sgr.B	IFR	1	2	t
53e4d66c-9e75-42ab-82e0-4ebf85a3602e	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-13A	AC IFR – An 1, Gr.3, Sgr.A	IFR	1	3	t
7d3a018c-98a3-4405-b0d1-90f8981bdc03	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-13B	AC IFR – An 1, Gr.3, Sgr.B	IFR	1	3	t
9ccf996a-03da-4f8b-819a-d3393b1479d8	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-14A	AC IFR – An 1, Gr.4, Sgr.A	IFR	1	4	t
03b06aeb-c9f0-49c5-99a8-5c6290324c81	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-14B	AC IFR – An 1, Gr.4, Sgr.B	IFR	1	4	t
125af921-4d44-4f30-973c-d6b41c25203e	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-21A	AC IFR – An 2, Gr.1, Sgr.A	IFR	2	1	t
24e6d943-1036-446b-ae26-455eed1ed619	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-21B	AC IFR – An 2, Gr.1, Sgr.B	IFR	2	1	t
8dcfa650-da50-4f94-94d1-0676f13d8c99	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-22A	AC IFR – An 2, Gr.2, Sgr.A	IFR	2	2	t
c0627e51-683a-43be-bb5d-a77cc97b92d7	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-22B	AC IFR – An 2, Gr.2, Sgr.B	IFR	2	2	t
d515e158-f239-45d0-bb60-0cbe2e96086e	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-23A	AC IFR – An 2, Gr.3, Sgr.A	IFR	2	3	t
09c15394-42e7-43f6-9327-369c1960d984	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-23B	AC IFR – An 2, Gr.3, Sgr.B	IFR	2	3	t
46557644-e119-4a6e-aa25-9b80e27663e8	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-24A	AC IFR – An 2, Gr.4, Sgr.A	IFR	2	4	t
76fbc232-75c3-49d3-8352-39247fd33727	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-24B	AC IFR – An 2, Gr.4, Sgr.B	IFR	2	4	t
762c63c5-3936-4cec-9c84-289cd38cb7f2	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-31A	AC IFR – An 3, Gr.1, Sgr.A	IFR	3	1	t
e2d810bf-906d-493d-abc7-6984ba8e1f57	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-31B	AC IFR – An 3, Gr.1, Sgr.B	IFR	3	1	t
bad5f741-cec3-4597-951b-3c1103485693	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-32A	AC IFR – An 3, Gr.2, Sgr.A	IFR	3	2	t
5fac82b1-7c23-4e21-83aa-b07f63774a8a	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-32B	AC IFR – An 3, Gr.2, Sgr.B	IFR	3	2	t
14e9c42a-d3bf-4817-9b86-aab612aab670	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-33A	AC IFR – An 3, Gr.3, Sgr.A	IFR	3	3	t
9d4db8a3-bd48-414f-8a91-10f8bcdbdb72	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-33B	AC IFR – An 3, Gr.3, Sgr.B	IFR	3	3	t
2df80f40-61ab-4fab-a3c7-641526bfcf8b	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-34A	AC IFR – An 3, Gr.4, Sgr.A	IFR	3	4	t
197db1c9-622a-4508-bc49-9e70278b66e2	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-34B	AC IFR – An 3, Gr.4, Sgr.B	IFR	3	4	t
d99be987-8518-44b3-ba52-3708586adc40	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-41A	AC IFR – An 4, Gr.1, Sgr.A	IFR	4	1	t
e8e9f3e6-49ad-4bcd-a8c9-e5b5eeb70400	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-41B	AC IFR – An 4, Gr.1, Sgr.B	IFR	4	1	t
a28e0e8e-70b4-442c-95d5-49dcf9b408ff	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-42A	AC IFR – An 4, Gr.2, Sgr.A	IFR	4	2	t
c29b6b14-9bdd-4016-bbe0-aa692c8d104b	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-42B	AC IFR – An 4, Gr.2, Sgr.B	IFR	4	2	t
29b10bb9-6214-4b25-b9e5-9b52fcfbe14e	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-43A	AC IFR – An 4, Gr.3, Sgr.A	IFR	4	3	t
7dbc577f-dd02-4d2a-bfcc-83de61112b2f	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-43B	AC IFR – An 4, Gr.3, Sgr.B	IFR	4	3	t
587db80e-50c6-40d8-a510-993c919cc6ae	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-44A	AC IFR – An 4, Gr.4, Sgr.A	IFR	4	4	t
0aae04be-40ef-431c-b5f5-d3c6add40be9	bd2406b8-9e06-499a-94d0-0b4472e0cebf	AC-IFR-44B	AC IFR – An 4, Gr.4, Sgr.B	IFR	4	4	t
3847a306-ecdd-4bf3-b78f-66c826464261	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-11A	IE IF – An 1, Gr.1, Sgr.A	IF	1	1	t
e34ff9fb-3f2a-4f10-8761-ec7d2173b914	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-11B	IE IF – An 1, Gr.1, Sgr.B	IF	1	1	t
07fb3032-a0ed-4972-89c1-65d8adc98c54	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-12A	IE IF – An 1, Gr.2, Sgr.A	IF	1	2	t
04d0d3d9-dccc-45c8-90b8-3b8f73744b37	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-12B	IE IF – An 1, Gr.2, Sgr.B	IF	1	2	t
2e60ee40-b48d-4481-83df-89db9440c2e1	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-13A	IE IF – An 1, Gr.3, Sgr.A	IF	1	3	t
0615c103-b543-4eb8-8200-b2febd8a4328	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-13B	IE IF – An 1, Gr.3, Sgr.B	IF	1	3	t
1ea58645-defc-4456-9531-2adca32f07b4	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-14A	IE IF – An 1, Gr.4, Sgr.A	IF	1	4	t
c6dc6326-b250-438f-afe2-9470abe03f1f	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-14B	IE IF – An 1, Gr.4, Sgr.B	IF	1	4	t
2f7562f1-887e-46f7-b442-7837e361f367	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-21A	IE IF – An 2, Gr.1, Sgr.A	IF	2	1	t
3271808b-501c-461d-a63f-f35c016ae8fb	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-21B	IE IF – An 2, Gr.1, Sgr.B	IF	2	1	t
9f5f481b-df3a-4128-84e7-fb38a0e04dfc	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-22A	IE IF – An 2, Gr.2, Sgr.A	IF	2	2	t
3a60094e-24b1-4b92-9a9a-4663b98d71ac	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-22B	IE IF – An 2, Gr.2, Sgr.B	IF	2	2	t
fe0f2198-9e76-4144-8002-7aea623f92f4	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-23A	IE IF – An 2, Gr.3, Sgr.A	IF	2	3	t
fe6537ed-9b6b-47b0-bd84-9bfe75ff7e7a	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-23B	IE IF – An 2, Gr.3, Sgr.B	IF	2	3	t
047a79c3-0503-4030-a6ee-966572de4bf8	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-24A	IE IF – An 2, Gr.4, Sgr.A	IF	2	4	t
d53e46b4-ae50-4ea2-9632-5dd746502005	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-24B	IE IF – An 2, Gr.4, Sgr.B	IF	2	4	t
a211a46f-5b1e-4448-8414-647d8973ecbf	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-31A	IE IF – An 3, Gr.1, Sgr.A	IF	3	1	t
1b7a163a-4d3f-43e2-b89e-42afc3aff998	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-31B	IE IF – An 3, Gr.1, Sgr.B	IF	3	1	t
d9a2ebbb-5fa0-4f45-8f92-7ba7c12c9dd9	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-32A	IE IF – An 3, Gr.2, Sgr.A	IF	3	2	t
26bb05c4-ff4f-4940-b061-3e98554c2b16	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-32B	IE IF – An 3, Gr.2, Sgr.B	IF	3	2	t
02db58a9-c0a0-4e3d-a2a1-a24d95b7657b	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-33A	IE IF – An 3, Gr.3, Sgr.A	IF	3	3	t
a60c9d61-a60d-4d80-a233-4eb46026ec26	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-33B	IE IF – An 3, Gr.3, Sgr.B	IF	3	3	t
a26ea24f-fdc7-44c3-bdee-5260bcc54467	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-34A	IE IF – An 3, Gr.4, Sgr.A	IF	3	4	t
0e71c990-c14a-4f16-ae34-f623be1339c7	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-34B	IE IF – An 3, Gr.4, Sgr.B	IF	3	4	t
462104bc-76d8-4a5a-ba8b-0d8c8b06af31	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-41A	IE IF – An 4, Gr.1, Sgr.A	IF	4	1	t
9c90f60e-6a9f-46dc-89e7-2f020a93c6e3	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-41B	IE IF – An 4, Gr.1, Sgr.B	IF	4	1	t
51850d64-f969-4147-8248-c2b86c30d302	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-42A	IE IF – An 4, Gr.2, Sgr.A	IF	4	2	t
1e489516-eea1-46d1-b76b-2c0896a865de	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-42B	IE IF – An 4, Gr.2, Sgr.B	IF	4	2	t
af4aaf0b-28c3-444f-bab7-5a3b06c1e22f	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-43A	IE IF – An 4, Gr.3, Sgr.A	IF	4	3	t
46e9db9a-a5b7-4d0e-a899-e120e1a5ce47	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-43B	IE IF – An 4, Gr.3, Sgr.B	IF	4	3	t
a009f7c7-2d2a-4cf6-9aaa-fc91fbc4d7ea	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-44A	IE IF – An 4, Gr.4, Sgr.A	IF	4	4	t
98538efa-05cf-4914-84af-bc3f684f6751	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IF-44B	IE IF – An 4, Gr.4, Sgr.B	IF	4	4	t
85d6cb88-1157-4d34-b5a2-daba07912d35	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-11A	IE IFR – An 1, Gr.1, Sgr.A	IFR	1	1	t
00cb11cf-8f14-47d3-aa55-7bba85ab3709	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-11B	IE IFR – An 1, Gr.1, Sgr.B	IFR	1	1	t
9931a48f-d9b5-498a-b62c-b3422eecb00e	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-12A	IE IFR – An 1, Gr.2, Sgr.A	IFR	1	2	t
fb354641-cad1-4d12-9b40-02e2bbaf4e5f	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-12B	IE IFR – An 1, Gr.2, Sgr.B	IFR	1	2	t
c4aa35dc-3519-4436-b891-2b59cd8b7192	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-13A	IE IFR – An 1, Gr.3, Sgr.A	IFR	1	3	t
38556760-6875-4f52-9abe-0c86d693b996	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-13B	IE IFR – An 1, Gr.3, Sgr.B	IFR	1	3	t
82395cc8-6863-45a3-b1fb-5ade9b64a8f8	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-14A	IE IFR – An 1, Gr.4, Sgr.A	IFR	1	4	t
9c89c474-eba4-4078-911e-833ccacbccf0	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-14B	IE IFR – An 1, Gr.4, Sgr.B	IFR	1	4	t
a06b78a2-7ee8-4c5b-b2cd-013a20c881a4	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-21A	IE IFR – An 2, Gr.1, Sgr.A	IFR	2	1	t
a96bc4ea-2b5d-46e8-bcf3-260a244e25a6	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-21B	IE IFR – An 2, Gr.1, Sgr.B	IFR	2	1	t
e8f92b37-c1a0-4fcc-a464-b4368c4a45fd	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-22A	IE IFR – An 2, Gr.2, Sgr.A	IFR	2	2	t
f2a8a42f-e36e-4fb2-969a-ffffc9928996	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-22B	IE IFR – An 2, Gr.2, Sgr.B	IFR	2	2	t
d79f5e1c-58f4-464d-9774-6593c89860cb	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-23A	IE IFR – An 2, Gr.3, Sgr.A	IFR	2	3	t
5641575f-3c0e-477d-8302-013c33bffbb4	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-23B	IE IFR – An 2, Gr.3, Sgr.B	IFR	2	3	t
14711531-571d-484d-9273-12b63cc56a14	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-24A	IE IFR – An 2, Gr.4, Sgr.A	IFR	2	4	t
cae6ba6d-d8a1-4c1e-bd63-88b698a79161	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-24B	IE IFR – An 2, Gr.4, Sgr.B	IFR	2	4	t
a6c1f612-3419-48d9-b729-af2488697d8b	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-31A	IE IFR – An 3, Gr.1, Sgr.A	IFR	3	1	t
d6ccf4ec-016e-4e1f-8843-a6c4e18a7b21	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-31B	IE IFR – An 3, Gr.1, Sgr.B	IFR	3	1	t
2b044841-c188-47dc-bb0d-ef2d7ca51b00	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-32A	IE IFR – An 3, Gr.2, Sgr.A	IFR	3	2	t
8096b688-5168-430a-9670-8b1ab9e747c0	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-32B	IE IFR – An 3, Gr.2, Sgr.B	IFR	3	2	t
a3723214-7685-43a1-a832-43cdd7ca6328	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-33A	IE IFR – An 3, Gr.3, Sgr.A	IFR	3	3	t
78c02e7f-8ade-48d3-aada-69f2683b30a2	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-33B	IE IFR – An 3, Gr.3, Sgr.B	IFR	3	3	t
e1b1545e-24bc-4631-bb1d-f40555b57116	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-34A	IE IFR – An 3, Gr.4, Sgr.A	IFR	3	4	t
f68aafcd-0620-494a-a4ac-2362371aedc8	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-34B	IE IFR – An 3, Gr.4, Sgr.B	IFR	3	4	t
8465a8d0-90c7-4085-80a1-dc94edc238d5	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-41A	IE IFR – An 4, Gr.1, Sgr.A	IFR	4	1	t
355cfc65-bd55-4086-93cc-d3b597fce794	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-41B	IE IFR – An 4, Gr.1, Sgr.B	IFR	4	1	t
4d8c96dd-1928-4612-8d9a-33fd192d7075	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-42A	IE IFR – An 4, Gr.2, Sgr.A	IFR	4	2	t
bd5b9d3c-edcb-4668-9031-121601e78140	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-42B	IE IFR – An 4, Gr.2, Sgr.B	IFR	4	2	t
18dc6c77-e921-46cc-8047-88c1f28589a1	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-43A	IE IFR – An 4, Gr.3, Sgr.A	IFR	4	3	t
1014235a-b04f-4ed5-9359-09c3af3d6965	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-43B	IE IFR – An 4, Gr.3, Sgr.B	IFR	4	3	t
7f901eb4-24ed-46bd-a21f-423afdcb5cee	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-44A	IE IFR – An 4, Gr.4, Sgr.A	IFR	4	4	t
a54ea70a-7948-4877-97c7-4a8bcae66957	8911bbf0-62fa-4c84-90c0-287d27fa02cc	IE-IFR-44B	IE IFR – An 4, Gr.4, Sgr.B	IFR	4	4	t
2bb88f87-336c-4f57-848e-db8d76b2eaa7	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-11A	MSSC IF – An 1, Gr.1, Sgr.A	IF	1	1	t
516502a3-1ef2-491f-94bd-1771d9c28412	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-11B	MSSC IF – An 1, Gr.1, Sgr.B	IF	1	1	t
8e1c0db1-7098-4190-8e4f-afad1ead6f71	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-12A	MSSC IF – An 1, Gr.2, Sgr.A	IF	1	2	t
53524754-2575-40aa-94d5-374b87d8f7d8	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-12B	MSSC IF – An 1, Gr.2, Sgr.B	IF	1	2	t
afab71c3-b710-4406-8db3-7aa8c1d7d568	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-21A	MSSC IF – An 2, Gr.1, Sgr.A	IF	2	1	t
2a82caff-1bf5-4fe5-95aa-4896a9b6ba99	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-21B	MSSC IF – An 2, Gr.1, Sgr.B	IF	2	1	t
9a101578-fcfe-4188-a53c-bb5bb78d72b7	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-22A	MSSC IF – An 2, Gr.2, Sgr.A	IF	2	2	t
1918e590-05d8-42c1-a056-0668e6e47382	eb206aa7-4f72-49bf-9e20-8aa66c51a228	MSSC-IF-22B	MSSC IF – An 2, Gr.2, Sgr.B	IF	2	2	t
6267a333-d4df-4393-865e-71f5c2a9bce3	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-11A	MIA IF – An 1, Gr.1, Sgr.A	IF	1	1	t
46189d88-8aa2-4a61-9d5d-2b9685fb0e1c	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-11B	MIA IF – An 1, Gr.1, Sgr.B	IF	1	1	t
81baf423-c8b9-4f07-8eff-1702786c94c8	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-12A	MIA IF – An 1, Gr.2, Sgr.A	IF	1	2	t
e8254f3a-3b40-48d2-ae08-e29dcea03e9a	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-12B	MIA IF – An 1, Gr.2, Sgr.B	IF	1	2	t
171c22ab-82cb-4d8f-9bda-dae407dfa4c8	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-21A	MIA IF – An 2, Gr.1, Sgr.A	IF	2	1	t
593162a5-219e-4fcc-8e4a-dd6f31d08ca7	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-21B	MIA IF – An 2, Gr.1, Sgr.B	IF	2	1	t
a34e69d4-a78d-45ae-bd12-a0595093f5d1	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-22A	MIA IF – An 2, Gr.2, Sgr.A	IF	2	2	t
cf9dd9a0-59f4-49f3-87ab-b9a21f99eaa5	ef25c7b5-c008-40a2-8f35-59c53f110cf2	MIA-IF-22B	MIA IF – An 2, Gr.2, Sgr.B	IF	2	2	t
918f9cec-3a68-4b1b-a155-f25bd2e64e77	6147e737-6538-44eb-8a1b-923af9954203	SDSI-IF-1	SDSI IF – An 1	IF	1	0	t
66761bea-69a0-4440-aafa-8aa54d4f4c80	6147e737-6538-44eb-8a1b-923af9954203	SDSI-IF-2	SDSI IF – An 2	IF	2	0	t
c3983a33-b8a4-4dad-97e5-42c279ee759d	6147e737-6538-44eb-8a1b-923af9954203	SDSI-IF-3	SDSI IF – An 3	IF	3	0	t
0ef1c255-0fd8-41d2-a1bf-49d9cf1be6f1	6147e737-6538-44eb-8a1b-923af9954203	SDSI-IFR-1	SDSI IFR – An 1	IFR	1	0	t
584afaa1-e3de-421e-891d-a4d762fc9d38	6147e737-6538-44eb-8a1b-923af9954203	SDSI-IFR-2	SDSI IFR – An 2	IFR	2	0	t
0bfa0155-226f-4ea3-b5c1-3251c014e96d	6147e737-6538-44eb-8a1b-923af9954203	SDSI-IFR-3	SDSI IFR – An 3	IFR	3	0	t
5a105954-3612-494e-973b-927ca8b2983c	68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA-IF-1	SDSA IF – An 1	IF	1	0	t
07980534-a5d4-4095-b4c7-68b4f639c7b5	68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA-IF-2	SDSA IF – An 2	IF	2	0	t
33296349-b268-497f-b73e-05fda21bf0fd	68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA-IF-3	SDSA IF – An 3	IF	3	0	t
1e694f62-ffe6-4b8e-b386-539bebfb515b	68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA-IFR-1	SDSA IFR – An 1	IFR	1	0	t
d765ddfc-16ee-43d8-809c-0cdf87a7f3ef	68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA-IFR-2	SDSA IFR – An 2	IFR	2	0	t
1b7c3c2d-436b-4aeb-8ba6-ff6059d4f6ea	68f6fc5f-8140-4faa-8e4b-d603b8ebb0e0	SDSA-IFR-3	SDSA IFR – An 3	IFR	3	0	t
\.


--
-- Data for Name: system_setting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_setting (id, key, value, updated_at) FROM stdin;
3	INSTITUTION_NAME	University of Craiova	2026-05-02 12:25:06.264724
7	DEAN_SECRETARY	Mariana Neamțu	2026-05-02 12:25:06.264724
9	SYSTEM_EMAIL	support.ace@ucv.ro	2026-05-02 12:25:06.264724
1	FACULTY_NAME	Facultatea de Automatica, Calculatoare si Electronica	2026-05-02 12:25:06.264724
5	DEAN_NAME	Prof. dr. ing. Eugen Bobașu	2026-05-02 12:25:06.264724
11	PORTAL_NOTICE	Facultatea de Automatică, Calculatoare şi Electronică (A.C.E.) pregăteşte şi formează tinerii ingineri, asigurându-le o pregătire teoretică fundamentală precum şi una practic-aplicativă, în domenii precum:\n\n    calculatoare şi tehnologia informaţiei\n    ingineria sistemelor,\n    inginerie electronică şi telecomunicaţii,\n    mecatronică şi robotică.\n	2026-05-02 12:25:06.264724
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_settings (key, value, category, label, updated_at) FROM stdin;
institution_name	Universitatea din Craiova	INSTITUTION	Institution Name	2026-05-02 13:29:47.469116+03
institution_name_en	University of Craiova	INSTITUTION	Institution Name (English)	2026-05-02 13:29:47.469116+03
faculty_name	Facultatea de Automatică, Calculatoare și Electronică	INSTITUTION	Faculty Name	2026-05-02 13:29:47.469116+03
faculty_name_en	Faculty of Automation, Computers and Electronics	INSTITUTION	Faculty Name (English)	2026-05-02 13:29:47.469116+03
faculty_code	FACE	INSTITUTION	Faculty Code	2026-05-02 13:29:47.469116+03
dean_name	Prof. univ. dr. ing. Daniela Danciu	INSTITUTION	Dean	2026-05-02 13:29:47.469116+03
vice_dean_academic	Conf. univ. dr. ing. Alin Iulian Drăgan	INSTITUTION	Vice-Dean (Academic)	2026-05-02 13:29:47.469116+03
secretary_chief	Ec. Iuliana Bratu	INSTITUTION	Chief Secretary	2026-05-02 13:29:47.469116+03
domain	Calculatoare și Tehnologia Informației	INSTITUTION	Academic Domain	2026-05-02 13:29:47.469116+03
domain_en	Computer Science and Information Technology	INSTITUTION	Academic Domain (English)	2026-05-02 13:29:47.469116+03
accreditation	ARACIS Acredited	INSTITUTION	Accreditation Status	2026-05-02 13:29:47.469116+03
address	Bulevardul Decebal nr. 107, Craiova, Dolj, 200440, România	CONTACT	Address	2026-05-02 13:29:47.469116+03
phone	+40 251 438 198	CONTACT	Phone	2026-05-02 13:29:47.469116+03
fax	+40 251 438 198	CONTACT	Fax	2026-05-02 13:29:47.469116+03
email_secretariat	secretariat@ace.ucv.ro	CONTACT	Secretariat Email	2026-05-02 13:29:47.469116+03
email_it_helpdesk	helpdesk@software.ucv.ro	CONTACT	IT Helpdesk Email	2026-05-02 13:29:47.469116+03
email_dpo	dpo@ucv.ro	CONTACT	DPO Email	2026-05-02 13:29:47.469116+03
website	https://ace.ucv.ro	CONTACT	Website	2026-05-02 13:29:47.469116+03
current_academic_year	2025-2026	ACADEMIC	Current Academic Year	2026-05-02 13:29:47.469116+03
semester_1_start	2025-10-01	ACADEMIC	Semester 1 Start	2026-05-02 13:29:47.469116+03
semester_1_end	2026-01-31	ACADEMIC	Semester 1 End	2026-05-02 13:29:47.469116+03
semester_2_start	2026-02-16	ACADEMIC	Semester 2 Start	2026-05-02 13:29:47.469116+03
semester_2_end	2026-06-15	ACADEMIC	Semester 2 End	2026-05-02 13:29:47.469116+03
summer_session_start	2026-06-16	ACADEMIC	Summer Session Start	2026-05-02 13:29:47.469116+03
summer_session_end	2026-06-30	ACADEMIC	Summer Session End	2026-05-02 13:29:47.469116+03
grading_scale	1-10	ACADEMIC	Grading Scale	2026-05-02 13:29:47.469116+03
passing_grade	5	ACADEMIC	Minimum Passing Grade	2026-05-02 13:29:47.469116+03
system_name	AFSMS Core	SYSTEM	System Name	2026-05-02 13:29:47.469116+03
system_version	1.0.0	SYSTEM	Version	2026-05-02 13:29:47.469116+03
maintenance_mode	false	SYSTEM	Maintenance Mode	2026-05-02 13:29:47.469116+03
max_upload_size_mb	10	SYSTEM	Max Upload Size (MB)	2026-05-02 13:29:47.469116+03
session_timeout_min	60	SYSTEM	Session Timeout (minutes)	2026-05-02 13:29:47.469116+03
default_language	ro	SYSTEM	Default Language	2026-05-02 13:29:47.469116+03
\.


--
-- Data for Name: user_account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_account (id, sso_subject, username, email, full_name, account_status) FROM stdin;
65cbf637-fde9-4a43-954f-a8806682d462	sso_admin_01	admin.sistem	admin@mock.ucv.ro	Admin Fictiv	ACTIVE
df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	sso_sec_01	secretariat.ace	secretariat@mock.ucv.ro	Secretar Maria Pop	ACTIVE
3b43d8da-3105-46ed-9c04-53f009fc1ae4	sso_prof_01	prof.ing.progr	prof1@mock.ucv.ro	Prof. Dr. Ingineria Programării	ACTIVE
0ad47593-45f5-45ff-93ce-649e2c99846d	sso_prof_02	prof.baze.date	prof2@mock.ucv.ro	Prof. Dr. Baze de Date	ACTIVE
f9b7a621-1309-482d-9d06-5f6b8e4283c1	sso_prof_03	prof.sisteme	prof3@mock.ucv.ro	Prof. Dr. Sisteme Distribuite	ACTIVE
f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213	testu2	testu2	test2@u.com	Test U2	ACTIVE
30d7bb9c-f363-4998-9113-3ef962943e74	newstudent99	newstudent99	newstudent99@uni.ro	Student Nou	ACTIVE
3cd49142-4f34-4de7-8e86-640e2ce97e22	prof_ucv_001	profesor	profesor@ucv.ro	Profesor Inginerie	ACTIVE
898080e7-dbe3-4e20-990c-931c42585cab	admin_ucv_001	admin	admin@ucv.ro	Admin Sistem	ACTIVE
8c7932d4-e1b5-48a8-b3dd-accbf190617f	secr_ucv_001	secretariat	secretariat@ucv.ro	Secretariat Fictiv	ACTIVE
4197ae30-6bd6-40e5-b664-518f8e58cff2	stud_ucv_001	student	amceva@nuammail.test2	Student Fictiv	ACTIVE
a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c	mitmar_001	mitmar	nicusormitmar@gmail.com	Mitrache Marian Nicusor	ACTIVE
\.


--
-- Data for Name: user_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_group (id, name, description, updated_at) FROM stdin;
5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	test	test	2026-05-01 20:28:45.992+03
\.


--
-- Data for Name: user_group_member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_group_member (id, group_id, user_account_id, joined_at) FROM stdin;
bce9c3b5-8ae3-44f5-9880-0e87469c2184	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	3b43d8da-3105-46ed-9c04-53f009fc1ae4	2026-05-04 09:00:34.625593+03
5a6eddeb-73a8-4445-abff-f59ed583fc4c	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	8c7932d4-e1b5-48a8-b3dd-accbf190617f	2026-05-04 09:00:37.065283+03
f09accc9-f9cc-4db5-b177-77c5823a1e49	5c603f0b-19ae-4f9e-9aa8-a925ea3f6f09	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	2026-05-04 23:01:17.93238+03
\.


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_role (id, user_id, role_id, assigned_at) FROM stdin;
77e2445f-937e-42c5-ba97-d012fdb89d3f	3b43d8da-3105-46ed-9c04-53f009fc1ae4	45f9f1a1-835c-4306-b119-98339489e987	2026-04-30 11:44:57.968+03
d7b8e402-5f04-4284-8ea2-f0d31d5cc4cb	0ad47593-45f5-45ff-93ce-649e2c99846d	45f9f1a1-835c-4306-b119-98339489e987	2026-04-30 11:44:57.968+03
e2d1c0fe-7fa0-49b3-8bef-1ccdfff2cae6	f0e9dcd2-5cf0-4cb9-9c56-9919d93c9213	28befd85-a492-4b97-a133-a15fe755c8d0	2026-05-04 00:45:48.977+03
7451c608-24c7-45c3-8c60-b529cc73c75a	30d7bb9c-f363-4998-9113-3ef962943e74	8eda1ea4-55b7-45f0-adbe-7457cd039ee1	2026-05-04 08:42:17.492+03
e55a9699-dc18-4c25-b6ed-7063413e59aa	8c7932d4-e1b5-48a8-b3dd-accbf190617f	d15c7883-4bd0-49b4-8978-4b102217047e	2026-05-04 08:42:25.659+03
7ebebafc-317a-4ccb-ac5c-dfb5def40dc4	4197ae30-6bd6-40e5-b664-518f8e58cff2	8eda1ea4-55b7-45f0-adbe-7457cd039ee1	2026-05-04 08:46:53.847+03
811dc7d2-7a01-4990-8553-6dfc223ee646	f9b7a621-1309-482d-9d06-5f6b8e4283c1	45f9f1a1-835c-4306-b119-98339489e987	2026-05-04 08:47:59.814+03
7038eb84-005a-473a-814c-52fd6dedb2c6	df3cfe57-9cb4-4b35-9ab2-6f3903e748ea	d15c7883-4bd0-49b4-8978-4b102217047e	2026-05-04 08:54:35.392+03
2935d050-b98c-46cd-8bb0-a20cf789347f	a2f730ed-cf6a-4044-ac96-e2ad5a5e6c0c	8eda1ea4-55b7-45f0-adbe-7457cd039ee1	2026-05-05 17:10:50.957871+03
a6a1e512-871c-4230-9fec-9c2d0a686f9d	3cd49142-4f34-4de7-8e86-640e2ce97e22	45f9f1a1-835c-4306-b119-98339489e987	2026-05-11 16:47:01.95938+03
eae66637-3315-4037-b8d8-47bea5e69077	65cbf637-fde9-4a43-954f-a8806682d462	28befd85-a492-4b97-a133-a15fe755c8d0	2026-08-31 22:56:58.011968+03
34d47278-bc65-45d3-94e3-9e442a4fd7cd	898080e7-dbe3-4e20-990c-931c42585cab	28befd85-a492-4b97-a133-a15fe755c8d0	2026-11-08 03:14:36.260154+02
\.


--
-- Data for Name: validation_error; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.validation_error (id, import_job_id, entity_type, entity_id, field_name, error_code, message, resolution_hint, created_at) FROM stdin;
\.


--
-- Name: system_setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_setting_id_seq', 420, true);


--
-- Name: academic_year academic_year_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.academic_year
    ADD CONSTRAINT academic_year_pkey PRIMARY KEY (id);


--
-- Name: audit_log_entry audit_log_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_pkey PRIMARY KEY (id);


--
-- Name: auth_session auth_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_session
    ADD CONSTRAINT auth_session_pkey PRIMARY KEY (id);


--
-- Name: auth_session auth_session_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_session
    ADD CONSTRAINT auth_session_session_token_key UNIQUE (session_token);


--
-- Name: backup_config backup_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_config
    ADD CONSTRAINT backup_config_pkey PRIMARY KEY (id);


--
-- Name: backup_job backup_job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_job
    ADD CONSTRAINT backup_job_pkey PRIMARY KEY (id);


--
-- Name: backup_job_recovery_point backup_job_recovery_point_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_job_recovery_point
    ADD CONSTRAINT backup_job_recovery_point_pkey PRIMARY KEY (id);


--
-- Name: curriculum curriculum_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum
    ADD CONSTRAINT curriculum_code_key UNIQUE (code);


--
-- Name: curriculum curriculum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum
    ADD CONSTRAINT curriculum_pkey PRIMARY KEY (id);


--
-- Name: curriculum_snapshot curriculum_snapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_snapshot
    ADD CONSTRAINT curriculum_snapshot_pkey PRIMARY KEY (id);


--
-- Name: data_import_job data_import_job_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_import_job
    ADD CONSTRAINT data_import_job_pkey PRIMARY KEY (id);


--
-- Name: data_transformation_rule data_transformation_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_transformation_rule
    ADD CONSTRAINT data_transformation_rule_pkey PRIMARY KEY (id);


--
-- Name: discipline discipline_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discipline
    ADD CONSTRAINT discipline_code_key UNIQUE (code);


--
-- Name: discipline discipline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discipline
    ADD CONSTRAINT discipline_pkey PRIMARY KEY (id);


--
-- Name: document document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_pkey PRIMARY KEY (id);


--
-- Name: e_grade_centralizer e_grade_centralizer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_grade_centralizer
    ADD CONSTRAINT e_grade_centralizer_pkey PRIMARY KEY (id);


--
-- Name: grade grade_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_pkey PRIMARY KEY (id);


--
-- Name: import_job_rule import_job_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_job_rule
    ADD CONSTRAINT import_job_rule_pkey PRIMARY KEY (id);


--
-- Name: operation operation_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operation
    ADD CONSTRAINT operation_code_key UNIQUE (code);


--
-- Name: operation operation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.operation
    ADD CONSTRAINT operation_pkey PRIMARY KEY (id);


--
-- Name: outlook_notification outlook_notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outlook_notification
    ADD CONSTRAINT outlook_notification_pkey PRIMARY KEY (id);


--
-- Name: permission permission_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT permission_code_key UNIQUE (code);


--
-- Name: permission permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT permission_pkey PRIMARY KEY (id);


--
-- Name: recovery_point recovery_point_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recovery_point
    ADD CONSTRAINT recovery_point_pkey PRIMARY KEY (id);


--
-- Name: report_definition report_definition_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_definition
    ADD CONSTRAINT report_definition_code_key UNIQUE (code);


--
-- Name: report_definition report_definition_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_definition
    ADD CONSTRAINT report_definition_pkey PRIMARY KEY (id);


--
-- Name: report_export report_export_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_export
    ADD CONSTRAINT report_export_pkey PRIMARY KEY (id);


--
-- Name: report_request report_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_request
    ADD CONSTRAINT report_request_pkey PRIMARY KEY (id);


--
-- Name: report_row report_row_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_row
    ADD CONSTRAINT report_row_pkey PRIMARY KEY (id);


--
-- Name: role role_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_code_key UNIQUE (code);


--
-- Name: role_operation role_operation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_operation
    ADD CONSTRAINT role_operation_pkey PRIMARY KEY (id);


--
-- Name: role_permission role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_pkey PRIMARY KEY (id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: rollback_operation rollback_operation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rollback_operation
    ADD CONSTRAINT rollback_operation_pkey PRIMARY KEY (id);


--
-- Name: specialization specialization_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialization
    ADD CONSTRAINT specialization_code_key UNIQUE (code);


--
-- Name: specialization specialization_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialization
    ADD CONSTRAINT specialization_pkey PRIMARY KEY (id);


--
-- Name: student_curriculum student_curriculum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_curriculum
    ADD CONSTRAINT student_curriculum_pkey PRIMARY KEY (student_id, curriculum_id);


--
-- Name: student student_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_email_key UNIQUE (email);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: student student_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_registration_number_key UNIQUE (registration_number);


--
-- Name: study_formation study_formation_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_formation
    ADD CONSTRAINT study_formation_code_key UNIQUE (code);


--
-- Name: study_formation study_formation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_formation
    ADD CONSTRAINT study_formation_pkey PRIMARY KEY (id);


--
-- Name: system_setting system_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_setting
    ADD CONSTRAINT system_setting_key_key UNIQUE (key);


--
-- Name: system_setting system_setting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_setting
    ADD CONSTRAINT system_setting_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: user_account user_account_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_email_key UNIQUE (email);


--
-- Name: user_account user_account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (id);


--
-- Name: user_account user_account_sso_subject_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_sso_subject_key UNIQUE (sso_subject);


--
-- Name: user_account user_account_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_account_username_key UNIQUE (username);


--
-- Name: user_group_member user_group_member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_member
    ADD CONSTRAINT user_group_member_pkey PRIMARY KEY (id);


--
-- Name: user_group user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- Name: validation_error validation_error_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validation_error
    ADD CONSTRAINT validation_error_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_actor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_actor ON public.audit_log_entry USING btree (actor_user_id);


--
-- Name: idx_audit_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_date ON public.audit_log_entry USING btree (occurred_at);


--
-- Name: idx_audit_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_entity ON public.audit_log_entry USING btree (entity_type, entity_id);


--
-- Name: idx_document_author; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_document_author ON public.document USING btree (author_id);


--
-- Name: idx_document_type_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_document_type_date ON public.document USING btree (type, created_at);


--
-- Name: idx_grade_snapshot; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grade_snapshot ON public.grade USING btree (curriculum_snapshot_id);


--
-- Name: idx_grade_student; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_grade_student ON public.grade USING btree (student_id);


--
-- Name: idx_student_formation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_formation ON public.student USING btree (study_formation_id);


--
-- Name: idx_student_registration; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_student_registration ON public.student USING btree (registration_number);


--
-- Name: audit_log_entry audit_log_entry_actor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: audit_log_entry audit_log_entry_data_import_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_data_import_job_id_fkey FOREIGN KEY (data_import_job_id) REFERENCES public.data_import_job(id) ON DELETE SET NULL;


--
-- Name: audit_log_entry audit_log_entry_grade_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_grade_id_fkey FOREIGN KEY (grade_id) REFERENCES public.grade(id) ON DELETE SET NULL;


--
-- Name: audit_log_entry audit_log_entry_operation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_operation_id_fkey FOREIGN KEY (operation_id) REFERENCES public.operation(id) ON DELETE SET NULL;


--
-- Name: audit_log_entry audit_log_entry_report_export_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_report_export_id_fkey FOREIGN KEY (report_export_id) REFERENCES public.report_export(id) ON DELETE SET NULL;


--
-- Name: audit_log_entry audit_log_entry_report_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log_entry
    ADD CONSTRAINT audit_log_entry_report_request_id_fkey FOREIGN KEY (report_request_id) REFERENCES public.report_request(id) ON DELETE SET NULL;


--
-- Name: auth_session auth_session_user_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_session
    ADD CONSTRAINT auth_session_user_account_id_fkey FOREIGN KEY (user_account_id) REFERENCES public.user_account(id) ON DELETE CASCADE;


--
-- Name: backup_job_recovery_point backup_job_recovery_point_backup_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_job_recovery_point
    ADD CONSTRAINT backup_job_recovery_point_backup_job_id_fkey FOREIGN KEY (backup_job_id) REFERENCES public.backup_job(id) ON DELETE CASCADE;


--
-- Name: backup_job_recovery_point backup_job_recovery_point_recovery_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_job_recovery_point
    ADD CONSTRAINT backup_job_recovery_point_recovery_point_id_fkey FOREIGN KEY (recovery_point_id) REFERENCES public.recovery_point(id) ON DELETE CASCADE;


--
-- Name: curriculum_snapshot curriculum_snapshot_curriculum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_snapshot
    ADD CONSTRAINT curriculum_snapshot_curriculum_id_fkey FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(id) ON DELETE CASCADE;


--
-- Name: curriculum curriculum_specialization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum
    ADD CONSTRAINT curriculum_specialization_id_fkey FOREIGN KEY (specialization_id) REFERENCES public.specialization(id) ON DELETE CASCADE;


--
-- Name: data_import_job data_import_job_initiated_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_import_job
    ADD CONSTRAINT data_import_job_initiated_by_user_id_fkey FOREIGN KEY (initiated_by_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: discipline discipline_curriculum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discipline
    ADD CONSTRAINT discipline_curriculum_id_fkey FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(id) ON DELETE CASCADE;


--
-- Name: document document_assigned_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_assigned_to_user_id_fkey FOREIGN KEY (assigned_to_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: document document_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document
    ADD CONSTRAINT document_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: e_grade_centralizer e_grade_centralizer_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_grade_centralizer
    ADD CONSTRAINT e_grade_centralizer_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_year(id) ON DELETE CASCADE;


--
-- Name: e_grade_centralizer e_grade_centralizer_report_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_grade_centralizer
    ADD CONSTRAINT e_grade_centralizer_report_request_id_fkey FOREIGN KEY (report_request_id) REFERENCES public.report_request(id) ON DELETE CASCADE;


--
-- Name: e_grade_centralizer e_grade_centralizer_specialization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.e_grade_centralizer
    ADD CONSTRAINT e_grade_centralizer_specialization_id_fkey FOREIGN KEY (specialization_id) REFERENCES public.specialization(id) ON DELETE CASCADE;


--
-- Name: grade grade_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_year(id) ON DELETE CASCADE;


--
-- Name: grade grade_curriculum_snapshot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_curriculum_snapshot_id_fkey FOREIGN KEY (curriculum_snapshot_id) REFERENCES public.curriculum_snapshot(id) ON DELETE CASCADE;


--
-- Name: grade grade_discipline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_discipline_id_fkey FOREIGN KEY (discipline_id) REFERENCES public.discipline(id) ON DELETE CASCADE;


--
-- Name: grade grade_graded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_graded_by_user_id_fkey FOREIGN KEY (graded_by_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: grade grade_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grade
    ADD CONSTRAINT grade_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- Name: import_job_rule import_job_rule_import_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_job_rule
    ADD CONSTRAINT import_job_rule_import_job_id_fkey FOREIGN KEY (import_job_id) REFERENCES public.data_import_job(id) ON DELETE CASCADE;


--
-- Name: import_job_rule import_job_rule_transformation_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_job_rule
    ADD CONSTRAINT import_job_rule_transformation_rule_id_fkey FOREIGN KEY (transformation_rule_id) REFERENCES public.data_transformation_rule(id) ON DELETE CASCADE;


--
-- Name: outlook_notification outlook_notification_sent_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outlook_notification
    ADD CONSTRAINT outlook_notification_sent_by_user_id_fkey FOREIGN KEY (sent_by_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: outlook_notification outlook_notification_user_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.outlook_notification
    ADD CONSTRAINT outlook_notification_user_group_id_fkey FOREIGN KEY (user_group_id) REFERENCES public.user_group(id) ON DELETE CASCADE;


--
-- Name: report_export report_export_exported_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_export
    ADD CONSTRAINT report_export_exported_by_user_id_fkey FOREIGN KEY (exported_by_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: report_export report_export_report_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_export
    ADD CONSTRAINT report_export_report_request_id_fkey FOREIGN KEY (report_request_id) REFERENCES public.report_request(id) ON DELETE CASCADE;


--
-- Name: report_request report_request_report_definition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_request
    ADD CONSTRAINT report_request_report_definition_id_fkey FOREIGN KEY (report_definition_id) REFERENCES public.report_definition(id) ON DELETE CASCADE;


--
-- Name: report_request report_request_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_request
    ADD CONSTRAINT report_request_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: report_row report_row_centralizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_row
    ADD CONSTRAINT report_row_centralizer_id_fkey FOREIGN KEY (centralizer_id) REFERENCES public.e_grade_centralizer(id) ON DELETE CASCADE;


--
-- Name: report_row report_row_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_row
    ADD CONSTRAINT report_row_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- Name: role_operation role_operation_operation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_operation
    ADD CONSTRAINT role_operation_operation_id_fkey FOREIGN KEY (operation_id) REFERENCES public.operation(id) ON DELETE CASCADE;


--
-- Name: role_operation role_operation_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_operation
    ADD CONSTRAINT role_operation_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: role_permission role_permission_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permission(id) ON DELETE CASCADE;


--
-- Name: role_permission role_permission_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: rollback_operation rollback_operation_recovery_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rollback_operation
    ADD CONSTRAINT rollback_operation_recovery_point_id_fkey FOREIGN KEY (recovery_point_id) REFERENCES public.recovery_point(id) ON DELETE SET NULL;


--
-- Name: rollback_operation rollback_operation_triggered_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rollback_operation
    ADD CONSTRAINT rollback_operation_triggered_by_user_id_fkey FOREIGN KEY (triggered_by_user_id) REFERENCES public.user_account(id) ON DELETE SET NULL;


--
-- Name: student_curriculum student_curriculum_curriculum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_curriculum
    ADD CONSTRAINT student_curriculum_curriculum_id_fkey FOREIGN KEY (curriculum_id) REFERENCES public.curriculum(id) ON DELETE CASCADE;


--
-- Name: student_curriculum student_curriculum_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_curriculum
    ADD CONSTRAINT student_curriculum_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id) ON DELETE CASCADE;


--
-- Name: student_curriculum student_curriculum_study_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_curriculum
    ADD CONSTRAINT student_curriculum_study_formation_id_fkey FOREIGN KEY (study_formation_id) REFERENCES public.study_formation(id);


--
-- Name: student student_study_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_study_formation_id_fkey FOREIGN KEY (study_formation_id) REFERENCES public.study_formation(id) ON DELETE SET NULL;


--
-- Name: study_formation study_formation_specialization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.study_formation
    ADD CONSTRAINT study_formation_specialization_id_fkey FOREIGN KEY (specialization_id) REFERENCES public.specialization(id) ON DELETE CASCADE;


--
-- Name: user_group_member user_group_member_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_member
    ADD CONSTRAINT user_group_member_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.user_group(id) ON DELETE CASCADE;


--
-- Name: user_group_member user_group_member_user_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_group_member
    ADD CONSTRAINT user_group_member_user_account_id_fkey FOREIGN KEY (user_account_id) REFERENCES public.user_account(id) ON DELETE CASCADE;


--
-- Name: user_role user_role_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(id) ON DELETE CASCADE;


--
-- Name: user_role user_role_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(id) ON DELETE CASCADE;


--
-- Name: validation_error validation_error_import_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validation_error
    ADD CONSTRAINT validation_error_import_job_id_fkey FOREIGN KEY (import_job_id) REFERENCES public.data_import_job(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


