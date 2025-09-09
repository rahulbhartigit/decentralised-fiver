export declare const getNextTask: (userId: number) => Promise<{
    id: number;
    title: string;
    amount: number;
    options: {
        id: number;
        task_id: number;
        image_url: string;
    }[];
} | null>;
//# sourceMappingURL=db.d.ts.map