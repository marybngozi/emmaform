document.querySelector('#year').innerHTML = new Date().getFullYear().toString();

const employeeImage = document.querySelector('#passPort')
const pictureImg = document.querySelector('#passImage')
const printBtn = document.querySelector('#printBtn')

if(employeeImage && pictureImg){
  employeeImage.addEventListener('change', e => {
    if(e.target.value){
      pictureImg.classList.remove("invisible");
      pictureImg.src = URL.createObjectURL(e.target.files[0]);
    }
  })
}

if(printBtn) {
  printBtn.addEventListener('click', e => {
    const printArea = document.querySelector('#printSection').innerHTML;
    // printThis
    const myWindow = window.open('', 'PRINT', 'height=400,width=600');

    myWindow.document.write('<html><head><title>' + document.title  + '</title>');
    myWindow.document.write('<link rel="stylesheet" href="/css/styles.css" type="text/css" />');
    myWindow.document.write('</head><body >');
    myWindow.document.write(printArea);
    myWindow.document.write('</body></html>');

    myWindow.document.close(); // necessary for IE >= 10

    myWindow.focus(); // necessary for IE >= 10*/

    setTimeout(() => {
      myWindow.print();
      myWindow.close();
    }, 500);


    return true;

  })
}