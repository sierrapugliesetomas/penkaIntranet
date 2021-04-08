import {Component, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';
import {ThirdPlace} from '../../../interfaces/third-place';
import {TypeTournament} from '../../../interfaces/type-tournament';
import {TypeMatch} from '../../../interfaces/type-match';
import {FirstPlace} from '../../../interfaces/first-place';
import {TournamentTeams} from '../../../interfaces/tournament-teams';
import {TournamentGroups} from '../../../interfaces/tournament-groups';
import {TournamentMatches} from '../../../interfaces/tournament-matches';
import {TournamentResults} from '../../../interfaces/tournament-results';
import {TournamentService} from '../../../services/Tournament/tournament.service';
import {TypeMatchService} from '../../../services/typeMatch/type-match.service';
import {TypeTournamentService} from '../../../services/typeTournament/type-tournament.service';
import {ThirdPlaceService} from '../../../services/third-place/third-place.service';
import {FirstPlaceService} from '../../../services/first-place/first-place.service';
import {TournamentTeamsService} from '../../../services/Tournament/tournament-teams.service';
import {TournamentGroupsService} from '../../../services/Tournament/tournament-groups.service';
import {TournamentMatchesService} from '../../../services/Tournament/tournament-matches.service';
import {TournamentResultsService} from '../../../services/Tournament/tournament-results.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-new-tournament',
    templateUrl: './new-tournament.component.html',
    styleUrls: ['./new-tournament.component.css']
})
export class NewTournamentComponent implements OnInit {

    /* RESULT QUERIES INIT */
    tournaments = [];
    thirdPlaces = [];
    typeTournaments = [];
    typeMatches = [];
    firstPlaces = [];

    /* GET DATA FORM */
    duplicated: any;
    thirdPlace = {} as ThirdPlace;
    typeTournament = {} as TypeTournament;
    typeMatch = {} as TypeMatch;
    firstPlace = {} as FirstPlace;

    /* NEW TOURNAMENT */
    newTournament = {} as Tournament;
    team = {} as TournamentTeams;
    group = {} as TournamentGroups;
    match = {} as TournamentMatches;
    result = {} as TournamentResults;

    constructor(
        private tournamentService: TournamentService,
        private typeMatchService: TypeMatchService,
        private typeTournamentService: TypeTournamentService,
        private thirdPlaceService: ThirdPlaceService,
        private firstPlaceService: FirstPlaceService,
        private tournamentTeamsService: TournamentTeamsService,
        private tournamentGroupsService: TournamentGroupsService,
        private tournamentMatchesService: TournamentMatchesService,
        private tournamentResultsService: TournamentResultsService,
        private router: Router) {
    }

    ngOnInit() {
        this.tournamentService.getTournaments().subscribe(
            res => this.tournaments = res,
            error => console.log(error));

        this.typeMatchService.getTypeMatches().subscribe(
            res => this.typeMatches = res,
            error => console.log(error));

        this.typeTournamentService.getTypeTournaments().subscribe(
            res => this.typeTournaments = res,
            error => console.log(error));

        this.thirdPlaceService.getThirdPlaces().subscribe(
            res => this.thirdPlaces = res,
            error => console.log(error));

        this.firstPlaceService.getFirstPlaces().subscribe(
            res => this.firstPlaces = res,
            error => console.log(error));
    }

    /* GETTING DATA FROM FORM */
    preventDuplicated(event) {
        /* get duplicated prevent */
        this.tournamentService.getTournamentsDuplicated(event.value).subscribe(
            res => this.duplicated = res,
            error => console.log(error));
    }

    loadTypeTournament(event) {
        /* get data by type tournament */
        this.typeTournamentService.getTypeTournamentById(event.value).subscribe(
            res => this.typeTournament = res,
            error => console.log(error));
    }

    loadTypeMatches(event) {
        /* get data by type matches */
        this.typeMatchService.getTypeMatchById(event.value).subscribe(
            res => this.typeMatch = res,
            error => console.log(error));
    }

    loadThirdPlace(event) {
        /* get data by third place*/
        this.thirdPlaceService.getThirdPlaceById(event.value).subscribe(
            res => this.thirdPlace = res,
            error => console.log(error));
    }

    loadFirstPlace(event) {
        /* get data by first place */
        this.firstPlaceService.getFirstPlaceById(event.value).subscribe(
            res => this.firstPlace = res,
            error => console.log(error));
    }

    updateOpening(event) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.newTournament.openingDate = event.day + ' de ' + months[(event.month - 1)] + ' de ' + event.year;
    }

    updateClosure(event) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.newTournament.closureDate = event.day + ' de ' + months[(event.month - 1)] + ' de ' + event.year;
    }

    addNewTournament() {

        /* VALIDATE DUPLICATED */
        if (this.duplicated.length > 0) {
            alert('Ya existe un torneo con ese nombre');

        } else {
            /* GETTING GROUPS */
            let nTeams: number;
            let nGroups: number;
            let nTeamsByGroup: number;
            let nMatchesByGroup: number;
            let nMatchesPhaseGroups: number;
            let nMatchesByTypeMatch: number;
            let phaseGroups: boolean;

            /* IF TOURNAMENT HAVE GROUP PHASE */
            if (this.typeTournament.groups === true) {
                phaseGroups = true;
                nTeams = this.newTournament.nTeams;
                nGroups = this.newTournament.nGroups;
                nMatchesByTypeMatch = this.typeMatch.nMatches;

                nTeamsByGroup = (nTeams / nGroups);
                nMatchesByGroup = (((nTeamsByGroup / 2) * (nTeamsByGroup - 1)) * nMatchesByTypeMatch);
                nMatchesPhaseGroups = (nMatchesByGroup * nGroups);

                /* SAVE TEAMS AND GROUPS AND MATCHES PHASE GROUPS */
                const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

                /* TEAMS */
                for (let g = 0; g < nGroups; g++) {
                    for (let t = 0; t < nTeamsByGroup; t++) {
                        this.team.teamId = '';
                        this.team.teamName = 'Equipo' + ' ' + (t + 1);
                        this.team.order = (t + 1);
                        this.team.flagUrl = '../../../assets/images/bandera.png';
                        this.team.group = 'Grupo' + ' ' + groups[g];
                        this.team.tournamentId = '';
                        this.team.tournamentName = this.newTournament.name;
                        this.tournamentTeamsService.addTeam(this.team);
                    }
                }

                /* GROUPS */
                for (let g = 0; g < nGroups; g++) {
                    this.group.name = 'Grupo ' + groups[g];
                    this.group.tournamentId = '';
                    this.group.tournamentName = this.newTournament.name;
                    this.tournamentGroupsService.addGroup(this.group);

                    /* MATCHES */
                    for (let m = 0; m < nMatchesByGroup; m++) {
                        this.match.name = 'Partido' + ' ' + (m + 1);
                        this.match.phase = 'groups';
                        this.match.group = 'Grupo' + ' ' + groups[g];
                        this.match.tournamentId = '';
                        this.match.tournamentName = this.newTournament.name;
                        this.match.winnerId = '';
                        this.match.winnerName = '';
                        this.match.winnerFlag = '';
                        this.match.loserId = '';
                        this.match.loserName = '';
                        this.match.loserFlag = '';
                        this.match.draw = true;
                        this.match.homeTeamId = 'Equipo' + ' ' + m + g;
                        this.match.homeTeamName = 'Equipo' + ' ' + (m + 1);
                        this.match.homeFlag = '';
                        this.match.homeScore = null;
                        this.match.visitTeamId = 'Equipo' + ' ' + g + m;
                        this.match.visitTeamName = 'Equipo' + ' ' + (m + 1);
                        this.match.visitFlag = '';
                        this.match.visitScore = null;
                        this.match.status = '';
                        this.match.startDate = '00/00/0000';
                        this.match.startTime = '00:00';
                        this.tournamentMatchesService.addMatch(this.match);
                    }
                }
            } else {
                nMatchesPhaseGroups = 0;
                phaseGroups = false;
                nTeams = this.typeTournament.nTeams;
                this.newTournament.nTeams = nTeams;
                this.newTournament.nGroups = 0;

                for (let t = 0; t < nTeams; t++) {
                    this.team.teamId = '';
                    this.team.teamName = 'Equipo' + ' ' + (t + 1);
                    this.team.order = (t + 1);
                    this.team.flagUrl = '../../../assets/images/bandera.png';
                    this.team.group = '';
                    this.team.tournamentId = '';
                    this.team.tournamentName = this.newTournament.name;
                    this.tournamentTeamsService.addTeam(this.team);
                }
            }

            /* GETTING FINALS */
            const nTeamsFinals: number = this.typeTournament.nTeams;
            let nMatches16vos = 0;
            let nMatches8vos = 0;
            let nMatches4tos = 0;
            let nMatchesSemis = 0;
            const nMatchesThirdPlace: number = this.thirdPlace.nMatches;
            const nMatchesFinal: number = this.firstPlace.nMatches;

            switch (nTeamsFinals) {
                case 32:
                    nMatches16vos = 16 * this.typeMatch.nMatches;
                    nMatches8vos = 8 * this.typeMatch.nMatches;
                    nMatches4tos = 4 * this.typeMatch.nMatches;
                    nMatchesSemis = 2 * this.typeMatch.nMatches;
                    break;
                case 16:
                    nMatches8vos = 8 * this.typeMatch.nMatches;
                    nMatches4tos = 4 * this.typeMatch.nMatches;
                    nMatchesSemis = 2 * this.typeMatch.nMatches;
                    break;
                case 8:
                    nMatches4tos = 4 * this.typeMatch.nMatches;
                    nMatchesSemis = 2 * this.typeMatch.nMatches;
                    break;
                case 4:
                    nMatchesSemis = 2 * this.typeMatch.nMatches;
                    break;
                default:
                    break;
            }

            /* MATCHES 16vos */
            for (let mf = 0; mf < nMatches16vos; mf++) {
                this.match.name = 'Partido' + ' ' + (mf + 1);
                this.match.phase = '16vos de final';
                this.match.group = '';
                this.match.tournamentId = '';
                this.match.tournamentName = this.newTournament.name;
                this.match.winnerId = '';
                this.match.winnerName = '';
                this.match.winnerFlag = '';
                this.match.loserId = '';
                this.match.loserName = '';
                this.match.loserFlag = '';
                this.match.draw = true;
                this.match.homeTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.homeTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.homeFlag = '';
                this.match.homeScore = null;
                this.match.visitTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.visitTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.visitFlag = '';
                this.match.visitScore = null;
                this.match.status = '';
                this.match.startDate = '00/00/0000';
                this.match.startTime = '00:00';
                this.tournamentMatchesService.addMatch(this.match);
            }

            /* MATCHES 8vos */
            for (let mf = 0; mf < nMatches8vos; mf++) {
                this.match.name = 'Partido' + ' ' + (mf + 1);
                this.match.phase = '8vos de final';
                this.match.group = '';
                this.match.tournamentId = '';
                this.match.tournamentName = this.newTournament.name;
                this.match.winnerId = '';
                this.match.winnerName = '';
                this.match.winnerFlag = '';
                this.match.loserId = '';
                this.match.loserName = '';
                this.match.loserFlag = '';
                this.match.draw = true;
                this.match.homeTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.homeTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.homeFlag = '';
                this.match.homeScore = null;
                this.match.visitTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.visitTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.visitFlag = '';
                this.match.visitScore = null;
                this.match.status = '';
                this.match.startDate = '00/00/0000';
                this.match.startTime = '00:00';
                this.tournamentMatchesService.addMatch(this.match);
            }

            /* MATCHES 4tos */
            for (let mf = 0; mf < nMatches4tos; mf++) {
                this.match.name = 'Partido' + ' ' + (mf + 1);
                this.match.phase = '4tos de final';
                this.match.group = '';
                this.match.tournamentId = '';
                this.match.tournamentName = this.newTournament.name;
                this.match.winnerId = '';
                this.match.winnerName = '';
                this.match.winnerFlag = '';
                this.match.loserId = '';
                this.match.loserName = '';
                this.match.loserFlag = '';
                this.match.draw = true;
                this.match.homeTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.homeTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.homeFlag = '';
                this.match.homeScore = null;
                this.match.visitTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.visitTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.visitFlag = '';
                this.match.visitScore = null;
                this.match.status = '';
                this.match.startDate = '00/00/0000';
                this.match.startTime = '00:00';
                this.tournamentMatchesService.addMatch(this.match);
            }
            /* MATCHES SEMI */
            for (let mf = 0; mf < nMatchesSemis; mf++) {
                this.match.name = 'Partido' + ' ' + (mf + 1);
                this.match.phase = 'Semifinal';
                this.match.group = '';
                this.match.tournamentId = '';
                this.match.tournamentName = this.newTournament.name;
                this.match.winnerId = '';
                this.match.winnerName = '';
                this.match.winnerFlag = '';
                this.match.loserId = '';
                this.match.loserName = '';
                this.match.loserFlag = '';
                this.match.draw = true;
                this.match.homeTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.homeTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.homeFlag = '';
                this.match.homeScore = null;
                this.match.visitTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.visitTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.visitFlag = '';
                this.match.visitScore = null;
                this.match.status = '';
                this.match.startDate = '00/00/0000';
                this.match.startTime = '00:00';
                this.tournamentMatchesService.addMatch(this.match);
            }
            /* MATCHES 3er PLACE */
            for (let mf = 0; mf < nMatchesThirdPlace; mf++) {
                this.match.name = 'Partido' + ' ' + (mf + 1);
                this.match.phase = '3er Lugar';
                this.match.group = '';
                this.match.tournamentId = '';
                this.match.tournamentName = this.newTournament.name;
                this.match.winnerId = '';
                this.match.winnerName = '';
                this.match.winnerFlag = '';
                this.match.loserId = '';
                this.match.loserName = '';
                this.match.loserFlag = '';
                this.match.draw = true;
                this.match.homeTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.homeTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.homeFlag = '';
                this.match.homeScore = null;
                this.match.visitTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.visitTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.visitFlag = '';
                this.match.visitScore = null;
                this.match.status = '';
                this.match.startDate = '00/00/0000';
                this.match.startTime = '00:00';
                this.tournamentMatchesService.addMatch(this.match);
            }

            /* MATCHES FINAL */
            for (let mf = 0; mf < nMatchesFinal; mf++) {
                this.match.name = 'Partido' + ' ' + (mf + 1);
                this.match.phase = 'Final';
                this.match.group = '';
                this.match.tournamentId = '';
                this.match.tournamentName = this.newTournament.name;
                this.match.winnerId = '';
                this.match.winnerName = '';
                this.match.winnerFlag = '';
                this.match.loserId = '';
                this.match.loserName = '';
                this.match.loserFlag = '';
                this.match.draw = true;
                this.match.homeTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.homeTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.homeFlag = '';
                this.match.homeScore = null;
                this.match.visitTeamId = 'Equipo' + ' ' + mf + mf;
                this.match.visitTeamName = 'Equipo' + ' ' + (mf + 1);
                this.match.visitFlag = '';
                this.match.visitScore = null;
                this.match.status = '';
                this.match.startDate = '00/00/0000';
                this.match.startTime = '00:00';
                this.tournamentMatchesService.addMatch(this.match);
            }

            /* GETTING DATA TOURNAMENT */
            let nMatchesTotal: number;
            // tslint:disable-next-line:max-line-length
            nMatchesTotal = ((nMatchesPhaseGroups + ((this.typeTournament.nMatches - 2) * this.typeMatch.nMatches)) + (this.thirdPlace.nMatches + this.firstPlace.nMatches));


            /* SAVE TOURNAMENT */
            this.newTournament.nMatches = nMatchesTotal;
            this.newTournament.phaseFinals = this.typeTournament.phaseFinals;
            this.newTournament.phaseGroups = phaseGroups;
            this.newTournament.typeMatches = this.typeMatch.name;
            this.newTournament.thirdPlace = this.thirdPlace.name;
            this.newTournament.firstPlace = this.firstPlace.name;
            this.newTournament.goalScorerId = '';
            this.newTournament.goalScorerName = '';
            this.newTournament.goalScorerFlagUrl = '';
            this.newTournament.goalScorerCountry = '';
            this.newTournament.mvpId = '';
            this.newTournament.mvpName = '';
            this.newTournament.mvpFlagUrls = '';
            this.newTournament.mvpCountry = '';
            this.newTournament.podiumFirstPlaceId = '';
            this.newTournament.podiumFirstPlaceName = '';
            this.newTournament.podiumFirstPlaceFlagUrl = '';
            this.newTournament.podiumSecondPlaceId = '';
            this.newTournament.podiumSecondPlaceName = '';
            this.newTournament.podiumSecondPlaceFlagUrl = '';
            this.newTournament.podiumThirdPlaceId = '';
            this.newTournament.podiumThirdPlaceName = '';
            this.newTournament.podiumThirdPlaceFlagUrl = '';
            this.tournamentService.addTournament(this.newTournament);
            this.newTournament = {} as Tournament;
            this.router.navigate(['/tournaments']).catch(error => console.log(error));
        }
    }

    delete(event, tournament: Tournament) {
        let teamsArray: any = [];
        let matchesArray: any = [];
        let resultsArray: any = [];
        let groupsArray: any = [];

        if (confirm('Esta seguro de eliminar el torneo: "' + tournament.name + '"')) {

            this.tournamentTeamsService.getTeams().subscribe(
                res => {
                    teamsArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < teamsArray.length; i++) {
                        if (teamsArray[i].tournamentName === tournament.name) {
                            this.tournamentTeamsService.deleteTeam(teamsArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentGroupsService.getGroups().subscribe(
                res => {
                    groupsArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < groupsArray.length; i++) {
                        if (groupsArray[i].tournamentName === tournament.name) {
                            this.tournamentGroupsService.deleteGroup(groupsArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentMatchesService.getMatches().subscribe(
                res => {
                    matchesArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < matchesArray.length; i++) {
                        if (matchesArray[i].tournamentName === tournament.name) {
                            this.tournamentMatchesService.deleteMatch(matchesArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentResultsService.getResults().subscribe(
                res => {
                    resultsArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < resultsArray.length; i++) {
                        if (resultsArray[i].tournamentName === tournament.name) {
                            this.tournamentResultsService.deleteResult(resultsArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentService.deleteTournament(tournament.id);
        }
    }

    edit(event, tournament: Tournament) {
        this.router.navigate(['tournaments/edit/' + tournament.id]).catch(error => console.log(error));
    }
}
