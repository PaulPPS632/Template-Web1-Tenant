import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from './website/ui/header/header.component';
import { FooterComponent } from './website/ui/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { TenantService } from './admin/services/tenant.service';
import { Tenant } from './admin/models/Tenant';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'technet';

  showHeaderFooter: boolean = true;
  showCarousel: boolean = true;
  imagenespublicitarias: { [key: string]: string[] } = {};
  tenant: Tenant = {
    id: '',
    nombre: '',
    tiponegocio: '',
    dominio: '',
    dominiofront: '',
    urllogo: '',
  };
  private routeSubscription!: Subscription;

  constructor(
    private router: Router,
    private tenantService: TenantService,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        initFlowbite();
      }
    });

    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const headerFooterExcludedRoutes = ['/dashboard'];
        const currentRoute = event.urlAfterRedirects;

        this.showHeaderFooter = !headerFooterExcludedRoutes.some((route) =>
          currentRoute.startsWith(route),
        );
      });
    this.tenantService.loadTenant().subscribe((tenantInfo) => {
      this.tenant = tenantInfo;
      this.titleService.setTitle(tenantInfo.nombre);
      this.updateFavicon(tenantInfo.urllogo);
    });

    // this.archivosService.getImagenesPublicitarias().subscribe((data) => {
    //   this.imagenespublicitarias = data;
    // });
  }
  updateFavicon(url: string): void {
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") ||
      document.createElement('link');
    link.type = 'image/webp';
    link.rel = 'icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  ObjectKeys(obj: any): string[] {
    //retorna un formato iterable
    return Object.keys(obj);
  }
}
