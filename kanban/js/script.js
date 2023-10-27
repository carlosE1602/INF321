const objetos = {
  inputNova: document.getElementById('nova'),
  insercao: document.getElementById("insercao"),
  pendentes: document.getElementById('lista-pendentes'),
  fazendo: document.getElementById('lista-fazendo'),
  concluidas: document.getElementById('lista-concluidas'),
  btnIns: document.getElementById("btnNova"),
  btnLimpa: document.getElementById("btnLimpa"),
  tarefaArrastada: null
}

const criaTarefa = (texto, className = "pendente") => {
  let card = document.createElement('div');
  card.classList.add("card")
  card.classList.add(className)


  let sp = document.createElement('span');

  let spTxt = document.createTextNode(texto);
  sp.appendChild(spTxt);
  card.appendChild(sp);
  card.setAttribute("draggable", true)
  card.addEventListener("dragstart", (event) => {
    objetos.tarefaArrastada = card;
    let texto = card.querySelector('span').innerText;
    event.dataTransfer.setData('text', texto);
    card.classList.add('dragging');
  })

  card.addEventListener('dragend', (event) => {
    objetos.tarefaArrastada = null;
    card.classList.remove('dragging');
});
  return card
}

const insere = () => {
  console.log("eueueu")
  let texto = objetos.inputNova.value;
  console.log(texto)
  if (!texto) 
    alert('Informe um texto para a tarefa');
  else{
    let card = criaTarefa(texto)
    objetos.pendentes.appendChild(card)
    objetos.inputNova.value = '';
    objetos.inputNova.focus();
  }


}

objetos.btnIns.addEventListener('click', insere);
objetos.btnLimpa.addEventListener('click', () => {
  objetos.inputNova.value = '';
  objetos.inputNova.focus();
} )

objetos.insercao.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  objetos.insercao.classList.add('dragover');
});

objetos.pendentes.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  objetos.pendentes.classList.add('dragover');
});

objetos.concluidas.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  objetos.concluidas.classList.add('dragover');
});

objetos.fazendo.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  objetos.fazendo.classList.add('dragover');
});

objetos.pendentes.addEventListener('dragleave', () => {
  objetos.pendentes.classList.remove('dragover');
});

objetos.insercao.addEventListener('dragleave', () => {
  objetos.insercao.classList.remove('dragover');
});

objetos.fazendo.addEventListener('dragleave', () => {
  objetos.fazendo.classList.remove('dragover');
});

objetos.concluidas.addEventListener('dragleave', () => {
  objetos.concluidas.classList.remove('dragover');
});

objetos.pendentes.addEventListener('drop', (event) => {
  event.preventDefault();
  let texto = event.dataTransfer.getData('text');
  let novoItem = criaTarefa(texto, "pendente");
  objetos.pendentes.appendChild(novoItem);
  objetos.tarefaArrastada.parentNode.removeChild(objetos.tarefaArrastada);
  objetos.pendentes.classList.remove('dragover');
});

objetos.concluidas.addEventListener('drop', (event) => {
  event.preventDefault();
  let texto = event.dataTransfer.getData('text');
  let novoItem = criaTarefa(texto, "concluida");
  objetos.concluidas.appendChild(novoItem);
  objetos.tarefaArrastada.parentNode.removeChild(objetos.tarefaArrastada);
  objetos.concluidas.classList.remove('dragover');
});

objetos.fazendo.addEventListener('drop', (event) => {
  event.preventDefault();
  let texto = event.dataTransfer.getData('text');
  let novoItem = criaTarefa(texto, "fazendo");
  objetos.fazendo.appendChild(novoItem);
  objetos.tarefaArrastada.parentNode.removeChild(objetos.tarefaArrastada);
  objetos.fazendo.classList.remove('dragover');
});

objetos.insercao.addEventListener('drop', (event) => {
  event.preventDefault();
  let texto = event.dataTransfer.getData('text');
  objetos.inputNova.value = texto;
  objetos.tarefaArrastada.parentNode.removeChild(objetos.tarefaArrastada);
  objetos.insercao.classList.remove('dragover');

})