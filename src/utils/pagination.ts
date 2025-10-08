export const paginate = <T,>(items: T[], page = 1, perPage = 10) => {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(Math.max(1, page), totalPages);
    const start = (current - 1) * perPage;
    const end = start + perPage;
    return {
        page: current,
        perPage,
        total,
        totalPages,
        items: items.slice(start, end),
    };
};
