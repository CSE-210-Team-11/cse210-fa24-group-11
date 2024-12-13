import fs from 'node:fs';
import path from 'node:path';

describe('Home Page', () => {
    let html;

    beforeAll(() => {
        html = fs.readFileSync(
            path.resolve(__dirname, '../../pages/home.html'),
            'utf8'
        );
        document.documentElement.innerHTML = html;
    });

    describe('Page Structure', () => {
        test('renders the greeting message', () => {
            const greeting = document.querySelector('.greeting');
            expect(greeting).toBeTruthy();
        });

        test('renders the quote container elements', () => {
            const quoteContainer = document.getElementById('quote-container');
            expect(quoteContainer).toBeTruthy();

            const quoteText = document.getElementById('quote-text');
            expect(quoteText).toBeTruthy();

            const quoteAuthor = document.getElementById('quote-author');
            expect(quoteAuthor).toBeTruthy();
        });


    });

    describe('Navigation Elements', () => {
        test('renders the Go To Projects button', () => {
            const buttons = document.querySelectorAll('button');
            expect(buttons.length).toBe(1);

            const projectButton = buttons[0];
            expect(projectButton.textContent).toContain('Go To Projects');
        });
    });
});