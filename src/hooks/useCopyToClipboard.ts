import { config } from "@/utils/config";
import { useState } from "react";

interface CopyToClipboardOptions {
  prefix?: string;
  suffix?: string;
}

/**
 * A custom React hook that provides functionality to copy text to the clipboard.
 *
 * @param {CopyToClipboardOptions} options - An object containing prefix and suffix options for the text to be copied.
 * @return {{ copyToClipboard: (text: string) => void, isCopied: boolean }} An object containing the copyToClipboard function and the isCopied state.
 */
export function useCopyToClipboard(
  options: CopyToClipboardOptions = {
    prefix: config.clipboardPrefix,
    suffix: config.clipboardSuffix,
  }
) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (text: string) => {
    const fullText = `${options.prefix || ""}${text}${options.suffix || ""}`;
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return { copyToClipboard, isCopied };
}
