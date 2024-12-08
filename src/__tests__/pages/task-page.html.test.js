import fs from "node:fs";
import path from "node:path";

describe('Task Page HTML', () => {
    let htmlContent;

    beforeAll(() => {
        const htmlPath = path.join(process.cwd(), 'src', 'pages', 'task-page.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
    });

    test('contains essential HTML elements', () => {
        // Test for basic HTML structure
        expect(htmlContent).toMatch(/<html>/);
        expect(htmlContent).toMatch(/<head>/);
        expect(htmlContent).toMatch(/<body>/);
        
        // Test for title
        expect(htmlContent).toMatch(/<title>Learning Path Tasks<\/title>/);
        
        // Test for CSS link
        expect(htmlContent).toMatch(/<link.*task-page\.css/);
    });

    test('contains navigation elements', () => {
        // Test for navbar and its components
        expect(htmlContent).toMatch(/<div class="navbar">/);
        expect(htmlContent).toMatch(/<img class="logo"/);
        expect(htmlContent).toMatch(/href="\.\.\/pages\/home\.html"/);
        expect(htmlContent).toMatch(/href="\.\.\/pages\/project-list\.html"/);
    });

    test('contains main content elements', () => {
        // Test for container and flowchart
        expect(htmlContent).toMatch(/<div class="container">/);
        expect(htmlContent).toMatch(/<div class="flowchart"/);
        expect(htmlContent).toMatch(/id="taskFlow"/);
    });

    test('contains required scripts', () => {
        expect(htmlContent).toMatch(/src="\.\.\/scripts\/components\/tree\/tree\.js"/);
        expect(htmlContent).toMatch(/src="\.\.\/scripts\/taskflow\.js"/);
    });
});
