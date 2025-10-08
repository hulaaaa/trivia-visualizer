import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Question } from '../utils/api';
import '../styles/charts.css';

interface CategoryChartProps {
    questions: Question[];
    onSelectCategory: (category: string | null) => void;
    activeCategory: string | null;
}

const COLORS = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc949', '#af7aa1', '#ff9da7'
];

const CategoryChart: React.FC<CategoryChartProps> = ({ questions, onSelectCategory, activeCategory }) => {
    const { data, total } = useMemo(() => {
        const map = new Map<string, number>();
        for (const q of questions) {
            map.set(q.category, (map.get(q.category) ?? 0) + 1);
        }
        const arr = Array.from(map.entries()).map(([category, count]) => ({ category, count }));
        arr.sort((a, b) => b.count - a.count);
        const tot = arr.reduce((s, x) => s + x.count, 0);
        return { data: arr, total: tot };
    }, [questions]);


    const tooltipFormatter = (value: any) => {
        const count = Number(value ?? 0);
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
        return `${count} question${count !== 1 ? 's' : ''} • ${pct}%`;
    };


    const handleBarClick = (payloadOrEvent: any) => {
        const category = payloadOrEvent?.category ?? payloadOrEvent?.payload?.category ?? null;
        onSelectCategory(category ?? null);
    };

    return (
        <div className="chart-card category-chart" role="region" aria-label="Questions by category">
            <div className="chart-header">
                <h3>Questions by Category</h3>
                <div className="chart-sub">Click a bar or use legend to filter</div>
            </div>

            {data.length === 0 ? (
                <div className="chart-empty">No data</div>
            ) : (
                <>
                    <div className="chart-visual" style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart
                                layout="vertical"
                                data={data}
                                margin={{ top: 8, right: 8, left: 12, bottom: 8 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    type="category"
                                    dataKey="category"
                                    width={160}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 13 }}
                                />
                                <Tooltip formatter={tooltipFormatter} />
                                <Bar
                                    dataKey="count"
                                    onClick={handleBarClick}
                                    isAnimationActive={true}
                                >
                                    {data.map((entry, index) => {
                                        const isActive = activeCategory === entry.category;
                                        const fill = isActive ? '#ff7f0e' : COLORS[index % COLORS.length];
                                        return <Cell key={`cell-${index}`} fill={fill} cursor="pointer" />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <ul className="category-legend" role="list" aria-label="Category list">
                        {data.map((d) => {
                            const isActive = activeCategory === d.category;
                            const color = isActive ? '#ff7f0e' : COLORS[data.indexOf(d) % COLORS.length];
                            return (
                                <li key={d.category} className="category-legend__item">
                                    <button
                                        type="button"
                                        className={`category-legend__btn ${isActive ? 'active' : ''}`}
                                        onClick={() => onSelectCategory(isActive ? null : d.category)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                onSelectCategory(isActive ? null : d.category);
                                            }
                                        }}
                                        style={{ borderLeftColor: color }}
                                        aria-pressed={isActive}
                                        aria-label={`${d.category}, ${d.count} questions`}
                                    >
                                        <span className="legend-dot" style={{ background: color }} />
                                        <span className="legend-label">{d.category}</span>
                                        <span className="legend-count">{d.count}</span>
                                        <span className="legend-pct">{total > 0 ? `${((d.count / total) * 100).toFixed(1)}%` : '0.0%'}</span>
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

export default CategoryChart;
