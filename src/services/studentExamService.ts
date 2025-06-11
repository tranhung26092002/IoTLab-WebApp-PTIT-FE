export const gradeEssayAnswer = async (studentExamId: number, questionId: number, score: number) => {
  return axiosInstance.post<StudentExamResult>(
    `/api/student-exams/${studentExamId}/questions/${questionId}/grade?score=${score}`
  );
}; 