import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../../services/categoria.service';
import { MarcaService } from '../../../../services/marca.service';
import { ProductoSerieService } from '../../../../services/producto-serie.service';
import Swal from 'sweetalert2';
import { QuillModule } from 'ngx-quill';
@Component({
  selector: 'app-inventario-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './inventario-detalle.component.html',
})
export class InventarioDetalleComponent implements OnInit {
  //Traer Tipado
  productos: any[] = [];
  categorias: any[] = [];
  marcas: any[] = [];
  categoriaservice = inject(CategoriaService);
  marcaservice = inject(MarcaService);

  //ID
  url = environment.API_URL;
  productService = inject(ProductoService);
  id: string = '';

  //nuevo
  nuevoActua: any = {
    id: '',
    nombre: '',
    pn: '',
    descripcion: '',
    stock: 1,
    precio: 1,
    MarcaId: 1,
    CategoriaMarcaId: 1,
    CategoriaId: 1,
    SubCategoriaId: 1,
    garantia_cliente: 0,
    garantia_total: 0,
    cantidad: 0,
    imagen_principal: '',
    imageurl: [],
  };

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
  ) {}

  ListaCategoriaMarcaSeleccionada: any;
  ListasSubcategoriaSeleccionada: any;

  buscarSubM(marcaId: number) {
    this.ListaCategoriaMarcaSeleccionada = this.marcas.find(
      (m) => m.id == marcaId,
    )?.CategoriaMarcas;
  }

  buscarSubC(categoriaId: number) {
    this.ListasSubcategoriaSeleccionada = this.categorias.find(
      (c) => c.id == categoriaId,
    )?.subcategorias;
  }

  ngOnInit() {
    if (this.categorias.length == 0) {
      this.categoriaservice.getAll().subscribe((categorias) => {
        this.categorias = categorias;
      });
    }

    if (this.marcas.length == 0) {
      this.marcaservice.getAll().subscribe((marcas) => {
        this.marcas = marcas;
      });
    }

    // Obtener el ID de la URL
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id') ?? ''; // Almacenar el ID del producto

      this.productService.getProductoById(id).subscribe((res) => {
        this.nuevoActua = res;
        console.log(this.nuevoActua);
        this.buscarSubC(this.nuevoActua.CategoriaId);
        this.buscarSubM(this.nuevoActua.MarcaId);
      });
    });
  }

  // Series del producto
  productoSerieService = inject(ProductoSerieService);
  seriesProducto: any[] = [];
  ListOpen = false;

  verSeries(idProducto: string) {
    //this.ListOpen = true;
    this.productoSerieService.getSeriesByProductoId(idProducto).subscribe({
      next: (series) => {
        this.seriesProducto = series; // Almacenar las series obtenidas
        console.log('Series del producto:', this.seriesProducto);
      },
      error: (err) => {
        console.error('Error al obtener las series del producto:', err);
      },
    });
  }

  imagencargadaPrincipal: string = '';
  imagencarga: string[] = [];

  selectedFiles: File[] = [];
  selectedFilePrincipal: File | null = null;
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);

      //cargar imagencarga []
      this.selectedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onFileChangePrincipal(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFilePrincipal = event.target.files[0];
      //cargar imagencarga
      if (this.selectedFilePrincipal) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagencarga.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFilePrincipal);
      }
    }
  }

  eliminarImagen(index: number) {
    this.nuevoActua.imageurl.splice(index, 1);
    console.log('Lista imagenes: ', this.nuevoActua.imageurl);
  }

  guardarCambios() {
    const formData = new FormData();

    formData.append('producto', JSON.stringify(this.nuevoActua));

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    } else {
      formData.append('files', new Blob(), '');
    }

    if (this.selectedFilePrincipal) {
      formData.append('file', this.selectedFilePrincipal);
    } else {
      formData.append('file', new Blob(), '');
    }

    this.productoService.putProducto(formData).subscribe({
      next: () => {
        //window.location.reload();
        // Resetear solo los archivos seleccionados, pero mantener el estado del producto
        this.imagencargadaPrincipal = '';
        this.imagencarga = [];
        this.selectedFilePrincipal = null;
        this.selectedFiles = [];

        Swal.fire({
          icon: 'success',
          title: 'Producto Actualizado',
          showConfirmButton: false,
          timer: 1000,
        });
      },
      error: (err) => {
        console.error('Error al actualizar el producto:', err);
      },
    });
  }
  deleteSerie(id: string, estado: string) {
    if (estado === 'stock') {
      this.productoSerieService.delete(id).subscribe({
        next: () => {
          this.verSeries(this.nuevoActua.id);
          Swal.fire({
            icon: 'success',
            title: 'Serie Eliminada',
            showConfirmButton: false,
            timer: 1000,
          });
        },
        error: (err) => {
          console.error('Error al eliminar la serie:', err);
        },
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No puede eliminar la serie',
        text: 'no puedes elimar una serie que esta relacionada con una venta o en rma',
        timer: 2500,
      });
    }
  }
}
