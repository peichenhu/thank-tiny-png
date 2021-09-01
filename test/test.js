/**
 * 时间 2021-07-12 20:10:08
 * 作者 chenhu.pei
 */

const assert = require("assert");
const thankTinyPng = require("..");
const success = (...args) => console.log(`\x1b[32m ✓ \x1b[32m \x1b[0m`, ...args);

// # 远程 HTTP 文件
// node debug.js http://s1.hdslb.com/bfs/cm/cm-sdk/static/js/pc.js.map 1 1000

const tracker = new assert.CallTracker();

function test1() {
    const callback = (data) => {
        assert.ok(typeof data === "string");
        success("测试1 thankTinyPng 文件夹 深处理：", data);
    };
    const callsfunc = tracker.calls(callback, 2);
    thankTinyPng("./test/input", "-deep", "./test/output", callsfunc);
}

function test2() {
    const callback = (data) => {
        assert.ok(typeof data === "string");
        success("测试2 thankTinyPng 文件夹：", data);
    };
    const callsfunc = tracker.calls(callback, 1);
    thankTinyPng("./test/input", null, "./test/output", callsfunc);
}

function test3() {
    const callback = (data) => {
        assert.ok(typeof data === "string");
        success("测试3 thankTinyPng 文件：", data);
    };
    const callsfunc = tracker.calls(callback, 1);
    thankTinyPng("./test/input/test2.png", null, "./test/output", callsfunc);
}

// 调用 tracker.verify() 并验证是否所有 tracker.calls() 函数都已被准确调用。
test2();
test1();
test3();
process.on("exit", () => {
    tracker.verify();
});
