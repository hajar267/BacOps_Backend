import jsPDF from 'jspdf';
import { Decharge } from '@/types/decharge';

const ARMA_BLUE = '#1D1056';
const TEXT_PRIMARY = '#2F3E4C';
const TEXT_SECONDARY = '#6D7D8A';

const ARMA_LOGO_PATH = '/images/arma_logo.jpg';
const PARTNER_LOGO: string | null = null;

let armaLogoCache: string | null = null;

async function getArmaLogo(): Promise<string | null> {
  if (armaLogoCache) return armaLogoCache;
  armaLogoCache = await urlToDataUrl(ARMA_LOGO_PATH);
  return armaLogoCache;
}

export async function buildDechargePdf(decharge: Decharge): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
  const [armaLogo, beneficiarySignature, agentSignature] = await Promise.all([
    getArmaLogo(),
    urlToDataUrl(decharge.signatureBeneficiaireUrl),
    urlToDataUrl(decharge.signatureAgentUrl),
  ]);

  drawHeader(doc, decharge, armaLogo);
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

function drawHeader(doc: jsPDF, decharge: Decharge, armaLogo: string | null) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const reference = `${decharge.id}-${new Date(decharge.createdAt).getFullYear()}`;
  const bacType = getBacTypeLabel(decharge);

  doc.setDrawColor(ARMA_BLUE);
  doc.setLineWidth(0.6);
  doc.line(10, 17, pageWidth - 10, 17);

  if (armaLogo) {
    doc.addImage(armaLogo, 10, 6, 15, 10);
  } else {
    doc.setDrawColor('#D9DEE4');
    doc.rect(10, 6, 15, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text('ARMA', 17.5, 11.5, { align: 'center' });
  }

  if (PARTNER_LOGO) {
    doc.addImage(PARTNER_LOGO, 'PNG', pageWidth - 25, 6, 15, 10);
  } else {
    doc.setDrawColor('#D9DEE4');
    doc.rect(pageWidth - 25, 6, 15, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text('logo', pageWidth - 17.5, 11.5, { align: 'center' });
  }

  doc.setTextColor(ARMA_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Décharge du ${bacType}`, pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_SECONDARY);
  doc.text(`Référence : ${reference}`, 10, 21.5);
  doc.text(`Date : ${formatDate(decharge.createdAt)}`, pageWidth - 10, 21.5, { align: 'right' });
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

  doc.setDrawColor('#D9DEE4');
  doc.setFillColor('#F6F7F9');
  doc.rect(10, 32, pageWidth - 20, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(ARMA_BLUE);
  doc.text('Informations du bénéficiaire', pageWidth / 2, 36.8, { align: 'center' });

  const rowStartY = 47;
  const rowHeight = 10.5;
  const labelX = 10;
  const valueX = 45;
  const valueWidth = pageWidth - valueX - 10;

  lines.forEach(([label, value], index) => {
    const y = rowStartY + index * rowHeight;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text(label, labelX, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_PRIMARY);
    doc.text(doc.splitTextToSize(value, valueWidth), valueX, y);
  });
}

function drawSignatures(
  doc: jsPDF,
  beneficiarySignature: string | null,
  agentSignature: string | null
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const sectionY = 114;
  const sectionWidth = (pageWidth - 26) / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(ARMA_BLUE);
  doc.text('Signatures', 10, sectionY);

  drawSignatureBox(doc, 10, sectionY + 5, sectionWidth, 'Signature du bénéficiaire', beneficiarySignature);
  drawSignatureBox(
    doc,
    16 + sectionWidth,
    sectionY + 5,
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
  const boxHeight = 40;

  doc.setDrawColor('#D9DEE4');
  doc.rect(x, y, width, boxHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_PRIMARY);
  doc.text(label, x + width / 2, y + 6, { align: 'center' });

  if (signature) {
    const availableWidth = width - 12;
    const availableHeight = boxHeight - 14;
    const { width: naturalWidth, height: naturalHeight } = doc.getImageProperties(signature);
    const scale = Math.min(availableWidth / naturalWidth, availableHeight / naturalHeight);
    const drawWidth = naturalWidth * scale;
    const drawHeight = naturalHeight * scale;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + 10 + (availableHeight - drawHeight) / 2;

    doc.addImage(signature, drawX, drawY, drawWidth, drawHeight, undefined, 'FAST');
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_SECONDARY);
    doc.text('Signature non disponible', x + width / 2, y + boxHeight / 2, { align: 'center' });
  }
}

function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(5.5);
  doc.setTextColor(TEXT_SECONDARY);
  doc.text('ARMA – EXP.F10 – V2 – 01/05/2026', pageWidth / 2, pageHeight - 5, { align: 'center' });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR');
}