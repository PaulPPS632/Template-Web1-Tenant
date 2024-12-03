import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { AsignarRolComponent } from '../acciones/asignar-rol/asignar-rol.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [AsignarRolComponent, FormsModule, CommonModule],
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersComponent implements OnInit {
  constructor(
    private usuarioService: UserService,
    private tenantService: TenantService,
  ) {}
  DetalleOpen = false;
  Usuarios: any[] = [];
  UsuarioSelect: any;
  UsuarioPrincipal: any;

  Pasarela = {
    username: '',
    password: '',
    hash: '',
    publickey: '',
  };

  ngOnInit(): void {
    this.usuarioService.getUsuariosDeshboard().subscribe((res) => {
      this.Usuarios = res;
      this.UsuarioPrincipal = JSON.parse(localStorage.getItem('User')!);
    });
  }
  EditarRol(usuario: any) {
    this.UsuarioSelect = usuario;
    if (this.UsuarioSelect) {
      this.DetalleOpen = true;
    }
  }
  ActualizarPasarella() {
    console.log('holis');
    this.tenantService.postPasarela(this.Pasarela).subscribe((res) => {
      console.log(res);
    });
  }
}
