import React, { useState, useEffect } from 'react';
import { Typography, Card, Radio, Space, Input, Upload, Button, message, Progress, Modal, Tag, Tooltip, Steps } from 'antd';
import { UploadOutlined, FileImageOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { Student } from '../types/student';
import { Exam, StudentExam, QuestionType, QuestionDifficulty, ExamStatus } from '../types/exam';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ExamPageProps {
  student?: Student;
  exam?: Exam;
}

const ExamPage: React.FC<ExamPageProps> = (_) => {
  // States
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [preparationTime, setPreparationTime] = useState(5 * 60); // 5 minutes preparation
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const WARNING_TIME = 5 * 60; // 5 minutes in seconds

  // Sample student info
  const [studentInfo] = useState<Student>({
    id: 1,
    userId: 1,
    name: "Nguyễn Văn A",
    studentCode: "B20DCCN001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Sample exam info
  const [examInfo] = useState<Exam>({
    id: 1,
    templateId: 1,
    title: "Kiểm tra IoT Cơ Bản",
    description: "Bài kiểm tra kiến thức cơ bản về IoT, bao gồm phần trắc nghiệm và thực hành.",
    duration: 30,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    questions: Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      content: `Câu hỏi ${index + 1}: Đây là nội dung câu hỏi trắc nghiệm...`,
      type: index < 20 ? QuestionType.MULTIPLE_CHOICE : QuestionType.ESSAY,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'IoT Basics',
      options: index < 20 ? ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'] : undefined,
      correctOption: index < 20 ? 0 : undefined,
      points: index < 20 ? 1 : 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    status: ExamStatus.PUBLISHED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Student exam state
  const [studentExam, setStudentExam] = useState<StudentExam>({
    id: 1,
    examId: examInfo.id,
    studentId: studentInfo.userId,
    startTime: new Date().toISOString(),
    multipleChoiceAnswers: {},
    essayAnswers: {},
    status: ExamStatus.DRAFT, // Start as draft, then move to published when started
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Timer state
  const [timeLeft, setTimeLeft] = useState(examInfo.duration * 60);

  // Calculate progress
  const answeredQuestions = Object.keys(studentExam.multipleChoiceAnswers).length;
  const progressPercent = (answeredQuestions / examInfo.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).length) * 100;

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamStarted) {
      setStudentExam(prev => ({
        ...prev,
        status: ExamStatus.PUBLISHED,
        updatedAt: new Date().toISOString(),
      }));
      timer = setInterval(() => {
        setTimeLeft(prev => {
          // Show warning when 5 minutes remaining
          if (prev === WARNING_TIME) {
            setShowTimeWarning(true);
          }
          
          if (prev <= 0) {
            clearInterval(timer);
            handleExamSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      timer = setInterval(() => {
        setPreparationTime(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamStarted]);

  // Handle exam start
  const handleStartExam = () => {
    setIsExamStarted(true);
    setTimeLeft(examInfo.duration * 60);
    message.success('Bài kiểm tra đã bắt đầu!');
  };

  // Handle multiple choice answer selection
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setStudentExam(prev => ({
      ...prev,
      multipleChoiceAnswers: {
        ...prev.multipleChoiceAnswers,
        [questionId]: optionIndex,
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle essay answer update
  const handleEssayAnswer = (questionId: number, answer: string) => {
    setStudentExam(prev => ({
      ...prev,
      essayAnswers: {
        ...prev.essayAnswers,
        [questionId]: {
          answer,
          images: prev.essayAnswers[questionId]?.images || [],
        },
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle image upload
  const handleImageUpload = (questionId: number, file: File) => {
    // Simulate image upload
    setTimeout(() => {
      setStudentExam(prev => ({
        ...prev,
        essayAnswers: {
          ...prev.essayAnswers,
          [questionId]: {
            answer: prev.essayAnswers[questionId]?.answer || '',
            images: [
              ...(prev.essayAnswers[questionId]?.images || []),
              URL.createObjectURL(file),
            ].slice(0, 3), // Keep only the last 3 images
          },
        },
        updatedAt: new Date().toISOString(),
      }));
    }, 1000);
    return false;
  };

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle exam submit
  const handleExamSubmit = () => {
    const unansweredQuestions = examInfo.questions
      .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
      .filter(q => !studentExam.multipleChoiceAnswers[q.id]);

    if (unansweredQuestions.length > 0) {
      Modal.confirm({
        title: 'Xác nhận nộp bài',
        icon: <ExclamationCircleOutlined />,
        content: `Bạn còn ${unansweredQuestions.length} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`,
        okText: 'Nộp bài',
        cancelText: 'Kiểm tra lại',
        onOk: () => {
          submitExam();
        },
      });
    } else {
      submitExam();
    }
  };

  const submitExam = () => {
    setStudentExam(prev => ({
      ...prev,
      endTime: new Date().toISOString(),
      status: ExamStatus.COMPLETED,
      updatedAt: new Date().toISOString(),
    }));
    message.success('Đã nộp bài thành công!');
  };

  // Scroll to question function
  const scrollToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add highlight effect
      element.classList.add('highlight-question');
      setTimeout(() => {
        element.classList.remove('highlight-question');
      }, 2000);
      setShowProgressModal(false);
    }
  };

  // Pre-exam screen
  if (!isExamStarted) {
    return (
      <AppLayout>
        <div className="p-6">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
              <FormOutlined /> Kiểm Tra Trực Tuyến
            </Typography.Title>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-6">
                <Steps
                  current={currentStep}
                  items={[
                    { title: 'Thông tin', description: 'Kiểm tra thông tin' },
                    { title: 'Chuẩn bị', description: 'Thời gian chuẩn bị' },
                    { title: 'Bắt đầu', description: 'Làm bài kiểm tra' },
                  ]}
                  className="mb-8"
                />

                <div className="space-y-6">
                  {/* Student Info */}
                  <div>
                    <Title level={4} className="flex items-center gap-2">
                      <UserOutlined /> Thông tin sinh viên
                    </Title>
                    <Card className="bg-[var(--bg-secondary)]">
                      <div className="grid grid-cols-2 gap-4">
                        <Paragraph><strong>Họ và tên:</strong> {studentInfo.name}</Paragraph>
                        <Paragraph><strong>Mã sinh viên:</strong> {studentInfo.studentCode}</Paragraph>
                      </div>
                    </Card>
                  </div>

                  {/* Exam Info */}
                  <div>
                    <Title level={4} className="flex items-center gap-2">
                      <BookOutlined /> Thông tin bài kiểm tra
                    </Title>
                    <Card className="bg-[var(--bg-secondary)]">
                      <div className="grid grid-cols-2 gap-4">
                        <Paragraph><strong>Mã bài kiểm tra:</strong> {examInfo.id}</Paragraph>
                        <Paragraph><strong>Thời gian:</strong> {examInfo.duration} phút</Paragraph>
                        <Paragraph><strong>Số câu hỏi:</strong> {examInfo.questions.length} câu</Paragraph>
                        <Paragraph><strong>Loại bài:</strong> Trắc nghiệm và Thực hành</Paragraph>
                      </div>
                      <Paragraph className="mt-4">
                        <strong>Mô tả:</strong> {examInfo.description}
                      </Paragraph>
                    </Card>
                  </div>

                  {/* Preparation Timer */}
                  <Card className="text-center">
                    <Title level={4} className="text-primary--color">
                      Thời gian chuẩn bị
                    </Title>
                    <Text className="text-3xl font-bold block mb-4">
                      {formatTime(preparationTime)}
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleStartExam}
                      disabled={preparationTime > 0}
                    >
                      {preparationTime > 0 ? 'Vui lòng đợi...' : 'Bắt đầu làm bài'}
                    </Button>
                  </Card>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Exam interface
  return (
    <AppLayout>
      <div className="p-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography.Title level={2} className="forest--dark--color flex items-center gap-2">
            <FormOutlined /> Bài Kiểm Tra: {examInfo.title}
          </Typography.Title>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <Text className="text-base">{studentInfo.name} - {studentInfo.studentCode}</Text>
              </div>
              <Card className="flex items-center gap-2 bg-[var(--bg-secondary)]">
                <ClockCircleOutlined className="text-xl primary--color" />
                <Text className="text-lg font-semibold primary--color">
                  {formatTime(timeLeft)}
                </Text>
              </Card>
            </div>

            {/* Progress */}
            <Card className="mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress 
                    percent={progressPercent} 
                    status="active"
                    strokeColor={{
                      '0%': '#4f6f52',
                      '100%': '#739072',
                    }}
                  />
                </div>
                <Text className="text-lg primary--color">
                  {answeredQuestions}/{examInfo.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).length} câu đã trả lời
                </Text>
              </div>
            </Card>
          </motion.div>

          {/* Multiple Choice Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6">
              <Title level={3} className="forest--dark--color mb-6">
                Phần 1: Trắc nghiệm
              </Title>
              <Space direction="vertical" className="w-full" size="large">
                {examInfo.questions
                  .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
                  .map((question) => (
                    <div 
                      key={question.id} 
                      id={`question-${question.id}`}
                      className="border-b border-[var(--border-color)] pb-4 last:border-0 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Text className="text-lg">{question.content}</Text>
                        <Tag color={studentExam.multipleChoiceAnswers[question.id] !== undefined ? 'success' : 'warning'}>
                          {studentExam.multipleChoiceAnswers[question.id] !== undefined ? 'Đã trả lời' : 'Chưa trả lời'}
                        </Tag>
                      </div>
                      <Radio.Group
                        onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                        value={studentExam.multipleChoiceAnswers[question.id]}
                      >
                        <Space direction="vertical" className="w-full">
                          {question.options?.map((option, index) => (
                            <Radio 
                              key={index} 
                              value={index}
                              className="text-base py-2 w-full"
                            >
                              {option}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>
                  ))}
              </Space>
            </Card>
          </motion.div>

          {/* Essay Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <Title level={3} className="forest--dark--color mb-6">
                Phần 2: Thực hành
              </Title>
              <Space direction="vertical" className="w-full" size="large">
                {examInfo.questions
                  .filter(q => q.type === QuestionType.ESSAY)
                  .map((question) => (
                    <div key={question.id} className="space-y-6">
                      <Text className="text-lg block">
                        {question.content}
                      </Text>
                      <TextArea
                        rows={6}
                        value={studentExam.essayAnswers[question.id]?.answer}
                        onChange={(e) => handleEssayAnswer(question.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn ở đây..."
                        className="text-base"
                      />
                      <div>
                        <Text className="text-base block mb-4">
                          Tải lên hình ảnh minh họa (tối đa 3 ảnh):
                        </Text>
                        <Upload
                          beforeUpload={(file) => handleImageUpload(question.id, file)}
                          multiple={false}
                          accept="image/*"
                          showUploadList={true}
                          listType="picture"
                          fileList={studentExam.essayAnswers[question.id]?.images.map((url, index) => ({
                            uid: `-${index}`,
                            name: `image-${index + 1}`,
                            status: 'done',
                            url,
                          }))}
                          maxCount={3}
                        >
                          <Button 
                            icon={<UploadOutlined />}
                            className="flex items-center gap-2"
                            disabled={studentExam.essayAnswers[question.id]?.images.length >= 3}
                          >
                            <FileImageOutlined /> Tải lên ảnh
                          </Button>
                        </Upload>
                      </div>
                    </div>
                  ))}
              </Space>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 flex justify-end"
          >
            <Button 
              type="primary" 
              size="large"
              className="min-w-[200px]"
              onClick={handleExamSubmit}
            >
              Nộp bài
            </Button>
          </motion.div>

          {/* Floating Progress Button */}
          <div 
            className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50"
            style={{ marginTop: '60px' }}
          >
            <Tooltip title="Xem tiến độ làm bài" placement="left">
              <Button
                type="primary"
                size="large"
                className="w-[60px] h-[60px] rounded-lg shadow-lg bg-[#4f6f52] hover:bg-[#3a5a40] flex items-center justify-center"
                onClick={() => setShowProgressModal(true)}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{answeredQuestions}</div>
                  <div className="text-xs">/ {examInfo.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).length}</div>
                </div>
              </Button>
            </Tooltip>
          </div>

          {/* Progress Modal */}
          <Modal
            title={
              <div className="flex items-center justify-between">
                <span>Tiến độ làm bài</span>
                <Text className="text-lg primary--color">
                  {answeredQuestions}/{examInfo.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).length} câu đã trả lời
                </Text>
              </div>
            }
            open={showProgressModal}
            onCancel={() => setShowProgressModal(false)}
            footer={null}
            width={600}
            bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
          >
            <div className="space-y-6">
              {/* Overall Progress */}
              <Card className="bg-[var(--bg-secondary)]">
                <Progress 
                  percent={progressPercent} 
                  status="active"
                  strokeColor={{
                    '0%': '#4f6f52',
                    '100%': '#739072',
                  }}
                />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#4f6f52]"></div>
                    <Text>Đã trả lời: {answeredQuestions} câu</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#f0f0f0]"></div>
                    <Text>Chưa trả lời: {examInfo.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE).length - answeredQuestions} câu</Text>
                  </div>
                </div>
              </Card>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-4">
                {examInfo.questions
                  .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
                  .map((question) => (
                    <Tooltip 
                      key={question.id}
                      title={
                        <div className="text-center">
                          <div className="font-bold mb-1">Câu {question.id}</div>
                          <div>{studentExam.multipleChoiceAnswers[question.id] !== undefined ? 'Đã trả lời' : 'Chưa trả lời'}</div>
                        </div>
                      }
                    >
                      <Button
                        type={studentExam.multipleChoiceAnswers[question.id] !== undefined ? 'primary' : 'default'}
                        className={`w-full h-12 ${
                          studentExam.multipleChoiceAnswers[question.id] !== undefined 
                            ? 'bg-[#4f6f52] hover:bg-[#3a5a40]' 
                            : 'hover:border-[#4f6f52] hover:text-[#4f6f52]'
                        }`}
                        onClick={() => scrollToQuestion(question.id)}
                      >
                        {question.id}
                      </Button>
                    </Tooltip>
                  ))}
              </div>
            </div>
          </Modal>

          {/* Time Warning Modal */}
          <Modal
            title={
              <div className="flex items-center gap-2 text-[#ff4d4f]">
                <ClockCircleOutlined />
                <span>Sắp hết thời gian!</span>
              </div>
            }
            open={showTimeWarning}
            onCancel={() => setShowTimeWarning(false)}
            footer={[
              <Button 
                key="cancel" 
                onClick={() => setShowTimeWarning(false)}
              >
                Tiếp tục làm bài
              </Button>,
              <Button 
                key="submit" 
                type="primary" 
                danger
                onClick={handleExamSubmit}
              >
                Nộp bài ngay
              </Button>,
            ]}
            centered
            closable={false}
            maskClosable={false}
          >
            <div className="text-center space-y-4">
              <ExclamationCircleOutlined className="text-5xl text-[#ff4d4f]" />
              <div>
                <Text className="text-lg block mb-2">
                  Còn 5 phút nữa là hết thời gian làm bài!
                </Text>
                <Text type="secondary">
                  Bạn có muốn nộp bài ngay bây giờ không?
                </Text>
              </div>
              <div className="p-3 bg-[#fff2f0] rounded-lg">
                <Text type="danger">
                  Lưu ý: Bài thi sẽ tự động được nộp khi hết thời gian.
                </Text>
              </div>
            </div>
          </Modal>

          <style>{`
            .highlight-question {
              background-color: rgba(79, 111, 82, 0.1);
              border-radius: 8px;
              transition: background-color 0.3s ease;
            }
          `}</style>
        </div>
      </div>
    </AppLayout>
  );
};

export default ExamPage; 