export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BUSINESS: string;
      ONESERVICE: string;
      TWOSERVICE: string;
      THREESERVICE: string;
      OTRERSERVICE: string;
      AFTERNOON: string;
      MORNING: string;
      EMPLOYEE1: string;
      EMPLOYEE2: string;
    }
  }
}
