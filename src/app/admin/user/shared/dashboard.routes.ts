import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from '../../../app.routes';
import { InventarioComponent } from '../gestion/inventory/inventario/inventario.component';
import LayoutComponent from './layout/layout.component';
import { FacIngresoComponent } from '../gestion/fac-ingreso/fac-ingreso.component';
import ComprobantesComponent from '../comprobantes/comprobantes.component';
import { AdminUsersComponent } from '../admin-users/admin-users.component';
import { PedidosComponent } from '../../user/pedidos/pedidos.component';
import UsuarioVentaComponent from '../../user/gestion/fac-salida/fac-salida.component';
import { ImagenesUblicitariasComponent } from '../../user/imagenes-ublicitarias/imagenes-ublicitarias.component';
import { CrearEntidadComponent } from '../../user/acciones/crear-entidad/crear-entidad.component';
import DashboardComponent from './dashboard/dashboard.component';
import { InventarioDetalleComponent } from '../gestion/inventory/inventario-detalle/inventario-detalle.component';
import { ListCotizacionComponent } from '../gestion/list-cotizacion/list-cotizacion.component';
import { CotizacionComponent } from '../gestion/cotizacion/cotizacion.component';
import { CategoriaComponent } from '../gestion/categoria/categoria.component';
import { MarcaComponent } from '../gestion/marca/marca.component';
import { ReportesComponent } from '../reportes/reportes.component';

export default [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'comprobantes', component: ComprobantesComponent },
      { path: 'admin-user', component: AdminUsersComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'inventario/:id', component: InventarioDetalleComponent },
      { path: 'ingreso', component: FacIngresoComponent },
      { path: 'ingreso/:id', component: FacIngresoComponent },
      { path: 'salida', component: UsuarioVentaComponent },
      { path: 'salida/:id', component: UsuarioVentaComponent },
      { path: 'publicitarias', component: ImagenesUblicitariasComponent },
      { path: 'entidades', component: CrearEntidadComponent },
      { path: 'cotizaciones', component: ListCotizacionComponent },
      { path: 'categoria', component: CategoriaComponent },
      { path: 'marca', component: MarcaComponent },
      { path: 'cotizaciones/nuevo', component: CotizacionComponent },
      { path: 'reportes', component: ReportesComponent },
    ],
  },
] as Routes;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
