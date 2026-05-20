document.addEventListener('DOMContentLoaded', function() {
            const textInput = document.getElementById('textInput');
            const convertBtn = document.getElementById('convertBtn');
            const downloadBtn = document.getElementById('downloadBtn');
            const clearBtn = document.getElementById('clearBtn');
            const pageSize = document.getElementById('pageSize');
            const fontSize = document.getElementById('fontSize');
            const fileName = document.getElementById('fileName');
            const statusMessage = document.getElementById('statusMessage');
            
            let pdfDoc = null;
            
            // Convert text to PDF
            convertBtn.addEventListener('click', function() {
                const text = textInput.value.trim();
                
                if (!text) {
                    showStatus('Please enter some text to convert.', 'error');
                    return;
                }
                
                try {
                    // Initialize jsPDF
                    const { jsPDF } = window.jspdf;
                    pdfDoc = new jsPDF();
                    
                    // Set page size
                    const pageSizes = {
                        'a4': [595.28, 841.89],
                        'letter': [612, 792],
                        'legal': [612, 1008]
                    };
                    
                    const selectedSize = pageSize.value;
                    pdfDoc = new jsPDF({
                        orientation: 'portrait',
                        unit: 'pt',
                        format: selectedSize
                    });
                    
                    // Set font and size
                    const selectedFontSize = parseInt(fontSize.value);
                    pdfDoc.setFontSize(selectedFontSize);
                    
                    // Split text into lines that fit the page width
                    const pageWidth = pageSizes[selectedSize][0] - 80; // 40pt margin on each side
                    const lines = pdfDoc.splitTextToSize(text, pageWidth);
                    
                    // Calculate line height
                    const lineHeight = selectedFontSize * 1.5;
                    
                    // Add text to PDF with pagination
                    let yPosition = 40;
                    let page = 1;
                    
                    for (let i = 0; i < lines.length; i++) {
                        // Check if we need a new page
                        if (yPosition > pageSizes[selectedSize][1] - 40) {
                            pdfDoc.addPage();
                            page++;
                            yPosition = 40;
                        }
                        
                        // Add line to PDF
                        pdfDoc.text(40, yPosition, lines[i]);
                        yPosition += lineHeight;
                    }
                    
                    showStatus(`PDF created successfully! ${page} page(s) generated.`, 'success');
                    
                } catch (error) {
                    console.error('Error creating PDF:', error);
                    showStatus('An error occurred while creating the PDF.', 'error');
                }
            });
            
            // Download PDF
            downloadBtn.addEventListener('click', function() {
                if (!pdfDoc) {
                    showStatus('Please convert text to PDF first.', 'error');
                    return;
                }
                
                try {
                    const name = fileName.value.trim() || 'converted_document';
                    pdfDoc.save(`${name}.pdf`);
                    showStatus('PDF downloaded successfully!', 'success');
                } catch (error) {
                    console.error('Error downloading PDF:', error);
                    showStatus('An error occurred while downloading the PDF.', 'error');
                }
            });
            
            // Clear text
            clearBtn.addEventListener('click', function() {
                textInput.value = '';
                pdfDoc = null;
                showStatus('Text cleared.', 'success');
            });
            
            // Show status message
            function showStatus(message, type) {
                statusMessage.textContent = message;
                statusMessage.className = 'status ' + type;
                statusMessage.style.display = 'block';
                
                // Hide status after 5 seconds
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 5000);
            }
        });