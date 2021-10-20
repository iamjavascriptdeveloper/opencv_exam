const pdfMod = 'pdf.js';
const pdfWor =  'pdf.worker.js';

class PdfUtils {
  
  contstructor() {

  }

  loadpdfutils = (onloadCallback) => {
    loadPdfMod();
    loadpdfWor();
    onloadCallback();   
  }

  loadPdfMod = () => {
    
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.addEventListener('load', () => {
      console.log('load')
    });
    script.addEventListener('error', () => {
      console.log('Failed to load ' + pdfMod);
    });
    
    script.src = pdfMod;
    let node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(script, node);

  };

  loadpdfWor = () => {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.addEventListener('load', () => {
      console.log('load')
    });
    script.addEventListener('error', () => {
      console.log('Failed to load ' + pdfMod);
    });
    
    script.src = pdfWor;
    let node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(script, node);
  };

}

export { PdfUtils }