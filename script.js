// Поточний розмір шрифту
let currentFontSize = 16;
// Об'єкт для збереження базових розмірів тексту
let baseTextSizes = {};
// Поточний масштабний коефіцієнт
let currentScaleFactor = 1;
// Тимчасовий контент тесту (спочатку порожній)
let testContent = null;

// Функція для розрахунку та оновлення макету титульної сторінки
function updateTitlePageLayout() {
    // Знаходимо елемент меню
    const menu = document.querySelector('.menu');
    // Якщо меню не існує, виходимо з функції
    if (!menu) return;
    
    // Отримуємо розміри меню
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;
    
    // Базові параметри для розрахунку масштабу
    const baseWidth = 1200;
    const baseHeight = 800;
    
    // Розраховуємо співвідношення ширини та висоти
    const widthRatio = menuWidth / baseWidth;
    const heightRatio = menuHeight / baseHeight;
    
    // Використовуємо менше співвідношення, щоб контент поміщався
    const contentScale = Math.min(widthRatio, heightRatio);
    let scaleFactor = Math.max(0.5, Math.min(contentScale, 1));
    
    // Оновлюємо CSS-властивість масштабування
    document.documentElement.style.setProperty('--content-scale', scaleFactor.toString());
    
    // Знаходимо елементи для масштабування
    const title = document.querySelector('.title .header');
    const themeElements = document.querySelectorAll('.theme h2');
    const author = document.querySelector('.author p');
    const footer = document.querySelector('.footer p');
    const arrow = document.querySelector('.arrow-icon');
    
    // Отримуємо базові розміри тексту з CSS-змінних
    const baseMainTextSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--main-text-size'));
    const baseThemeTextSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--theme-text-size'));
    
    // Розраховуємо співвідношення розміру теми до інших елементів
    const baseThemeToTitleRatio = baseThemeTextSize / baseMainTextSize;
    
    // Застосовуємо масштабування зі збереженням оригінального співвідношення
    const titleFontSize = baseMainTextSize * scaleFactor;
    const themeFontSize = titleFontSize * baseThemeToTitleRatio;
    
    // Застосовуємо нові розміри для різних елементів
    if (title) {
        title.style.fontSize = `${titleFontSize}rem`;
    }
    
    if (themeElements) {
        themeElements.forEach(theme => {
            theme.style.fontSize = `${themeFontSize}rem`;
        });
    }
    
    if (author) {
        author.style.fontSize = `${baseMainTextSize * scaleFactor}rem`;
    }
    
    if (footer) {
        footer.style.fontSize = `${baseMainTextSize * scaleFactor}rem`;
    }
    
    if (arrow) {
        arrow.style.transform = `translate(-50%, 50%) scale(${scaleFactor})`;
    }
}

// Створюємо спостерігач за змінами розмірів меню
const menuObserver = new ResizeObserver(() => {
    updateTitlePageLayout();
});

// Отримуємо посилання на меню
const menu = document.querySelector('.menu');
// Якщо меню існує, застосовуємо спостерігач
if (menu) {
    menuObserver.observe(menu);
}

// Викликаємо функцію оновлення макету при завантаженні та зміні розміру вікна
window.addEventListener('load', updateTitlePageLayout);
window.addEventListener('resize', updateTitlePageLayout);

// Додаємо обробник події завершення переходу для меню
if (menu) {
    menu.addEventListener('transitionend', updateTitlePageLayout);
}

// Функція для встановлення одиниць viewport
function setViewportUnits() {
    // Розраховуємо 1% висоти та ширини вікна
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    
    // Встановлюємо CSS-змінні для використання в адаптивній верстці
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
}

// Встановлюємо розміри viewport при завантаженні сторінки
window.addEventListener('load', setViewportUnits);

// Оновлюємо розміри viewport при зміні розміру вікна
window.addEventListener('resize', () => {
    setViewportUnits();
});

// Отримуємо посилання на ключові елементи сторінки
const mainContent = document.getElementById('mainContent');
const startButton = document.getElementById('startButton');
const menuContent = document.querySelector('.menu-content');
const logo = document.querySelector('.logo');
const increaseTextSizeButton = document.getElementById('increaseTextSize');
const decreaseTextSizeButton = document.getElementById('decreaseTextSize');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Змінні для пошуку
let searchIndex = {};
// Ключ для збереження останнього пошукового запиту
const LAST_SEARCH_KEY = 'lastSearchQuery';

// Функція для збереження початкових розмірів тексту різних елементів
function saveInitialTextSizes() {
    // Збереження розмірів для посилань меню
    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(element => {
        if (!element.hasAttribute('data-size-id')) {
            const elementId = 'menulink_' + Math.random();
            element.setAttribute('data-size-id', elementId);
            baseTextSizes[elementId] = parseFloat(window.getComputedStyle(element).fontSize);
        }
    });

    // Збереження розмірів для основного контенту та тестових елементів
    const elements = document.querySelectorAll('#mainContent p, #mainContent h1, #mainContent h2, #mainContent h3, #mainContent h4, #mainContent h5, #mainContent h6, #mainContent span, #mainContent li, #mainContent ul, #mainContent ol, .test-container h2, .question p, .option');
    
    elements.forEach(element => {
        if (!element.hasAttribute('data-size-id')) {
            let elementId;
            if (element.closest('.test-container')) {
                // Спеціальна обробка елементів тесту
                if (element.tagName === 'H2') {
                    elementId = 'test_header_' + Math.random();
                } else if (element.classList.contains('question')) {
                    elementId = 'test_question_' + Math.random();
                } else if (element.classList.contains('option')) {
                    elementId = 'test_option_' + Math.random();
                } else {
                    elementId = 'test_element_' + Math.random();
                }
            } else {
                elementId = element.tagName + '_' + Math.random();
            }
            element.setAttribute('data-size-id', elementId);
            baseTextSizes[elementId] = parseFloat(window.getComputedStyle(element).fontSize);
        }
    });
}

// Функція для ініціалізації розмірів тестових елементів
function initializeTestSizing() {
    const testElements = document.querySelectorAll('.test-container h2, .question p, .option');
    testElements.forEach(element => {
        if (!element.hasAttribute('data-size-id')) {
            let elementId;
            if (element.tagName === 'H2') {
                elementId = 'test_header_' + Math.random();
                baseTextSizes[elementId] = parseFloat(window.getComputedStyle(element).fontSize);
            } else if (element.classList.contains('question')) {
                elementId = 'test_question_' + Math.random();
                baseTextSizes[elementId] = parseFloat(window.getComputedStyle(element).fontSize);
            } else if (element.classList.contains('option')) {
                elementId = 'test_option_' + Math.random();
                baseTextSizes[elementId] = parseFloat(window.getComputedStyle(element).fontSize);
            }
            element.setAttribute('data-size-id', elementId);
        }
    });
}

// Функція для оновлення розміру тексту
function updateTextSize() {
    // Розрахунок масштабного коефіцієнта
    currentScaleFactor = currentFontSize / 16;

    // Оновлення розмірів для всіх елементів з унікальним ідентифікатором розміру
    document.querySelectorAll('[data-size-id]').forEach(element => {
        const sizeId = element.getAttribute('data-size-id');
        if (baseTextSizes[sizeId]) {
            // Встановлення нового розміру шрифту
            element.style.fontSize = `${baseTextSizes[sizeId] * currentScaleFactor}px`;
            
            // Спеціальна обробка для посилань меню
            if (element.closest('.menu-links')) {
                const li = element.closest('li');
                if (li) {
                    li.style.height = 'auto';
                    li.style.minHeight = 'auto';
                    li.style.paddingBottom = '15px';
                }
            }

            // Спеціальна обробка для варіантів тесту
            if (element.classList.contains('option')) {
                element.style.padding = `${10 * currentScaleFactor}px ${15 * currentScaleFactor}px`;
            }
        }
    });
}

// Модифікована функція завантаження секції
window.loadSection = function(section) {
    // Видаляємо активний клас з усіх посилань меню
    document.querySelectorAll('.menu-links a').forEach(link => {
        link.classList.remove('active');
    });

    // Додаємо активний клас до натиснутого посилання
    const activeLink = document.querySelector(`.menu-links a[onclick*="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Якщо переходимо в розділ 8 і вже є збережений вміст тесту
    if (section === 'section8' && testContent) {
        mainContent.innerHTML = testContent;
        
        // Прокручуємо до верху контенту
        mainContent.scrollTop = 0;
        
        // Відновлюємо обробники подій для кнопок
        restoreTestEventListeners();
        
        // Оновлюємо розміри тексту
        saveInitialTextSizes();
        updateTextSize();
        
        return Promise.resolve();
    }

    // Завантаження вмісту секції з HTML-файлу
    return fetch(`sections/${section}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load file: ' + response.status);
            return response.text();
        })
        .then(data => {
            mainContent.innerHTML = data;
            
            // Прокручуємо до верху контенту
            mainContent.scrollTop = 0;
            
            if (section === 'section8') {
                // Зберігаємо початковий HTML тесту
                testContent = data;
                
                // Виконуємо скрипти для розділу тесту
                const scripts = mainContent.getElementsByTagName('script');
                Array.from(scripts).forEach(script => {
                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.textContent = script.textContent;
                    script.parentNode.replaceChild(newScript, script);
                });

                // Після виконання скриптів оновлюємо збережений вміст
                setTimeout(() => {
                    testContent = mainContent.innerHTML;
                }, 100);
            }
            
            saveInitialTextSizes();
            updateTextSize();
            initializeSearch();
        })
        .catch(() => mainContent.innerHTML = '<p>Не вдалося завантажити вміст. Будь ласка, спробуйте ще раз.</p>');
};

// Функція для відновлення обробників подій для тесту
function restoreTestEventListeners() {
    // Відновлюємо обробники для кнопок опцій
    document.querySelectorAll('.option').forEach(button => {
        if (!button.disabled) {
            button.onclick = function() {
                const questionDiv = this.closest('.question');
                const options = questionDiv.getElementsByClassName('option');
                const questionIndex = Array.from(document.querySelectorAll('.question')).indexOf(questionDiv);
                
                Array.from(options).forEach(opt => {
                    opt.disabled = true;
                });

                const optionIndex = Array.from(options).indexOf(this);
                const correctIndex = questions[questionIndex].correct;

                if (optionIndex === correctIndex) {
                    this.classList.add('correct');
                    testState.score++;
                } else {
                    this.classList.add('incorrect');
                    options[correctIndex].classList.add('correct');
                }

                testState.answers[questionIndex] = optionIndex;
                testState.answeredQuestions++;

                if (testState.answeredQuestions === questions.length) {
                    document.getElementById('showResults').style.display = 'inline-block';
                }

                saveTestState();
                testContent = mainContent.innerHTML;
            };
        }
    });

    // Відновлюємо обробник для кнопки показу результатів
    const showResultsButton = document.getElementById('showResults');
    if (showResultsButton) {
        showResultsButton.onclick = function() {
            this.style.display = 'none';
            document.getElementById('score').textContent = testState.score;
            document.getElementById('results').style.display = 'block';
            testState.showingResults = true;
            saveTestState();
            testContent = mainContent.innerHTML;
        };
    }

    // Відновлюємо обробник для кнопки перезапуску тесту
    const retryButton = document.getElementById('retryTest');
    if (retryButton) {
        retryButton.onclick = function() {
            testState = {
                score: 0,
                answeredQuestions: 0,
                answers: [],
                showingResults: false
            };
            saveTestState();
            document.getElementById('results').style.display = 'none';
            document.getElementById('showResults').style.display = 'none';
            createTest();
            testContent = mainContent.innerHTML;
        };
    }
}

// Ініціалізація пошуку
function initializeSearch() {
    // Індексація вмісту всіх секцій для пошуку
    for (let i = 1; i <= 8; i++) {
        fetch(`sections/section${i}.html`)
            .then(response => response.text())
            .then(content => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');

                doc.querySelectorAll('p').forEach((p, index) => {
                    const text = p.textContent.trim();
                    if (text) {
                        searchIndex[`section${i}_p${index}`] = {
                            text: text,
                            section: i,
                            paragraphIndex: index
                        };
                    }
                });
            })
            .catch(error => console.error('Помилка індексації:', error));
    }

    // Додаємо обробників подій для пошукового поля
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            if (searchInput.value === localStorage.getItem(LAST_SEARCH_KEY)) {
                searchInput.classList.remove('placeholder-gray');
                performSearch(searchInput.value);
                searchResults.style.display = 'block';
            }
        });

        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value;
            localStorage.setItem(LAST_SEARCH_KEY, searchText);
            performSearch(searchText);

            if (searchText.trim() === '') {
                searchResults.style.display = 'none';
            }
        });

        // Приховування результатів пошуку при кліці поза полем пошуку
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Функція виконання пошуку
function performSearch(searchText) {
    if (!searchResults) return;

    searchResults.innerHTML = '';

    if (!searchText) {
        searchResults.style.display = 'none';
        return;
    }

    const searchTerm = searchText.toLowerCase();
    const matches = [];

    // Пошук збігів у проіндексованому контенті
    for (const [key, value] of Object.entries(searchIndex)) {
        if (value.text.toLowerCase().includes(searchTerm)) {
            matches.push({
                key: key,
                ...value
            });
        }
    }

    searchResults.style.display = 'block';

    if (matches.length > 0) {
        matches.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';

            const text = match.text;
            const index = text.toLowerCase().indexOf(searchTerm);
            const start = Math.max(0, index - 30);
            const end = Math.min(text.length, index + searchTerm.length + 30);
            let displayText = text.substring(start, end);
            if (start > 0) displayText = '...' + displayText;
            if (end < text.length) displayText += '...';

            // Підсвічування пошукового терміну
            const highlightedDisplayText = displayText.replace(
                new RegExp(`(${searchTerm})`, 'gi'), 
                '<span style="background-color: #ffeb3b">$1</span>'
            );

            resultItem.innerHTML = highlightedDisplayText;

            // Обробник кліку для переходу до знайденого елементу
            resultItem.addEventListener('click', () => {
                loadSection(`section${match.section}`).then(() => {
                    setTimeout(() => {
                        const mainContent = document.getElementById('mainContent');
                        const paragraphs = mainContent.querySelectorAll('p');
                        const targetParagraph = paragraphs[match.paragraphIndex];
                        
                        if (targetParagraph) {
                            // Зберігаємо оригінальний HTML кожного абзацу
                            const originalHTMLs = Array.from(paragraphs).map(p => p.innerHTML);

                            // Функція для підсвічування конкретного пошукового терміну
                            const highlightSearchTerm = (htmlContent, specificSearchTerm) => {
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = htmlContent;
                                const textNodes = [];
                                
                                const walkNodes = (node) => {
                                    if (node.nodeType === Node.TEXT_NODE) {
                                        textNodes.push(node);
                                    } else {
                                        node.childNodes.forEach(walkNodes);
                                    }
                                };
                                
                                walkNodes(tempDiv);
                                
                                textNodes.forEach(node => {
                                    const nodeText = node.textContent;
                                    const lowerNodeText = nodeText.toLowerCase();
                                    
                                    const searchRegex = new RegExp(`(${specificSearchTerm})`, 'gi');
                                    if (searchRegex.test(nodeText)) {
                                        const replacementNode = document.createElement('span');
                                        replacementNode.innerHTML = nodeText.replace(
                                            searchRegex, 
                                            '<span style="background-color: #ffeb3b">$1</span>'
                                        );
                                        
                                        node.parentNode.replaceChild(replacementNode, node);
                                    }
                                });
                                
                                return tempDiv.innerHTML;
                            };

                            // Підсвічування цільового абзацу
                            targetParagraph.innerHTML = highlightSearchTerm(originalHTMLs[match.paragraphIndex], searchTerm);

                            // Прокрутка до підсвіченого тексту
                            const scrollToHighlight = () => {
                                const highlightedSpan = targetParagraph.querySelector('span[style*="background-color: #ffeb3b"]');
                                if (!highlightedSpan) return;

                                const spanRect = highlightedSpan.getBoundingClientRect();
                                const mainContentRect = mainContent.getBoundingClientRect();
                                const currentScroll = mainContent.scrollTop;
                                const targetPosition = currentScroll + spanRect.top - mainContentRect.top - 150;

                                const maxScroll = mainContent.scrollHeight - mainContent.clientHeight;
                                const finalScrollPosition = Math.min(targetPosition, maxScroll);

                                mainContent.scrollTo({
                                    top: finalScrollPosition,
                                    behavior: 'smooth'
                                });
                            };

                            scrollToHighlight();
                            setTimeout(scrollToHighlight, 100);

                            // Видалення підсвічування через 3 секунди
                            setTimeout(() => {
                                paragraphs.forEach((p, index) => {
                                    p.innerHTML = originalHTMLs[index];
                                });
                            }, 3000);
                        }
                    }, 50);
                });

                searchResults.style.display = 'none';
            });

            searchResults.appendChild(resultItem);
        });
    } else {
        const noResults = document.createElement('div');
        noResults.className = 'search-result-item no-results';
        noResults.textContent = 'Не знайдено збігів.';
        searchResults.appendChild(noResults);
    }
}

// Обробник події для кнопки старту
startButton.addEventListener('click', () => {
    // Додаємо клас для анімації затухання меню
    menuContent.classList.add('fade-out');
 
    // Скидаємо фільтри для header та основного контенту
    document.querySelector('.header-bar').style.filter = 'none';
    mainContent.style.filter = 'none';
 
    // Анімація переходу до навігаційного меню
    setTimeout(() => {
        menuContent.innerHTML = `
            <ul class="menu-links" style="opacity: 0">
                <li><a href="#" onclick="loadSection('section1')" class="active">Походження, культивування, використання вірусів, як біологічну зброю</a></li>
                <li><a href="#" onclick="loadSection('section2')">Історія походження вірусу SARS-CoV-2</a></li>
                <li><a href="#" onclick="loadSection('section3')">Будова віруса</a></li>
                <li><a href="#" onclick="loadSection('section4')">Опис найпоширеніших штамів коронавірусної інфекції</a></li>
                <li><a href="#" onclick="loadSection('section5')">Смертність від COVID-19 в Україні та світі</a></li>
                <li><a href="#" onclick="loadSection('section6')">Поширення короновірусної інфекції в Дніпропетровській області</a></li>
                <li><a href="#" onclick="loadSection('section7')">Рекомендації щодо захисту та профілактики від COVID-19</a></li>
                <li><a href="#" onclick="loadSection('section8')">Тест-перевірка знань</a></li>
            </ul>
        `;
 
        document.querySelector('.menu-links').style.opacity = '1';
 
        menuContent.classList.remove('fade-out');
        menuContent.classList.add('text-top');
        menu.classList.add('menu-left');
 
        setTimeout(() => {
            menu.classList.add('menu-expanded');
            saveInitialTextSizes();
            updateTextSize();
        }, 500);
    }, 500);
 });
 
 // Обробники подій для збільшення розміру тексту
 increaseTextSizeButton.addEventListener('click', () => {
    // Обмежуємо максимальний розмір шрифту
    if (currentFontSize < 24) {
        currentFontSize += 2;
 
        // Оновлення розмірів посилань меню
        const menuLinks = document.querySelectorAll('.menu-links a');
        menuLinks.forEach(link => {
            const linkParent = link.parentElement;
            const currentHeight = linkParent.offsetHeight;
            linkParent.style.minHeight = currentHeight + 'px';
            
            link.style.transition = 'none';
            const sizeId = link.getAttribute('data-size-id');
            if (sizeId && baseTextSizes[sizeId]) {
                const scaleFactor = currentFontSize / 16;
                link.style.fontSize = `${baseTextSizes[sizeId] * scaleFactor}px`;
            }
        });
 
        updateTextSize();
    }
 });
 
 // Обробники подій для зменшення розміру тексту
 decreaseTextSizeButton.addEventListener('click', () => {
    // Обмежуємо мінімальний розмір шрифту
    if (currentFontSize > 12) {
        currentFontSize -= 2;
 
        // Оновлення розмірів посилань меню
        const menuLinks = document.querySelectorAll('.menu-links a');
        menuLinks.forEach(link => {
            const linkParent = link.parentElement;
            const currentHeight = linkParent.offsetHeight;
            linkParent.style.minHeight = currentHeight + 'px';
            
            link.style.transition = 'none';
            const sizeId = link.getAttribute('data-size-id');
            if (sizeId && baseTextSizes[sizeId]) {
                const scaleFactor = currentFontSize / 16;
                link.style.fontSize = `${baseTextSizes[sizeId] * scaleFactor}px`;
            }
        });
 
        updateTextSize();
    }
 });
 
 // Обробник події для логотипу - перезавантаження сторінки
 logo.addEventListener('click', function() {
    location.reload();
 });
 
 // Ініціалізація при завантаженні сторінки
 window.addEventListener('load', () => {
    loadSection('section1');
    mainContent.classList.add('active');
    mainContent.style.filter = 'blur(10px)';
    saveInitialTextSizes();
    initializeSearch();
 
    // Очищення пошукового поля
    if (searchInput) {
        searchInput.value = '';
        searchInput.classList.remove('placeholder-gray');
        searchResults.style.display = 'none';
    }
 });