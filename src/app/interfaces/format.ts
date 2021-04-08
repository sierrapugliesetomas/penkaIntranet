export interface Format {
    id?: string;
    name?: string;
    podium?: boolean;
    podiumGoldPoints?: number;
    podiumSilverPoints?: number;
    podiumBronzePoints?: number;
    mvp?: boolean;
    mvpPoints?: number;
    goalScorer?: boolean;
    goalScorerPoints?: number;
    winnerProgressive?: boolean;
    winnerProgressivePoints?: number;
    drawProgressivePoints?: number;
    exactResult?: boolean;
    exactResultPoints?: number;
}
