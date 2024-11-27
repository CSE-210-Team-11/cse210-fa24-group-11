class Button {
    constructor(text, icon, onClick) {
        this.text = text;
        this.icon = icon;
        this.onClick = onClick;
    }

    getIconPath() {
        switch(this.icon) {
            case 'plus':
                return 'M12 5v14M5 12h14';
            case 'arrow':
                return 'M5 12h14M12 5l7 7-7 7';
            default:
                return '';
        }
    }

    render() {
        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        
        if (this.icon) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'icon');
            svg.setAttribute('viewBox', '0 0 24 24');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', this.getIconPath());
            
            svg.appendChild(path);
            button.appendChild(svg);
        }

        const text = document.createTextNode(this.text);
        button.appendChild(text);

        if (this.onClick) {
            button.addEventListener('click', this.onClick);
        }

        return button;
    }
}