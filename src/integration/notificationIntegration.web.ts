// Versão WEB: o site não tem reserva com tempo, então não há notificação.
// Existe só para o _layout raiz poder chamar configureNotifications() nas duas plataformas.
export async function configureNotifications(): Promise<void> {}
