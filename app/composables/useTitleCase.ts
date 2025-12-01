export const useTitleCase = () => {
  const toTitleCase = (text: string): string => {
    if (!text) return "";

    return text
      .toLowerCase()
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  return {
    toTitleCase,
  };
};
