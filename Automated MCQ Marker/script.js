/**
 * AutoGradr - Automated MCQ Grading & Assessment System
 * Core Application Logic & Grading Engine
 */

// 1. Centralized Data Structure: Questions mapped with answers
const quizBank = [
    {
        id: 1,
        question: "What is the capital city of France?",
        choices: { A: "London", B: "Berlin", C: "Paris", D: "Rome" },
        correctKey: "C"
    },
    {
        id: 2,
        question: "Which planet is commonly known as the Red Planet?",
        choices: { A: "Earth", B: "Mars", C: "Jupiter", D: "Saturn" },
        correctKey: "B"
    },
    {
        id: 3,
        question: "What is the largest ocean on Planet Earth?",
        choices: { A: "Atlantic Ocean", B: "Indian Ocean", C: "Arctic Ocean", D: "Pacific Ocean" },
        correctKey: "D"
    },
    {
        id: 4,
        question: "How many days are there normally in a standard year?",
        choices: { A: "365", B: "366", C: "360", D: "350" },
        correctKey: "A"
    },
    {
        id: 5,
        question: "What is the primary chemical element that makes up water?",
        choices: { A: "Helium", B: "Carbon", C: "Hydrogen and Oxygen", D: "Nitrogen" },
        correctKey: "C"
    }
];

// Wait for the DOM structure to load fully before populating elements
window.addEventListener('DOMContentLoaded', () => {
    renderAssessmentInterface();
});

/**
 * 2. UI Rendering Engine
 * Loops through the quizBank to build both the Answer Key panel 
 * and the student response document structure dynamically.
 */
function renderAssessmentInterface() {
    const keyContainer = document.getElementById('keyContainer');
    const sheetContainer = document.getElementById('sheetContainer');

    let keyHtml = '';
    let sheetHtml = '';

    quizBank.forEach((item) => {
        const correctLabel = item.choices[item.correctKey];

        // Compile the reference key visual panel structure
        keyHtml += `
            <div class="question-block">
                <div class="question-text">Q${item.id}: ${item.question}</div>
                <p style="color: var(--success); font-weight: 600;">
                    Correct Answer: <span class="badge-choice">${item.correctKey}</span> (${correctLabel})
                </p>
            </div>
        `;

        // Compile the student live test workspace form structures
        sheetHtml += `
            <div class="question-block">
                <div class="question-text">Q${item.id}: ${item.question}</div>
                <div class="options-group">
                    ${Object.entries(item.choices).map(([key, value]) => `
                        <label class="option-label">
                            <input type="radio" name="sheet_q${item.id}" value="${key}" required> 
                            <strong>${key}:</strong> ${value}
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });

    // Commit generated templates directly into target views
    keyContainer.innerHTML = keyHtml;
    sheetContainer.innerHTML = sheetHtml;
}

/**
 * 3. Grading Logic & Processing Engine
 * Collects form state inputs natively using memory buffers to assess matching variants.
 */
document.getElementById('submissionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const studentName = document.getElementById('studentName').value;
    
    // Instantly capture form state fields into memory for execution tracking
    const studentFormData = new FormData(this);

    let rawScore = 0;
    let analysisReport = [];

    // Evaluate answers against criteria configurations
    quizBank.forEach((item) => {
        const studentSelection = studentFormData.get(`sheet_q${item.id}`);
        const isCorrect = studentSelection === item.correctKey;

        if (isCorrect) rawScore++;

        analysisReport.push({
            id: item.id,
            questionText: item.question,
            studentChoice: studentSelection,
            studentChoiceText: item.choices[studentSelection],
            masterChoice: item.correctKey,
            masterChoiceText: item.choices[item.correctKey],
            status: isCorrect
        });
    });

    // Pass outputs down to report layout dashboard
    compileDashboard(studentName, rawScore, analysisReport);
});

/**
 * 4. Analytics Report & Dashboard Compiler
 * Generates custom analytics badges, status calculations, and pushes updates to the DOM.
 */
function compileDashboard(name, score, report) {
    const totalQuestions = quizBank.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Push updates directly to metric node values
    document.getElementById('resName').textContent = name;
    document.getElementById('resScore').textContent = `${score} / ${totalQuestions} (${percentage}%)`;
    
    const gradeBox = document.getElementById('resGrade');
    if (percentage >= 60) { // Passing limit metric value set to 60%
        gradeBox.textContent = "PASS";
        gradeBox.style.color = "var(--success)";
    } else {
        gradeBox.textContent = "FAIL";
        gradeBox.style.color = "var(--danger)";
    }

    // Flush out previous evaluation markup items safely
    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = '';

    // Walk through analysis array elements and paint conditional markup elements
    report.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `review-item ${item.status ? 'correct' : 'incorrect'}`;
        
        itemDiv.innerHTML = `
            <span class="status-badge">${item.status ? 'Correct' : 'Incorrect'}</span>
            <h4>Question ${item.id}: ${item.questionText}</h4>
            <p style="margin-top: 0.5rem;">
                Student Selection: <span class="badge-choice">${item.studentChoice}</span> (${item.studentChoiceText})
                <br>
                Correct Target: <span class="badge-choice">${item.masterChoice}</span> (${item.masterChoiceText})
            </p>
        `;
        reviewContainer.appendChild(itemDiv);
    });

    // Drop structural css state rule utility tags to view metrics dashboard directly
    document.getElementById('resultsCard').classList.remove('hidden');
    
    // Auto Scroll user display focus smoothly right into the report summary data blocks
    document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
}