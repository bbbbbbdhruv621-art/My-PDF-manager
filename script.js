const pdfInput = document.getElementById('pdfInput');
const pdfList = document.getElementById('pdfList');
const search = document.getElementById('search');
const resetAllBtn = document.getElementById('resetAll');

let pdfs = JSON.parse(localStorage.getItem('pdfs')) || [];

/* Render PDFs */
function render(list){
  pdfList.innerHTML = '';
  list.forEach((pdf, index)=>{
    const li = document.createElement('li');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = pdf.name;
    nameSpan.onclick = ()=>{
      const blob = base64ToBlob(pdf.data,'application/pdf');
      const url = URL.createObjectURL(blob);
      window.open(url,'_blank');
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.className = 'delete-btn';
    delBtn.onclick = ()=>{
      if(confirm('Is PDF ko delete kare?')){
        pdfs.splice(index,1);
        localStorage.setItem('pdfs',JSON.stringify(pdfs));
        render(pdfs);
      }
    };

    li.appendChild(nameSpan);
    li.appendChild(delBtn);
    pdfList.appendChild(li);
  });
}

/* Upload PDFs */
pdfInput.addEventListener('change',()=>{
  [...pdfInput.files].forEach(file=>{
    const reader = new FileReader();
    reader.onload = ()=>{
      pdfs.push({
        name:file.name,
        data:reader.result.split(',')[1]
      });
      localStorage.setItem('pdfs',JSON.stringify(pdfs));
      render(pdfs);
    };
    reader.readAsDataURL(file);
  });
});

/* Search */
search.addEventListener('input',()=>{
  const value = search.value.toLowerCase();
  const filtered = pdfs.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  render(filtered);
});

/* Reset All */
resetAllBtn.addEventListener('click',()=>{
  if(confirm('Saari PDFs delete karni hai?')){
    pdfs = [];
    localStorage.removeItem('pdfs');
    render(pdfs);
  }
});

/* Base64 to Blob */
function base64ToBlob(base64,type){
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for(let i=0;i<bytes.length;i++){
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr],{type});
}

render(pdfs);
