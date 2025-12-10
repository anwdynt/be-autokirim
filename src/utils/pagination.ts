export const paginateResponse = (data: any[], page: number, limit: number, total: number, extra: object = {}) => {
    const totalPages = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages,
            ...extra
        },
        data
    };
};
