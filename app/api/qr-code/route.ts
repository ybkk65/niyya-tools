import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { url } = body;

    // Validation : URL présente
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL manquante ou invalide" },
        { status: 400 }
      );
    }

    // Validation : URL valide
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Format d'URL invalide" },
        { status: 400 }
      );
    }

    // Validation : Longueur maximale
    if (url.length > 2048) {
      return NextResponse.json(
        { error: "URL trop longue (maximum 2048 caractères)" },
        { status: 400 }
      );
    }

    // Génération du QR code en data URL (base64)
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H", // Haute correction d'erreur
      type: "image/png",
      width: 512, // Largeur en pixels
      margin: 2, // Marge autour du QR code
      color: {
        dark: "#000000", // Couleur des pixels noirs
        light: "#FFFFFF", // Couleur de fond
      },
    });

    // Retourne le QR code en base64
    return NextResponse.json(
      {
        success: true,
        qrCode: qrCodeDataUrl,
        url: url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error);

    return NextResponse.json(
      {
        error: "Erreur interne du serveur",
        details:
          error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

// Méthode GET non supportée
export async function GET() {
  return NextResponse.json(
    { error: "Méthode GET non supportée. Utilisez POST." },
    { status: 405 }
  );
}
