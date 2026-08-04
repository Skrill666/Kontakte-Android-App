import { toastController } from '@ionic/vue';

export const useAppMessages = () => {
  const showMessage = async (
    message: string,
    color: 'success' | 'danger' | 'warning' | 'medium' = 'medium',
  ): Promise<void> => {
    const toast = await toastController.create({
      message,
      color,
      duration: 2200,
      position: 'bottom',
      buttons: [{ text: 'Schließen', role: 'cancel' }],
    });
    await toast.present();
  };

  return {
    showSuccess: (message: string) => showMessage(message, 'success'),
    showError: (message: string) => showMessage(message, 'danger'),
    showWarning: (message: string) => showMessage(message, 'warning'),
  };
};
