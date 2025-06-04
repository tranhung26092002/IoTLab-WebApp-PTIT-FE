import React, { useState, useEffect } from 'react';
import { Typography, Button, message, Modal, Divider } from 'antd';
import { FormOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import AppLayout from '../components/AppLayout';
import { Exam, StudentAnswer, StudentExam, ExamStatus } from '../types/exam';
import { useStudentExam } from '../hooks/useStudentExam';
import { useUsers } from '../hooks/useUsers';
import StudentInfoConfirmation from '../components/exam/StudentInfoConfirmation';
import ExamStatusScreen from '../components/exam/ExamStatusScreen';
import ExamHeader from '../components/exam/ExamHeader';
import ExamQuestions from '../components/exam/ExamQuestions';
import ExamProgressModal from '../components/exam/ExamProgressModal';
import TimeWarningModal from '../components/exam/TimeWarningModal';
import ExamResultScreen from '../components/exam/ExamResultScreen';

const { Title } = Typography;

const ExamPage: React.FC = () => {
    // States
    const [step, setStep] = useState<'info' | 'status' | 'exam'>('info');
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState<StudentAnswer[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [currentExamData, setCurrentExamData] = useState<Exam | null>(null);
    const [currentStudentExam, setCurrentStudentExam] = useState<StudentExam | null>(null);
    const WARNING_TIME = 3 * 60; // 3 minute in seconds
    const EXAM_DURATION = 20 * 60; // 20 minutes in seconds

    const { me, getMe } = useUsers({ enableMe: true });

    // Hooks
    const { 
        getCurrentExam,
        isLoadingCurrentExam,
        submitExam,
        isSubmitting,
    } = useStudentExam({
        studentId: me?.id
    });

    // Get current user info on mount
    useEffect(() => {
        getMe();
    }, [getMe]);

    // Initialize answers when currentStudentExam changes
    useEffect(() => {
        if (currentStudentExam?.exam?.questions) {
            const initialAnswers = currentStudentExam.exam.questions.map(q => ({
                id: 0,
                studentExam: currentStudentExam,
                question: q.question,
                selectedOption: '',
                essayAnswer: '',
                imageUrls: [],
                score: 0,
                createdAt: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds() * 1000000],
                updatedAt: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds() * 1000000]
            }));
            setAnswers(initialAnswers);
            setCurrentExamData(currentStudentExam.exam);
        }
    }, [currentStudentExam]);

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'exam' && currentStudentExam?.startTime && currentStudentExam?.status === ExamStatus.IN_PROGRESS) {
            // Convert array to Date object
            const [year, month, day, hour, minute, second, millisecond] = currentStudentExam.startTime;
            const startTime = new Date(year, month - 1, day, hour, minute, second, millisecond / 1000000).getTime();
            const now = new Date().getTime();
            const elapsedTime = Math.floor((now - startTime) / 1000);
            const remainingTime = Math.max(0, EXAM_DURATION - elapsedTime);

            setTimeLeft(remainingTime);

            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === WARNING_TIME) {
                        setShowTimeWarning(true);
                    }
                    
                    if (prev <= 0) {
                        clearInterval(timer);
                        handleExamSubmit(true); // Pass true to indicate time is up
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, currentStudentExam]);

    // Handle info confirmation
    const handleInfoConfirm = async () => {
        if (!me?.id) {
            message.error('Không tìm thấy thông tin sinh viên!');
            return;
        }

        try {
            const exam = await getCurrentExam.mutateAsync(me.id);
            setCurrentStudentExam(exam);
            if (exam.status === ExamStatus.SUBMITTED) {
                setStep('exam');
            } else {
                Modal.info({
                    title: 'Thông tin bài thi',
                    icon: <ExclamationCircleOutlined />,
                    content: (
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium mb-2">Lưu ý quan trọng:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Thời gian làm bài: {EXAM_DURATION / 60} phút</li>
                                    <li>Thời gian sẽ bắt đầu tính ngay khi bạn bắt đầu làm bài</li>
                                    <li>Bài thi sẽ tự động nộp khi hết thời gian</li>
                                    <li>Không thể tạm dừng hoặc làm lại bài thi</li>
                                    <li>Mỗi sinh viên chỉ được làm bài một lần</li>
                                </ul>
                            </div>
                            <p className="text-blue-600 font-medium">Vui lòng đọc kỹ thông tin và quy định bài thi trước khi bắt đầu!</p>
                        </div>
                    ),
                    okText: 'Đã hiểu',
                    width: 600,
                    centered: true,
                    onOk: () => {
                        setStep('status');
                    }
                });
            }
        } catch (error) {
            message.error('Không thể lấy thông tin bài kiểm tra. Vui lòng thử lại!');
        }
    };

    // Handle continue exam
    const handleContinueExam = async () => {
        if (!currentStudentExam) {
            message.error('Không tìm thấy thông tin bài kiểm tra!');
            return;
        }
        setStep('exam');
    };

    // Handle view result
    const handleViewResult = () => {
        if (currentStudentExam?.id) {
            setStep('exam');
        }
    };

    // Handle answer selection
    const handleAnswerSelect = (questionId: number, selectedOption: string) => {
        setAnswers(prev => prev.map(answer => 
            answer.question.id === questionId 
                ? { ...answer, selectedOption }
                : answer
        ));
    };

    // Handle essay answer
    const handleEssayAnswer = (questionId: number, answer: string) => {
        setAnswers(prev => prev.map(a => 
            a.question.id === questionId 
                ? { ...a, essayAnswer: answer }
                : a
        ));
    };

    // Handle image upload
    const handleImageUpload = (questionId: number, file: File) => {
        setAnswers(prev => prev.map(a => 
            a.question.id === questionId 
                ? { 
                    ...a, 
                    imageUrls: [...(a.imageUrls || []), URL.createObjectURL(file)].slice(0, 3)
                }
                : a
        ));
        setImages(prev => [...prev, file]);
        return false;
    };

    // Handle exam submit
    const handleExamSubmit = async (isTimeUp: boolean = false) => {
        if (!currentStudentExam?.id || !currentExamData?.questions) {
            return;
        }

        const unansweredQuestions = currentExamData.questions
            .filter(q => !answers.find(a => a.question.id === q.question.id && (a.selectedOption || a.essayAnswer)));

        // If time is up, submit directly without confirmation
        if (isTimeUp) {
            await submitExamAndShowResult();
            return;
        }

        // If there are unanswered questions, show confirmation
        if (unansweredQuestions?.length) {
            Modal.confirm({
                title: 'Xác nhận nộp bài',
                icon: <ExclamationCircleOutlined />,
                content: `Bạn còn ${unansweredQuestions.length} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`,
                okText: 'Nộp bài',
                cancelText: 'Kiểm tra lại',
                onOk: submitExamAndShowResult
            });
        } else {
            // If all questions are answered, show simple confirmation
            Modal.confirm({
                title: 'Xác nhận nộp bài',
                icon: <ExclamationCircleOutlined />,
                content: 'Bạn có chắc chắn muốn nộp bài?',
                okText: 'Nộp bài',
                cancelText: 'Kiểm tra lại',
                onOk: submitExamAndShowResult
            });
        }
    };

    // Submit exam and show result
    const submitExamAndShowResult = async () => {
        try {
            const result = await submitExam({
                studentExamId: currentStudentExam!.id,
                answers: {
                    answers: answers.map(answer => ({
                        questionId: answer.question.id,
                        questionType: answer.question.type,
                        selectedOption: answer.selectedOption,
                        essayAnswer: answer.essayAnswer,
                        imageUrls: answer.imageUrls,
                        score: answer.score
                    }))
                },
                images: images
            });

            // Show result popup
            Modal.success({
                title: 'Nộp bài thành công!',
                content: (
                    <div className="text-center">
                        <p className="text-lg mb-2">Kết quả bài làm của bạn:</p>
                        <p className="text-2xl font-bold text-green-600 mb-2">{result.score} điểm</p>
                        <p>Số câu trả lời đúng: {result.correctAnswers}</p>
                    </div>
                ),
                okText: 'Xem chi tiết',
                onOk: () => {
                    setStep('info');
                }
            });
        } catch (error) {
            message.error('Không thể nộp bài. Vui lòng thử lại!');
        }
    };

    // Scroll to question
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

    // Render different screens based on step
    if (step === 'info') {
        return (
            <AppLayout>
                <div className="p-6">
                    <Title level={2} className="forest--dark--color flex items-center gap-2 mb-8">
                        <FormOutlined /> Kiểm Tra Trực Tuyến
                    </Title>
                    {me && (
                        <StudentInfoConfirmation
                            student={me}
                            onConfirm={handleInfoConfirm}
                        />
                    )}
                </div>
            </AppLayout>
        );
    }

    if (step === 'status') {
        // If exam is submitted, redirect to result screen
        if (currentStudentExam?.status === ExamStatus.SUBMITTED) {
            return <ExamResultScreen 
                exam={currentStudentExam} 
                onBack={() => setStep('info')}
            />;
        }

        return (
            <AppLayout>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <Title level={2} className="forest--dark--color flex items-center gap-2 m-0">
                            <FormOutlined /> Kiểm Tra Trực Tuyến
                        </Title>
                        <Button 
                            type="primary"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => setStep('info')}
                        >
                            Quay lại
                        </Button>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <ExamStatusScreen
                            currentExam={currentStudentExam}
                            onContinue={handleContinueExam}
                            onViewResult={handleViewResult}
                            isLoading={isLoadingCurrentExam}
                            examDuration={EXAM_DURATION}
                        />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (step === 'exam' && me) {
        // If exam is submitted, show result screen
        if (currentStudentExam?.status === ExamStatus.SUBMITTED) {
            return <ExamResultScreen 
                exam={currentStudentExam} 
                onBack={() => setStep('info')}
            />;
        }

        // If we don't have exam data yet, show loading
        if (!currentExamData) {
            return (
                <AppLayout>
                    <div className="p-6">
                        <Title level={2} className="forest--dark--color flex items-center gap-2 mb-8">
                            <FormOutlined /> Đang tải...
                        </Title>
                    </div>
                </AppLayout>
            );
        }

        const answeredQuestions = answers.filter(a => a.selectedOption || a.essayAnswer).length;
        const sortedQuestions = [...currentExamData.questions].sort((a, b) => a.order - b.order);

        return (
            <AppLayout>
                <div className="p-6">
                    <Title level={2} className="forest--dark--color flex items-center gap-2 mb-8">
                        <FormOutlined /> Bài Kiểm Tra: {currentExamData.title}
                    </Title>

                    <div className="max-w-5xl mx-auto">
                        <ExamHeader
                            student={me}
                            examTitle={currentExamData.title}
                            timeLeft={timeLeft}
                            answeredQuestions={answeredQuestions}
                            totalQuestions={currentExamData.questions.length}
                            description={currentExamData.description}
                        />

                        <ExamQuestions
                            questions={currentExamData.questions}
                            answers={answers}
                            onAnswerSelect={handleAnswerSelect}
                            onEssayAnswer={handleEssayAnswer}
                            onImageUpload={handleImageUpload}
                            isSubmitting={isSubmitting}
                            examDescription={currentExamData.description}
                            onBack={() => setStep('status')}
                        />

                        <div className="mt-6 flex justify-end">
                            <Button 
                                type="primary" 
                                size="large"
                                className="min-w-[200px]"
                                onClick={() => handleExamSubmit()}
                                loading={isSubmitting}
                            >
                                Nộp bài
                            </Button>
                        </div>
                    </div>

                    {/* Floating Progress Button */}
                    <Button
                        type="primary"
                        onClick={() => setShowProgressModal(true)}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            right: 24,
                            transform: 'translateY(-50%)',
                            zIndex: 1100,
                            background: '#4f6f52',
                            border: 'none',
                            borderRadius: 12,
                            width: 60,
                            height: 60,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s, box-shadow 0.2s',
                        }}
                        className="exam-progress-floating-btn"
                        title="Xem tiến độ làm bài"
                    >
                        <div className="text-center">
                            <div className="text-lg font-bold" style={{color: 'white'}}>{answeredQuestions}</div>
                            <div className="text-xs" style={{color: 'white'}}>/ {currentExamData.questions.length}</div>
                        </div>
                    </Button>

                    {/* Only show modals when exam is in progress */}
                    {currentStudentExam?.status === ExamStatus.IN_PROGRESS && (
                        <>
                            <ExamProgressModal
                                open={showProgressModal}
                                onClose={() => setShowProgressModal(false)}
                                questions={sortedQuestions}
                                answers={answers}
                                onQuestionClick={scrollToQuestion}
                            />

                            <TimeWarningModal
                                open={showTimeWarning}
                                onClose={() => setShowTimeWarning(false)}
                                onSubmit={() => handleExamSubmit(true)}
                                isSubmitting={isSubmitting}
                            />
                        </>
                    )}

                    <style>{`
                        .highlight-question {
                            background-color: rgba(79, 111, 82, 0.1);
                            border-radius: 8px;
                            transition: background-color 0.3s ease;
                        }
                        .exam-progress-floating-btn:hover {
                            background: #3b5740 !important;
                            box-shadow: 0 8px 24px rgba(79, 111, 82, 0.25) !important;
                        }
                    `}</style>
                </div>
            </AppLayout>
        );
    }

    return null;
};

export default ExamPage; 