import fs from "node:fs";
import path from "node:path";

describe('Task Page CSS', () => {
    let cssContent;

    beforeAll(() => {
        const cssPath = path.join(process.cwd(), 'src', 'styles', 'pages', 'task-page.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });

    test('contains essential layout classes', () => {
        // Test for navbar
        expect(cssContent).toMatch(/\.navbar\s*\{/);
        
        // Test for container
        expect(cssContent).toMatch(/\.container\s*\{/);
        
        // Test for flowchart
        expect(cssContent).toMatch(/\.flowchart\s*\{/);
        
        // Test for logo and link styles
        expect(cssContent).toMatch(/\.logo\s*\{/);
        expect(cssContent).toMatch(/\.link-style\s*\{/);
    });

    test('contains logo-home-link class', () => {
        expect(cssContent).toMatch(/\.logo-home-link\s*\{/);
    });
});