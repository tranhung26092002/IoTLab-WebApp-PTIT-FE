import React, { useState } from 'react';
import { Card, Button, Select, Input, message, Spin } from 'antd';
import { PlusOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import AppLayout from "../components/AppLayout";
import { ReportContentTable } from '../components/report/ReportContentTable';
import { useReportValidation } from '../hooks/useReportValidation';
import { ReportData, ReportContent } from '../types/report';
import { useReport } from '../hooks/useReport';
import dayjs from 'dayjs';
import { useUsers } from '../hooks/useUsers';
import { StudentList } from '../components/report/StudentList';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { TextArea } = Input;

const Report: React.FC = () => {
  const navigate = useNavigate();  
  const [searchParams] = useSearchParams();
  const practiceId = Number(searchParams.get('practiceId')) || 0;
  const practiceTitle = searchParams.get('title') || '';

  const {
    submitReport,
    saveAsDraft,
    isSubmitting,
    isSaving,
  } = useReport();

  const {
    me, 
    instructors,
    isLoadingInstructors,
  } = useUsers({
      enableMe: true,
      enableInstructors: true
  });

  const initialReportData: ReportData = {
    title: practiceTitle,
    practiceId: practiceId,
    students: [{ name: '', id: 0, studentCode: '' }],
    classGroup: '',
    className: '',
    instructor: { id: 0, name: '' },
    shift: '',
    reportContents: [ { id: 0, content: '', performer: '', imageUrl: '', evaluation: 0, userId: 0 } ],
    discussion: '',
  };

  const [reportData, setReportData] = useState<ReportData>(initialReportData);

  React.useEffect(() => {
    if (practiceId) {
      setReportData(prev => ({
        ...prev,
        practiceId
      }));
    }
  }, [practiceId]);

  React.useEffect(() => {
    if (me) {
      setReportData(prev => ({
        ...prev,
        students: [{
          name: me.fullName || '',
          id: me.id || 0,
          studentCode: me.userName || ''
        }]
      }));
    }
  }, [me]);

  const handleInputChange = (field: keyof ReportData, value: string) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteStudent = (indexToDelete: number) => {
    if (reportData.students.length <= 1) {
      message.warning('Phải có ít nhất một sinh viên');
      return;
    }
    setReportData(prev => ({
      ...prev,
      students: prev.students.filter((_, index) => index !== indexToDelete)
    }));
  };

  const handleContentChange = (index: number, value: string) => {
    const newContents = [...reportData.reportContents];
    newContents[index] = { ...newContents[index], content: value };
    setReportData(prev => ({ ...prev, reportContents: newContents }));
  };
  
  const handlePerformerChange = (index: number, userId: number, name: string) => {
    const newContents = [...reportData.reportContents];
    newContents[index] = { 
      ...newContents[index], 
      performer: name,
      userId: userId 
    };
    setReportData(prev => ({ ...prev, reportContents: newContents }));
  };
  
  const handleImageUpload = (index: number, url: string) => {
    const newContents = [...reportData.reportContents];
    newContents[index] = { ...newContents[index], imageUrl: url };
    setReportData(prev => ({ ...prev, reportContents: newContents }));
  };
  
  const handleDeleteContent = (index: number) => {
    setReportData(prev => ({
      ...prev,
      reportContents: prev.reportContents.filter((_, i) => i !== index)
    }));
  };
  
  const addReportContent = () => {
    const newContent: ReportContent = {
      id: 0,
      content: '',
      performer: '',
      imageUrl: '',
      evaluation: 0,
      userId: 0
    };
    setReportData(prev => ({
      ...prev,
      reportContents: [...prev.reportContents, newContent]
    }));
  };

  const { validate } = useReportValidation(reportData);

  const handleSaveDraft = async () => {
    try {
      await saveAsDraft(reportData);
      message.success('Đã lưu bản nháp');
    } catch (error) {
      // Error handling is done by the hook
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
    }
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length) {
      errors.forEach(error => message.error(error));
      return;
    }

    try {
      await submitReport(reportData);
      // Reset form after successful submission
      setReportData(initialReportData);
      message.success('Nộp báo cáo thành công!');
      navigate(`/report-history`);
    } catch (error) {
      // Error handling is done by the hook
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
    }
  };

  return (
    <AppLayout>
      <Spin spinning={isSubmitting || isSaving}>
        <Card className="mx-auto max-w-5xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center primary--color mb-8">
            Phiếu báo cáo kết quả thực hành (Sinh viên)
          </h1>

          <div className="space-y-6">
            {/* Tên bài thực hành */}
            <div className="flex flex-col gap-2">
              <label className="text-xl font-semibold primary--color">
                Tên bài thực hành
              </label>
              <Input 
                placeholder="Nhập tên bài thực hành" 
                value={reportData.title}
                className="w-full" 
                readOnly
              />
            </div>

            {/* Thông tin sinh viên */}
            <StudentList
              students={reportData.students}
              onAddStudent={(student) => {
                setReportData(prev => ({
                  ...prev,
                  students: [...prev.students, {
                    id: student.id,
                    name: student.name,
                    studentCode: student.studentCode
                  }]
                }));
              }}
              onDeleteStudent={handleDeleteStudent}
            />

            {/* Thông tin lớp và thời gian */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold primary--color">Thông tin lớp và thời gian</h2>
              <div className="space-y-4">
                {/* Row 1: Group, Class, Date */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 font-medium">Nhóm</label>
                    <Input 
                      placeholder="Nhóm" 
                      value={reportData.classGroup}
                      onChange={(e) => handleInputChange('classGroup', e.target.value)}
                      maxLength={10}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 font-medium">Lớp</label>
                    <Input 
                      placeholder="Lớp" 
                      value={reportData.className}
                      onChange={(e) => handleInputChange('className', e.target.value)}
                      maxLength={20}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 font-medium">Ngày thực hành</label>
                    <Input 
                      value={dayjs().format('DD/MM/YYYY')}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                {/* Row 2: Instructor and Practice Session */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 font-medium">
                      Giảng viên hướng dẫn
                    </label>
                    <Select 
                      placeholder="Chọn giảng viên" 
                      value={reportData.instructor?.id || undefined}
                      onChange={(value) => {
                        const selectedInstructor = instructors?.find(i => i.id === value);
                        if (selectedInstructor) {
                          setReportData(prev => ({
                            ...prev,
                            instructor: {
                              id: selectedInstructor.id,
                              name: selectedInstructor.name
                            }
                          }));
                        }
                      }}
                      className="w-full"
                      loading={isLoadingInstructors}
                      showSearch
                      optionFilterProp="children"
                      notFoundContent={
                        isLoadingInstructors ? 'Đang tải...' : 
                        (!instructors || instructors.length === 0) ? 'Không có giảng viên' : undefined
                      }
                    >
                      {(instructors && instructors.length > 0) && 
                        instructors.map(instructor => (
                          <Select.Option 
                            key={instructor.id}
                            value={instructor.id}
                          >
                            {instructor.name}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-600 font-medium">
                      Ca thực hành
                    </label>
                    <Select 
                      placeholder="Chọn ca thực hành" 
                      value={reportData.shift}
                      onChange={(value) => handleInputChange('shift', value)}
                      className="w-full"
                    >
                      <Select.Option value="0">Ca 1 (08:00 - 12:00)</Select.Option>
                      <Select.Option value="1">Ca 2 (12:00 - 16:00)</Select.Option>
                      <Select.Option value="2">Ca 3 (16:00 - 20:00)</Select.Option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bảng nội dung thực hành */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold primary--color">Nội dung thực hành</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
              <ReportContentTable 
                practiceContents={reportData.reportContents}
                students={reportData.students}  // Add this
                onContentChange={handleContentChange}
                onPerformerChange={handlePerformerChange}
                onImageUpload={handleImageUpload}
                onDelete={handleDeleteContent}
              />
                <Button 
                  type="dashed" 
                  onClick={addReportContent} 
                  icon={<PlusOutlined />}
                  className="w-full mt-4"
                >
                  Thêm nội dung
                </Button>
              </div>
            </div>

            {/* Thảo luận */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold primary--color">Thảo luận sinh viên</h2>
              <div className="flex flex-col gap-2">
                <TextArea 
                  rows={6} 
                  value={reportData.discussion}
                  onChange={(e) => handleInputChange('discussion', e.target.value)}
                  placeholder="Nhập nội dung thảo luận..."
                  className="w-full"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button 
                type="default"
                size="large"
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                loading={isSaving}
                className="min-w-[140px]"
              >
                Lưu bản nháp
              </Button>
              <Button 
                type="primary" 
                size="large"
                icon={<SendOutlined />}
                onClick={handleSubmit}
                loading={isSubmitting}
                className="min-w-[140px]"
              >
                Nộp báo cáo
              </Button>
            </div>
          </div>
        </Card>
      </Spin>
    </AppLayout>
  );
};

export default Report;