

import fs from 'fs';
import path from 'path';
import https from 'https';
import { ifLog, ifOption, ifUploadResponse } from './interface';
// 文件后缀名
export const ext: string[] = ['.png', '.jpg', '.jpeg'];
// 最大体积
export const maxSize: number = 5200000; // 5MB == 5242848.754299136
// 日志打印
export const log: ifLog = {
    warning(title, ...content) {
        console.log(`\x1b[33m${title}\x1b[33m \x1b[0m`, ...content);
    },
    success(title, ...content) {
        console.log(`\x1b[32m${title}\x1b[32m \x1b[0m`, ...content);
    },
    error(title, ...content) {
        console.log(`\x1b[31m${title}\x1b[31m \x1b[0m`, ...content);
    }
};
// 检查输出文件夹
export function checkOutput(output: string | null): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
        if (!output) resolve(null);
        output = path.resolve(process.cwd(), output || "");
        fs.stat(output, (err, data) => {
            if (err) {
                reject('请指定一个有效的输出文件夹1');
            } else if (data.isDirectory()) {
                resolve(output);
            } else {
                reject('请指定一个有效的输出文件夹2');
            }
        });
    });
};
// 获取处理文件列表
export function getImageList(option: ifOption): string[] {
    const list: string[] = [];
    const { input: pathname, deep: deepLoop, ext, maxSize } = option;
    try {
        loop(pathname, true);
        function loop(pathname: string, deep: boolean) {
            const stat = fs.statSync(pathname);
            if (deep && stat.isDirectory()) {
                fs.readdirSync(pathname).forEach((filePathname) => {
                    loop(path.join(pathname, filePathname), deepLoop);
                });
            } else if (stat.isFile() && stat.size <= maxSize && ext.includes(path.extname(pathname))) {
                list.push(pathname);
            }
        }
    } catch (error) {
        log.error('警告：请指定一个有效的目标文件/文件夹');
    }
    return list;
}
// 获取文件上传请求参数
export function getXHROptions(): any {
    const option = {
        method: "POST",
        hostname: "tinypng.com",
        path: "/web/shrink",
        headers: {
            rejectUnauthorized: false,
            "X-Forwarded-For": Array(4)
                .fill(1)
                .map(() => Math.ceil(Math.random() * 255))
                .join("."),
            "Postman-Token": Date.now(),
            "Cache-Control": "no-cache",
            // "Content-Type": "image/png",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        }
    };
    return option;
}
// 文件上传
export function fileUpload(imgPath: string) {
    return new Promise((
        resolve: (value: ifUploadResponse) => void,
        reject: (reason: string) => void
    ) => {
        const config = getXHROptions();
        let req = https.request(config, (res) => {
            res.on("data", (buf) => {
                let serverData: ifUploadResponse = JSON.parse(buf.toString());
                if (serverData.error) {
                    reject('警告：压缩失败, 当前文件 ' + imgPath);
                    // log.error('警告：压缩失败, 当前文件', imgPath);
                } else {
                    resolve(serverData);
                    // downloadImage(imgPath, serverData, option);
                }
            });
        });
        req.write(fs.readFileSync(imgPath), "binary");
        req.on("error", (e) => {
            reject('警告：上传失败, 当前文件 ' + imgPath);
            // log.error('警告：上传失败, 当前文件', imgPath);
            req.destroy();
        });
        req.end();
    });
}
// 下载图片
export function downloadImage(webImgUrl: string) {
    return new Promise((
        resolve: (value: string) => void,
        reject: (value: string) => void,
    ) => {
        https.get(webImgUrl, (res) => {
            let body = "";
            res.setEncoding("binary");
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => resolve(body));
        }).on('error', () => {
            reject('警告：下载失败, 当前文件 ' + webImgUrl);
        });
    });
}
