/* Variável global que servirá de buffer para quando uma tarefa que está sendo editada
for carregada para o input. Ao fazer esta operação, o <li> é removido temporariamente
do DOM e armazenado no buffer, até que o usuário clique no botão para atualizar os dados */
let buffer = null;

const getNthElementChild = (HTMLElement, n) => {
    let element = HTMLElement.firstElementChild;
    for(let i = 0; i< n-1 ;i++)
        element = element.nextElementSibling;
    return element;
}

/* Função que conclui uma tarefa ou a retorna ao status de pendente. Basicamente, inverte
o estado da tarefa. O número de classes é utilizado para monitorar o estado. Se houver mais
de uma classe CSS, é por que a tarefa está concluída e deseja retorná-la para o status de
pendente. Basta remover a classe que indica que está completa. Caso contrário, acrescenta-se
tal classe */
function acaoConcluir() {
    // this se refere ao objeto que evocou a função. Nesse caso, o botão
    let li = this.parentNode; // parentNode do botão é o <li>

    let spanTarefa= getNthElementChild(li, 3); // O 3 filho do tipo Element é o span
    let firstChild = li.firstElementChild;

    /* Ao inverter o estado de uma tarefa, ela muda de lista. As variáveis a seguir controlam
    de qual lista será retirada e em qual lista será incluída */
    let de;
    let para;

    if (spanTarefa.classList.length > 1) {
        spanTarefa.classList.remove('tarefa-completa');
        /* Após a remoção da classe no span, percorre os irmão seguintes (do tipo elemento)
        removendo a classe também neles, até que a lista termine (ponteiro p vale null) */
        let p = firstChild;
        while (p != null) {

            if(p.tagName.toLowerCase() !== 'h1'){
                p.classList.remove('botao-completa');
                p = p.nextElementSibling;
            }
        }
        // Se removemos a tarefa, ela sai do status de concluída para pendente
        de = 'concluidas';
        para = 'pendentes';
    } else { // Análogo ao caso acima, porém com a lógica invertida
        spanTarefa.classList.add('tarefa-completa');
        let p = firstChild;
        while (p != null) {

            if(p.tagName.toLowerCase() !== 'h1'){
                p.classList.add('botao-completa');
                p = p.nextElementSibling;
            }
        }
        de = 'pendentes';
        para = 'concluidas';
    }

    // Captura as listas de origem e destino
    de = document.getElementById(de);
    para = document.getElementById(para);

    // Remove da lista de origem e acrescenta na de destino
    de.removeChild(li);
    para.appendChild(li);
}

/* Ação executada ao clicar em um botão de editar tarefa. Se o buffer estiver cheio, significa
que há uma ação de edição em curso. Irá bloquear o usuário de cumprir a ação. Caso contrário:
1) Remove a tarefa da lista onde está e a salva no buffer
2) Copia o texto do span da tarefa pro campo de formulário
3) Se a tarefa estava cumprida, a retorna para as pendentes, pois se foi modificada, assume-se
que ainda não cumprida
4) Muda a função associada ao clique do botão. Ao invés de evocar a função de inserção, agora
evocará uma outra função, de atualização. Ou seja, muda o papel do botão */
function acaoEditar() {
    if (buffer == null) {
        // Passo 1, acima
        let li = this.parentNode;
        let lista = li.parentNode;
        lista.removeChild(li);
        buffer = li;

        // Passo 2, acima
        let spanTarefa= getNthElementChild(li, 3);
        let inputTexto = document.getElementById('nova');
        inputTexto.value = spanTarefa.innerText;

        // Passo 3, acima
        if (spanTarefa.classList.length > 1) {
            spanTarefa.classList.remove('tarefa-completa');
            let p = spanTarefa.nextElementSibling;
            while (p != null) {
                p.classList.remove('botao-completa');
                p = p.nextElementSibling;
            }
        }

        // Passo 4, acima
        let btn = document.getElementById('btnInserir');
        btn.removeEventListener('click', acaoInserir);
        btn.innerText = 'Atualizar';
        btn.addEventListener('click', acaoAtualizar);
    } else {
        alert('Já há uma tarefa em atualização no momento');
    }
}

/* Ação executada ao clicar em um botão de atualizar tarefa (botão inserir modificado).
1) Verifica se o campo de formulário contém um texto. Se contiver:
    2) Copia o texto do campo de formulário para o span da tarefa
    3) Atribui o <li> à lista de pendentes
    4) Muda a função associada ao clique do botão. Remove a associação à função de atualização
    e retorna para a função original do botão, de inserção. Ou seja, restaura o papel original
    do botão
    5) Limpa o campo de formulário e o buffer */
function acaoAtualizar() {
    // Passo 1, acima
    let inputTexto = document.getElementById('nova');
    let texto = inputTexto.value;

    if (texto != '') {
        // Passo 2, acima
        let spanTarefa= getNthElementChild(buffer, 3);
        spanTarefa.innerText = texto;

        // Passo 3, acima
        let pendentes = document.getElementById('pendentes');
        pendentes.appendChild(buffer);

        // Passo 4, acima
        let btn = document.getElementById('btnInserir');
        btn.removeEventListener('click', acaoAtualizar);
        btn.innerText = 'Inserir';
        btn.addEventListener('click', acaoInserir);

        // Passo 5, acima
        inputTexto.value = '';
        buffer = null;
    } else {
        alert('Informe o texto da tarefa');
    }
}

/* Ação executada ao clicar em um botão de remover tarefa. A partir do botão, encontra
a lista, que  por sua vez é usada para encontrar o span, do qual se capturará o texto
da tarefa, para a mensagem de confirmação da operação (window.confirm). Se o usuário
responder positivamente à pergunta, fará a remoção do item da lista onde se encontra
(removeChild) */
function acaoRemover() {
    let li = this.parentNode;
    let lista = li.parentNode;
    let span = getNthElementChild(li, 3);
    let texto = span.innerText;

    const resp = window.confirm('Tem certeza que deseja excluir a tarefa ' + texto + '?');

    if (resp) lista.removeChild(li);
}

/* Função auxiliar, para criar um item de lista e retornar para quem a evocou. Foi criada
apenas para encapsular esta tarefa e deixar o código da ação de inserção mais alto nível */
function criaLi(texto) {
    // Criar o item de lista correspondente à tarefa adicionada
    let li = document.createElement('li'); // Cria um OBJETO DOM, ainda desvinculado à árvore

    // Criar o span contendo o texto da tarefa
    let sp = document.createElement('span');

    // Adiciona texto ao span
    let spTxt = document.createTextNode(texto);
    sp.appendChild(spTxt);

    // Criar botões da tarefa
    let btnSub = document.createElement('button');
    let btnDesc = document.createElement('button');
    let btnConc = document.createElement('button');
    let btnEdit = document.createElement('button');
    let btnDel = document.createElement('button');

    // Adiciona emojis aos botões
    btnSub.innerHTML = '&#x2191;';
    btnDesc.innerHTML = '&#x2193;';
    btnConc.innerHTML = '&#10003;';
    btnEdit.innerHTML = '&#128395;';
    btnDel.innerHTML = '&#128465;';

    // Adiciona classes ao span
    sp.classList.add('tarefa');

    // Adiciona a classe CSS correspondente ao botão e adiciona o handler de evento de clique
    btnSub.classList.add('subir');
    btnSub.addEventListener('click', acaoSubir);

    btnDesc.classList.add('descer');
    btnDesc.addEventListener('click', acaoDescer);

    btnConc.classList.add('concluir');
    btnConc.addEventListener('click', acaoConcluir);

    btnEdit.classList.add('editar');
    btnEdit.addEventListener('click', acaoEditar);
    
    btnDel.classList.add('remover');
    btnDel.addEventListener('click', acaoRemover);

    // Adicionar span e botões aos filhos de li
    // A ordem importa
    li.appendChild(btnSub);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(btnDesc);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(sp); // Primeiro o span
    li.appendChild(document.createTextNode(' ')); // Espaço em branco para separar elementos
    li.appendChild(btnConc);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(btnEdit);
    li.appendChild(document.createTextNode(' '));
    li.appendChild(btnDel);

    // Retorna o objeto <li> pronto para ser inserido na lista de pendentes
    return li;
}

/* Ação executada ao clicar no botão de inserir. Se o campo de formulário estiver vazio, apenas
informa ao usuário e não efetua ação nenhuma. Caso contrário, limpa o campo de formuláro, evoca a
função de criação de elementos <li>, informando o texto da tarefa nova (vindo do campo de formulário)
e, por fim, adiciona o item de lista à lista de tarefas pendentes */
function acaoInserir() {
    // Captura o texto do campo de formulário
    let inputTexto = document.getElementById('nova');
    let texto = inputTexto.value;
    if (texto != '') {
        inputTexto.value = ''; // Limpa o campo de formulário

        // Cria um elemento <li>
        let li = criaLi(texto);
        // Captura referência à lista de tarefas pendentes
        let pendentes = document.getElementById('pendentes');
        // Inserir o li (PRONTO) à lista
        pendentes.appendChild(li);
    } else {
        alert('Informe o texto da tarefa');
    }
}

function acaoSubir() {
    let li = this.parentNode;
    let lista = li.parentNode;

    if (li.previousElementSibling !== null) {
        lista.insertBefore(li, li.previousElementSibling);
    }else window.alert("O elemento ja é o primeiro da lista")
}

function acaoDescer() {
    let li = this.parentNode;
    let lista = li.parentNode;

    if (li.nextElementSibling !== null) {
        lista.insertBefore(li.nextElementSibling, li);
    }else window.alert("O elemento ja é o último da lista")
}

// Associa a função de inserção ao clique no botão Inserir
let btn = document.getElementById('btnInserir');
btn.addEventListener('click', acaoInserir);
