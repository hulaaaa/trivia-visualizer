export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export const fetchQuestions = async (): Promise<Question[]> => {
    const res = await fetch('https://opentdb.com/api.php?amount=50');
    const data = await res.json();
    if (data.response_code !== 0) throw new Error('API fetch error');
    return data.results;
};
