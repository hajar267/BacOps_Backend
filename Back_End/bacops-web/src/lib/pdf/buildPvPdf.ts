import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PreviewBacItem } from '@/types/pv';

const ARMA_BLUE = '#1D1056';
const TEXT_PRIMARY = '#2F3E4C';
const TEXT_SECONDARY = '#6D7D8A';

interface BuildPvPdfParams {
  items: PreviewBacItem[];
  contractNum: string;
  date: string;
  societeDelegataire: string;
  representant: string;
}

export async function buildPvPdf({
  items,
  contractNum,
  date,
  societeDelegataire,
  representant,
}: BuildPvPdfParams): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Fetch logo + all row photos as data URLs in parallel — no need to
  // chunk pages manually, autoTable handles that for us below.
  const [logo, photos] = await Promise.all([
    urlToDataUrl('/images/arma_logo.jpg', { direct: true }), // local Next.js asset, no proxy
    Promise.all(items.map((item) => urlToDataUrl(item.photo))), // Laravel URLs, via proxy
  ]);

  autoTable(doc, {
    startY: 50, // page 1 only — leaves room for the custom header
    rowPageBreak: 'avoid',
    head: [[
      'N°', 'Type', 'Capacité (L)', 'N° CUVE', 'Arrond.', 'Date',
      'Adresse', 'X', 'Y', 'Photo', 'Paraphe Délégant', 'Paraphe Délégataire',
    ]],
    body: items.map((item, i) => [
      String(i + 1),
      item.nature,
      item.capacite ?? '',
      item.serialNumber,
      item.arrond ?? '',
      item.installedAt.slice(0, 10),
      item.address ?? '',
      item.x?.toFixed(6) ?? '',
      item.y?.toFixed(6) ?? '',
      '', '', '',
    ]),
    styles: { fontSize: 7, cellPadding: 2, valign: 'middle', halign: 'center' },
    headStyles: { fillColor: ARMA_BLUE, textColor: '#FFFFFF', fontStyle: 'bold' },
    columnStyles: { 9: { cellWidth: 22, minCellHeight: 16 } }, // photo column
    margin: { top: 15, bottom: 15 }, // pages 2+ — just enough room for the repeated table head
    theme: 'grid',
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 9) {
        const photo = photos[data.row.index];
        if (photo) {
          const h = Math.min(data.cell.height - 3, 14);
          doc.addImage(photo, data.cell.x + 2, data.cell.y + 1.5, h * 1.3, h);
        } else {
          doc.setFontSize(6);
          doc.setTextColor(TEXT_SECONDARY);
          doc.text('N/A', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, {
            align: 'center',
          });
        }
      }
    },
    didDrawPage: (data) => {
      if (data.pageNumber === 1) {
        drawHeader(doc, { contractNum, date, societeDelegataire, representant, logo });
      }
      drawFooter(doc);
    },
  });

  return doc;
}

async function urlToDataUrl(
  url: string | null,
  opts: { direct?: boolean } = {}
): Promise<string | null> {
  if (!url) return null;
  try {
    const target = opts.direct ? url : `/api/proxy-image?url=${encodeURIComponent(url)}`;
    const res = await fetch(target);
    if (!res.ok) return null;
    const blob = await res.blob();
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

function drawHeader(
  doc: jsPDF,
  params: { contractNum: string; date: string; societeDelegataire: string; representant: string; logo: string | null }
) {
  const { contractNum, date, societeDelegataire, representant, logo } = params;
  const pageWidth = doc.internal.pageSize.getWidth();

  if (logo) doc.addImage(logo, 14, 6, 20, 14);

  doc.setTextColor(ARMA_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Fiche de constat de mise en service', pageWidth / 2, 15, { align: 'center' });

  doc.setFillColor(ARMA_BLUE);
  doc.rect(pageWidth - 34, 6, 20, 14, 'F');

  const fields: [string, string][] = [
    ['Société Délégataire', societeDelegataire],
    ['N° de Contrat', contractNum],
    ['Date', date],
    ['Représentant du Délégataire', representant],
  ];
  const colWidth = (pageWidth - 28) / fields.length;
  fields.forEach(([label, value], i) => {
    const x = 14 + i * colWidth;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_PRIMARY);
    doc.text(label, x, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(value, x, 38);
  });
}

function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7);
  doc.setTextColor(TEXT_SECONDARY);
  doc.text('ARMA – EXP.F10 – V2 – 01/05/2026', pageWidth / 2, pageHeight - 8, { align: 'center' });
}
