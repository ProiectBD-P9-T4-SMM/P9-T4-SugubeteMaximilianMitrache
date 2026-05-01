const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');
const Papa = require('papaparse');
const XLSX = require('xlsx');

router.use(requireAuth);

/**
 * Shared Dynamic Query Builder for Centralizer
 */
async function getCentralizerData(filters) {
    const { 
        specialization_id, 
        study_year, 
        education_form, 
        academic_year_id,
        curriculum_id,
        discipline_id,
        group_index,
        degree_level
    } = filters;

    let query = `
        SELECT 
            s.id as student_id, s.registration_number, 
            CONCAT(s.last_name, ' ', s.first_name) as student_name,
            d.code as discipline_code, d.name as discipline_name, d.semester, d.ects_credits, d.evaluation_type,
            g.value as grade, g.exam_session, g.grading_date,
            sf.code as formation_code, spec.name as spec_name, COALESCE(spec.degree_level, 'Nespecificat') as degree_level
        FROM STUDENT s
        LEFT JOIN STUDENT_CURRICULUM sc ON s.id = sc.student_id
        LEFT JOIN STUDY_FORMATION sf ON COALESCE(sc.study_formation_id, s.study_formation_id) = sf.id
        LEFT JOIN CURRICULUM c ON sc.curriculum_id = c.id
        LEFT JOIN SPECIALIZATION spec ON COALESCE(c.specialization_id, sf.specialization_id) = spec.id
        -- Join disciplines: either from curriculum OR from existing grades
        INNER JOIN LATERAL (
            SELECT d.* FROM DISCIPLINE d WHERE d.curriculum_id = c.id
            UNION
            SELECT d.* FROM GRADE g2 JOIN DISCIPLINE d ON g2.discipline_id = d.id WHERE g2.student_id = s.id
        ) d ON TRUE
        LEFT JOIN GRADE g ON s.id = g.student_id AND d.id = g.discipline_id
        WHERE s.status IN ('ENROLLED', 'ACTIVE', 'GRADUATED')
    `;

    const params = [];
    let pIdx = 1;

    if (specialization_id) { query += ` AND spec.id = $${pIdx++}`; params.push(specialization_id); }
    if (degree_level) { query += ` AND spec.degree_level = $${pIdx++}`; params.push(degree_level); }
    if (study_year) { query += ` AND sf.study_year = $${pIdx++}`; params.push(parseInt(study_year)); }
    if (education_form) { query += ` AND sf.education_form = $${pIdx++}`; params.push(education_form); }
    if (curriculum_id) { query += ` AND c.id = $${pIdx++}`; params.push(curriculum_id); }
    if (discipline_id) { query += ` AND d.id = $${pIdx++}`; params.push(discipline_id); }
    if (group_index) { query += ` AND sf.group_index = $${pIdx++}`; params.push(parseInt(group_index)); }
    if (academic_year_id) { 
        // Logic: Filter disciplines that belong to the selected academic year based on curriculum start
        // Formula: StartYear + (DisciplineYear - 1) = SelectedYear
        query += ` 
            AND EXISTS (
                SELECT 1 FROM ACADEMIC_YEAR ay 
                WHERE ay.id = $${pIdx++} 
                AND EXTRACT(YEAR FROM c.valid_from) + CEIL(d.semester / 2.0) = ay.year_end
            )
        `; 
        params.push(academic_year_id); 
    }
    if (filters.semester) { query += ` AND d.semester = $${pIdx++}`; params.push(parseInt(filters.semester)); }
    if (filters.evaluation_type) { query += ` AND d.evaluation_type = $${pIdx++}`; params.push(filters.evaluation_type); }
    if (filters.cod) { 
        query += ` AND (s.registration_number ILIKE $${pIdx} OR d.code ILIKE $${pIdx} OR s.first_name ILIKE $${pIdx} OR s.last_name ILIKE $${pIdx})`; 
        params.push(`%${filters.cod}%`); 
        pIdx++;
    }
    if (filters.show_only_graded === true || filters.show_only_graded === 'true') {
        query += ` AND g.id IS NOT NULL`;
    }

    query += ` ORDER BY s.last_name ASC, s.first_name ASC, d.semester ASC, d.name ASC`;

    const startTime = Date.now();
    const result = await db.query(query, params);
    const duration = Date.now() - startTime;
    console.log(`[BENCHMARK] Centralizer generated in ${duration}ms for ${result.rows.length} records.`);
    return result;
}

// POST /api/reports/e-grade-centralizer
router.post('/e-grade-centralizer', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
    try {
        const result = await getCentralizerData(req.body);

        const studentsMap = new Map();
        result.rows.forEach(row => {
            if (!studentsMap.has(row.student_id)) {
                studentsMap.set(row.student_id, {
                    student_id: row.student_id,
                    registration_number: row.registration_number,
                    last_name: row.student_name.split(' ')[0],
                    first_name: row.student_name.split(' ').slice(1).join(' '),
                    formation_code: row.formation_code,
                    spec_name: row.spec_name,
                    degree_level: row.degree_level,
                    disciplines: {} // Use object for deduplication
                });
            }
            
            const student = studentsMap.get(row.student_id);
            const dKey = row.discipline_code;
            
            // Keep best grade
            if (!student.disciplines[dKey] || (row.grade && (!student.disciplines[dKey].grade || parseFloat(row.grade) > parseFloat(student.disciplines[dKey].grade)))) {
                student.disciplines[dKey] = {
                    discipline_code: row.discipline_code,
                    discipline_name: row.discipline_name,
                    semester: row.semester,
                    ects_credits: row.ects_credits,
                    grade: row.grade,
                    exam_session: row.exam_session
                };
            }
        });

        const students = Array.from(studentsMap.values()).map(s => {
            const disciplineList = Object.values(s.disciplines);
            return {
                ...s,
                disciplines: disciplineList,
                total_ects: disciplineList.filter(d => d.grade >= 5).reduce((sum, d) => sum + d.ects_credits, 0),
                average_grade: disciplineList.filter(d => d.grade !== null).length > 0 
                    ? (disciplineList.filter(d => d.grade !== null).reduce((sum, d) => sum + (parseFloat(d.grade) === 0 ? 1 : parseFloat(d.grade)), 0) / disciplineList.filter(d => d.grade !== null).length).toFixed(2)
                    : null
            };
        });

        res.json({
            success: true,
            student_count: students.length,
            students,
            generated_at: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/reports/e-grade-centralizer/export/csv
router.post('/e-grade-centralizer/export/csv', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
    try {
        const result = await getCentralizerData(req.body);
        const csv = Papa.unparse(result.rows);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="Centralizator_${new Date().getTime()}.csv"`);
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

// POST /api/reports/e-grade-centralizer/export/xlsx
router.post('/e-grade-centralizer/export/xlsx', requireRole(['SECRETARIAT', 'ADMIN']), async (req, res, next) => {
    try {
        const result = await getCentralizerData(req.body);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(result.rows);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Centralizator');
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="Centralizator_${new Date().getTime()}.xlsx"`);
        res.send(buffer);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
