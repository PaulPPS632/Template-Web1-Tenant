import { Component, OnInit } from '@angular/core';
import DashboardComponent from '../dashboard/dashboard.component';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { TenantService } from '../../../services/tenant.service';
import { Tenant } from '../../../models/Tenant';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, DashboardComponent, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent implements OnInit {
  isSidebarOpen = true;
  tenant: Tenant | null = null;
  constructor(
    private router: Router,
    private tenantService: TenantService,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });
    this.tenantService.tenant$.subscribe((tenant) => {
      this.tenant = tenant;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  Logout() {
    localStorage.removeItem('User');
    localStorage.removeItem('authToken');
    this.router.navigate(['/']);
  }
}
