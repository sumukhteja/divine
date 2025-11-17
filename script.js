// Get the file parameter from URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Load JSON data and render
async function loadStotram(fileName) {
    try {
        const response = await fetch(`data/${fileName}.json`);
        const data = await response.json();
        renderStotram(data);
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Function to render the page
function renderStotram(data) {
    document.getElementById('page-title').textContent = data.title;
    document.getElementById('main-title').textContent = data.title;
    document.getElementById('subtitle-1').textContent = data.subtitle1;
    document.getElementById('subtitle-2').textContent = data.subtitle2;
    document.getElementById('outro-title').textContent = data.outroTitle;
    document.getElementById('outro-subtitle').textContent = data.outroSubtitle;
    
    if (data.verses.length > 0) {
        document.querySelector('.sticky-content .sanskrit').innerHTML = data.verses[0].sanskrit;
        document.querySelector('.sticky-content .transliteration').innerHTML = data.verses[0].transliteration;
    }
    
    const desktopContainer = document.getElementById('desktop-verses');
    data.verses.forEach(verse => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.setAttribute('data-step', verse.number);
        stepDiv.setAttribute('data-sanskrit', verse.sanskrit);
        stepDiv.setAttribute('data-transliteration', verse.transliteration);
        
        stepDiv.innerHTML = `
            <div class="step-content">
                <h2>Verse ${verse.number}</h2>
                <p>${verse.meaning}</p>
            </div>
        `;
        
        desktopContainer.appendChild(stepDiv);
    });
    
    const mobileContainer = document.getElementById('mobile-verses');
    data.verses.forEach(verse => {
        const verseDiv = document.createElement('div');
        verseDiv.className = 'mobile-verse';
        
        verseDiv.innerHTML = `
            <div class="verse-number">॥ ${verse.number} ॥</div>
            <div class="sanskrit">${verse.sanskrit}</div>
            <div class="transliteration">${verse.transliteration}</div>
            <h2>Verse ${verse.number}</h2>
            <p>${verse.meaning}</p>
        `;
        
        mobileContainer.appendChild(verseDiv);
    });
    
    initScrollama();
}

function initScrollama() {
    const scroller = scrollama();

    scroller
        .setup({
            step: ".step",
            offset: 0.5,
            debug: false
        })
        .onStepEnter(response => {
            const { element } = response;
            
            const verseNum = element.getAttribute('data-step');
            const sanskritText = element.getAttribute('data-sanskrit');
            const translitText = element.getAttribute('data-transliteration');
            
            document.querySelector('.verse-number').textContent = `॥ ${verseNum} ॥`;
            document.querySelector('.sticky-content .sanskrit').innerHTML = sanskritText;
            document.querySelector('.sticky-content .transliteration').innerHTML = translitText;
        });

    window.addEventListener('resize', scroller.resize);
}

// Get the file from URL parameter and load it
const fileName = getUrlParameter('file');
if (fileName) {
    loadStotram(fileName);
} else {
    // Default to sri-suktam if no parameter
    loadStotram('sri-suktam');
}
