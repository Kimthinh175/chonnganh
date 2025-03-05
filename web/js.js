const majors = {
    "Công nghệ Thông tin": ["lập trình", "máy tính", "code", "phần mềm", "thuật toán", "logic"],
    "Thiết kế Đồ họa": ["thiết kế", "mỹ thuật", "màu sắc", "sáng tạo", "illustrator", "photoshop"],
    "Marketing": ["chiến lược", "quảng cáo", "kinh doanh", "thương hiệu", "social media", "content"],
    "Y học": ["sức khỏe", "bác sĩ", "sinh học", "nghiên cứu", "dược", "giải phẫu"],
    "Kinh tế": ["tài chính", "đầu tư", "ngân hàng", "kinh doanh", "thị trường", "chứng khoán"],
    "Ngôn ngữ": ["ngôn ngữ", "dịch thuật", "văn học", "tiếng anh", "giao tiếp", "văn hóa"]
};

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
        .replace(/[^a-z0-9\s]/g, "") // Loại bỏ ký tự đặc biệt
        .replace(/\s+/g, ' '); // Chuẩn hóa khoảng trắng
}

function startQuiz() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
}

function showResults() {
    // Lấy và chuẩn hóa dữ liệu đầu vào
    const inputs = {
        hobbies: normalizeText(document.getElementById('hobbies').value),
        strengths: normalizeText(document.getElementById('strengths').value),
        weaknesses: normalizeText(document.getElementById('weaknesses').value)
    };

    const allText = [inputs.hobbies, inputs.strengths, inputs.weaknesses].join(' ');
    const matches = {};

    // Phân tích từ khóa
    for (const [major, keywords] of Object.entries(majors)) {
        const matchedKeywords = keywords.filter(keyword => {
            const normalizedKeyword = normalizeText(keyword);
            return (
                allText.includes(normalizedKeyword) || 
                allText.split(' ').some(word => word === normalizedKeyword)
            );
        });
        matches[major] = matchedKeywords.length;
    }

    // Tính toán và sắp xếp kết quả
    const sorted = Object.entries(matches)
        .map(([major, score]) => ({
            major,
            percentage: Math.min((score / majors[major].length) * 100, 100),
            matchedKeywords: majors[major].filter(keyword => 
                allText.includes(normalizeText(keyword)))
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6);

    // Hiển thị kết quả
    const resultsHTML = sorted.map(item => `
        <div class="major-card">
            <h3>${item.major}</h3>
            <p>Độ phù hợp: ${item.percentage.toFixed(1)}%</p>
            ${item.matchedKeywords.length > 0 ? 
                `<small>Từ khóa phù hợp: ${item.matchedKeywords.join(', ')}</small>` : 
                ''}
        </div>
    `).join('');

    document.getElementById('formSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('majorsList').innerHTML = resultsHTML;
}