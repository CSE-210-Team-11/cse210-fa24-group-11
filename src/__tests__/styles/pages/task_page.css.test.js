import fs from 'node:fs';
import path from 'node:path';

describe('Task Page Styles', () => {
    let cssContent;

    beforeAll(() => {
        cssContent = fs.readFileSync(
            path.resolve(__dirname, '../../../styles/pages/task_page.css'),
            'utf8'
        );
    });

    test('should define basic body styles', () => {
        expect(cssContent).toContain('body {');
        expect(cssContent).toContain('background-color: #f4f5f7');
    });

    test('should define container grid layout', () => {
        expect(cssContent).toContain('.container {');
        expect(cssContent).toContain('display: grid');
        expect(cssContent).toContain('grid-template-areas:');
    });

    test('should define task list styles', () => {
        expect(cssContent).toContain('.task-list {');
        expect(cssContent).toContain('grid-area: task-list');
    });

    test('should define header styles', () => {
        expect(cssContent).toContain('.header {');
        expect(cssContent).toContain('grid-area: header');
    });

    test('should define content area styles', () => {
        expect(cssContent).toContain('.content {');
        expect(cssContent).toContain('grid-area: content');
    });
});
