import { Component, computed, Input, input, signal } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  sidenavCollapsed = signal(false);
  @Input() set collapsed(val: boolean){
    this.sidenavCollapsed.set(val);
  }
  menuItems = signal<MenuItem[]>([
    {
      icon:'dashboard',
      label:'Dashboard',
      route:'dashboard',
    },
    {
      icon:'personal_injury',
      label:'Patients',
      route:'patients',
    },
    {
      icon:'analytics',
      label:'Analytics',
      route:'analytics',
    },
    {
      icon:'comment',
      label:'Comments',
      route:'comments',
    }
  ]);

  // profilePicSize = computed(() => this.sidenavCollapsed() ? '32' : '100');
}
