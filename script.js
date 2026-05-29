```javascript
/* ========================= */
/* script.js */
/* ========================= */

const modal = document.getElementById('modalLogin');

const resultado = document.getElementById('resultado');

const themeToggle = document.getElementById('themeToggle');

let historicoConsultas = [];

/* MODAL */

function abrirModal(){
    modal.style.display = 'flex';
}

function fecharModal(){
    modal.style.display = 'none';
}

/* LOGIN */

function mostrarResultado(){

    const cpf = document
        .getElementById('cpfLogin')
        .value
        .trim();

    const senha = document
        .getElementById('senhaLogin')
        .value
        .trim();

    if(!cpf || !senha){

        alert('Preencha CPF e senha corretamente.');

        return;
    }

    fecharModal();

    resultado.style.display = 'block';

    window.scrollTo({
        top: resultado.offsetTop,
        behavior:'smooth'
    });

    historicoConsultas.push({
        cpf,
        data:new Date().toLocaleString()
    });

    console.table(historicoConsultas);

    alert('Login realizado com sucesso!');
}

/* DARK MODE */

themeToggle.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    const darkModeAtivo =
        document.body.classList.contains('dark-mode');

    localStorage.setItem(
        'darkMode',
        darkModeAtivo
    );
});

/* LOAD */

window.onload = () => {

    resultado.style.display = 'none';

    const darkModeSalvo =
        localStorage.getItem('darkMode');

    if(darkModeSalvo === 'true'){
        document.body.classList.add('dark-mode');
    }

    console.log('Sistema carregado com sucesso.');
};
```
