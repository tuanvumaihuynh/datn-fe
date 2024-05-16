import { useToast } from "@/components/ui/toast/use-toast";

export default (): {
  copyToClipboard: (text: string) => void;
} => {
  const { toast } = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
    });
  };
  return {
    copyToClipboard,
  };
};
