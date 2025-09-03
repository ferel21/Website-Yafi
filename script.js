document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // Fungsionalitas Menu Navigasi Seluler
    // ===============================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
            }
        });
    });

    // ===============================================
    // Fungsionalitas Pengecek Jenis Sampah
    // ===============================================
    const wasteDatabase = [
        { keywords: ['nasi', 'sayur', 'buah', 'daun', 'rumput', 'kayu', 'sisa makanan', 'kotoran hewan'], category: 'Organik', action: 'Dapat diolah menjadi kompos untuk menyuburkan tanaman.', className: 'result-category-organic' },
        { keywords: ['plastik', 'botol', 'gelas', 'kresek', 'sedotan', 'kertas', 'koran', 'kardus', 'kaleng', 'logam', 'besi', 'kaca', 'beling'], category: 'Anorganik', action: 'Dapat didaur ulang menjadi produk baru. Pisahkan dan setor ke bank sampah.', className: 'result-category-inorganic' },
        { keywords: ['baterai', 'aki', 'lampu', 'neon', 'bohlam', 'elektronik', 'hp rusak', 'cat', 'pilox', 'obat', 'jarum suntik', 'pembersih'], category: 'Berbahaya (B3)', action: 'Perlu penanganan khusus. Kumpulkan secara terpisah dan jangan dicampur dengan sampah lain.', className: 'result-category-hazardous' },
        { keywords: ['baju', 'kaos', 'celana', 'kain', 'gorden', 'sprei', 'sepatu', 'tas'], category: 'Tekstil', action: 'Jika masih layak, dapat disumbangkan. Jika sudah rusak, bisa dijadikan lap atau kerajinan.', className: 'result-category-textile' }
    ];
    const wasteInput = document.getElementById('waste-input');
    const checkBtn = document.getElementById('check-btn');
    const resultContainer = document.getElementById('result-container');
    const resultItem = document.getElementById('result-item');
    const resultCategory = document.getElementById('result-category');
    const resultAction = document.getElementById('result-action');

    function checkWaste() {
        const userInput = wasteInput.value.toLowerCase().trim();
        if (userInput === '') return;
        let foundCategory = null;
        for (const item of wasteDatabase) {
            for (const keyword of item.keywords) {
                if (userInput.includes(keyword)) {
                    foundCategory = item;
                    break;
                }
            }
            if (foundCategory) break;
        }
        resultContainer.style.display = 'block';
        resultItem.textContent = `"${wasteInput.value}"`;
        if (foundCategory) {
            resultCategory.textContent = foundCategory.category;
            resultAction.textContent = foundCategory.action;
            resultCategory.className = foundCategory.className;
        } else {
            resultCategory.textContent = 'Tidak Dikenali';
            resultAction.textContent = 'Kami belum memiliki data untuk sampah ini. Coba gunakan kata kunci yang lebih umum.';
            resultCategory.className = 'result-category-unknown';
        }
    }
    if (checkBtn) {
        checkBtn.addEventListener('click', checkWaste);
        wasteInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                checkWaste();
            }
        });
    }

    // ===============================================
    // BARU: Fungsionalitas Kuis Interaktif
    // ===============================================
    const questions = [
        {
            question: "Kulit pisang dan sisa sayuran termasuk dalam jenis sampah apa?",
            answers: [
                { text: "Anorganik", correct: false },
                { text: "Organik", correct: true },
                { text: "Berbahaya (B3)", correct: false },
                { text: "Tekstil", correct: false }
            ]
        },
        {
            question: "Manakah dari berikut ini yang merupakan contoh sampah B3 (Bahan Berbahaya dan Beracun)?",
            answers: [
                { text: "Kardus bekas", correct: false },
                { text: "Botol kaca", correct: false },
                { text: "Baterai bekas", correct: true },
                { text: "Kain perca", correct: false }
            ]
        },
        {
            question: "Apa cara terbaik untuk mengelola sampah organik sisa dapur?",
            answers: [
                { text: "Membakarnya", correct: false },
                { text: "Membuangnya ke sungai", correct: false },
                { text: "Menjadikannya kompos", correct: true },
                { text: "Menimbunnya di tanah", correct: false }
            ]
        },
        {
            question: "Botol plastik bekas air mineral sebaiknya...",
            answers: [
                { text: "Didaur ulang", correct: true },
                { text: "Digunakan sekali lagi untuk minum", correct: false },
                { text: "Dibuang ke tempat sampah biasa", correct: false },
                { text: "Dikubur dalam tanah", correct: false }
            ]
        },
        {
            question: "Prinsip 3R dalam pengelolaan sampah adalah...",
            answers: [
                { text: "Recycle, Reuse, Repair", correct: false },
                { text: "Reduce, Reuse, Recycle", correct: true },
                { text: "Remove, Relocate, Replant", correct: false },
                { text: "Reduce, Reform, Recreate", correct: false }
            ]
        }
    ];

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const quizStartScreen = document.getElementById('quiz-start-screen');
    const quizQuestionScreen = document.getElementById('quiz-question-screen');
    const quizScoreScreen = document.getElementById('quiz-score-screen');
    const quizProgressEl = document.getElementById('quiz-progress');
    const questionTextEl = document.getElementById('question-text');
    const answerButtonsEl = document.getElementById('answer-buttons');
    const finalScoreEl = document.getElementById('final-score');
    const scoreMessageEl = document.getElementById('score-message');

    let currentQuestionIndex, score;

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        quizStartScreen.classList.add('hidden');
        quizScoreScreen.classList.add('hidden');
        quizQuestionScreen.classList.remove('hidden');
        showNextQuestion();
    }

    function showNextQuestion() {
        resetState();
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionTextEl.textContent = question.question;
            quizProgressEl.textContent = `Pertanyaan ${currentQuestionIndex + 1} dari ${questions.length}`;
            question.answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer.text;
                button.classList.add('btn-answer');
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                button.addEventListener('click', selectAnswer);
                answerButtonsEl.appendChild(button);
            });
        } else {
            showScore();
        }
    }
    
    function resetState() {
        while (answerButtonsEl.firstChild) {
            answerButtonsEl.removeChild(answerButtonsEl.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';

        if (isCorrect) {
            score++;
        }

        Array.from(answerButtonsEl.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.disabled = true;
        });
        
        setTimeout(() => {
            currentQuestionIndex++;
            showNextQuestion();
        }, 1500); // Tunggu 1.5 detik sebelum ke pertanyaan berikutnya
    }
    
    function setStatusClass(element, correct) {
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
        }
    }

    function showScore() {
        quizQuestionScreen.classList.add('hidden');
        quizScoreScreen.classList.remove('hidden');
        const totalQuestions = questions.length;
        finalScoreEl.textContent = `${score} / ${totalQuestions}`;
        
        let message = "";
        if(score === totalQuestions) {
            message = "Luar biasa! Kamu adalah pahlawan lingkungan! 🏆";
        } else if (score >= totalQuestions / 2) {
            message = "Kerja bagus! Pengetahuanmu sudah cukup baik. 👍";
        } else {
            message = "Jangan menyerah! Coba pelajari lagi materi di halaman ini. 😊";
        }
        scoreMessageEl.textContent = message;
    }

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', startQuiz);
        restartQuizBtn.addEventListener('click', () => {
             quizScoreScreen.classList.add('hidden');
             quizStartScreen.classList.remove('hidden');
        });
    }

    // ===============================================
    // Fungsionalitas Kalkulator Sampah
    // ===============================================
    const familySizeInput = document.getElementById('family-size');
    const lifestyleSelect = document.getElementById('lifestyle');
    const mealsSelect = document.getElementById('meals');
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    const totalWasteEl = document.getElementById('total-waste-value');
    const organicWasteEl = document.getElementById('organic-waste');
    const inorganicWasteEl = document.getElementById('inorganic-waste');
    const otherWasteEl = document.getElementById('other-waste');

    function calculateWaste() {
        if (!familySizeInput) return;
        const familySize = parseInt(familySizeInput.value) || 1;
        const lifestyle = lifestyleSelect.value;
        const meals = mealsSelect.value;
        const lifestyleMultiplier = { minimalis: 0.7, sedang: 1.0, konsumtif: 1.5 };
        const mealMultiplier = { jarang: 0.6, sedang: 1.0, sering: 1.4 };
        let baseWaste = familySize * 2;
        let totalWaste = baseWaste * lifestyleMultiplier[lifestyle] * mealMultiplier[meals];
        totalWasteEl.textContent = totalWaste.toFixed(1);
        organicWasteEl.textContent = `${(totalWaste * 0.6).toFixed(1)} kg`;
        inorganicWasteEl.textContent = `${(totalWaste * 0.3).toFixed(1)} kg`;
        otherWasteEl.textContent = `${(totalWaste * 0.1).toFixed(1)} kg`;
    }

    if (familySizeInput) {
        familySizeInput.addEventListener('input', calculateWaste);
        lifestyleSelect.addEventListener('change', calculateWaste);
        mealsSelect.addEventListener('change', calculateWaste);
        btnPlus.addEventListener('click', () => {
            familySizeInput.value = parseInt(familySizeInput.value) + 1;
            calculateWaste();
        });
        btnMinus.addEventListener('click', () => {
            let currentValue = parseInt(familySizeInput.value);
            if (currentValue > 1) {
                familySizeInput.value = currentValue - 1;
                calculateWaste();
            }
        });
        calculateWaste();
    }
});