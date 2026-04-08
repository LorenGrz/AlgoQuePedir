import type { PedidoModel, DetallePedido, Estado } from '../models/pedidoModel'
import type { Plato } from '../models/platoModel'

export const pedidos: PedidoModel[] = [
  {
    id: '1',
    estado: 'cancelado',
    nombreLocal: 'Restaurante de sushi',
    total: 35.0,
    fecha: '12 de mayo',
    cantArticulos: 1,
    imgUrl: 'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_1280.jpg'
  },
  {
    id: '2',
    estado: 'entregado',
    nombreLocal: 'Pizzería',
    total: 28.5,
    fecha: '10 de mayo',
    cantArticulos: 2,
    imgUrl:
      'https://resizer.glanacion.com/resizer/v2/pizza-NUKNWKWWRBAGXEECJWGLKMULVQ.jpg?auth=df70fb70d27e9a242dfe70068af898769f18e832bb543cb49d3faf002314bb82&width=1200&height=800&quality=70&smart=true'
  },
  {
    id: '3',
    estado: 'entregado',
    nombreLocal: 'Hamburguesería',
    total: 42.75,
    fecha: '8 de mayo',
    cantArticulos: 3,
    imgUrl: 'https://www.carniceriademadrid.es/wp-content/uploads/2022/09/smash-burger-que-es.jpg'
  },
  {
    id: '4',
    estado: 'pendiente',
    nombreLocal: 'Café Central',
    total: 10.0,
    fecha: '2 de noviembre',
    cantArticulos: 1,
    imgUrl:
      'https://www.shutterstock.com/image-photo/coffee-cup-saucer-teaspoon-pack-600nw-2337186769.jpg'
  }
]

const platoSushiRolls: Plato = {
  id: 1,
  nombre: 'Sushi Rolls',
  descripcion: 'Variedad de rolls de sushi frescos',
  precio: 35.0,
  img: 'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_1280.jpg',
  popular: true
}

const platoPizzaMargarita: Plato = {
  id: 1,
  nombre: 'Pizza Margarita',
  descripcion: 'Clásica pizza con tomate, mozzarella y albahaca',
  precio: 15.0,
  img: 'https://ejemplo.com/pizza-margarita.jpg', // URL de imagen de ejemplo
  popular: true
}

const platoPizzaPepperoni: Plato = {
  id: 2,
  nombre: 'Pizza Pepperoni',
  descripcion: 'Pizza con salsa de tomate, mozzarella y pepperoni',
  precio: 13.5,
  img: 'https://ejemplo.com/pizza-pepperoni.jpg', // URL de imagen de ejemplo
  popular: true
}

const platoHamburguesaClasica: Plato = {
  id: 1,
  nombre: 'Hamburguesa Clásica',
  descripcion: 'Hamburguesa con carne, lechuga y tomate',
  precio: 12.0,
  img: 'https://ejemplo.com/hamburguesa-clasica.jpg', // URL de imagen de ejemplo
  popular: true
}

const platoHamburguesaDoble: Plato = {
  id: 2,
  nombre: 'Hamburguesa Doble',
  descripcion: 'Doble carne, doble queso, pura satisfacción',
  precio: 15.75,
  img: 'https://ejemplo.com/hamburguesa-doble.jpg', // URL de imagen de ejemplo
  popular: false
}

const platoPapasFritas: Plato = {
  id: 3,
  nombre: 'Papas Fritas',
  descripcion: 'Porción de papas fritas crujientes',
  precio: 15.0,
  img: 'https://ejemplo.com/papas-fritas.jpg', // URL de imagen de ejemplo
  popular: true
}

const platoCafeLatte: Plato = {
  id: 1,
  nombre: 'Café Latte',
  descripcion: 'Café con leche espumosa',
  precio: 10.0,
  img: 'https://ejemplo.com/cafe-latte.jpg', // URL de imagen de ejemplo
  popular: true
}

export const pedidosDetalle: DetallePedido[] = [
  {
    id: '1',
    estado: 'Cancelado' as Estado,
    restaurante: {
      nombre: 'Restaurante de sushi',
      imagen: 'https://cdn.pixabay.com/photo/2017/10/15/11/41/sushi-2853382_1280.jpg',
      calificacion: 4.5,
      distanciaKm: 2.3,
      envioGratis: true
    },
    items: [{ plato: platoSushiRolls, cantidad: 1 }],
    resumen: {
      subtotal: 35.0,
      recargoTipoPago: 0,
      tarifaEntrega: 0,
      total: 35.0
    },
    formaPago: 'Efectivo',
    fecha: '12 de mayo'
  },
  {
    id: '2',
    estado: 'Completado' as Estado,
    restaurante: {
      nombre: 'Pizzería',
      imagen:
        'https://resizer.glanacion.com/resizer/v2/pizza-NUKNWKWWRBAGXEECJWGLKMULVQ.jpg?auth=df70fb70d27e9a242dfe70068af898769f18e832bb543cb49d3faf002314bb82&width=1200&height=800&quality=70&smart=true',
      calificacion: 4.2,
      distanciaKm: 1.5,
      envioGratis: false
    },
    items: [
      { plato: platoPizzaMargarita, cantidad: 1 },
      { plato: platoPizzaPepperoni, cantidad: 1 }
    ],
    resumen: {
      subtotal: 28.5,
      recargoTipoPago: 0,
      tarifaEntrega: 0,
      total: 28.5
    },
    formaPago: 'Tarjeta de crédito',
    fecha: '10 de mayo'
  },
  {
    id: '3',
    estado: 'Completado' as Estado,
    restaurante: {
      nombre: 'Hamburguesería',
      imagen:
        'https://www.carniceriademadrid.es/wp-content/uploads/2022/09/smash-burger-que-es.jpg',
      calificacion: 4.8,
      distanciaKm: 3.0,
      envioGratis: true
    },
    items: [
      { plato: platoHamburguesaClasica, cantidad: 1 },
      { plato: platoHamburguesaDoble, cantidad: 1 },
      { plato: platoPapasFritas, cantidad: 1 }
    ],
    resumen: {
      subtotal: 42.75,
      recargoTipoPago: 0,
      tarifaEntrega: 0,
      total: 42.75
    },
    formaPago: 'Efectivo',
    fecha: '8 de mayo'
  },
  {
    id: '4',
    estado: 'Pendiente' as Estado,
    restaurante: {
      nombre: 'Café Central',
      imagen:
        'https://www.shutterstock.com/image-photo/coffee-cup-saucer-teaspoon-pack-600nw-2337186769.jpg',
      calificacion: 4.0,
      distanciaKm: 0.8,
      envioGratis: false
    },
    items: [{ plato: platoCafeLatte, cantidad: 1 }],
    resumen: {
      subtotal: 10.0,
      recargoTipoPago: 0,
      tarifaEntrega: 0,
      total: 10.0
    },
    formaPago: 'Tarjeta de débito',
    fecha: '2 de noviembre'
  }
]
