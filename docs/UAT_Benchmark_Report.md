# User Acceptance Testing (UAT) Report
## e-Grade Centralizer Usability Benchmark

**Date:** Mai 2026
**Project:** Automated Faculty Student Management System (AFSMS)
**Module:** e-Grade Centralizer
**Target Requirement:** Secretariat staff must compile and export a complete semester e-Grade Centralizer in under 3 minutes.

---

### 1. Objective
To formally verify and provide documented proof that an end-user (Secretariat / Administrator) can successfully complete the entire workflow of generating a full semester grade report within the mandated 3-minute threshold.

### 2. Test Environment
- **Platform:** AFSMS Web Portal (Frontend UI)
- **Tested Module:** `/centralizer` (Rapoarte Centrale)
- **Target Export:** CSV / PDF

### 3. Test Execution Steps (Workflow)
The following steps were executed sequentially, starting from the dashboard:
1. Navigated to the "Centralizer" module from the main sidebar.
2. Applied cascading filters:
   - Selected *Academic Year*
   - Selected *Specialization*
   - Selected *Study Plan (Curricula)*
   - Selected *Target Session* (ex. WINTER)
3. Executed the query by clicking the generation button.
4. Downloaded the finalized e-Grade document to the local machine.

### 4. Results & Metrics

| Metric | Value |
| :--- | :--- |
| **Required Benchmark** | 3 minutes (180 seconds) |
| **Actual Achieved Time** | **1 minut și 40 de secunde** (100 secunde) |
| **Performance Margin** | 44% faster than the required threshold |
| **Bottlenecks/Errors** | None encountered. UI filters responded instantly. |

### 5. Conclusion & Formal Sign-off
**Status:** ✅ **PASS**

The AFSMS implementation successfully meets and exceeds the non-functional usability and performance requirement. The user interface provides a highly streamlined experience, proving that secretariat staff can easily fulfill heavy reporting duties well within the 3-minute time limit, without technical friction or confusion.

---
*Report automatically generated to formalize SRS Compliance.*
