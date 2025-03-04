import { Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ConverterComponent } from './pages/converter/converter.component';
import { soloLogueadoGuard } from './guards/solo-logueado.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManageComponent } from './pages/user-manage/user-manage';
import { soloPublicoGuard } from './guards/solo-publico-guard';
import { CurrenciesComponent } from './pages/currencies/currencies.component';
import { RegisterComponent } from './pages/register/register.component';
import { ConvertionsComponent } from './pages/convertions/convertions.component';

export const routes: Routes = [

    {
        path: "",
        component: LogInComponent
    },
    {
        path: "logIn",
        component: LogInComponent,
        canActivate: [soloPublicoGuard]
    },
    {
        path: "",
        component: DashboardComponent,
      canActivate: [soloLogueadoGuard],
        children:[
            
            {
                path: "converter",
                component: ConverterComponent,
                canActivate: [soloLogueadoGuard]
            },
            {
                path: "user-manage",
                component: UserManageComponent,
                canActivate: [soloLogueadoGuard]
            },
            {
                path : "convertions",
                component: ConvertionsComponent,
                canActivate: [soloLogueadoGuard]
            },
            {
                path: "currencies",
                component: CurrenciesComponent,
                canActivate: [soloLogueadoGuard]
            }
        ]
    },
    {
        path: "not-found",
        component: NotFoundComponent
    },

    {
        path: "signUp",
        component: RegisterComponent
    },
    {
        path: "**",
        redirectTo: "not-found",
        pathMatch: "full"
    },
    
];
