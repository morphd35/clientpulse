export interface PriorityConfig {
    dayThresholds: {
        high: number;
        medium: number;
        low: number;
    };
    colors: {
        high: string;
        medium: string;
        low: string;
    };
}

export const priorityConfig: PriorityConfig = {
    dayThresholds: {
        high: 30,
        medium: 14,
        low: 7
    },
    colors: {
        high: '#dc2626',
        medium: '#f59e0b',
        low: '#22c55e'
    }
};

export function calculatePriority(daysSinceContact: number, accountType: string): number {
    let priority = 0;
    
    if (daysSinceContact > priorityConfig.dayThresholds.high) priority += 3;
    else if (daysSinceContact > priorityConfig.dayThresholds.medium) priority += 2;
    else if (daysSinceContact > priorityConfig.dayThresholds.low) priority += 1;

    if (accountType === 'active') priority += 2;
    else if (accountType === 'prospect') priority += 1;

    return priority;
}

export function getPriorityColor(priority: number): string {
    if (priority >= 4) return priorityConfig.colors.high;
    if (priority >= 2) return priorityConfig.colors.medium;
    return priorityConfig.colors.low;
}