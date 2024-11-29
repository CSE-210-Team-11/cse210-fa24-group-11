/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

describe('home.css', () => {
    let styleSheet;

    beforeAll(() => {
        // 加载 CSS 文件内容
        const cssPath = path.resolve(__dirname, '../../styles/pages/home.css'); // 确保路径正确
        const css = fs.readFileSync(cssPath, 'utf8');

        // 将 CSS 添加到模拟的 DOM 中
        styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.appendChild(document.createTextNode(css));
        document.head.appendChild(styleSheet);
    });

    afterAll(() => {
        // 清理测试用的样式
        document.head.removeChild(styleSheet);
    });

    test('body should have no margin and padding', () => {
        document.body.innerHTML = `<div></div>`;
        const styles = window.getComputedStyle(document.body);
        expect(styles.margin).toBe('0px');
        expect(styles.padding).toBe('0px');
    });

    test('.greeting-div should have correct flexbox properties', () => {
        document.body.innerHTML = `<div class="greeting-div"></div>`;
        const element = document.querySelector('.greeting-div');
        const styles = window.getComputedStyle(element);

        expect(styles.display).toBe('flex');
        expect(styles['justify-content']).toBe('center');
        expect(styles['align-items']).toBe('center');
        expect(styles['flex-direction']).toBe('column');
        expect(styles['background-color']).toBe('black');
        expect(styles.color).toBe('blanchedalmond');
        expect(styles.height).toBe('100vh');
        expect(styles.width).toBe('100%');
    });

    test('button should have correct styles', () => {
        document.body.innerHTML = `<button></button>`;
        const button = document.querySelector('button');
        const styles = window.getComputedStyle(button);

        expect(styles.padding).toBe('10px');
        expect(styles['border-radius']).toBe('5px');
        expect(styles.margin).toBe('10px');
        expect(styles['border-width']).toBe('2px');
        expect(styles['background-color']).toBe('blanchedalmond');
        expect(styles.color).toBe('black');
        expect(styles.cursor).toBe('pointer');
    });

    test('.tree-art should have correct fixed position styles', () => {
        document.body.innerHTML = `<img class="tree-art" />`;
        const element = document.querySelector('.tree-art');
        const styles = window.getComputedStyle(element);

        expect(styles.width).toBe('100vw');
        expect(styles.height).toBe('30vh');
        expect(styles.position).toBe('fixed');
        expect(styles.bottom).toBe('0px');
        expect(styles.left).toBe('0px');
        expect(styles['pointer-events']).toBe('none');
        expect(styles.margin).toBe('0px');
        expect(styles.padding).toBe('0px');
    });

    test('.author should float right', () => {
        document.body.innerHTML = `<span class="author"></span>`;
        const element = document.querySelector('.author');
        const styles = window.getComputedStyle(element);

        expect(styles.float).toBe('right');
    });
});