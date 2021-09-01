export interface ifLog {
    success: (title: string, content?: any) => void;
    warning: (title: string, content?: any) => void;
    error: (title: string, content?: any) => void;
}
export interface ifOption {
    README: string;
    maxSize: number;
    ext: string[];
    root: string;
    deep: boolean;
    input: string;
    output: string;
    imageList: string[];
    imageCount: number;
    successCount: number;
}
export interface ifUploadResponse {
    input: {
        size: number;
        type: string;
    };
    output: {
        type: string;
        size: number;
        ratio: number;
        url: string;
        width: number;
        height: number;
    };
    error: string;
    message: string;
}