const majors = {
    "Information Technology": ["programming", "computers", "coding", "software", "algorithms", "logic"],
    "Graphic Design": ["design", "art", "colors", "creativity", "illustrator", "photoshop"],
    "Digital Marketing": ["strategy", "advertising", "business", "branding", "social media", "content"],
    "Medical Science": ["healthcare", "medicine", "biology", "research", "pharmacy", "anatomy"],
    "Economics": ["finance", "investment", "banking", "business", "market", "stocks"],
    "Linguistics": ["languages", "translation", "literature", "english", "communication", "culture"]
};

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, ' ');
}

function startQuiz() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
}

function showResults() {
    const inputs = {
        hobbies: normalizeText(document.getElementById('hobbies').value),
        strengths: normalizeText(document.getElementById('strengths').value),
        weaknesses: normalizeText(document.getElementById('weaknesses').value)
    };

    const allText = [inputs.hobbies, inputs.strengths, inputs.weaknesses].join(' ');
    const matches = {};

    // Analyze keywords
    for (const [major, keywords] of Object.entries(majors)) {
        const matchedKeywords = keywords.filter(keyword => 
            allText.includes(normalizeText(keyword)) || 
            allText.split(' ').some(word => word === normalizeText(keyword))
        );
        matches[major] = matchedKeywords.length;
    }

    // Calculate results
    const sorted = Object.entries(matches)
        .map(([major, score]) => ({
            major,
            percentage: Math.min((score / majors[major].length) * 100, 100),
            matchedKeywords: majors[major].filter(keyword => 
                allText.includes(normalizeText(keyword)))
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6);

    // Display results
    const resultsHTML = sorted.map(item => `
        <div class="major-card">
            <h3>${item.major}</h3>
            <p>Match Rate: ${item.percentage.toFixed(1)}%</p>
            ${item.matchedKeywords.length > 0 ? 
                `<small>Matching keywords: ${item.matchedKeywords.join(', ')}</small>` : 
                ''}
        </div>
    `).join('');

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('majorsList').innerHTML = resultsHTML;
}
