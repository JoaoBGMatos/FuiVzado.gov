/**
 * ============================================
 * SCRIPT.JS - Plataforma GOV Digital
 * Funcionalidades principais e Modo Escuro
 * ============================================
 */

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let historicoConsultas = [];
const STORAGE_KEY_THEME = 'govbr-theme';
const STORAGE_KEY_HISTORICO = 'govbr-historico';

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarTema();
    carregarHistorico();
    configurarEventos();
    console.log('Sistema carregado com sucesso!');
});

/**
 * Inicializa o tema (claro ou escuro) baseado nas preferências do usuário
 */
function inicializarTema() {
    const temaSalvo = localStorage.getItem(STORAGE_KEY_THEME);
    const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Se o usuário tem uma preferência salva, usar ela
    if (temaSalvo) {
        if (temaSalvo === 'dark') {
            ativarModoEscuro();
        }
    } 
    // Caso contrário, respeitar a preferência do sistema
    else if (prefereEscuro) {
        ativarModoEscuro();
    }
    
    // Listener para mudanças de preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            ativarModoEscuro();
        } else {
            desativarModoEscuro();
        }
    });
}

/**
 * Configura os event listeners
 */
function configurarEventos() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', alternarTema);
    }
    
    // Fechar modal ao clicar fora dele
    const modal = document.getElementById('modalLogin');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                fecharModal();
            }
        });
    }
    
    // Tecla ESC para fechar modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fecharModal();
        }
    });
}

// ============================================
// MODO ESCURO
// ============================================

/**
 * Alterna entre modo claro e escuro
 */
function alternarTema() {
    const body = document.body;
    
    if (body.classList.contains('dark-mode')) {
        desativarModoEscuro();
    } else {
        ativarModoEscuro();
    }
}

/**
 * Ativa o modo escuro
 */
function ativarModoEscuro() {
    document.body.classList.add('dark-mode');
    localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    atualizarIconeTema();
}

/**
 * Desativa o modo escuro
 */
function desativarModoEscuro() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem(STORAGE_KEY_THEME, 'light');
    atualizarIconeTema();
}

/**
 * Atualiza o ícone do botão de tema
 */
function atualizarIconeTema() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (isDarkMode) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        themeToggle.title = 'Ativar Modo Claro';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        themeToggle.title = 'Ativar Modo Escuro';
    }
}

// ============================================
// MODAL
// ============================================

/**
 * Abre o modal de login
 */
function abrirModal() {
    const modal = document.getElementById('modalLogin');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focar no primeiro input
        const cpfInput = document.getElementById('cpfLogin');
        if (cpfInput) {
            setTimeout(() => cpfInput.focus(), 100);
        }
    }
}

/**
 * Fecha o modal de login
 */
function fecharModal() {
    const modal = document.getElementById('modalLogin');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Limpar campos
        document.getElementById('cpfLogin').value = '';
        document.getElementById('senhaLogin').value = '';
    }
}

// ============================================
// CONSULTAS E RESULTADOS
// ============================================

/**
 * Valida e processa o login
 */
function mostrarResultado() {
    const cpfInput = document.querySelector('#cpfLogin');
    const senhaInput = document.querySelector('#senhaLogin');
    
    if (!cpfInput || !senhaInput) {
        mostrarAlerta('Erro: Campos não encontrados!', 'erro');
        return;
    }
    
    const cpf = cpfInput.value.trim();
    const senha = senhaInput.value.trim();
    
    // Validação básica
    if (cpf === '' || senha === '') {
        mostrarAlerta('Preencha CPF e senha corretamente!', 'aviso');
        return;
    }
    
    if (cpf.length < 11) {
        mostrarAlerta('CPF deve ter pelo menos 11 dígitos!', 'aviso');
        return;
    }
    
    if (senha.length < 6) {
        mostrarAlerta('Senha deve ter pelo menos 6 caracteres!', 'aviso');
        return;
    }
    
    fecharModal();
    
    // Adicionar ao histórico
    adicionarAoHistorico(cpf);
    
    // Mostrar resultado
    mostrarSeccaoResultado();
    
    mostrarAlerta('Consulta realizada com sucesso!', 'sucesso');
}

/**
 * Mostra a seção de resultado e faz scroll suave
 */
function mostrarSeccaoResultado() {
    const resultado = document.getElementById('resultado');
    if (resultado) {
        resultado.classList.add('active');
        window.scrollTo({
            top: resultado.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

/**
 * Adiciona uma consulta ao histórico
 */
function adicionarAoHistorico(cpf) {
    const consulta = {
        cpf: cpf,
        data: new Date().toLocaleString('pt-BR'),
        id: Date.now()
    };
    
    historicoConsultas.unshift(consulta);
    
    // Manter apenas os últimos 50 registros
    if (historicoConsultas.length > 50) {
        historicoConsultas.pop();
    }
    
    salvarHistorico();
}

/**
 * Carrega o histórico do localStorage
 */
function carregarHistorico() {
    const historico = localStorage.getItem(STORAGE_KEY_HISTORICO);
    if (historico) {
        try {
            historicoConsultas = JSON.parse(historico);
        } catch (e) {
            console.error('Erro ao carregar histórico:', e);
            historicoConsultas = [];
        }
    }
}

/**
 * Salva o histórico no localStorage
 */
function salvarHistorico() {
    localStorage.setItem(STORAGE_KEY_HISTORICO, JSON.stringify(historicoConsultas));
}

// ============================================
// FUNCIONALIDADES INTERATIVAS
// ============================================

/**
 * Abre o histórico de consultas
 */
function abrirHistorico() {
    if (historicoConsultas.length === 0) {
        mostrarAlerta('Nenhuma consulta foi realizada ainda.', 'info');
        return;
    }
    
    let historicoTexto = 'HISTÓRICO DE CONSULTAS\n';
    historicoTexto += '='.repeat(50) + '\n\n';
    
    historicoConsultas.forEach(function(item, index) {
        historicoTexto += `Consulta #${index + 1}\n`;
        historicoTexto += `CPF: ${mascaraCPF(item.cpf)}\n`;
        historicoTexto += `Data: ${item.data}\n`;
        historicoTexto += '-'.repeat(50) + '\n\n';
    });
    
    // Mostrar em um alert ou modal personalizado
    alert(historicoTexto);
}

/**
 * Ativa o monitoramento de e-mails
 */
function monitorarEmails() {
    const email = prompt('Digite seu e-mail para ativar o monitoramento:');
    
    if (email === null) {
        return;
    }
    
    if (email === '') {
        mostrarAlerta('E-mail não pode estar vazio!', 'aviso');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarAlerta('E-mail inválido!', 'aviso');
        return;
    }
    
    mostrarAlerta(`Monitoramento ativado para: ${email}`, 'sucesso');
}

/**
 * Ativa o modo mobile
 */
function abrirMobile() {
    const isMobileMode = document.body.style.maxWidth === '480px';
    
    if (isMobileMode) {
        document.body.style.maxWidth = 'none';
        document.body.style.margin = '0';
        mostrarAlerta('Modo mobile desativado!', 'info');
    } else {
        document.body.style.maxWidth = '480px';
        document.body.style.margin = '0 auto';
        mostrarAlerta('Modo mobile ativado!', 'info');
    }
}

/**
 * Ativa o login biométrico
 */
function loginBiometrico() {
    const autenticado = confirm('Deseja autenticar utilizando biometria?');
    
    if (autenticado) {
        // Simular validação biométrica
        mostrarAlerta('Biometria validada com sucesso!', 'sucesso');
    } else {
        mostrarAlerta('Autenticação cancelada.', 'info');
    }
}

/**
 * Inicia o backup seguro
 */
function backupSeguro() {
    mostrarAlerta('Iniciando backup criptografado...', 'info');
    
    setTimeout(function() {
        mostrarAlerta('Backup concluído com sucesso!', 'sucesso');
    }, 2000);
}

/**
 * Ativa a proteção anti-fraude
 */
function antiFraude() {
    const itens = document.querySelectorAll('.result-item');
    
    itens.forEach(function(item) {
        item.style.background = '#d8ffe1';
        item.style.borderLeft = '4px solid #0d7c2f';
    });
    
    mostrarAlerta('Proteção Anti Fraude ativada!', 'sucesso');
    
    // Remover destaque após 5 segundos
    setTimeout(function() {
        itens.forEach(function(item) {
            item.style.background = '';
            item.style.borderLeft = '';
        });
    }, 5000);
}

/**
 * Gera um relatório de segurança
 */
function gerarRelatorio() {
    const data = new Date().toLocaleString('pt-BR');
    const texto = `RELATÓRIO DE SEGURANÇA\n`;
    texto += `Data: ${data}\n`;
    texto += `Status: Sistema ativo e protegido\n`;
    texto += `Consultas realizadas: ${historicoConsultas.length}\n`;
    texto += `Modo: ${document.body.classList.contains('dark-mode') ? 'Escuro' : 'Claro'}\n`;
    
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-seguranca-${Date.now()}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    mostrarAlerta('Relatório gerado com sucesso!', 'sucesso');
}

/**
 * Atualiza o painel de estatísticas
 */
function atualizarPainel() {
    const stats = document.querySelectorAll('.stat h2');
    
    if (stats.length >= 3) {
        stats[0].innerHTML = (Math.random() * 5).toFixed(1) + 'M';
        stats[1].innerHTML = (90 + Math.random() * 10).toFixed(1) + '%';
        stats[2].innerHTML = '24/7';
    }
    
    mostrarAlerta('Painel atualizado com sucesso!', 'sucesso');
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Valida um e-mail
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Mascara um CPF para exibição
 */
function mascaraCPF(cpf) {
    if (!cpf || cpf.length < 11) return cpf;
    return cpf.substring(0, 3) + '.***.***-' + cpf.substring(cpf.length - 2);
}

/**
 * Mostra um alerta personalizado
 */
function mostrarAlerta(mensagem, tipo = 'info') {
    // Tipos: 'sucesso', 'erro', 'aviso', 'info'
    const cores = {
        'sucesso': '#0d7c2f',
        'erro': '#c41e3a',
        'aviso': '#ff9800',
        'info': '#1351b4'
    };
    
    // Por enquanto, usar alert padrão
    // Em uma aplicação real, você criaria um toast notification
    alert(`[${tipo.toUpperCase()}] ${mensagem}`);
}

/**
 * Copia texto para a área de transferência
 */
function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarAlerta('Copiado para a área de transferência!', 'sucesso');
    }).catch(() => {
        mostrarAlerta('Erro ao copiar para a área de transferência!', 'erro');
    });
}

/**
 * Formata um número como moeda
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/**
 * Formata uma data
 */
function formatarData(data) {
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(data));
}

// ============================================
// PERFORMANCE E OTIMIZAÇÕES
// ============================================

/**
 * Debounce para otimizar eventos
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle para limitar execução de funções
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// LOGS E DEBUG
// ============================================

console.log('%cPlataforma GOV Digital', 'font-size: 20px; font-weight: bold; color: #1351b4;');
console.log('%cVersão 1.0.0', 'color: #666;');
console.log('%cModo Escuro: Ativado', 'color: #4caf50;');
