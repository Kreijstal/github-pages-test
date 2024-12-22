export default class TriviaQuiz {
    constructor() {
        this.name = "Computer Trivia";
        this.description = "Test your knowledge of computer history with these multiple choice questions";
        this.currentQuestionIndex = 0;
        this.questions = [
            {
                text: "Who is considered the first computer programmer?",
                choices: [
                    "Ada Lovelace",
                    "Charles Babbage",
                    "Alan Turing",
                    "Grace Hopper"
                ],
                correctIndex: 0,
                explanation: "Ada Lovelace wrote the first algorithm intended to be processed by a machine, making her the world's first computer programmer."
            },
            {
                text: "What was the first computer mouse made of?",
                choices: [
                    "Plastic",
                    "Metal",
                    "Wood",
                    "Rubber"
                ],
                correctIndex: 2,
                explanation: "The first computer mouse was invented by Doug Engelbart in the 1960s and was made of wood."
            },
            {
                text: "Which programming language came first?",
                choices: [
                    "BASIC",
                    "FORTRAN",
                    "COBOL",
                    "Pascal"
                ],
                correctIndex: 1,
                explanation: "FORTRAN (Formula Translation) was developed by IBM in 1957, making it the first high-level programming language."
            }
        ];
    }

    display(container) {
        const feedbackContainer = document.getElementById('quiz-feedback');
        const nextButton = document.getElementById('next-question');
        
        const showQuestion = () => {
            feedbackContainer.classList.add('hidden');
            nextButton.classList.add('hidden');
            
            const question = this.questions[this.currentQuestionIndex];
            container.innerHTML = `
                <div class="quiz-question">
                    <h3>${question.text}</h3>
                    <div class="choices">
                        ${question.choices.map((choice, index) => `
                            <div class="choice">
                                <input type="radio" name="answer" value="${index}" id="choice${index}">
                                <label for="choice${index}">${choice}</label>
                            </div>
                        `).join('')}
                    </div>
                    <button id="check-answer">Check Answer</button>
                </div>
            `;

            const checkButton = container.querySelector('#check-answer');
            checkButton.onclick = () => {
                const selectedInput = document.querySelector('input[name="answer"]:checked');
                if (!selectedInput) return;
                
                const userAnswer = parseInt(selectedInput.value);
                const isCorrect = userAnswer === question.correctIndex;
                
                feedbackContainer.classList.remove('hidden');
                
                if (isCorrect) {
                    feedbackContainer.innerHTML = '<div class="correct">Correct!</div>';
                    if (this.currentQuestionIndex < this.questions.length - 1) {
                        nextButton.classList.remove('hidden');
                    } else {
                        feedbackContainer.innerHTML += '<p class="quiz-complete">Congratulations! You\'ve completed the quiz!</p>';
                    }
                } else {
                    feedbackContainer.innerHTML = `
                        <div class="answer-explanation">
                            <p>The correct answer is: ${question.choices[question.correctIndex]}</p>
                            <p>${question.explanation}</p>
                        </div>
                        <button class="retry-button">Try Again</button>
                    `;
                    
                    const retryButton = feedbackContainer.querySelector('.retry-button');
                    retryButton.onclick = showQuestion;
                    
                    if (this.currentQuestionIndex < this.questions.length - 1) {
                        nextButton.classList.remove('hidden');
                    }
                }
            };
        };

        nextButton.onclick = () => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                showQuestion();
            }
        };

        showQuestion();
    }
}
