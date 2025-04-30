export const decodeToken = (token: string): any => {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Ошибка при декодировании токена:', e);
      return null;
    }
  };
  