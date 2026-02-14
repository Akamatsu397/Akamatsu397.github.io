const fs = require('fs');
const path = require('path');

describe('Gallery Scroll Buttons', () => {
    let gallery, prevBtn, nextBtn;
    let domContentLoadedHandler;
    let scrollHandler;
    let resizeHandler;

    beforeEach(() => {
        // Reset mocks and state
        jest.clearAllMocks();

        // Mock elements
        gallery = {
            addEventListener: jest.fn((event, handler) => {
                if (event === 'scroll') scrollHandler = handler;
            }),
            scrollBy: jest.fn(),
            scrollLeft: 0,
            clientWidth: 500,
            scrollWidth: 1000,
            style: {},
        };

        prevBtn = {
            addEventListener: jest.fn(),
            style: {},
        };

        nextBtn = {
            addEventListener: jest.fn(),
            style: {},
        };

        // Mock global objects
        global.document = {
            addEventListener: jest.fn((event, handler) => {
                if (event === 'DOMContentLoaded') {
                    domContentLoadedHandler = handler;
                }
            }),
            querySelector: jest.fn((selector) => {
                if (selector === '.screenshot-gallery') return gallery;
                if (selector === '.scroll-btn.prev') return prevBtn;
                if (selector === '.scroll-btn.next') return nextBtn;
                return null;
            }),
            querySelectorAll: jest.fn(() => []),
        };

        global.window = {
            addEventListener: jest.fn((event, handler) => {
                if (event === 'resize') resizeHandler = handler;
            }),
            scrollTo: jest.fn(),
            pageYOffset: 0,
        };

        global.IntersectionObserver = jest.fn(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
        }));

        // Load and execute main.js
        const mainJs = fs.readFileSync(path.resolve(__dirname, '../scripts/main.js'), 'utf8');

        // Wrap in a function to avoid global scope pollution and allow re-execution
        const executeMain = new Function('document', 'window', 'IntersectionObserver', mainJs);
        executeMain(global.document, global.window, global.IntersectionObserver);

        // Trigger DOMContentLoaded
        if (domContentLoadedHandler) {
            domContentLoadedHandler();
        }
    });

    test('next button click should scroll gallery to the right', () => {
        const nextClickHandler = nextBtn.addEventListener.mock.calls.find(call => call[0] === 'click')[1];
        nextClickHandler();

        expect(gallery.scrollBy).toHaveBeenCalledWith({
            left: 300,
            behavior: 'smooth'
        });
    });

    test('prev button click should scroll gallery to the left', () => {
        const prevClickHandler = prevBtn.addEventListener.mock.calls.find(call => call[0] === 'click')[1];
        prevClickHandler();

        expect(gallery.scrollBy).toHaveBeenCalledWith({
            left: -300,
            behavior: 'smooth'
        });
    });

    test('updateButtons should hide prev button at start', () => {
        gallery.scrollLeft = 0;
        scrollHandler();

        expect(prevBtn.style.opacity).toBe('0');
        expect(prevBtn.style.pointerEvents).toBe('none');
        expect(nextBtn.style.opacity).toBe('1');
        expect(nextBtn.style.pointerEvents).toBe('auto');
    });

    test('updateButtons should hide next button at end', () => {
        gallery.scrollLeft = 500; // scrollLeft + clientWidth >= scrollWidth - 5
        scrollHandler();

        expect(nextBtn.style.opacity).toBe('0');
        expect(nextBtn.style.pointerEvents).toBe('none');
        expect(prevBtn.style.opacity).toBe('1');
        expect(prevBtn.style.pointerEvents).toBe('auto');
    });

    test('updateButtons should show both buttons in the middle', () => {
        gallery.scrollLeft = 100;
        scrollHandler();

        expect(prevBtn.style.opacity).toBe('1');
        expect(nextBtn.style.opacity).toBe('1');
    });

    test('resize event should also update buttons', () => {
        gallery.scrollLeft = 0;
        resizeHandler();

        expect(prevBtn.style.opacity).toBe('0');
    });
});
