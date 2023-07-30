import cookies from 'browser-cookies';

export default {
  set(name, key, value) {
    cookies.set(
      `${name}_${key}`,
      JSON.stringify(value),
      { expires: 365 }
    );
  },
  get(name, key, defaultValue) {
    try {
      const value = cookies.get(`${name}_${key}`);
      // Переустанавливаем куки заново, чтобы обойти ограничение в 7 дней
      // для Safari и Brave.
      if (value) {
        const parsedValue = JSON.parse(value);
        this.set(name, key, parsedValue);
        return parsedValue;
      }
      return defaultValue;
    } catch  {
      return defaultValue;
    }
  }
};
