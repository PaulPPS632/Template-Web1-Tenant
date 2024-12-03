import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DetallepedidoComponent } from './detallepedido/detallepedido.component';
import { Pedido } from '../../models/pedido-fomart';
interface pedido {
  id: '';
  fecha: '';
  productos: any;
  datospago: any;
  estado: '';
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, CommonModule, DetallepedidoComponent],
  templateUrl: './pedidos.component.html',
  styles: ``,
})
export class PedidosComponent implements OnInit {
  constructor(private pedidosService: PedidoService) {}
  DetalleOpen = false;
  pedidos: Pedido[] = [];
  pedidoSelected?: Pedido | undefined;

  ngOnInit(): void {
    this.pedidosService.listar().subscribe((data: Pedido[]) => {
      // data.forEach((element) => {
      //   this.pedidos.push({
      //     id: element.id,
      //     fecha: element.fecha,
      //     productos: JSON.parse(element.productos),
      //     datospago: JSON.parse(element.datospago),
      //     estado: element.estado,
      //     username: element.username,
      //   });
      // });
      this.pedidos = data;
      console.log(this.pedidos);
    });
  }

  Detalles(id: string | any) {
    this.pedidoSelected = this.pedidos.find((p) => p.id == id);
    this.DetalleOpen = !!this.pedidoSelected;
  }
  onRemoveModal(flag: boolean) {
    this.DetalleOpen = flag;
  }
}
