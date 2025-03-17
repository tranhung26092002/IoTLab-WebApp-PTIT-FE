import React, { useState } from 'react';
import { Button, Card, DatePicker, Select, Space } from 'antd';
import AttendanceTable from './AttendanceTable';
import AttendanceStats from './AttendanceStats';
import { Attendance } from '../../types/user';
import dayjs from 'dayjs';

const { Option } = Select;

interface AttendanceManagementProps {
  attendances: Attendance[];
}

const formatDateTime = (dateTimeArray: number[] | null) => {
  if (!dateTimeArray || !Array.isArray(dateTimeArray) || dateTimeArray.length < 5) return null;
  const [year, month, day, hour, minute] = dateTimeArray;
  return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
};


const AttendanceManagement: React.FC<AttendanceManagementProps> = ({ attendances }) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Get unique classes from attendances
  const classes = [...new Set(attendances.map(a => a.classCode).filter(Boolean))];
  
  // Get unique shifts
  const shifts = [...new Set(attendances.map(a => a.shift).filter(Boolean))];

  // Filter attendances based on selections
  const filteredAttendances = attendances.filter(attendance => {
    const checkInTime = formatDateTime(attendance.checkInTime as unknown as number[]);
    
    const matchDate = selectedDate && checkInTime
      ? checkInTime.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
      : true;
      
    const matchShift = selectedShift 
      ? attendance.shift === selectedShift
      : true;
      
    const matchClass = selectedClass
      ? attendance.classCode === selectedClass
      : true;

    return matchDate && matchShift && matchClass;
  });

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedShift(null);
    setSelectedClass(null);
  };

  return (
    <Card className="shadow-sm">
      <div className="mb-4">
        <Space size="large" wrap className="w-full justify-between">
          <Space size="large" wrap>
            <DatePicker
              placeholder="Chọn ngày"
              onChange={setSelectedDate}
              className="w-48"
              value={selectedDate}
            />
            <Select
              placeholder="Chọn ca"
              className="w-48"
              onChange={setSelectedShift}
              allowClear
              value={selectedShift}
            >
              {shifts.map(shift => (
                <Option key={shift} value={shift}>{formatShiftName(shift)}</Option>
              ))}
            </Select>
            <Select
              placeholder="Chọn lớp"
              className="w-48"
              onChange={setSelectedClass}
              allowClear
              value={selectedClass}
            >
              {classes.map(className => (
                <Option key={className} value={className}>{className}</Option>
              ))}
            </Select>
          </Space>
          <Button 
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200"
          >
            Đặt lại
          </Button>
        </Space>
      </div>

      <AttendanceStats attendances={filteredAttendances} />
      <AttendanceTable attendances={filteredAttendances} />
    </Card>
  );
};

const formatShiftName = (shift: string): string => {
  const shiftMap: Record<string, string> = {
    'MORNING': 'Morning (7:00 - 11:00)',
    'AFTERNOON': 'Afternoon (13:00 - 17:00)',
    'EVENING': 'Evening (18:00 - 21:00)'
  };
  
  return shiftMap[shift] || shift;
};

export default AttendanceManagement;