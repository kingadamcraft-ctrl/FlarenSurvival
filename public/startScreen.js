// public/startScreen.js

class StartScreen {
    constructor(onStartGame) {
        this.onStartGame = onStartGame;
        this.domElement = null;
        this.init();
    }

    init() {
        // 1. Create the main fullscreen overlay wrapper
        const overlay = document.createElement('div');
        overlay.id = 'start-screen-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        // Classic retro dark dirt/stone background pattern fallback or clean gradient blend
        overlay.style.background = 'radial-gradient(circle, rgba(16,16,24,0.85) 0%, rgba(5,5,10,0.98) 100%)';
        overlay.style.fontFamily = '"Courier New", Courier, monospace';
        overlay.style.userSelect = 'none';

        // 2. Title Container (Minecraft Style)
        const titleContainer = document.createElement('div');
        titleContainer.style.position = 'relative';
        titleContainer.style.marginBottom = '60px';
        titleContainer.style.textAlign = 'center';

        const title = document.createElement('h1');
        title.innerText = 'FLAREN SURVIVAL';
        title.style.color = '#ffb6c1'; // Cherry pink theme highlight
        title.style.fontSize = '4.5rem';
        title.style.fontWeight = '900';
        title.style.margin = '0';
        title.style.letterSpacing = '4px';
        // Gives it that blocky retro drop shadow look
        title.style.textShadow = '5px 5px 0px #4a2830, 8px 8px 0px rgba(0,0,0,0.4)';
        titleContainer.appendChild(title);

        // Splashtext (The yellow bouncing text!)
        const splash = document.createElement('div');
        splash.innerText = 'Now with smoother biomes!';
        splash.style.position = 'absolute';
        splash.style.right = '-40px';
        splash.style.bottom = '-20px';
        splash.style.color = '#ffff55'; // Classic Minecraft yellow splash color
        splash.style.fontWeight = 'bold';
        splash.style.fontSize = '1.3rem';
        splash.style.transform = 'rotate(-15deg)';
        splash.style.textShadow = '2px 2px 0px #555500';
        
        // Simple keyframe animation effect for the splash jump directly in JS
        let angle = 0;
        setInterval(() => {
            angle += 0.05;
            const scale = 1 + Math.sin(angle) * 0.1;
            splash.style.transform = `rotate(-15deg) scale(${scale})`;
        }, 16);
        
        titleContainer.appendChild(splash);
        overlay.appendChild(titleContainer);

        // 3. Menu Buttons Layout
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '14px';
        buttonContainer.style.width = '320px';

        const createMenuButton = (text, onClick) => {
            const btn = document.createElement('button');
            btn.innerText = text;
            btn.style.width = '100%';
            btn.style.padding = '12px';
            btn.style.fontSize = '1.2rem';
            btn.style.fontWeight = 'bold';
            btn.style.color = '#ffffff';
            btn.style.backgroundColor = '#4a4a4a';
            btn.style.border = '3px solid #000000';
            btn.style.borderTopColor = '#8b8b8b';
            btn.style.borderLeftColor = '#8b8b8b';
            btn.style.cursor = 'pointer';
            btn.style.textShadow = '2px 2px 0px #1a1a1a';
            btn.style.boxShadow = '0px 4px 0px rgba(0,0,0,0.3)';

            // Hover and active states built natively
            btn.onmouseenter = () => {
                btn.style.backgroundColor = '#6c8e3f'; // Gives it that leafy green hover highlight!
                btn.style.borderTopColor = '#a3c96c';
                btn.style.borderLeftColor = '#a3c96c';
            };
            btn.onmouseleave = () => {
                btn.style.backgroundColor = '#4a4a4a';
                btn.style.borderTopColor = '#8b8b8b';
                btn.style.borderLeftColor = '#8b8b8b';
            };
            btn.onmousedown = () => {
                btn.style.transform = 'translateY(2px)';
                btn.style.boxShadow = '0px 2px 0px rgba(0,0,0,0.3)';
            };
            btn.onmouseup = () => {
                btn.style.transform = 'translateY(0px)';
                btn.style.boxShadow = '0px 4px 0px rgba(0,0,0,0.3)';
            };

            btn.onclick = onClick;
            return btn;
        };

        const playButton = createMenuButton('Singleplayer', () => {
            this.hide();
            if (this.onStartGame) this.onStartGame();
        });

        const optionsButton = createMenuButton('Options', () => {
            alert('Settings option coming soon!');
        });

        buttonContainer.appendChild(playButton);
        buttonContainer.appendChild(optionsButton);
        overlay.appendChild(buttonContainer);

        // Append to current document body
        document.body.appendChild(overlay);
        this.domElement = overlay;
    }

    hide() {
        if (this.domElement) {
            this.domElement.style.display = 'none';
        }
    }

    show() {
        if (this.domElement) {
            this.domElement.style.display = 'flex';
        }
    }
}

// Attach directly to window scope
window.StartScreen = StartScreen;