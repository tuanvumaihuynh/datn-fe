const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const RANDOM_STRING_LENGTH = 20;

export default (): {
  generateRandomString: () => string;
} => {
  const generateRandomString = () => {
    let randomString = "";
    for (let i = 0; i < RANDOM_STRING_LENGTH; i++) {
      randomString += CHARACTERS.charAt(
        Math.floor(Math.random() * CHARACTERS.length)
      );
    }
    return randomString;
  };
  return {
    generateRandomString,
  };
};
