import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuikaComponent } from './pages/suika/suika.component';

const routes: Routes = [
  { path: 'suika', component: SuikaComponent },
  { path: '', redirectTo: '/suika', pathMatch: 'full' },
  { path: '**', redirectTo: '/suika' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
