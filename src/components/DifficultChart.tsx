import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { Question } from '../utils/api';
import '../styles/charts.css';

const COLORS = { easy: '#60A5FA', medium: '#F59E0B', hard: '#EF4444' };

interface Props {
    questions: Question[];
    activeDifficulty?: 'easy' | 'medium' | 'hard' | null;
    onSelectDifficulty?: (difficulty: 'easy' | 'medium' | 'hard' | null) => void;
}


interface HandleSliceClickParams {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payloadOrEvent: any;
}

const DifficultyChart: React.FC<Props> = ({ questions, activeDifficulty = null, onSelectDifficulty }) => {
    const { data, total } = useMemo(() => {
        const counts: Record<'easy' | 'medium' | 'hard', number> = { easy: 0, medium: 0, hard: 0 };
        for (const q of questions) {
            const d = (q.difficulty ?? '').toLowerCase() as 'easy' | 'medium' | 'hard' | '';
            if (d === 'easy' || d === 'medium' || d === 'hard') counts[d] += 1;
        }
        const arr = [
            { name: 'easy', value: counts.easy },
            { name: 'medium', value: counts.medium },
            { name: 'hard', value: counts.hard },
        ];
        const tot = arr.reduce((s, x) => s + x.value, 0);
        return { data: arr, total: tot };
    }, [questions]);

    const tooltipFormatter = (value: never) => {
        const count = Number(value ?? 0);
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
        return `${count} question${count !== 1 ? 's' : ''} • ${pct}%`;
    };

    const handleSliceClick = ({payloadOrEvent}: HandleSliceClickParams) => {
        const category = payloadOrEvent?.name ?? payloadOrEvent?.payload?.name ?? null;
        if (!onSelectDifficulty) return;
        if (!category) return;
        const isActive = activeDifficulty === category;
        onSelectDifficulty(isActive ? null : (category as 'easy'|'medium'|'hard'));
    };

    return (
        <div className="chart-card difficulty-chart" role="region" aria-label="Difficulty distribution">
            <div className="chart-header">
                <h3>By difficulty</h3>
                <div className="chart-sub">Shows distribution by difficulty — click to filter</div>
            </div>

            {data.every(d => d.value === 0) ? (
                <div className="chart-empty">No data</div>
            ) : (
                <>
                    <div style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={48}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    onClick={handleSliceClick}
                                    isAnimationActive
                                >
                                    {data.map((entry, i) => {
                                        const active = activeDifficulty === entry.name;
                                        const fill = COLORS[entry.name as keyof typeof COLORS];
                                        return (
                                            <Cell
                                                key={`cell-${i}`}
                                                fill={fill}
                                                fillOpacity={active ? 1 : entry.value === 0 ? 0.15 : 0.85}
                                                cursor={onSelectDifficulty ? 'pointer' : 'default'}
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip formatter={tooltipFormatter} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <ul className="difficulty-legend" role="list" aria-label="Difficulty legend">
                        {data.map((d) => {
                            const isActive = activeDifficulty === d.name;
                            const color = COLORS[d.name as keyof typeof COLORS];
                            return (
                                <li key={d.name} className="difficulty-legend__item">
                                    <button
                                        type="button"
                                        className={`difficulty-legend__btn ${isActive ? 'active' : ''}`}
                                        onClick={() => onSelectDifficulty?.(isActive ? null : (d.name as 'easy'|'medium'|'hard'))}
                                        aria-pressed={isActive}
                                        aria-label={`${d.name} — ${d.value} item${d.value !== 1 ? 's' : ''}`}
                                        style={{ borderLeftColor: color }}
                                    >
                                        <span className="legend-dot" style={{ background: color }} />
                                        <span className="legend-label">{d.name[0].toUpperCase() + d.name.slice(1)}</span>
                                        <span className="legend-count">{d.value}</span>
                                        <span className="legend-pct">{total > 0 ? `${((d.value / total) * 100).toFixed(1)}%` : '0.0%'}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
        </div>
    );
};

export default DifficultyChart;
