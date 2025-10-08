import React, { useEffect, useMemo, useState } from 'react';
import Controls from './components/Controls';
import CategoryChart from './components/CategoryChart';
import DifficultyChart from './components/DifficultChart';
import QuestionCard from './components/QuestionCard';
import { fetchQuestions, type Question } from './utils/api';
import { paginate } from './utils/pagination';
import { FooterComponent } from './components/Footer';
import './styles/pagination.css';

const PER_PAGE = 5;

const App: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeDifficulty, setActiveDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);


    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchQuestions()
            .then((res) => { if (mounted) setQuestions(res); })
            .catch((e) => { if (mounted) setError(String(e)); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);


    const categories = useMemo(() => {
        const set = new Set(questions.map(q => q.category));
        return Array.from(set).sort();
    }, [questions]);


    const filtered = useMemo(() => {
        setPage(1);
        return questions.filter(q => {
            if (selectedCategory && q.category !== selectedCategory) return false;
            if (activeDifficulty && q.difficulty.toLowerCase() !== activeDifficulty) return false;
            return true;
        });
    }, [questions, selectedCategory, activeDifficulty]);


    const { items: pageItems, totalPages } = useMemo(() => paginate(filtered, page, PER_PAGE), [filtered, page]);

    if (loading) return <div className="center">Loading...</div>;

    return (
        <div className="container">
            <header className="header">
                <h1>Trivia Visualizer</h1>
                <p className="subtitle">Visualizer of Open Trivia DB questions</p>
                {error && <div style={{ color: '#b45309', marginTop: 8 }}>Note: remote API had issues — using local fallback data.</div>}
            </header>

            <main>
                <Controls
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(c) => { setSelectedCategory(c); setPage(1); }}
                    onReset={() => { setSelectedCategory(null); setActiveDifficulty(null); setPage(1); }}
                    totalCount={questions.length}
                    filteredCount={filtered.length}
                />

                <div className="layout">
                    <section className="left">
                        <CategoryChart
                            questions={questions}
                            onSelectCategory={(cat) => { setSelectedCategory(cat); setPage(1); }}
                            activeCategory={selectedCategory}
                        />
                        <DifficultyChart
                            questions={filtered}
                            activeDifficulty={activeDifficulty}
                            onSelectDifficulty={(d) => { setActiveDifficulty(d); setPage(1); }}
                        />
                    </section>

                    <section className="right">
                        <h3 style={{  fontSize:20, fontWeight:600 }}>Questions</h3>
                        {pageItems.length === 0 ? <div>No questions to show.</div> : (
                            <>
                                {pageItems.map((q, idx) => <QuestionCard key={idx} question={q} />)}
                                <div className="pagination" role="navigation" aria-label="Pagination">
                                    <button
                                        className="pagination__btn"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                        aria-label="Previous page"
                                    >
                                        Prev
                                    </button>

                                    <span className="pagination__info">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>

                                    <button
                                        className="pagination__btn"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page >= totalPages}
                                        aria-label="Next page"
                                    >
                                        Next
                                    </button>
                                </div>

                            </>
                        )}
                    </section>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
};

export default App;
