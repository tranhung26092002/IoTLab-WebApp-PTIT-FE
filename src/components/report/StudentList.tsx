import React, { useState } from 'react';
import { Input, Button, Popconfirm, message, Modal, Spin } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { StudentInfo } from '../../types/report';
import { useUsers } from '../../hooks/useUsers';

interface StudentListProps {
  students: StudentInfo[];
  onAddStudent: (student: { id: number; name: string; studentCode: string }) => void;
  onDeleteStudent: (index: number) => void;
}
const isValidStudentCode = (code: string) => /^[A-Z0-9]*$/.test(code);

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const { getStudent } = useUsers();
  const [searchResult, setSearchResult] = useState<{ id: number, name: string; studentCode: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (isValidStudentCode(value)) {
      setSearchCode(value);
    }
  };

  const handleDelete = (index: number) => {
    if (students.length <= 1) {
      message.warning('Phải có ít nhất một sinh viên');
      return;
    }
    onDeleteStudent(index);
  };

  const handleSearch = async () => {
    if (!searchCode) {
      message.warning('Vui lòng nhập mã sinh viên');
      return;
    }

    if (!isValidStudentCode(searchCode)) {
      message.error('Mã sinh viên chỉ được chứa chữ in hoa và số');
      return;
    }
    
    setIsSearching(true);
    try {
      const user = await getStudent(searchCode);
      if (user) {
        setSearchResult({
          id: user.id,
          name: user.name || '',
          studentCode: user.studentCode
        });
      }
    } catch (error) {
const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';
      message.error('Lỗi: ' + errorMessage);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStudent = () => {
    if (searchResult) {
      onAddStudent({
        id: searchResult.id, 
        name: searchResult.name,
        studentCode: searchResult.studentCode
      });
      setIsModalOpen(false);
      setSearchCode('');
      setSearchResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold primary--color">Thông tin sinh viên</h2>
      {students.map((student, index) => (
        <div key={student.id} className="grid grid-cols-12 gap-4 items-start border-b pb-4 last:border-0">
          <div className="col-span-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 font-medium">
                Sinh viên {index + 1}
              </label>
              <Input 
                placeholder="Họ và tên sinh viên" 
                value={student.name}
                readOnly
              />
            </div>
          </div>

          <div className="col-span-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 font-medium">
                Mã sinh viên
              </label>
              <Input 
                placeholder="Mã sinh viên" 
                value={student.studentCode}
                readOnly
              />
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600 font-medium">
                Xóa
              </label>
              <Popconfirm
                title="Xóa sinh viên"
                description="Bạn có chắc chắn muốn xóa sinh viên này?"
                onConfirm={() => handleDelete(index)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={students.length <= 1}
              >
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                  disabled={students.length <= 1}
                  className="w-full"
                />
              </Popconfirm>
            </div>
          </div>
        </div>
      ))}
      
      <Button 
        type="dashed" 
        onClick={() => setIsModalOpen(true)} 
        icon={<PlusOutlined />}
        className="w-full"
      >
        Thêm sinh viên
      </Button>

      <Modal
        title="Tìm kiếm sinh viên"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSearchCode('');
          setSearchResult(null);
        }}
        footer={null}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập mã sinh viên (chữ in hoa và số)"
              value={searchCode}
              onChange={handleInputChange}
              onPressEnter={handleSearch}
              maxLength={20}
              showCount
              status={searchCode && !isValidStudentCode(searchCode) ? 'error' : ''}
            />
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={isSearching}
            >
              Tìm kiếm
            </Button>
          </div>

          {searchCode && !isValidStudentCode(searchCode) && (
            <div className="text-red-500 text-sm">
              Mã sinh viên chỉ được chứa chữ in hoa và số
            </div>
          )}

          {isSearching && (
            <div className="text-center py-4">
              <Spin />
            </div>
          )}

          {searchResult && !isSearching && (
            <div 
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={handleSelectStudent}
            >
              <p className="font-medium">{searchResult.name}</p>
              <p className="text-gray-600">Mã sinh viên: {searchResult.studentCode}</p>
            </div>
          )}

          {!isSearching && !searchResult && searchCode && (
            <div className="text-center text-gray-500 py-4">
              Không tìm thấy sinh viên
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};