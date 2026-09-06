import jsPDF from 'jspdf';
import { Decharge } from '@/types/decharge';

const ARMA_BLUE = '#1D1056';
const TEXT_PRIMARY = '#2F3E4C';
const TEXT_SECONDARY = '#6D7D8A';

// Replace with your actual logo assets (base64 data URLs or imported files).
// ARMA_LOGO is drawn top-left, PARTNER_LOGO (délégant/délégataire) top-right.
const ARMA_LOGO: string | null = null;
const PARTNER_LOGO: string | null = null;

export async function buildDechargePdf(decharge: Decharge): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const [beneficiarySignature, agentSignature] = await Promise.all([
    urlToDataUrl(decharge.signatureBeneficiaireUrl),
    urlToDataUrl(decharge.signatureAgentUrl),
  ]);

  drawHeader(doc, decharge);
  drawInformation(doc, decharge);
  drawSignatures(doc, beneficiarySignature, agentSignature);
  drawFooter(doc);

  return doc;
}

async function urlToDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;

  try {
    const target = url.startsWith('/') ? url : `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const response = await fetch(target);
    if (!response.ok) return null;

    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Adjust the field name here to whatever your Decharge/session bac objects
// actually expose (e.g. bac.typeLabel, bac.bacType.nom). Falls back to a
// generic label when bacs have mixed types or none at all.
function getBacTypeLabel(decharge: Decharge): string {
  const bacs = decharge.session?.bacs ?? [];
  if (bacs.length === 0) return 'bac';

  const labels = new Set(
    bacs
      .map((bac) => {
        const type = bac.bacType;
        if (!type) return null;
        return [type.nature, type.capacite, type.matiere, type.color, type.variante].filter(Boolean).join(' ');
      })
      .filter((label): label is string => Boolean(label))
  );

  if (labels.size === 1) return [...labels][0];
  return 'bacs';
}

function drawHeader(doc: jsPDF, decharge: Decharge) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const reference = `${decharge.id}-${new Date(decharge.createdAt).getFullYear()}`;
  const bacType = getBacTypeLabel(decharge);

  // Letterhead bar
  doc.setDrawColor(ARMA_BLUE);
  doc.setLineWidth(0.8);
  doc.line(14, 24, pageWidth - 14, 24);

  // ARMA logo (top-left)
  if (ARMA_LOGO) {
    doc.addImage(ARMA_LOGO, 'PNG', 14, 8, 20, 14);
  } else {
    doc.setDrawColor('#D9DEE4');
    doc.rect(14, 8, 20, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text('ARMA', 24, 16, { align: 'center' });
  }

  // Partner/délégant logo (top-right)
  if (PARTNER_LOGO) {
    doc.addImage(PARTNER_LOGO, 'PNG', pageWidth - 34, 8, 20, 14);
  } else {
    doc.setDrawColor('#D9DEE4');
    doc.rect(pageWidth - 34, 8, 20, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text('logo', pageWidth - 24, 16, { align: 'center' });
  }

  // Title
  doc.setTextColor(ARMA_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`Décharge du ${bacType}`, pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(TEXT_SECONDARY);
  doc.text(`Référence : ${reference}`, 14, 30);
  doc.text(`Date : ${formatDate(decharge.createdAt)}`, pageWidth - 14, 30, { align: 'right' });
}

function drawInformation(doc: jsPDF, decharge: Decharge) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const session = decharge.session;
  const lines: [string, string][] = [
    ['Nom', `${decharge.prenom} ${decharge.nom}`],
    ['CIN', decharge.cin ?? '—'],
    ['Téléphone', decharge.telephone || '—'],
    ['Adresse', session?.address ?? '—'],
    ['Type du bac', getBacTypeLabel(decharge)],
    ['Arrondissement', session?.arrondissement ?? '—'],
  ];
  const columnWidth = (pageWidth - 28) / 2;

  doc.setDrawColor('#D9DEE4');
  doc.setFillColor('#F6F7F9');
  doc.rect(14, 38, pageWidth - 28, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(ARMA_BLUE);
  doc.text('Informations du bénéficiaire', pageWidth / 2, 44.5, { align: 'center' });

  lines.forEach(([label, value], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 14 + column * columnWidth;
    const y = 58 + row * 13;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_PRIMARY);
    doc.text(doc.splitTextToSize(value, columnWidth - 8), x, y + 5);
  });
}

function drawSignatures(
  doc: jsPDF,
  beneficiarySignature: string | null,
  agentSignature: string | null
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const sectionY = 111;
  const sectionWidth = (pageWidth - 38) / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(ARMA_BLUE);
  doc.text('Signatures', 14, sectionY);

  drawSignatureBox(doc, 14, sectionY + 6, sectionWidth, 'Signature du bénéficiaire', beneficiarySignature);
  drawSignatureBox(
    doc,
    24 + sectionWidth,
    sectionY + 6,
    sectionWidth,
    "Signature de l'agent",
    agentSignature
  );
}

function drawSignatureBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  signature: string | null
) {
  doc.setDrawColor('#D9DEE4');
  doc.rect(x, y, width, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_PRIMARY);
  doc.text(label, x + width / 2, y + 7, { align: 'center' });

  if (signature) {
    doc.addImage(signature, x + 12, y + 11, width - 24, 25, undefined, 'FAST');
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text('Signature non disponible', x + width / 2, y + 29, { align: 'center' });
  }
}

function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(TEXT_SECONDARY);
  doc.text('ARMA – EXP.F10 – V2 – 01/05/2026', pageWidth / 2, pageHeight - 8, { align: 'center' });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR');
}