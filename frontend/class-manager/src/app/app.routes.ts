import { Routes } from '@angular/router';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { SignupPageComponent } from './components/pages/signup-page/signup-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'main-page', pathMatch: 'full'
    },
    {
        path: 'main-page',
        component: MainPageComponent,
        children: [
            {
                path: 'header',
                component: HeaderComponent
            },
            {  
                path: 'footer',
                component: FooterComponent
            },
        ]
    },
    {
        path: 'home-page',
        component: HomePageComponent, 
    },
    {
        path: 'profile-page',
        component: ProfilePageComponent
    },
    {
        path: 'login-page',
        component: LoginPageComponent
    },
    {
        path: 'signup-page',
        component: SignupPageComponent
    }
];
