import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Trip, User } from '../types';

interface YearSummary {
  year: number;
  users: {
    [key in User]: {
      trips: Array<{
        country: string;
        departureDate: string;
        arrivalDate: string;
        days: number;
      }>;
      totals: {
        Greece: number;
        UK: number;
      };
    };
  };
}

const calculateDaysInYear = (startDate: string, endDate: string, year: number): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  
  const overlapStart = start > yearStart ? start : yearStart;
  const overlapEnd = end < yearEnd ? end : yearEnd;
  
  if (overlapStart > overlapEnd) {
    return 0;
  }
  
  const diffTime = overlapEnd.getTime() - overlapStart.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const organizeDataByYear = (trips: Trip[]): YearSummary[] => {
  const yearMap = new Map<number, YearSummary>();
  
  // Get all years from trips
  const allYears = new Set<number>();
  trips.forEach(trip => {
    const startYear = new Date(trip.departureDate).getFullYear();
    const endYear = new Date(trip.arrivalDate).getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      allYears.add(year);
    }
  });
  
  // Initialize year summaries
  allYears.forEach(year => {
    yearMap.set(year, {
      year,
      users: {
        Cheryl: { trips: [], totals: { Greece: 0, UK: 0 } },
        Nigel: { trips: [], totals: { Greece: 0, UK: 0 } }
      }
    });
  });
  
  // Process each trip
  trips.forEach(trip => {
    const startYear = new Date(trip.departureDate).getFullYear();
    const endYear = new Date(trip.arrivalDate).getFullYear();
    
    for (let year = startYear; year <= endYear; year++) {
      const daysInYear = calculateDaysInYear(trip.departureDate, trip.arrivalDate, year);
      
      if (daysInYear > 0) {
        const yearSummary = yearMap.get(year)!;
        const userSummary = yearSummary.users[trip.user];
        
        userSummary.trips.push({
          country: trip.country,
          departureDate: trip.departureDate,
          arrivalDate: trip.arrivalDate,
          days: daysInYear
        });
        
        userSummary.totals[trip.country] += daysInYear;
      }
    }
  });
  
  return Array.from(yearMap.values()).sort((a, b) => b.year - a.year);
};

export const generateTravelSummaryPDF = (trips: Trip[]): void => {
  const doc = new jsPDF();
  const yearSummaries = organizeDataByYear(trips);
  let yPosition = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Travel Day Summary Report', 105, yPosition, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString('en-GB')}`, 105, yPosition + 8, { align: 'center' });

  yPosition += 25;

  // Summary section on initial page
  if (yearSummaries.length > 1) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Summary', 105, yPosition, { align: 'center' });
    yPosition += 15;

    const summaryData: any[] = [];

    yearSummaries.forEach(yearSummary => {
      const cherylTotal = yearSummary.users.Cheryl.totals.Greece + yearSummary.users.Cheryl.totals.UK;
      const nigelTotal = yearSummary.users.Nigel.totals.Greece + yearSummary.users.Nigel.totals.UK;

      const cherylBreakdown = `Greece: ${yearSummary.users.Cheryl.totals.Greece} days\nUK: ${yearSummary.users.Cheryl.totals.UK} days`;
      const nigelBreakdown = `Greece: ${yearSummary.users.Nigel.totals.Greece} days\nUK: ${yearSummary.users.Nigel.totals.UK} days`;

      summaryData.push([
        yearSummary.year.toString(),
        cherylBreakdown,
        `${cherylTotal} days`,
        nigelBreakdown,
        `${nigelTotal} days`
      ]);
    });

    autoTable(doc, {
      startY: yPosition,
      head: [['Year', 'Cheryl', 'Cheryl Total', 'Nigel', 'Nigel Total']],
      body: summaryData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4,
        valign: 'top'
      },
      headStyles: {
        fillColor: [64, 64, 64],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        1: { cellWidth: 40, halign: 'right' },
        2: { halign: 'right' },
        3: { cellWidth: 40, halign: 'right' },
        4: { halign: 'right' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  yearSummaries.forEach((yearSummary, index) => {
    // Add new page for each year (or if summary was shown on first page)
    if (index > 0 || (index === 0 && yearSummaries.length > 1)) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Year header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${yearSummary.year}`, 20, yPosition);
    yPosition += 10;
    
    // Create table data
    const tableData: any[] = [];
    
    (['Cheryl', 'Nigel'] as User[]).forEach(user => {
      const userData = yearSummary.users[user];
      
      // Add user header row with proper spanning and color
      const userColor = user === 'Cheryl' ? [66, 139, 202] : [92, 184, 92]; // Darker blue/green
      tableData.push([
        { 
          content: user, 
          colSpan: 5,
          styles: { 
            fontStyle: 'bold', 
            fillColor: userColor,
            textColor: [255, 255, 255],
            halign: 'center'
          } 
        }
      ]);
      
      // Sort trips by departure date
      const sortedTrips = [...userData.trips].sort((a, b) => 
        new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
      );
      
      if (sortedTrips.length === 0) {
        tableData.push(['', 'No trips', '', '', '']);
      } else {
        sortedTrips.forEach(trip => {
          tableData.push([
            '',
            trip.country,
            formatDate(trip.departureDate),
            formatDate(trip.arrivalDate),
            `${trip.days} days`
          ]);
        });
      }
      
      // Add totals row
      tableData.push([
        '',
        { content: 'TOTALS:', styles: { fontStyle: 'bold' } },
        { content: `Greece: ${userData.totals.Greece} days`, styles: { fontStyle: 'bold' } },
        { content: `UK: ${userData.totals.UK} days`, styles: { fontStyle: 'bold' } },
        { content: `Total: ${userData.totals.Greece + userData.totals.UK} days`, styles: { fontStyle: 'bold' } }
      ]);
      
      // Add spacing row
      tableData.push(['', '', '', '', '']);
    });
    
    // Generate table
    autoTable(doc, {
      startY: yPosition,
      head: [['User', 'Country', 'Departure', 'Arrival', 'Days in ' + yearSummary.year]],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [64, 64, 64],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 }
      }
    });
  });
  
  // Save the PDF
  const filename = `travel-summary-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};