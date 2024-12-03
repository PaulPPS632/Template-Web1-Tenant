import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItemComponent } from './ui/cart-item/cart-item.component';
import { CartStateService } from '../data-access/cart-state.service';
import { ProductItemCart } from '../../admin/models/product.interface';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import KRGlue from '@lyracom/embedded-form-glue';
import { PaymentService } from '../../admin/services/payment.service';
import { PedidoService } from '../../admin/services/pedido.service';
import { AuthService } from '../../admin/services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
declare const initFlowbite: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent, CurrencyPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  styles: ``,
})
export default class CartComponent implements OnInit {
  @ViewChild('carrito') divcarrito!: ElementRef;
  @ViewChild('datos') divdatos!: ElementRef;
  @ViewChild('pagar') divpagar!: ElementRef;
  pedidoService = inject(PedidoService);
  state = inject(CartStateService).state;
  authService = inject(AuthService);
  estadopayment = 'CARRITO';
  TipoPago = '';
  formToken = '';
  message = '';
  username: string | null = null;
  RediccionPanelOpen = false;
  UserID = '';
  data = {
    amount: this.state.price() * 100,
    currency: 'PEN',
    orderId: 'ORDER-' + uuidv4(),
    customer: {
      email: '',
      billingDetails: {
        firstName: '',
        lastName: '',
        cellPhoneNumber: '',
        address: '',
        district: 'Ficus',
        city: 'Santa Anita',
        state: 'Lima',
        country: 'PE',
        identityCode: '',
        identityType: 'DNI',
      },
    },
  };

  CreateOpen = false;

  openCModal() {
    this.CreateOpen = true;
  }

  private renderer: Renderer2;

  constructor(
    private router: Router,
    renderer: Renderer2,
    private paymentService: PaymentService,
    private chRef: ChangeDetectorRef,
  ) {
    this.renderer = renderer;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });
  }
  CompletarDatos() {
    this.authService.isLoggedIn().subscribe(
      (response) => {
        if (response.estado) {
          this.data.customer.email = response.usuario.email;
          this.data.customer.billingDetails.firstName = response.usuario.nombre;
          this.data.customer.billingDetails.lastName =
            response.usuario.apellido;
          this.data.customer.billingDetails.cellPhoneNumber =
            response.usuario.telefono;
          this.data.customer.billingDetails.address =
            response.usuario.direccion;
          this.data.customer.billingDetails.identityCode =
            response.usuario.documento;
          this.UserID = response.usuario.id;
        } else {
          this.router.navigate(['/sesion/sign-in']);
        }
      },
      (error) => {
        console.error('Error en isLoggedIn:', error);
        this.router.navigate(['/sesion/sign-in']);
      },
    );
  }

  CreateIOpen = false;

  openCIModal() {
    this.CreateIOpen = true;
  }

  checkCartItems(): void {
    //validacion con respecto al precio
    console.log('completar');
    this.CompletarDatos();
    const cartItems = this.state.price();
    if (cartItems <= 0) {
      this.openCIModal();
    } else {
      //si tiene elementos el carrito
      this.estadopayment = 'DATOS';
      this.divcarrito.nativeElement.classList.add('activate');
      this.divdatos.nativeElement.classList.add('activate');
      this.divpagar.nativeElement.classList.remove('activate');
    }
  }

  Regresar() {
    this.estadopayment = 'CARRITO';
    this.divcarrito.nativeElement.classList.add('activate');
    this.divdatos.nativeElement.classList.remove('activate');
    this.divpagar.nativeElement.classList.remove('activate');
  }

  Regresar2() {
    this.estadopayment = 'DATOS';
    this.divcarrito.nativeElement.classList.add('activate');
    this.divdatos.nativeElement.classList.add('activate');
    this.divpagar.nativeElement.classList.remove('activate');
  }

  ProcesoPagoTarjeta() {
    this.TipoPago = 'TARJETA';
    const endpoint = 'https://api.micuentaweb.pe';
    // const publicKey = '80203493:publickey_1nPGb868QNn3uq7hs8Q71A2wT0y5WEk9zhm3eKdVczupQ';

    this.paymentService.getPublicKey().subscribe({
      next: (data) => {
        const publicKey = data.publickey;
        console.log(publicKey);

        // const publicKey =
        //   '80203493:testpublickey_2h74LTfgBCifM8NOXKuDkUqYUHMbb7jUegkAJqSUYYLgl';

        this.paymentService.postExternalData(this.data).subscribe((data) => {
          this.formToken = data.formToken;
          KRGlue.loadLibrary(endpoint, publicKey) // Load the remote library
            .then(({ KR }) =>
              KR.setFormConfig({
                //set the minimal configuration
                formToken: this.formToken,
                'kr-language': 'es-ES',
                //to update initialization parameter
              }),
            )
            .then(({ KR }) =>
              KR.onSubmit(async (paymentData) => {
                this.paymentService.validatePayment(paymentData).subscribe(
                  (response) => {
                    if (response.Status) {
                      this.message = 'pagado';
                      this.RegistrarPedido();
                    } else {
                      this.message = 'no pagado';
                    }
                    this.chRef.detectChanges();
                  },
                  (_error) => {
                    this.message = 'PIPIPI';
                  },
                );
                return true;
              }),
            )
            .then(({ KR }) => KR.renderElements('#myPaymentForm'));
        });
      },
      error: (err) => {
        console.error('Error al obtener la clave pública:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message,
        });
      },
    });
  }

  RegistrarPedido() {
    const pedido = {
      ClienteId: this.UserID,
      productos: JSON.stringify(this.state.products()),
      datospago: JSON.stringify(this.data),
      estado: 'NUEVO',
    };
    this.pedidoService.registrar(pedido).subscribe();
    this.RediccionPanelOpen = true;
  }
  Panel() {
    this.router.navigate(['/panel']);
  }

  onRemove(id: string) {
    this.state.remove(id);
  }

  onIncrease(product: ProductItemCart) {
    this.state.udpate({
      product: product.product,
      quantity: product.quantity + 1,
    });
  }

  onDecrease(product: ProductItemCart) {
    this.state.udpate({
      ...product,
      quantity: product.quantity - 1,
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.estadopayment = 'PAYMENT';
    } else {
      this.CreateOpen = true;
    }
  }

  onContinue(form: NgForm) {
    if (form.valid) {
      this.estadopayment = 'PAYMENT';
      this.divcarrito.nativeElement.classList.add('activate');
      this.divdatos.nativeElement.classList.add('activate');
      this.divpagar.nativeElement.classList.add('activate');
    } else {
      this.CreateOpen = true;
    }
  }
}
