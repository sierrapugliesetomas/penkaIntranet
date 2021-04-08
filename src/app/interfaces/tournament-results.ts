export interface TournamentResults {
    id?: string;
    tournamentId?: string;
    tournamentName?: string;
    tournamentPhaseFinals?: string;
    group?: string;
    teamId?: string;
    teamName?: string;
    teamFlagUrl?: string;
    teamPodium?: string;
    matchesPlayed?: number;
    matchesWon?: number;
    matchesDraw?: number;
    matchesLost?: number;
    positiveGoals?: number;
    negativeGoals?: number;
    averageGoals?: number;
    points?: number;
    classified?: boolean;
}
