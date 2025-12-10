export type MapMode = "exclude" | "include";

export const mapEntity = <T extends Record<string, any>>(
    entity: T,
    fields: string[] = [],
    mode: MapMode = "exclude"
): Partial<T> => {

    const result: Partial<T> = {};

    Object.entries(entity).forEach(([key, value]) => {
        const shouldInclude =
            (mode === "exclude" && !fields.includes(key)) ||
            (mode === "include" && fields.includes(key));

        if (!shouldInclude) return;

        let processedValue = value;

        // Prisma Decimal → convert to string
        if (processedValue && typeof processedValue === "object" && "toString" in processedValue) {
            processedValue = processedValue.toString();
        }

        (result as any)[key] = processedValue;
    });

    return result;
};


interface MapOptions {
    remove?: string[];
    rename?: Record<string, string>; 
}

export const mapFields = <T extends Record<string, any>>(
    entity: T | T[],
    options: MapOptions
) => {
    const { remove = [], rename = {} } = options;

    const process = (obj: Record<string, any>) => {
        const result: Record<string, any> = {};

        for (const key in obj) {
            if (!remove.includes(key)) {
                const renamedKey = rename[key] ?? key;
                result[renamedKey] = obj[key];
            }
        }

        return result;
    };

    return Array.isArray(entity)
        ? entity.map((item) => process(item))
        : process(entity);
};

