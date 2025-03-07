import { ReportData } from '../types/report';

export const useReportValidation = (reportData: ReportData) => {
  const validate = (): string[] => {
    const errors: string[] = [];

    if (!reportData.title.trim()) {
      errors.push('Vui lòng nhập tên bài thực hành');
    }

    if (!reportData.students.some(s => s.name && s.studentCode)) {
      errors.push('Vui lòng nhập thông tin ít nhất một sinh viên');
    }

    if (!reportData.classGroup.trim()) {
      errors.push('Vui lòng nhập thông tin nhóm');
    }

    if (!reportData.className.trim()) {
      errors.push('Vui lòng nhập thông tin lớp');
    }

    if (!reportData.instructor.userId) {
      errors.push('Vui lòng chọn giảng viên hướng dẫn');
    }

    if (!reportData.shift.trim()) {
      errors.push('Vui lòng chọn ca thực hành');
    }

    if (!reportData.reportContents.length) {
      errors.push('Vui lòng thêm ít nhất một nội dung thực hành');
    }

    const studentCodes = reportData.students.map(s => s.studentCode);
    const uniqueCodes = new Set(studentCodes.filter(Boolean));
    if (studentCodes.filter(Boolean).length !== uniqueCodes.size) {
      errors.push('Mã sinh viên không được trùng nhau');
    }

    return errors;
  };

  return { validate };
};