import { EstadoPedidoModel } from '../models/pedido-models'
import type { PedidoDetalleResponse, PedidoResponse } from '../models/pedido-models'
import { API_URL } from './Variables-entorno'
import axios from 'axios'
import { Pedido } from '../classes/Pedido.svelte'



class PedidoService {
  async obtenerPedidoPorId(id: string): Promise<Pedido> {
    const response = await axios.get<PedidoDetalleResponse>(`${API_URL}/pedidos/${id}`)
    const { data } = response

    return new Pedido().fromJsonDetalle(data)
  }

  async obtenerPedidosPorEstado(estado: EstadoPedidoModel, localId: number): Promise<Pedido[]> {
    const response = await axios.get<PedidoResponse[]>(`${API_URL}/pedidos/estado/${estado}/${localId}`)
    const { data } = response
    
    return data.map((dto) => new Pedido().fromJson(dto))
  }

  async prepararPedido(id: number): Promise<Pedido> {
    return await this.CambiarEstadoPedido(id, EstadoPedidoModel.Preparado)
  }

  async cancelarPedido(id: number): Promise<Pedido> {
    return await this.CambiarEstadoPedido(id, EstadoPedidoModel.Cancelado)
  }

  async CambiarEstadoPedido(id: number, estado: EstadoPedidoModel): Promise<Pedido> {
    const response = await axios.patch(`${API_URL}/pedidos/${id}/${estado}`)
    if (!response || !response.data) {
      throw new Error('Pedido no encontrado')
    }
    return response.data
  }
}
export const pedidoService = new PedidoService()


/* const pedidosEjemplo: PedidoModel[] = [
  {
    id: '12345',
    estado: EstadoPedidoModel.Pendiente,
    cliente: {
      nombre: 'Sofía Miller',
      username: '@sofia.miller2005',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: {
      direccion: 'Av. Siempre Viva 555',
      latitud: 40.7128,
      longitud: -74.0060
    },
    items: [
      {
        plato: new Plato({ id: '1', nombre: 'Hamburguesa con Queso', descripcion: 'Hamburguesa clásica con queso y papas fritas', precioBase: 12.00, imgUrl: '/src/lib/assets/images/hamburga.jpg',
          ingredientes: [],       // vacío porque no detallaste
          autor: true,            // lo agregaste explícitamente
          enPromocion: true   }),
        cantidad: 1
      },
      {
        plato: new Plato({ id: '2', nombre: 'Papas Fritas', descripcion: 'Tradicionales papas fritas crocantes', precioBase: 6.00, imgUrl: '/src/lib/assets/images/hamburga.jpg',    
          ingredientes: [],       // faltaba
          autor: false,           // faltaba
          enPromocion: false  }),
        cantidad: 1
      },
      {
        plato: new Plato({ id: '3', nombre: 'Refresco', descripcion: 'Jugo natural de fruta', precioBase: 3.00, imgUrl: '/src/lib/assets/images/hamburga.jpg',
          ingredientes: [],       // faltaba
          autor: false,           // faltaba
          enPromocion: false  
        }),
        cantidad: 1
      }
    ],
    pago: { subtotal: 20.00, comisionDelivery: 2.00, incrementoPago: 1.10, total: 23.10, metodoPago: MetodoPagoModel.Tarjeta },
    fechaCreacion: new Date()
  },
  {
    id: '12346',
    estado: EstadoPedidoModel.Preparado,
    cliente: {
      nombre: 'Lucas Fernández',
      username: '@lucasf',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: { direccion: 'Calle Falsa 123', latitud: 41.4036, longitud: 2.1744 },
    items: [
      {
        plato: new Plato({ id: '4', nombre: 'Pizza Margherita', descripcion: 'Pizza clásica con queso y tomate', precioBase: 15.00, imgUrl: '/src/lib/assets/images/pizza.jpg',
          ingredientes: [],      // vacío por ahora
          autor: false,          // no lo especificaste → default
          enPromocion: false     // no lo especificaste → default
        }),
        cantidad: 1
      }    ],
    pago: { subtotal: 15.00, comisionDelivery: 2.50, incrementoPago: 0, total: 17.50, metodoPago: MetodoPagoModel.Efectivo },
    fechaCreacion: new Date()
  },
  {
    id: '12347',
    estado: EstadoPedidoModel.Entregado,
    cliente: {
      nombre: 'Martina López',
      username: '@martinal',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: { direccion: 'Av. Libertador 200', latitud: 40.4168, longitud: -3.7038 },
    items: [
      {
        plato: new Plato({ id: '5', nombre: 'Ensalada César', descripcion: 'Ensalada con pollo y aderezo César', precioBase: 10.00, imgUrl: '/src/lib/assets/images/ensalada.jpg',      
          ingredientes: [],
          autor: false,
          enPromocion: false 
        }),
        cantidad: 2
      }    ],
    pago: { subtotal: 20.00, comisionDelivery: 3.00, incrementoPago: 0, total: 23.00, metodoPago: MetodoPagoModel.Qr },
    fechaCreacion: new Date()
  },
  {
    id: '12348',
    estado: EstadoPedidoModel.Pendiente,
    cliente: {
      nombre: 'Juan Pérez',
      username: '@juanp',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: { direccion: 'Calle Luna 77', latitud: 34.6037, longitud: -58.3816 },
    items: [
      {
        plato: new Plato({ id: '6', nombre: 'Sushi Combo', descripcion: 'Variedad de sushi fresco', precioBase: 25.00, imgUrl: '/src/lib/assets/images/sushi.jpg' }),
        cantidad: 1
      }    ],
    pago: { subtotal: 25.00, comisionDelivery: 2.50, incrementoPago: 0, total: 27.50, metodoPago: MetodoPagoModel.Efectivo },
    fechaCreacion: new Date()
  },
  {
    id: '12349',
    estado: EstadoPedidoModel.Pendiente,
    cliente: {
      nombre: 'Valentina Gómez',
      username: '@valeg',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: { direccion: 'Av. Córdoba 1000', latitud: 40.4168, longitud: -3.7038 },
    items: [
      {
        plato: new Plato({ id: '7', nombre: 'Tacos de Pollo', descripcion: 'Tacos con pollo y guacamole', precioBase: 8.00, imgUrl: '/src/lib/assets/images/tacos.jpg' }),
        cantidad: 3
      }    ],
    pago: { subtotal: 24.00, comisionDelivery: 3.00, incrementoPago: 0, total: 27.00, metodoPago: MetodoPagoModel.Tarjeta },
    fechaCreacion: new Date()
  },
  {
    id: '12350',
    estado: EstadoPedidoModel.Cancelado,
    cliente: {
      nombre: 'Diego Ramírez',
      username: '@diegor',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: { direccion: 'Calle Sol 456', latitud: 41.3851, longitud: 2.1734 },
    items: [
      {
        plato: new Plato({ id: '8', nombre: 'Hamburguesa Veggie', descripcion: 'Hamburguesa de vegetales con papas', precioBase: 11.00, imgUrl: '/src/lib/assets/images/hamburga.jpg' }),
        cantidad: 1
      },
      {
        plato: new Plato({ id: '9', nombre: 'Limonada', descripcion: 'Bebida natural de limón', precioBase: 3.50, imgUrl: '/src/lib/assets/images/limonada.jpg' }),
        cantidad: 1
      } ],
    pago: { subtotal: 14.50, comisionDelivery: 2.00, incrementoPago: 0, total: 16.50, metodoPago: MetodoPagoModel.Tarjeta },
    fechaCreacion: new Date()
  },
  {
    id: '12351',
    estado: EstadoPedidoModel.Entregado,
    cliente: {
      nombre: 'Camila Torres',
      username: '@camilat',
      foto: '/src/lib/assets/images/negra-maqueta.jpg'
    },
    direccion: { direccion: 'Av. Santa Fe 500', latitud: 40.7306, longitud: -73.9352 },
    items: [
      {
        plato: new Plato({ id: '10', nombre: 'Pasta Alfredo', descripcion: 'Pasta con salsa Alfredo y pollo', precioBase: 13.00, imgUrl: '/src/lib/assets/images/pasta.jpg' }),
        cantidad: 1
      }    ],
    pago: { subtotal: 13.00, comisionDelivery: 2.00, incrementoPago: 0, total: 15.00, metodoPago: MetodoPagoModel.Efectivo },
    fechaCreacion: new Date()
  }
]
 */