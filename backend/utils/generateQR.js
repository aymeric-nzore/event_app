import QRCode from "qrcode";

export const generateQrCode = async (data) => {
  const qrTheme = {
    dark: "#143D2F",
    light: "#F5FAF7",
  };

  const dataUrl = await QRCode.toDataURL(data, {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 1,
    width: 360,
    rendererOpts: {
      quality: 1,
    },
    color: {
      dark: qrTheme.dark,
      light: qrTheme.light,
    },
  });

  return dataUrl.replace(/^data:image\/png;base64,/, "");
};
