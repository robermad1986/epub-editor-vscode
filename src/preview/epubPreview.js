// EPUB Preview JavaScript
(function() {
    'use strict';

    const vscode = acquireVsCodeApi();
    let book = null;
    let rendition = null;
    let currentLocation = null;

    // DOM elements
    const loadingDiv = document.getElementById('epub-loading');
    const viewerDiv = document.getElementById('epub-viewer');
    const controlsDiv = document.getElementById('epub-controls');
    const errorDiv = document.getElementById('epub-error');
    const errorMessage = document.getElementById('error-message');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const chapterInfo = document.getElementById('chapter-info');
    const retryBtn = document.getElementById('retry-btn');

    // Initialize
    function init() {
        console.log('[EPUB Preview] Initializing...');
        
        // Set up event listeners
        prevBtn.addEventListener('click', goToPreviousPage);
        nextBtn.addEventListener('click', goToNextPage);
        retryBtn.addEventListener('click', retryLoad);

        // Listen for messages from the extension
        window.addEventListener('message', handleMessage);

        // Notify extension that webview is ready
        vscode.postMessage({ type: 'ready' });
        
        console.log('[EPUB Preview] Initialized and ready');
    }

    function handleMessage(event) {
        const message = event.data;
        
        switch (message.type) {
            case 'load-epub':
                loadEpubFromBase64(message.data, message.fileName);
                break;
            case 'navigate-to-chapter':
                navigateToChapter(message.chapterIndex);
                break;
            default:
                console.log('[EPUB Preview] Unknown message type:', message.type);
        }
    }

    async function loadEpubFromBase64(base64Data, fileName) {
        try {
            console.log('[EPUB Preview] Loading EPUB from base64 data...');
            showLoading();

            // Convert base64 to blob
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/epub+zip' });

            // Create book instance
            book = ePub(blob);
            
            // Wait for book to be ready
            await book.ready;
            console.log('[EPUB Preview] Book ready:', book);

            // Create rendition
            rendition = book.renderTo('epub-viewer', {
                width: '100%',
                height: '100%',
                spread: 'none',
                flow: 'paginated'
            });

            // Display the book
            await rendition.display();
            console.log('[EPUB Preview] Book displayed successfully');

            // Set up event listeners for navigation
            setupNavigationListeners();

            // Update UI
            updateChapterInfo();
            showViewer();

            vscode.postMessage({ 
                type: 'book-loaded', 
                fileName: fileName,
                spine: book.spine.spineItems.length 
            });

        } catch (error) {
            console.error('[EPUB Preview] Error loading EPUB:', error);
            showError(`Error loading EPUB: ${error.message}`);
            vscode.postMessage({ type: 'error', error: error.message });
        }
    }

    function setupNavigationListeners() {
        if (!rendition) return;

        // Listen for location changes
        rendition.on('relocated', (location) => {
            currentLocation = location;
            updateChapterInfo();
            updateNavigationButtons();
            
            vscode.postMessage({ 
                type: 'location-changed', 
                location: location 
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPreviousPage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNextPage();
            }
        });

        // Mouse/touch navigation within the book
        rendition.on('click', (event) => {
            const rect = viewerDiv.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const centerX = rect.width / 2;
            
            if (x < centerX) {
                goToPreviousPage();
            } else {
                goToNextPage();
            }
        });
    }

    async function goToPreviousPage() {
        if (!rendition) return;
        
        try {
            await rendition.prev();
        } catch (error) {
            console.log('[EPUB Preview] Already at beginning');
        }
    }

    async function goToNextPage() {
        if (!rendition) return;
        
        try {
            await rendition.next();
        } catch (error) {
            console.log('[EPUB Preview] Already at end');
        }
    }

    async function navigateToChapter(chapterIndex) {
        if (!book || !rendition) return;
        
        try {
            const spine = book.spine.spineItems;
            if (chapterIndex >= 0 && chapterIndex < spine.length) {
                await rendition.display(spine[chapterIndex].href);
            }
        } catch (error) {
            console.error('[EPUB Preview] Error navigating to chapter:', error);
        }
    }

    function updateChapterInfo() {
        if (!currentLocation || !book) {
            chapterInfo.textContent = '';
            return;
        }

        const spine = book.spine.spineItems;
        const currentIndex = spine.findIndex(item => item.href === currentLocation.start.href);
        const totalChapters = spine.length;
        
        if (currentIndex >= 0) {
            chapterInfo.textContent = `Capítulo ${currentIndex + 1} de ${totalChapters}`;
        }
    }

    function updateNavigationButtons() {
        if (!currentLocation || !book) {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        prevBtn.disabled = currentLocation.atStart;
        nextBtn.disabled = currentLocation.atEnd;
    }

    function showLoading() {
        loadingDiv.style.display = 'flex';
        viewerDiv.style.display = 'none';
        controlsDiv.style.display = 'none';
        errorDiv.style.display = 'none';
    }

    function showViewer() {
        loadingDiv.style.display = 'none';
        viewerDiv.style.display = 'block';
        controlsDiv.style.display = 'flex';
        errorDiv.style.display = 'none';
    }

    function showError(message) {
        loadingDiv.style.display = 'none';
        viewerDiv.style.display = 'none';
        controlsDiv.style.display = 'none';
        errorDiv.style.display = 'flex';
        errorMessage.textContent = message;
    }

    function retryLoad() {
        // Reset state
        book = null;
        rendition = null;
        currentLocation = null;
        
        // Show loading state
        showLoading();
        
        // Notify extension to retry
        vscode.postMessage({ type: 'retry-requested' });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
