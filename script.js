let historicoConsultas = [];

function abrirModal(){
    const modal = document.getElementById('modalLogin');
    modal.style.display = 'flex';
}

function fecharModal(){
    const modal = document.getElementById('modalLogin');
    modal.style.display = 'none';
}

function mostrarResultado(){

    const cpfInput = document.querySelector('#cpfLogin');
    const senhaInput = document.querySelector('#senhaLogin');

    const cpf = cpfInput.value.trim();
    const senha = senhaInput.value.trim();

    if(cpf === '' || senha === ''){
        alert('Preencha CPF e senha corretamente!');
        return;
    }

    fecharModal();

    const resultado = document.getElementById('resultado');

    resultado.style.display = 'block';

    window.scrollTo({
        top: resultado.offsetTop,
        behavior: 'smooth'
    });

    historicoConsultas.push({
        cpf: cpf,
        data: new Date().toLocaleString()
    });

    alert('Consulta realizada com sucesso!');
}

window.onload = function(){

    const resultado = document.getElementById('resultado');

    resultado.style.display = 'none';

    console.log('Sistema carregado com sucesso!');
}
