// Function to copy text to clipboard
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

// Function to handle copying the registration link
export const handleCopyRegistrationLink = (setCopiedRegistrationLink: React.Dispatch<React.SetStateAction<boolean>>, text: string) => {
  copyText(text); // Copy the registration link to clipboard
  setCopiedRegistrationLink(true); // Set copiedRegistrationLink state to true

  // Reset copiedRegistrationLink state after a delay
  setTimeout(() => {
    setCopiedRegistrationLink(false);
  }, 1000);
};