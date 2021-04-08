import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FederationsComponent} from './components/federations/federations.component';
import {EditFederationComponent} from './components/federations/edit-federation/edit-federation.component';
import {CountriesComponent} from './components/countries/countries.component';
import {EditCountryComponent} from './components/countries/edit-country/edit-country.component';
import {LeaguesComponent} from './components/leagues/leagues.component';
import {EditLeagueComponent} from './components/leagues/edit-league/edit-league.component';
import {ClubsComponent} from './components/clubs/clubs.component';
import {EditClubComponent} from './components/clubs/edit-club/edit-club.component';
import {PlayersComponent} from './components/players/players.component';
import {EditPlayerComponent} from './components/players/edit-player/edit-player.component';
import {NationalteamComponent} from './components/nationalteam/nationalteam.component';
import {FormatComponent} from './components/format/format.component';
import {TypeTournamentComponent} from './components/type-tournament/type-tournament.component';
import {TypeMatchComponent} from './components/type-match/type-match.component';
import {TournamentComponent} from './components/tournament/tournament.component';
import {ThirdPlaceComponent} from './components/tournament/third-place/third-place.component';
import {FirstPlaceComponent} from './components/tournament/first-place/first-place.component';
import {EditTournamentComponent} from './components/tournament/edit-tournament/edit-tournament.component';
import {GroupsComponent} from './components/tournament/groups/groups.component';
import {MatchesComponent} from './components/tournament/matches/matches.component';
import {TeamsComponent} from './components/tournament/teams/teams.component';
import {ResultsComponent} from './components/tournament/results/results.component';
import {AuthGuard} from './auth.guard';
import {LoginComponent} from './components/session/login/login.component';
import {LogoutComponent} from './components/session/logout/logout.component';
import {EditMatchComponent} from './components/tournament/matches/edit-match/edit-match.component';
import {SingleMatchesComponent} from './components/single-matches/single-matches.component';
import {NewSingleMatchComponent} from './components/single-matches/new-single-match/new-single-match.component';
import {NewTournamentComponent} from './components/tournament/new-tournament/new-tournament.component';
import {CompetitionsComponent} from './components/competitions/competitions.component';
import {TemplatesComponent} from './components/templates/templates.component';
import {NewTemplatesComponent} from './components/templates/new-templates/new-templates.component';
import {HistoryTemplatesComponent} from './components/templates/history-templates/history-templates.component';

const routes: Routes = [
    /* Futbol */
    {path: 'federations', component: FederationsComponent, canActivate: [AuthGuard]},
    {path: 'federations/edit/:id', component: EditFederationComponent, canActivate: [AuthGuard]},
    {path: 'countries', component: CountriesComponent, canActivate: [AuthGuard]},
    {path: 'countries/edit/:id', component: EditCountryComponent, canActivate: [AuthGuard]},
    {path: 'leagues', component: LeaguesComponent, canActivate: [AuthGuard]},
    {path: 'leagues/edit/:id', component: EditLeagueComponent, canActivate: [AuthGuard]},
    {path: 'clubs', component: ClubsComponent, canActivate: [AuthGuard]},
    {path: 'clubs/edit/:id', component: EditClubComponent, canActivate: [AuthGuard]},
    {path: 'players', component: PlayersComponent, canActivate: [AuthGuard]},
    {path: 'players/edit/:id', component: EditPlayerComponent, canActivate: [AuthGuard]},
    {path: 'nationalteams', component: NationalteamComponent, canActivate: [AuthGuard]},
    {path: 'competitions', component: CompetitionsComponent, canActivate: [AuthGuard]},

    /* Penka */
    {path: 'format', component: FormatComponent, canActivate: [AuthGuard]},

    /* Single Matches */
    {path: 'singleMatches', component: SingleMatchesComponent, canActivate: [AuthGuard]},
    {path: 'singleMatches/new', component: NewSingleMatchComponent, canActivate: [AuthGuard]},

    /* Templates */
    {path: 'templates', component: TemplatesComponent, canActivate: [AuthGuard]},
    {path: 'templates/new', component: NewTemplatesComponent, canActivate: [AuthGuard]},
    {path: 'templates/history', component: HistoryTemplatesComponent, canActivate: [AuthGuard]},

    /* Tournament */
    {path: 'tournaments', component: TournamentComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/new', component: NewTournamentComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/edit/:id', component: EditTournamentComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/groups/:id', component: GroupsComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/matches/:id', component: MatchesComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/matches/edit/:id', component: EditMatchComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/teams/:id', component: TeamsComponent, canActivate: [AuthGuard]},
    {path: 'tournaments/results/:id', component: ResultsComponent, canActivate: [AuthGuard]},

    /* Tournament miscelanius */
    {path: 'typeTournaments', component: TypeTournamentComponent, canActivate: [AuthGuard]},
    {path: 'typeMatches', component: TypeMatchComponent, canActivate: [AuthGuard]},
    {path: 'thirdPlace', component: ThirdPlaceComponent, canActivate: [AuthGuard]},
    {path: 'firstPlace', component: FirstPlaceComponent, canActivate: [AuthGuard]},

    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'}

];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
