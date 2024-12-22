export default class ArithmeticQuiz {
    constructor() {
        this.name = "Basic Arithmetic";
        this.description = "Practice addition and subtraction with numbers under 10";
        this.currentQuestion = null;
    }

    display(container) {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * (num1 + 1)); // Ensure no negative results
        const operation = Math.random() > 0.5 ? '+' : '-';
        
        this.currentQuestion = {
            num1,
            num2,
            operation,
            text: `${num1} ${operation} ${num2} = ?`,
            answer: operation === '+' ? num1 + num2 : num1 - num2
        };
        
        container.innerHTML = `
            <div class="quiz-question">
                <h3>${this.currentQuestion.text}</h3>
                <input type="number" id="answer-input" min="0">
                <button id="check-answer">Check Answer</button>
            </div>
        `;

        const checkButton = container.querySelector('#check-answer');
        const feedbackContainer = document.getElementById('quiz-feedback');
        const nextButton = document.getElementById('next-question');

        checkButton.onclick = () => {
            const input = document.getElementById('answer-input');
            const userAnswer = parseInt(input.value);
            const isCorrect = userAnswer === this.currentQuestion.answer;
            
            feedbackContainer.classList.remove('hidden');
            
            if (isCorrect) {
                feedbackContainer.innerHTML = '<div class="correct">Correct!</div>';
                nextButton.classList.remove('hidden');
            } else {
                feedbackContainer.innerHTML = `
                    <div class="incorrect">Incorrect. Try again!</div>
                    <button class="retry-button">Try Again</button>
                `;
                
                const retryButton = feedbackContainer.querySelector('.retry-button');
                retryButton.onclick = () => this.display(container);
            }
        };
    }

    evaluate() {
        const input = document.getElementById('answer-input');
        const userAnswer = parseInt(input.value);
        return userAnswer === this.currentQuestion.answer;
    }

    showAnswer(container) {
        const explanation = this.currentQuestion.operation === '+' 
            ? `When we add ${this.currentQuestion.num1} and ${this.currentQuestion.num2}, we count forward ${this.currentQuestion.num2} steps from ${this.currentQuestion.num1}`
            : `When we subtract ${this.currentQuestion.num2} from ${this.currentQuestion.num1}, we count backward ${this.currentQuestion.num2} steps from ${this.currentQuestion.num1}`;

        container.innerHTML = `
            <div class="answer-explanation">
                <p>The correct answer is ${this.currentQuestion.answer}</p>
                <p>${explanation}</p>
            </div>
        `;
    }
}
