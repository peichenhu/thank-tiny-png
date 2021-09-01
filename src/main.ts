/** 
 * 时间 2021-07-12 20:27:02
 * 作者 chenhu.pei
 */
import path from 'path';
import fs from 'fs';
import { maxSize, ext, log, checkOutput, getImageList, fileUpload, downloadImage } from './utils';
import { ifOption } from './interface';
// 获取用户输入
const input: string | null = String(process.argv[2]) || null;
const deep: boolean = Boolean(process.argv[3] === '-deep');
const output: string | null = String(process.argv[process.argv.length - 1]) || null;
// 方法调用
thankTinyPng(input, deep, output);
// 方法实现
function thankTinyPng(
	input: string | null,
	deep: boolean,
	output: string | null,
	callback?: (data: string) => void
): void {
	const root = process.cwd();// 根目录
	// 必须输入一个有效的文件/文件夹
	if (!input) throw new Error("请输入一个有效的文件/文件夹");
	// 配置表
	const option: ifOption = {
		README: "仅支持大小不超过 5MB 的 png/jpg 文件",
		maxSize,
		ext,
		root,
		deep,
		input: path.relative(root, input),
		output: (output === input || output === '-deep') ? null : output,
		imageList: [],
		imageCount: 0,
		successCount: 0
	};
	// 检查
	checkOutput(option.output).then(output => {
		option.output = output;
		// 获取处理文件列表
		option.imageList = getImageList(option);
		option.imageCount = option.imageList.length;
		log.success("当前配置信息：", option);
		// 遍历
		option.imageList.forEach((imgUrl) => {
			// 上传
			fileUpload(imgUrl).then(serverReq => {
				const preUrl = serverReq?.output?.url ?? "";
				const webImgUrl = path.join(preUrl, path.basename(imgUrl));
				// 下载
				downloadImage(webImgUrl).then(binary => {
					let outputPath = imgUrl;
					let { output, input } = serverReq || {};
					let { ratio: outputRatio = 0, size: outputSize = 0 } = output || {};
					let { size: inputSize = 0 } = input || {};
					// 指定输出文件夹
					if (option.output) {
						outputPath = path.join(option.output, path.basename(imgUrl));
					}
					// 写入
					fs.writeFile(outputPath, binary, "binary", (err) => {
						if (err) return log.error('警告：写入失败, 当前文件', outputPath);
						option.successCount++;
						let msg: string = '';
						msg += `优化比例: ${((1 - outputRatio) * 100).toFixed(2)}%, `;
						msg += `原始大小: ${(inputSize / 1024).toFixed(2)}KB, `;
						msg += `压缩大小: ${(outputSize / 1024).toFixed(2)}KB, `;
						msg += `文件[${option.successCount}]: ${imgUrl}`;
						!callback && log.success('成功：压缩完成', msg);
						callback && callback('成功：压缩完成' + msg);
					});
				}, log.error);
			}, log.error);
		});
	}, log.warning);
}

export default thankTinyPng;
// ts-node ./src/main.ts ./test/test2.png ../demo




