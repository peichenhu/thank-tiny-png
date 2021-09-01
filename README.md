# thank-tiny-png

自动图片压缩脚本,基于 tinypng.com WebAPI 实现

语法：

```bash
# 三个参数，顺序固定：
# 1. 文件或者文件夹
# 2. 深处理(可选参数，仅对文件夹生效)
# 3. 输出到文件夹(可选参数，未指定或者指定文件夹和参数1相同都会替换源图像文件)
thank-tiny-png file/folder -deep? output.folder?
```

```bash
# ------------ 快速使用 ------------
# 单文件处理
npx thank-tiny-png ./input/test.png
# 文件夹多文件处理
npx thank-tiny-png ./input
# 文件夹多文件处理，深度查找处理
npx thank-tiny-png ./input -deep
# 单文件处理, 指定输出文件夹
npx thank-tiny-png ./input/test.png ./output
# 文件夹多文件处理, 指定输出文件夹
npx thank-tiny-png ./input ./output
# 文件夹多文件处理，深度查找处理, 指定输出文件夹
npx thank-tiny-png ./input -deep ./output
```

## License

[MIT](LICENSE).
