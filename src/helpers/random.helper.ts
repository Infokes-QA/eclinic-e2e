export class RandomHelper {
    static randomNumber(length = 6): string {
      return Math.random().toString().slice(2, 2 + length);
    }
  
    static randomString(length = 8): string {
      return Math.random().toString(36).substring(2, 2 + length);
    }
  }