import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FederationsComponent} from './components/federations/federations.component';
import {EditFederationComponent} from './components/federations/edit-federation/edit-federation.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {NavigationComponent} from './components/navigation/navigation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CountriesComponent} from './components/countries/countries.component';
import {EditCountryComponent} from './components/countries/edit-country/edit-country.component';
import {LeaguesComponent} from './components/leagues/leagues.component';
import {EditLeagueComponent} from './components/leagues/edit-league/edit-league.component';
import {ClubsComponent} from './components/clubs/clubs.component';
import {EditClubComponent} from './components/clubs/edit-club/edit-club.component';
import {PlayersComponent} from './components/players/players.component';
import {EditPlayerComponent} from './components/players/edit-player/edit-player.component';
import {NationalteamComponent} from './components/nationalteam/nationalteam.component';
import {EditNationalteamComponent} from './components/nationalteam/edit-nationalteam/edit-nationalteam.component';
import {FilterNationalteamPipe} from './pipes/filter-nationalteam.pipe';
import {FormatComponent} from './components/format/format.component';
import {TypeTournamentComponent} from './components/type-tournament/type-tournament.component';
import {TypeMatchComponent} from './components/type-match/type-match.component';
import {TournamentComponent} from './components/tournament/tournament.component';
import {GroupsComponent} from './components/tournament/groups/groups.component';
import {TeamsComponent} from './components/tournament/teams/teams.component';
import {MatchesComponent} from './components/tournament/matches/matches.component';
import {ResultsComponent} from './components/tournament/results/results.component';
import {FirstPlaceComponent} from './components/tournament/first-place/first-place.component';
import {ThirdPlaceComponent} from './components/tournament/third-place/third-place.component';
import {EditTournamentComponent} from './components/tournament/edit-tournament/edit-tournament.component';
import {FilterGroupPipe} from './pipes/filter-group.pipe';
import {FilterTournamentPipe} from './pipes/filter-tournament.pipe';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {UsersComponent} from './components/users/users.component';
import {LoginComponent} from './components/session/login/login.component';
import {LogoutComponent} from './components/session/logout/logout.component';
import {NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FilterTeamPipe} from './pipes/filter-team.pipe';
import {EditMatchComponent} from './components/tournament/matches/edit-match/edit-match.component';
import {FilterCountryPipe} from './pipes/filter-country.pipe';
import {FilterSelectablePipe} from './pipes/filter-selectable.pipe';
import {FilterPlayerPipe} from './pipes/filter-player.pipe';
import {FilterMatchPipe} from './pipes/filter-match.pipe';
import {FilterMvpPipe} from './pipes/filter-mvp.pipe';
import {StatisticsComponent} from './components/tournament/statistics/statistics.component';
import {FinalsComponent} from './components/tournament/finals/finals.component';
import {MatchesFinalsComponent} from './components/tournament/matches-finals/matches-finals.component';
import {FilterPhasePipe} from './pipes/filter-phase.pipe';
import {FilterStagePipe} from './pipes/filter-stage.pipe';
import {FilterPodiumPipe} from './pipes/filter-podium.pipe';
import {FilterGoalScorerPipe} from './pipes/filter-goal-scorer.pipe';
import {PenkaComponent} from './components/tournament/penka/penka.component';
import {SingleMatchesComponent} from './components/single-matches/single-matches.component';
import {EditSingleMatchComponent} from './components/edit-single-match/edit-single-match.component';
import {NewSingleMatchComponent} from './components/single-matches/new-single-match/new-single-match.component';
import {NewTournamentComponent} from './components/tournament/new-tournament/new-tournament.component';
import {CompetitionsComponent} from './components/competitions/competitions.component';
import {TemplatesComponent} from './components/templates/templates.component';
import {NewTemplatesComponent} from './components/templates/new-templates/new-templates.component';
import {FilterStatusPipe} from './pipes/filter-status.pipe';
import {FilterCodePenkaPipe} from './pipes/filter-code-penka.pipe';
import {HistoryTemplatesComponent} from './components/templates/history-templates/history-templates.component';
import {FilterCodeTemplatePipe} from './pipes/filter-code-template.pipe';
import {FilterPublishPipe} from './pipes/filter-publish.pipe';
import {FilterFiledPipe} from './pipes/filter-filed.pipe';
import { EditTemplatesComponent } from './components/templates/edit-templates/edit-templates.component';

@NgModule({
  declarations: [
    AppComponent,
    FederationsComponent,
    EditFederationComponent,
    NavigationComponent,
    CountriesComponent,
    EditCountryComponent,
    LeaguesComponent,
    EditLeagueComponent,
    ClubsComponent,
    EditClubComponent,
    PlayersComponent,
    EditPlayerComponent,
    NationalteamComponent,
    EditNationalteamComponent,
    FilterNationalteamPipe,
    FormatComponent,
    TypeTournamentComponent,
    TypeMatchComponent,
    TournamentComponent,
    GroupsComponent,
    TeamsComponent,
    MatchesComponent,
    ResultsComponent,
    FirstPlaceComponent,
    ThirdPlaceComponent,
    EditTournamentComponent,
    FilterGroupPipe,
    FilterTournamentPipe,
    UsersComponent,
    LoginComponent,
    LogoutComponent,
    FilterTeamPipe,
    EditMatchComponent,
    FilterCountryPipe,
    FilterSelectablePipe,
    FilterPlayerPipe,
    FilterMatchPipe,
    FilterMvpPipe,
    StatisticsComponent,
    FinalsComponent,
    MatchesFinalsComponent,
    FilterPhasePipe,
    FilterStagePipe,
    FilterPodiumPipe,
    FilterGoalScorerPipe,
    PenkaComponent,
    SingleMatchesComponent,
    EditSingleMatchComponent,
    NewSingleMatchComponent,
    NewTournamentComponent,
    CompetitionsComponent,
    TemplatesComponent,
    NewTemplatesComponent,
    FilterStatusPipe,
    FilterCodePenkaPipe,
    HistoryTemplatesComponent,
    FilterCodeTemplatePipe,
    FilterPublishPipe,
    FilterFiledPipe,
    EditTemplatesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    AngularFireAuthModule,
    NgbModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule {
}
