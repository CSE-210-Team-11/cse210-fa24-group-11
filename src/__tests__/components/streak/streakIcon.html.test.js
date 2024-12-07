import fs from 'node:fs';
import path from 'node:path';

describe('Streak Icon Component', () => {
    beforeEach(() => {
        const html = fs.readFileSync(
            path.resolve(__dirname, '../../../components/streak/streakIcon.html'),
            'utf8'
        );
        document.documentElement.innerHTML = html;
    });

    describe('Structure', () => {
        test('should have streak wrapper', () => {
            const wrapper = document.querySelector('.streak-wrapper');
            expect(wrapper).toBeTruthy();
        });

        test('should have streak button', () => {
            const streakBtn = document.querySelector('#streak-btn');
            expect(streakBtn).toBeTruthy();
            expect(streakBtn.textContent).toBe('Streak: 0');
        });

        test('should have last check-in display', () => {
            const lastCheckin = document.querySelector('#last-checkin');
            expect(lastCheckin).toBeTruthy();
            expect(lastCheckin.textContent).toBe('Last check-in: Never');
        });

        test('should have reset button', () => {
            const resetBtn = document.querySelector('#reset-btn');
            expect(resetBtn).toBeTruthy();
            expect(resetBtn.textContent).toBe('Reset');
        });
    });

    describe('Styling', () => {
        test('should have required stylesheet linked', () => {
            const stylesheet = document.querySelector('link[rel="stylesheet"]');
            expect(stylesheet).toBeTruthy();
        });
    });

    describe('Script Loading', () => {
        test('should have streak script included', () => {
            const script = document.querySelector('script');
            expect(script).toBeTruthy();
            expect(script.src).toContain('streak.js');
        });
    });
});
