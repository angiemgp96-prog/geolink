export const STRIPE_PAYMENT_LINKS: Record<number, string> = {
  5: 'https://buy.stripe.com/aFa00j9cf8Uk74i4AeeQM05',
  10: 'https://buy.stripe.com/7sY4gzagj3A0bky9UyeQM02',
  20: 'https://buy.stripe.com/7sYaEX4VZ4E4agu9UyeQM00',
  30: 'https://buy.stripe.com/8x27sLcordaA0FU7MqeQM03',
  50: 'https://buy.stripe.com/bJecN52NR1rS0FU0jYeQM04',
};

export const STRIPE_LIBRE_LINK = 'https://buy.stripe.com/4gM5kD6037Qg2O2d6KeQM01';

/**
 * Retorna el nuevo precio corrido de promoción internacional para Stripe.
 * Escala exacta requerida:
 *  - 50 USD -> 30 USD
 *  - 30 USD -> 20 USD
 *  - 20 USD -> 10 USD
 *  - 10 USD -> 5 USD
 *  - 5 USD  -> 5 USD (permanece en 5)
 */
export function getShiftedPromoPrice(originalPrice: number): number {
  if (typeof originalPrice !== 'number' || isNaN(originalPrice)) return 5;
  const p = Math.round(originalPrice);
  if (p >= 50) return 30;
  if (p >= 30) return 20;
  if (p >= 20) return 10;
  if (p >= 10) return 5;
  return 5;
}

/**
 * Returns the exact Stripe payment URL matching the USD amount.
 * Falls back to STRIPE_LIBRE_LINK if no exact price match is found.
 */
export function getStripePaymentUrl(price: number): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return STRIPE_LIBRE_LINK;
  }
  const roundedPrice = Math.round(price);
  return STRIPE_PAYMENT_LINKS[roundedPrice] || STRIPE_LIBRE_LINK;
}
