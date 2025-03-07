import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Table, Spin } from "antd";

const ExcelViewer = ({ fileUrl }: { fileUrl: string }) => {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExcelFile = async () => {
            try {
                const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
                const workbook = XLSX.read(new Uint8Array(response.data), { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                if (jsonData.length > 0) {
                    const cols = Object.keys(jsonData[0] as object).map(key => ({
                        title: key,
                        dataIndex: key,
                        key: key,
                    }));
                    setColumns(cols);
                    setData(jsonData);
                }
            } catch (error) {
                console.error("Error loading Excel file:", error);
            } finally {
                setLoading(false);
            }
        };

        if (fileUrl) fetchExcelFile();
    }, [fileUrl]);

    if (loading) return <Spin className="flex justify-center items-center h-full" />;

    return (
        <div className="p-4">
            <Table 
                columns={columns} 
                dataSource={data}
                scroll={{ x: 'max-content', y: 400 }}
                size="small"
                bordered
            />
        </div>
    );
};

export default ExcelViewer;