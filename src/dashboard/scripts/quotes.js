class QuoteManager {
    static quotes = [
        {
            text: "The journey of a thousand miles begins with a single step.",
            author: "Lao Tzu"
        },
        {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: "Winston Churchill"
        },
        {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs"
        },
        {
            text: "What you do today can improve all your tomorrows.",
            author: "Ralph Marston"
        },
        {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        }
    ];

    static getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }

    static updateQuote() {
        const quote = this.getRandomQuote();
        document.getElementById('quote-text').textContent = `"${quote.text}"`;
        document.getElementById('quote-author').textContent = `- ${quote.author}`;
    }

    static init() {
        this.updateQuote();
        setInterval(() => this.updateQuote(), 24 * 60 * 60 * 1000);
    }
}