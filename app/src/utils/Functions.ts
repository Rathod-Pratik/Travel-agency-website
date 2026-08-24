export const DownloadFile = async (fileUrl: string, fileName: string) => {
  try {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
  }
};