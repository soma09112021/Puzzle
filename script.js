class PuzzleGame {
    constructor() {
        this.currentAge = null;
        this.currentTheme = null;
        this.coins = 0;
        this.puzzleData = null;
        this.pieces = [];
        this.completedPieces = 0;
        this.draggedPiece = null;
        
        this.initializeData();
        this.loadSavedData();
        this.initializeEventListeners();
        this.updateCoinDisplay();
    }
    
    initializeData() {
        this.themes = {
            animals: {
                name: 'どうぶつ',
                puzzles: [
                    { id: 'dog', emoji: '🐕', name: 'いぬ' },
                    { id: 'cat', emoji: '🐈', name: 'ねこ' },
                    { id: 'rabbit', emoji: '🐰', name: 'うさぎ' },
                    { id: 'elephant', emoji: '🐘', name: 'ぞう' }
                ]
            },
            vehicles: {
                name: 'のりもの',
                puzzles: [
                    { id: 'car', emoji: '🚗', name: 'くるま' },
                    { id: 'bus', emoji: '🚌', name: 'バス' },
                    { id: 'train', emoji: '🚂', name: 'でんしゃ' },
                    { id: 'airplane', emoji: '✈️', name: 'ひこうき' }
                ]
            },
            fruits: {
                name: 'くだもの',
                puzzles: [
                    { id: 'apple', emoji: '🍎', name: 'りんご' },
                    { id: 'banana', emoji: '🍌', name: 'バナナ' },
                    { id: 'grape', emoji: '🍇', name: 'ぶどう' },
                    { id: 'orange', emoji: '🍊', name: 'みかん' }
                ]
            },
            sea: {
                name: 'うみのいきもの',
                puzzles: [
                    { id: 'fish', emoji: '🐟', name: 'さかな' },
                    { id: 'octopus', emoji: '🐙', name: 'たこ' },
                    { id: 'whale', emoji: '🐋', name: 'くじら' },
                    { id: 'dolphin', emoji: '🐬', name: 'いるか' }
                ]
            }
        };
        
        this.difficultySettings = {
            3: { pieces: 4, rows: 2, cols: 2, showGuide: true, rotation: false },
            4: { pieces: 6, rows: 2, cols: 3, showGuide: true, rotation: false },
            5: { pieces: 9, rows: 3, cols: 3, showGuide: false, rotation: false },
            6: { pieces: 12, rows: 3, cols: 4, showGuide: false, rotation: true }
        };
    }
    
    loadSavedData() {
        const savedCoins = localStorage.getItem('puzzleCoins');
        if (savedCoins) {
            this.coins = parseInt(savedCoins);
        }
    }
    
    saveData() {
        localStorage.setItem('puzzleCoins', this.coins.toString());
    }
    
    initializeEventListeners() {
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAge(parseInt(e.target.dataset.age));
            });
        });
        
        document.querySelectorAll('.theme-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.selectTheme(theme);
            });
        });
        
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.goBack());
        });
        
        document.getElementById('nextPuzzleBtn').addEventListener('click', () => {
            this.startNewPuzzle();
        });
        
        document.getElementById('backToThemeBtn').addEventListener('click', () => {
            this.showScreen('themeScreen');
        });
    }
    
    selectAge(age) {
        this.currentAge = age;
        this.showScreen('themeScreen');
        this.playSound('click');
    }
    
    selectTheme(theme) {
        this.currentTheme = theme;
        this.showScreen('gameScreen');
        this.startNewPuzzle();
        this.playSound('click');
    }
    
    startNewPuzzle() {
        const themeData = this.themes[this.currentTheme];
        const randomPuzzle = themeData.puzzles[Math.floor(Math.random() * themeData.puzzles.length)];
        this.puzzleData = randomPuzzle;
        
        document.getElementById('currentTheme').textContent = `${themeData.name} - ${randomPuzzle.name}`;
        
        this.createPuzzle();
    }
    
    createPuzzle() {
        const settings = this.difficultySettings[this.currentAge];
        const targetArea = document.getElementById('targetArea');
        const piecesArea = document.getElementById('piecesArea');
        
        targetArea.innerHTML = '';
        piecesArea.innerHTML = '';
        this.pieces = [];
        this.completedPieces = 0;
        
        targetArea.style.gridTemplateColumns = `repeat(${settings.cols}, 1fr)`;
        targetArea.style.gridTemplateRows = `repeat(${settings.rows}, 1fr)`;
        
        const pieceWidth = 150;
        const pieceHeight = 150;
        
        // パズルピースの形状を生成
        const puzzleShapes = this.generatePuzzleShapes(settings.rows, settings.cols);
        
        for (let i = 0; i < settings.pieces; i++) {
            const row = Math.floor(i / settings.cols);
            const col = i % settings.cols;
            const shape = puzzleShapes[row][col];
            
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.dataset.pieceId = i;
            dropZone.style.width = `${pieceWidth}px`;
            dropZone.style.height = `${pieceHeight}px`;
            
            if (settings.showGuide) {
                dropZone.style.opacity = '0.3';
                const guideImg = document.createElement('div');
                guideImg.style.cssText = `
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 60px;
                    opacity: 0.3;
                `;
                guideImg.innerHTML = this.puzzleData.emoji;
                dropZone.appendChild(guideImg);
            }
            
            targetArea.appendChild(dropZone);
            
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.pieceId = i;
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
            
            // ジグソーパズル風のデザイン
            const pieceContent = document.createElement('div');
            pieceContent.style.cssText = `
                width: 100%;
                height: 100%;
                background: ${this.generateGradientBackground(i, settings)};
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 80px;
                position: relative;
                box-shadow: 
                    0 4px 8px rgba(0,0,0,0.2),
                    inset 0 2px 4px rgba(255,255,255,0.5),
                    inset 0 -2px 4px rgba(0,0,0,0.1);
                border: 2px solid rgba(255,255,255,0.3);
                overflow: hidden;
            `;
            
            // ピースの凸凹を擬似的に表現
            if (settings.pieces > 4) {
                pieceContent.innerHTML = `
                    <div style="
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(45deg, 
                            transparent 30%, 
                            rgba(255,255,255,0.1) 50%, 
                            transparent 70%);
                    "></div>
                    <span style="position: relative; z-index: 1;">${this.puzzleData.emoji}</span>
                    ${this.createPuzzleEdges(shape)}
                `;
            } else {
                pieceContent.innerHTML = `<span>${this.puzzleData.emoji}</span>`;
            }
            
            piece.appendChild(pieceContent);
            piece.style.transition = 'transform 0.2s';
            piece.style.cursor = 'grab';
            
            this.addDragListeners(piece);
            
            const randomOrder = Math.random();
            piece.style.order = randomOrder;
            
            piecesArea.appendChild(piece);
            this.pieces.push(piece);
        }
        
        this.addDropListeners();
    }
    
    generatePuzzleShapes(rows, cols) {
        const shapes = [];
        for (let r = 0; r < rows; r++) {
            shapes[r] = [];
            for (let c = 0; c < cols; c++) {
                shapes[r][c] = {
                    top: r > 0 ? (Math.random() > 0.5 ? 'out' : 'in') : 'flat',
                    right: c < cols - 1 ? (Math.random() > 0.5 ? 'out' : 'in') : 'flat',
                    bottom: r < rows - 1 ? (Math.random() > 0.5 ? 'out' : 'in') : 'flat',
                    left: c > 0 ? (Math.random() > 0.5 ? 'out' : 'in') : 'flat'
                };
            }
        }
        return shapes;
    }
    
    createPuzzleEdges(shape) {
        let edges = '';
        const edgeStyles = {
            out: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 30%, transparent 70%)',
            in: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 30%, transparent 70%)',
            flat: 'none'
        };
        
        if (shape.top !== 'flat') {
            edges += `<div style="
                position: absolute;
                top: -10px;
                left: 40%;
                width: 20%;
                height: 20px;
                background: ${edgeStyles[shape.top]};
                border-radius: 50%;
            "></div>`;
        }
        
        if (shape.right !== 'flat') {
            edges += `<div style="
                position: absolute;
                right: -10px;
                top: 40%;
                width: 20px;
                height: 20%;
                background: ${edgeStyles[shape.right]};
                border-radius: 50%;
            "></div>`;
        }
        
        return edges;
    }
    
    generateGradientBackground(index, settings) {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
            'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
            'linear-gradient(135deg, #f8b195 0%, #c06c84 100%)'
        ];
        return gradients[index % gradients.length];
    }
    
    
    addDragListeners(piece) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        const dragStart = (e) => {
            if (piece.classList.contains('placed')) return;
            
            isDragging = true;
            piece.classList.add('dragging');
            
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }
            
            this.draggedPiece = piece;
        };
        
        const dragEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            piece.classList.remove('dragging');
            
            const dropZones = document.querySelectorAll('.drop-zone');
            let placed = false;
            
            dropZones.forEach(zone => {
                const rect = zone.getBoundingClientRect();
                const pieceRect = piece.getBoundingClientRect();
                
                if (this.isOverlapping(pieceRect, rect) && 
                    zone.dataset.pieceId === piece.dataset.pieceId) {
                    
                    piece.style.position = 'absolute';
                    piece.style.left = `${rect.left - piece.parentElement.getBoundingClientRect().left}px`;
                    piece.style.top = `${rect.top - piece.parentElement.getBoundingClientRect().top}px`;
                    piece.classList.add('placed');
                    
                    zone.style.opacity = '1';
                    zone.innerHTML = '';
                    
                    this.completedPieces++;
                    this.playSound('correct');
                    placed = true;
                    
                    if (this.completedPieces === this.pieces.length) {
                        setTimeout(() => this.completePuzzle(), 500);
                    }
                }
            });
            
            if (!placed) {
                piece.style.transform = 'translate(0px, 0px)';
                xOffset = 0;
                yOffset = 0;
                this.playSound('wrong');
            }
            
            this.draggedPiece = null;
        };
        
        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            
            xOffset = currentX;
            yOffset = currentY;
            
            piece.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            this.highlightDropZone();
        };
        
        piece.addEventListener('mousedown', dragStart);
        piece.addEventListener('mouseup', dragEnd);
        piece.addEventListener('mousemove', drag);
        
        piece.addEventListener('touchstart', dragStart, { passive: false });
        piece.addEventListener('touchend', dragEnd);
        piece.addEventListener('touchmove', drag, { passive: false });
    }
    
    addDropListeners() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('highlight');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('highlight');
            });
        });
    }
    
    highlightDropZone() {
        if (!this.draggedPiece) return;
        
        const dropZones = document.querySelectorAll('.drop-zone');
        const pieceRect = this.draggedPiece.getBoundingClientRect();
        
        dropZones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            
            if (this.isOverlapping(pieceRect, rect) && 
                zone.dataset.pieceId === this.draggedPiece.dataset.pieceId) {
                zone.classList.add('highlight');
            } else {
                zone.classList.remove('highlight');
            }
        });
    }
    
    isOverlapping(rect1, rect2) {
        const centerX = rect1.left + rect1.width / 2;
        const centerY = rect1.top + rect1.height / 2;
        
        return centerX >= rect2.left && 
               centerX <= rect2.right && 
               centerY >= rect2.top && 
               centerY <= rect2.bottom;
    }
    
    completePuzzle() {
        const reward = 10;
        this.coins += reward;
        this.saveData();
        
        document.getElementById('completedPuzzle').innerHTML = 
            `<div style="font-size: 150px;">${this.puzzleData.emoji}</div>`;
        
        this.showScreen('completeScreen');
        this.playSound('complete');
        this.updateCoinDisplay();
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    goBack() {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen.id === 'themeScreen') {
            this.showScreen('startScreen');
        } else if (activeScreen.id === 'gameScreen') {
            this.showScreen('themeScreen');
        }
        this.playSound('click');
    }
    
    updateCoinDisplay() {
        document.getElementById('coinCount').textContent = this.coins;
        document.getElementById('gameCoinCount').textContent = this.coins;
    }
    
    playSound(type) {
        const audio = new Audio();
        
        switch(type) {
            case 'click':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE';
                break;
            case 'correct':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE';
                break;
            case 'wrong':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE';
                break;
            case 'complete':
                audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE';
                break;
        }
        
        audio.volume = 0.3;
        audio.play().catch(() => {});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});