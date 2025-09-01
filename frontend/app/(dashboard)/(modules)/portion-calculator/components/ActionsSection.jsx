'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "react-hot-toast";

export default function ActionsSection({
  filteredResults,
  selectedItems,
  handleReset
}) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Función para exportar a PDF con mejor calidad
  const exportToPDF = async () => {
    const itemsToExport = selectedItems.length > 0 
      ? filteredResults.filter(r => selectedItems.includes(r.item.id))
      : filteredResults;
    
    if (itemsToExport.length === 0) {
      toast.error('Por favor, selecciona al menos un elemento para exportar.');
      return;
    }

    setIsGeneratingPDF(true);
    toast.success('Generando PDF...', { autoClose: 2000 });

    // Crear un elemento temporal para el PDF con mejor calidad
    const pdfElement = document.createElement('div');
    pdfElement.style.position = 'absolute';
    pdfElement.style.left = '-9999px';
    pdfElement.style.padding = '30px';
    pdfElement.style.backgroundColor = 'white';
    pdfElement.style.color = 'black';
    pdfElement.style.fontFamily = 'Arial, sans-serif';
    pdfElement.style.width = '794px'; // A4 width in pixels (210mm)
    pdfElement.style.fontSize = '14px';
    
    // Construir el contenido del PDF con mejor formato
    pdfElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="font-size: 24px; margin-bottom: 10px; color: #2c5282;">Lista de Mercado</h1>
        <div style="font-size: 16px; color: #4a5568;">
          <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f7fafc; border-bottom: 2px solid #2c5282;">
            <th style="text-align: left; padding: 12px; font-weight: bold; color: #2d3748;">Producto</th>
            <th style="text-align: right; padding: 12px; font-weight: bold; color: #2d3748;">Cantidad</th>
            <th style="text-align: left; padding: 12px; font-weight: bold; color: #2d3748;">Categoría</th>
          </tr>
        </thead>
        <tbody>
          ${itemsToExport.map((item, index) => `
            <tr style="${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
                <span style="font-size: 18px; margin-right: 8px;">${item.item.icon}</span>
                <span style="font-weight: 500;">${item.item.name}</span>
              </td>
              <td style="text-align: right; padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #2b6cb0;">
                ${item.totalQuantity} ${item.calculatedUnit}
              </td>
              <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-transform: capitalize; color: #4a5568;">
                ${item.item.category}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #718096;">
        <div style="font-style: italic; margin-bottom: 5px;">
          Generado por Calculadora de Porciones
        </div>
        <div style="font-size: 12px;">
          ${selectedItems.length > 0 ? `${selectedItems.length} de ${filteredResults.length} productos seleccionados` : 'Todos los productos'}
        </div>
      </div>
    `;
    
    document.body.appendChild(pdfElement);
    
    try {
      // Configuración para mejor calidad
      const canvas = await html2canvas(pdfElement, {
        scale: 2, // Doble de resolución
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG con alta calidad
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Agregar páginas adicionales si es necesario
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`lista-mercado-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF generado con éxito!');
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      document.body.removeChild(pdfElement);
      setIsGeneratingPDF(false);
    }
  };

  // Función para imprimir directamente (mejorada)
  const handlePrint = () => {
    const itemsToPrint = selectedItems.length > 0 
      ? filteredResults.filter(r => selectedItems.includes(r.item.id))
      : filteredResults;
    
    if (itemsToPrint.length === 0) {
      toast.error('No hay elementos para imprimir.');
      return;
    }

    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lista de Mercado</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              color: #000; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px;
            }
            h1 { 
              color: #2c5282; 
              margin-bottom: 10px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            th { 
              background-color: #f7fafc; 
              padding: 12px; 
              text-align: left; 
              border-bottom: 2px solid #2c5282;
              font-weight: bold;
            }
            td { 
              padding: 12px; 
              border-bottom: 1px solid #ddd; 
            }
            tr:nth-child(even) { 
              background-color: #f9fafb; 
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              color: #666; 
              font-style: italic;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Lista de Mercado</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: right;">Cantidad</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              ${itemsToPrint.map(item => `
                <tr>
                  <td>${item.item.icon} ${item.item.name}</td>
                  <td style="text-align: right; font-weight: bold;">${item.totalQuantity} ${item.calculatedUnit}</td>
                  <td style="text-transform: capitalize;">${item.item.category}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Generado por Calculadora de Porciones</p>
            ${selectedItems.length > 0 ? `<p>${selectedItems.length} de ${filteredResults.length} productos seleccionados</p>` : ''}
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #2c5282; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Imprimir
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #718096; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Cerrar
            </button>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
  };

  // Función para copiar al portapapeles con toast
  const copyToClipboard = () => {
    const itemsToCopy = selectedItems.length > 0 
      ? filteredResults.filter(r => selectedItems.includes(r.item.id))
      : filteredResults;
    
    if (itemsToCopy.length === 0) {
      toast.error('Por favor, selecciona al menos un elemento para copiar.');
      return;
    }
    
    const text = itemsToCopy.map(r => 
      `${r.item.icon} ${r.item.name}: ${r.totalQuantity} ${r.calculatedUnit}`
    ).join('\n');
    
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Lista copiada al portapapeles!'))
      .catch(err => {
        console.error('Error al copiar:', err);
        toast.error('Error al copiar al portapapeles');
      });
  };

  return (
    <>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones {selectedItems.length > 0 && `(${selectedItems.length} seleccionados)`}
        </h3>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportToPDF}
            disabled={isGeneratingPDF}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? '⏳ Generando...' : '📄 Guardar PDF'}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            📋 Copiar Selección
          </button>
          
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            🖨️ Imprimir
          </button>
          
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            🔄 Reiniciar
          </button>
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 Las acciones se aplicarán solo a los {selectedItems.length} productos seleccionados.
            </p>
          </div>
        )}
      </div>
    </>
  );
}