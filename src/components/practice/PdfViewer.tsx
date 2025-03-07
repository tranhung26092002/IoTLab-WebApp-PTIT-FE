import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Spin } from 'antd';

const PdfViewer = ({ fileUrl }: { fileUrl: string }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div className="h-full w-full">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    renderLoader={(percentages: number) => (
                        <div className="h-full flex items-center justify-center">
                            <Spin tip={`Đang tải... ${Math.round(percentages)}%`} />
                        </div>
                    )}
                />
            </Worker>
        </div>
    );
};

export default PdfViewer;