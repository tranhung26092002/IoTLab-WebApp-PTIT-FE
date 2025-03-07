import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

interface Attendance {
  userId: number;
  userName: string;
  fullName: string;
  classCode: string;
  checkInTime: string | Date;
  shift: string;
}

const formatDateTime = (dateTimeArray: number[] | null) => {
  try {
    if (!dateTimeArray || !Array.isArray(dateTimeArray) || dateTimeArray.length < 5) return null;
    const [year, month, day, hour, minute] = dateTimeArray;
    return dayjs(`${year}-${month}-${day} ${hour}:${minute}`);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return null;
  }
};

export const exportToExcel = (data: Attendance[], fileName: string): void => {
  try {
    const shifts = [...new Set(data.map(item => item.shift))].join('_');

    // Format data for Excel export
    const formattedData = data.map(item => ({
      'User ID': item.userId || '-',
      'User Name': item.userName || '-',
      'Full Name': item.fullName || '-',
      'Class': item.classCode || '-',
      'Date': formatDateTime(item.checkInTime as unknown as number[])?.format('DD/MM/YYYY') || '-',
      'Time In': formatDateTime(item.checkInTime as unknown as number[])?.format('HH:mm') || '-',
      'Shift': item.shift || '-',
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    const columnWidths = [
      { wch: 10 },  // User ID
      { wch: 15 },  // User Name
      { wch: 25 },  // Full Name
      { wch: 12 },  // Class
      { wch: 12 },  // Date
      { wch: 10 },  // Time In
      { wch: 10 },  // Shift
    ];
    worksheet['!cols'] = columnWidths;

    // Add some styling
    worksheet['!autofilter'] = { ref: 'A1:G1' }; // Add filter to header row

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

     // Generate Excel file with shift in filename
     const exportFileName = `${fileName}_${dayjs().format('YYYY-MM-DD')}_${shifts}.xlsx`;
     XLSX.writeFile(workbook, exportFileName);
   } catch (error) {
     console.error('Error exporting to Excel:', error);
     throw new Error('Failed to export data to Excel');
    }
};