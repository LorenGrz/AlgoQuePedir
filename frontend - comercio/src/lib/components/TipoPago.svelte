<script lang="ts">
  // Import de los íconos
  import tarjeta from '$lib/assets/icons/pago-tarjeta-secundario.svg'
  import qr from '$lib/assets/icons/pago-qr.svg'
  import efectivo from '$lib/assets/icons/pago-efectivo.svg'
  import type { MetodoPagoModel } from '$lib/components/models/pedido-models'

  export let metodoPago: MetodoPagoModel

  const iconosPago: Record<MetodoPagoModel, string> = {
    TARJETA: tarjeta,
    QR: qr,
    EFECTIVO: efectivo
  }

  const textosPago: Record<MetodoPagoModel, string> = {
    TARJETA: 'Pago con tarjeta de crédito',
    QR: 'Pago con QR',
    EFECTIVO: 'Pago con efectivo'
  }

  $: key = metodoPago?.toUpperCase() as MetodoPagoModel
  $: icono = iconosPago[metodoPago] ?? 'src/lib/assets/icons/alerta.svg'
  $: texto = textosPago[metodoPago] ?? 'Método de pago no disponible'
</script>

<section>
  <p class="tipo-de-pago color-secundario">
    <span class="icono-tipo-pago">
      <img src={icono} alt={texto} />
    </span>
    {texto}
  </p>
</section>

<style>
  .tipo-de-pago {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .icono-tipo-pago img {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
