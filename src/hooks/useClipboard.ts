export default (): {
  copyToClipboard: (text: string) => void;
} => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  return {
    copyToClipboard,
  };
};
