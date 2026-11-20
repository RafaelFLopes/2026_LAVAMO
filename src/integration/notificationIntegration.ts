import * as Notifications from 'expo-notifications';

// Notificações LOCAIS (Android): o próprio aparelho agenda o aviso para o horário em
// que a reserva expira. O Android entrega mesmo com o app fechado, sem servidor
// e sem push. Funciona no Expo Go (só o push remoto exige um development build).
const RESERVATION_CHANNEL_ID = 'reservations';

// Chamado uma vez na raiz do app (src/app/_layout.tsx).
export async function configureNotifications(): Promise<void> {
  // Com o app aberto, mostra o aviso mesmo assim (por padrão ele seria ignorado).
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // No Android 8+ toda notificação precisa de um canal; a importância HIGH faz o aviso aparecer no topo da tela.
  await Notifications.setNotificationChannelAsync(RESERVATION_CHANNEL_ID, {
    name: 'Reservas',
    description: 'Avisos sobre as suas reservas de máquinas.',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

// Pede a permissão só quando ela é necessária (na primeira reserva), como na câmera.
async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// Devolve o id do agendamento (para cancelar depois) ou null se não foi possível agendar.
// Uma falha aqui nunca impede a reserva: a máquina é liberada no horário de qualquer jeito.
export async function scheduleReservationExpiredNotification(
  machineCode: string,
  expiresAt: Date
): Promise<string | null> {
  try {
    if (!(await ensurePermission())) return null;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tempo de reserva encerrado',
        body: `Sua reserva da máquina ${machineCode} foi cancelada automaticamente. A máquina está livre novamente.`,
        data: { machineCode },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: expiresAt,
        channelId: RESERVATION_CHANNEL_ID,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelScheduledNotification(notificationId: string | null): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // O aviso já foi entregue ou não existe mais: não há o que cancelar.
  }
}
