import React, { useState, useEffect } from 'react';
import { Typography, Card, Radio, Space, Input, Upload, Button, message, Progress, Modal, Tag, Tooltip, Steps } from 'antd';
import { UploadOutlined, FileImageOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import { Exam, StudentExam, QuestionType, ExamStatus, StudentAnswer } from '../types/exam';
import { useExam } from '../hooks/useExam';
import { useStudentExam } from '../hooks/useStudentExam';
import { useUsers } from '../hooks/useUsers';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ExamPage: React.FC = () => {
  // States
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [preparationTime, setPreparationTime] = useState(5 * 60); // 5 minutes preparation
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [currentStep] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const WARNING_TIME = 5 * 60; // 5 minutes in seconds

  // Hooks
  const { 
    getRandomExam,
    isGettingRandom
  } = useExam();
  const { 
    startExam,
    saveAnswers,
    submitExam,
    isStarting,
    isSavingAnswers,
    isSubmitting
  } = useStudentExam();
  const { me, getMe } = useUsers({ enableMe: true });

  // States for exam data
  const [examInfo, setExamInfo] = useState<Exam | null>(null);
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Get current user info on mount
  useEffect(() => {
    getMe();
  }, [getMe]);

  // Calculate progress
  const answeredQuestions = studentExam ? studentExam.answers.filter(a => a.selectedOption || a.essayAnswer).length : 0;
  const progressPercent = examInfo ? (answeredQuestions / examInfo.questions.length) * 100 : 0;

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamStarted && examInfo) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
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
  }, [isExamStarted, examInfo]);

  // Handle exam start
  const handleStartExam = async () => {
    try {
      // Get random exam
      const randomExam = await getRandomExam();
      setExamInfo(randomExam);
      setTimeLeft(60 * 60); // 1 hour default duration

      // Start student exam
      const startedExam = await startExam({
        examId: randomExam.id,
        studentId: me?.id || 0
      });
      setStudentExam(startedExam);
      setIsExamStarted(true);
      message.success('Bài kiểm tra đã bắt đầu!');
    } catch (error) {
      message.error('Không thể bắt đầu bài kiểm tra. Vui lòng thử lại!');
    }
  };

  // Handle multiple choice answer selection
  const handleAnswerSelect = async (questionId: number, optionIndex: number) => {
    if (!studentExam) return;

    try {
      const updatedAnswers = studentExam.answers.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, selectedOption: String.fromCharCode(65 + optionIndex) }
          : answer
      );

      await saveAnswers({
        studentExamId: studentExam.id,
        answers: {
          answers: updatedAnswers.map(answer => ({
            questionId: answer.questionId,
            questionType: answer.questionId === questionId ? QuestionType.MULTIPLE_CHOICE : QuestionType.ESSAY,
            selectedOption: answer.selectedOption,
            essayAnswer: answer.essayAnswer
          }))
        }
      });

      setStudentExam(prev => prev ? {
        ...prev,
        answers: updatedAnswers
      } : null);
    } catch (error) {
      message.error('Không thể lưu câu trả lời. Vui lòng thử lại!');
    }
  };

  // Handle essay answer update
  const handleEssayAnswer = async (questionId: number, answer: string) => {
    if (!studentExam) return;

    try {
      const updatedAnswers = studentExam.answers.map(a => 
        a.questionId === questionId 
          ? { ...a, essayAnswer: answer }
          : a
      );

      await saveAnswers({
        studentExamId: studentExam.id,
        answers: {
          answers: updatedAnswers.map(a => ({
            questionId: a.questionId,
            questionType: a.questionId === questionId ? QuestionType.ESSAY : QuestionType.MULTIPLE_CHOICE,
            selectedOption: a.selectedOption,
            essayAnswer: a.essayAnswer
          }))
        }
      });

      setStudentExam(prev => prev ? {
        ...prev,
        answers: updatedAnswers
      } : null);
    } catch (error) {
      message.error('Không thể lưu câu trả lời. Vui lòng thử lại!');
    }
  };

  // Handle image upload
  const handleImageUpload = async (questionId: number, file: File) => {
    if (!studentExam) return false;

    try {
      const updatedAnswers = studentExam.answers.map(a => 
        a.questionId === questionId 
          ? { 
              ...a, 
              imageUrls: [...(a.imageUrls || []), URL.createObjectURL(file)].slice(0, 3)
            }
          : a
      );

      await saveAnswers({
        studentExamId: studentExam.id,
        answers: {
          answers: updatedAnswers.map(a => ({
            questionId: a.questionId,
            questionType: a.questionId === questionId ? QuestionType.ESSAY : QuestionType.MULTIPLE_CHOICE,
            selectedOption: a.selectedOption,
            essayAnswer: a.essayAnswer,
            imageUrls: a.imageUrls
          }))
        },
        images: [file]
      });

      setStudentExam(prev => prev ? {
        ...prev,
        answers: updatedAnswers
      } : null);

      return false;
    } catch (error) {
      message.error('Không thể tải lên hình ảnh. Vui lòng thử lại!');
      return false;
    }
  };

  // Handle exam submit
  const handleExamSubmit = async () => {
    if (!studentExam) return;

    const unansweredQuestions = examInfo?.questions
      .filter(q => !studentExam.answers.find(a => a.questionId === q.id && (a.selectedOption || a.essayAnswer)));

    if (unansweredQuestions?.length) {
      Modal.confirm({
        title: 'Xác nhận nộp bài',
        icon: <ExclamationCircleOutlined />,
        content: `Bạn còn ${unansweredQuestions.length} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`,
        okText: 'Nộp bài',
        cancelText: 'Kiểm tra lại',
        onOk: async () => {
          try {
            await submitExam(studentExam.id);
            setStudentExam(prev => prev ? {
              ...prev,
              status: ExamStatus.SUBMITTED,
              endTime: new Date().toISOString()
            } : null);
            message.success('Đã nộp bài thành công!');
          } catch (error) {
            message.error('Không thể nộp bài. Vui lòng thử lại!');
          }
        }
      });
    } else {
      try {
        await submitExam(studentExam.id);
        setStudentExam(prev => prev ? {
          ...prev,
          status: ExamStatus.SUBMITTED,
          endTime: new Date().toISOString()
        } : null);
        message.success('Đã nộp bài thành công!');
      } catch (error) {
        message.error('Không thể nộp bài. Vui lòng thử lại!');
      }
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Scroll to question function
  const scrollToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
                        <Paragraph><strong>Họ và tên:</strong> {me?.fullName}</Paragraph>
                        <Paragraph><strong>Mã sinh viên:</strong> {me?.id}</Paragraph>
                      </div>
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
                      disabled={preparationTime > 0 || isGettingRandom || isStarting}
                      loading={isGettingRandom || isStarting}
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
  if (!examInfo || !studentExam) {
    return null;
  }

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
                <Text className="text-base">{me?.fullName} - {me?.id}</Text>
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
                  {answeredQuestions}/{examInfo.questions.length} câu đã trả lời
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
                  .filter(q => q.question.type === QuestionType.MULTIPLE_CHOICE)
                  .map((examQuestion) => (
                    <div 
                      key={examQuestion.id} 
                      id={`question-${examQuestion.id}`}
                      className="border-b border-[var(--border-color)] pb-4 last:border-0 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Text className="text-lg">{examQuestion.question.content}</Text>
                        <Tag color={studentExam.answers.find(a => a.questionId === examQuestion.id && a.selectedOption) ? 'success' : 'warning'}>
                          {studentExam.answers.find(a => a.questionId === examQuestion.id && a.selectedOption) ? 'Đã trả lời' : 'Chưa trả lời'}
                        </Tag>
                      </div>
                      <Radio.Group
                        onChange={(e) => handleAnswerSelect(examQuestion.id, e.target.value)}
                        value={studentExam.answers.find(a => a.questionId === examQuestion.id)?.selectedOption ? 
                          studentExam.answers.find(a => a.questionId === examQuestion.id)!.selectedOption!.charCodeAt(0) - 65 : undefined}
                        disabled={isSavingAnswers}
                      >
                        <Space direction="vertical" className="w-full">
                          {examQuestion.question.options?.map((option, index) => (
                            <Radio 
                              key={index} 
                              value={index}
                              className="text-base py-2 w-full"
                            >
                              {option.content}
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
                  .filter(q => q.question.type === QuestionType.ESSAY)
                  .map((examQuestion) => (
                    <div key={examQuestion.id} className="space-y-6">
                      <Text className="text-lg block">
                        {examQuestion.question.content}
                      </Text>
                      <TextArea
                        rows={6}
                        value={studentExam.answers.find(a => a.questionId === examQuestion.id)?.essayAnswer}
                        onChange={(e) => handleEssayAnswer(examQuestion.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bạn ở đây..."
                        className="text-base"
                        disabled={isSavingAnswers}
                      />
                      <div>
                        <Text className="text-base block mb-4">
                          Tải lên hình ảnh minh họa (tối đa 3 ảnh):
                        </Text>
                        <Upload
                          beforeUpload={(file) => handleImageUpload(examQuestion.id, file)}
                          multiple={false}
                          accept="image/*"
                          showUploadList={true}
                          listType="picture"
                          fileList={studentExam.answers.find(a => a.questionId === examQuestion.id)?.imageUrls?.map((url, index) => ({
                            uid: `-${index}`,
                            name: `image-${index + 1}`,
                            status: 'done',
                            url,
                          }))}
                          maxCount={3}
                          disabled={isSavingAnswers || (studentExam.answers.find(a => a.questionId === examQuestion.id)?.imageUrls?.length || 0) >= 3}
                        >
                          <Button 
                            icon={<UploadOutlined />}
                            className="flex items-center gap-2"
                            disabled={isSavingAnswers || (studentExam.answers.find(a => a.questionId === examQuestion.id)?.imageUrls?.length || 0) >= 3}
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
              loading={isSubmitting}
              disabled={isSubmitting}
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
                  <div className="text-xs">/ {examInfo.questions.length}</div>
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
                  {answeredQuestions}/{examInfo.questions.length} câu đã trả lời
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
                    <Text>Chưa trả lời: {examInfo.questions.length - answeredQuestions} câu</Text>
                  </div>
                </div>
              </Card>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-4">
                {examInfo.questions.map((examQuestion) => (
                  <Tooltip 
                    key={examQuestion.id}
                    title={
                      <div className="text-center">
                        <div className="font-bold mb-1">Câu {examQuestion.id}</div>
                        <div>{studentExam.answers.find(a => a.questionId === examQuestion.id && (a.selectedOption || a.essayAnswer)) ? 'Đã trả lời' : 'Chưa trả lời'}</div>
                      </div>
                    }
                  >
                    <Button
                      type={studentExam.answers.find(a => a.questionId === examQuestion.id && (a.selectedOption || a.essayAnswer)) ? 'primary' : 'default'}
                      className={`w-full h-12 ${
                        studentExam.answers.find(a => a.questionId === examQuestion.id && (a.selectedOption || a.essayAnswer))
                          ? 'bg-[#4f6f52] hover:bg-[#3a5a40]' 
                          : 'hover:border-[#4f6f52] hover:text-[#4f6f52]'
                      }`}
                      onClick={() => scrollToQuestion(examQuestion.id)}
                    >
                      {examQuestion.id}
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
                loading={isSubmitting}
                disabled={isSubmitting}
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