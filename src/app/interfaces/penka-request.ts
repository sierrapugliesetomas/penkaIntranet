export interface PenkaRequest {
    id?: string;
    penkaId?: string;
    codePenka?: string;
    penkaName?: string;
    makerId?: string;
    makerName?: string;
    makerEmail?: string;
    makerPhoto?: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    userPhoto?: string;
    message?: string;
    date?: Date;
    status?: string;
    timesShow?: number;
}

/* Status 
    1 - request to join penka 
    8 - accepted request
    9 - rejected request
    10 - penka finnished
    11 - penka template added match
*/
