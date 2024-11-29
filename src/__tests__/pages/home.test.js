import { jest } from "@jest/globals";
import fs from 'fs';
import path from 'path';

describe('Home Page', () => {
    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../../pages/home.html'), 'utf8');
        document.documentElement.innerHTML = html;
    });

    test('renders the greeting message', () => {
        const greeting = document.querySelector('.greeting');
        expect(greeting).toBeTruthy();
        expect(greeting.textContent).toBe('Welcome, Angry Atishay!');
    });

    test('renders the quote container elements', () => {
        const quoteContainer = document.getElementById('quote-container');
        expect(quoteContainer).toBeTruthy();

        const quoteText = document.getElementById('quote-text');
        expect(quoteText).toBeTruthy();

        const quoteAuthor = document.getElementById('quote-author');
        expect(quoteAuthor).toBeTruthy();
    });

    test('renders the buttons with correct text', () => {
        const buttons = document.querySelectorAll('button');
        expect(buttons.length).toBe(3);

        expect(buttons[0].textContent).toContain('0 Tasks Pending');
        expect(buttons[1].textContent).toContain('0 Day Streak');
        expect(buttons[2].textContent).toContain('Go To Projects');
    });

    test('renders the tree art image', () => {
        const treeArt = document.querySelector('.tree-art');
        expect(treeArt).toBeTruthy();
        expect(treeArt.getAttribute('src')).toBe('../media/images/tree_art.svg');
        expect(treeArt.getAttribute('alt')).toBe('Forest scene');
    });
});
