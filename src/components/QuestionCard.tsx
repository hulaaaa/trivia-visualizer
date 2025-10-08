import React, { useState, useMemo } from 'react';
import type { Question } from '../utils/api';
import { decodeHtml } from '../utils/helpers';
import '../styles/cards.css';

interface Props {
    question: Question;
    index?: number;
    onReveal?: (q: Question) => void;
}

const QuestionCard: React.FC<Props> = ({ question, index, onReveal }) => {
    const [open, setOpen] = useState(false);

    const allAnswers = useMemo(() => {
        if (question.type === 'multiple') {
            return shuffle([...question.incorrect_answers, question.correct_answer]);
        }
        if (question.type === 'boolean') {
            return ['True', 'False'];
        }
        return [...question.incorrect_answers, question.correct_answer];
    }, [question.correct_answer, question.incorrect_answers, question.type]);

    function shuffle<T>(arr: T[]) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const toggle = () => {
        const next = !open;
        setOpen(next);
        if (next && onReveal) onReveal(question);
    };

    return (
        <article
            className="qcard"
            aria-labelledby={index !== undefined ? `q-${index}` : undefined}
            role="article"
        >
            <div className="qcard__body">
                <header className="qcard__header">
                    <h3 id={index !== undefined ? `q-${index}` : undefined} className="qcard__title" dangerouslySetInnerHTML={{ __html: decodeHtml(question.question) }} />
                    <div className="qcard__meta">
                        <span className="qcard__tag" title={`Category: ${question.category}`}>{question.category}</span>
                        <span className="qcard__tag qcard__tag--muted">{question.difficulty}</span>
                    </div>
                </header>

                <div className="qcard__controls">
                    <button
                        className="qcard__btn"
                        onClick={toggle}
                        aria-expanded={open}
                        aria-controls={index !== undefined ? `answers-${index}` : undefined}
                    >
                        {open ? 'Hide answer' : 'Show answer'}
                    </button>
                </div>

                <div
                    id={index !== undefined ? `answers-${index}` : undefined}
                    className={`qcard__answers-wrapper ${open ? 'open' : ''}`}
                    aria-hidden={!open}
                >
                    {open && (
                        <div className="qcard__answers" role="region" aria-live="polite">
                            <ol>
                                {allAnswers.map((a, i) => {
                                    const isCorrect = a === question.correct_answer;
                                    return (
                                        <li key={i} className={isCorrect ? 'qcard__answer--correct' : undefined} dangerouslySetInnerHTML={{ __html: decodeHtml(a) }} />
                                    );
                                })}
                            </ol>

                            <div className="qcard__correct">
                                Correct:
                                <strong dangerouslySetInnerHTML={{ __html: decodeHtml(question.correct_answer) }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default QuestionCard;
