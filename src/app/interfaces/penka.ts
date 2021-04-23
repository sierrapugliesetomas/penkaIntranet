export interface Penka {
    id?: string;
    makerId?: string;
    makerName?: string;
    makerEmail?: string;
    makerPhoto?: string;
    name?: string;
    type?: string; /* singleMatches, templates, tournament */
    codePenka?: string; /* code sharing */
    format?: string;
    public?: boolean;
    bet?: number;
    distributionBet?: string;
    prize?: number;
    accumulatedBet: number;
    coin?: string; /* USD, PEN */
    nParticipants?: number;
    limitParticipants?: number;
    status?: string; /* 1- in Game // 2- finished  //  3- archived  */
    date?: Date;
    dateLimit?: Date;
    createdAt?: Date;
    visibility: string;
    typePenka: string;
    formatName: string;
    singleMatchesId: string[];
    codeTemplate: string;
    codeTournament: string;
    tournamentId : string;
    tournamentName : string;
}




// id : string;
// typePenka : string;
// nParticipants : number;
// name : string;
// codePenka : string;
// makerId : string;
// makerName : string;
// makerEmail : string;
// singleMatchesId : string[];
// tournamentId : string;
// tournamentName : string;
// formatName : string;
// bet : number;
// distributionBet : number;
// accumulatedBet : number;
// date : string;
// status : string;