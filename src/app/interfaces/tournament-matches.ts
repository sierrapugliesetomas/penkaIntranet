export interface TournamentMatches {
    id?: string;
    phase?: string;
    group?: string;
    name?: string;
    tournamentId?: string;
    tournamentName?: string;
    winnerId?: string;
    winnerName?: string;
    winnerFlag?: string;
    loserId?: string;
    loserName?: string;
    loserFlag?: string;
    draw?: boolean;
    homeTeamId?: string;
    homeTeamName?: string;
    homeFlag?: string;
    homeScore?: number;
    visitTeamId?: string;
    visitTeamName?: string;
    visitFlag?: string;
    visitScore?: number;
    startDate?: string;
    startTime?: string;
    status?: string;
}
