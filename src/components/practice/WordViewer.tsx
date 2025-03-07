import { useEffect, useState } from "react";
import axios from "axios";
import mammoth from "mammoth";
import { Spin } from "antd";

const WordViewer = ({ fileUrl }: { fileUrl: string }) => {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWordFile = async () => {
            if (!fileUrl) return;
            try {
                const response = await axios.get(fileUrl, { 
                    responseType: "arraybuffer",
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                });
                const arrayBuffer = response.data;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setContent(result.value);
            } catch (error) {
                console.error("Error loading Word file:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWordFile();
    }, [fileUrl]);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Spin tip="Đang tải tài liệu..." />
        </div>
    );

    return (
        <div className="p-6 bg-white h-full overflow-auto">
            <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }} 
            />
        </div>
    );
};

export default WordViewer;