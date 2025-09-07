class AdocaoSystem {
    constructor() {
        this.padrinhos = this.loadData('padrinhos') || [];
        this.animais = this.loadData('animais') || [];
        this.apadrinhamentos = this.loadData('apadrinhamentos') || [];
    }

    loadData(key) {
        try {
            const data = localStorage.getItem(`adotepet_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(`adotepet_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    }

    // Padrinhos
    adicionarPadrinho(padrinho) {
        const newPadrinho = {
            ...padrinho,
            id: Date.now().toString()
        };
        this.padrinhos.push(newPadrinho);
        this.saveData('padrinhos', this.padrinhos);
        return newPadrinho;
    }

    getPadrinhos() {
        return this.padrinhos;
    }

    // Animais
    adicionarAnimal(animal) {
        const newAnimal = {
            ...animal,
            id: Date.now().toString()
        };
        this.animais.push(newAnimal);
        this.saveData('animais', this.animais);
        return newAnimal;
    }

    getAnimais() {
        return this.animais;
    }

    // Apadrinhamentos
    criarApadrinhamento(padrinhoId, animalId) {
        const padrinho = this.padrinhos.find(p => p.id === padrinhoId);
        const animal = this.animais.find(a => a.id === animalId);
        
        if (padrinho && animal) {
            const newApadrinhamento = {
                id: Date.now().toString(),
                padrinhoId,
                animalId,
                dataAdocao: new Date().toLocaleDateString('pt-BR'),
                padrinho,
                animal
            };
            
            this.apadrinhamentos.push(newApadrinhamento);
            this.saveData('apadrinhamentos', this.apadrinhamentos);
            
            // Remove animal from available list
            this.animais = this.animais.filter(a => a.id !== animalId);
            this.saveData('animais', this.animais);
            
            return newApadrinhamento;
        }
        
        return null;
    }

    getApadrinhamentos() {
        return this.apadrinhamentos;
    }
}

// Global system instance
const adocaoSystem = new AdocaoSystem();

// Toast Notifications
function showToast(message, type = 'info', title = '') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const toastHeader = title ? `<div class="toast-header">${title}</div>` : '';
    const toastMessage = `<div class="toast-message">${message}</div>`;
    
    toast.innerHTML = toastHeader + toastMessage;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// Navigation
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Update Statistics
function updateStats() {
    const padrinhos = adocaoSystem.getPadrinhos();
    const animais = adocaoSystem.getAnimais();
    const apadrinhamentos = adocaoSystem.getApadrinhamentos();

    const padrinhosCount = document.getElementById('padrinhos-count');
    const animaisCount = document.getElementById('animais-count');
    const apadrinhamentosCount = document.getElementById('apadrinhamentos-count');

    if (padrinhosCount) padrinhosCount.textContent = padrinhos.length;
    if (animaisCount) animaisCount.textContent = animais.length;
    if (apadrinhamentosCount) apadrinhamentosCount.textContent = apadrinhamentos.length;
}

// Form Validation
function validateForm(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
            errors.push(`${field} é obrigatório`);
        }
    });
    
    // Validate email format
    if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.push('Email deve ter um formato válido');
        }
    }
    
    // Validate idade
    if (formData.idade) {
        const idade = parseInt(formData.idade);
        if (isNaN(idade) || idade < 1 || idade > 120) {
            errors.push('Idade deve ser um número válido entre 1 e 120');
        }
    }
    
    return errors;
}

// Format CPF (Brazilian tax ID)
function formatCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Format Phone
function formatPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4}-\d{4})\d+?$/, '$1');
}

// Auto-format inputs
function initAutoFormat() {
    const cpfInputs = document.querySelectorAll('input[name="cpf"]');
    const phoneInputs = document.querySelectorAll('input[name="telefone"]');
    
    cpfInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = formatCPF(e.target.value);
        });
    });
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = formatPhone(e.target.value);
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initMobileNav();
    initAutoFormat();
    
    // Page-specific initializations
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            updateStats();
            break;
        case 'cdst_padrinho.html':
            initCadastroPadrinho();
            break;
        case 'lista_padrinhos.html':
            initListaPadrinhos();
            break;
        case 'cdst_animal.html':
            initCadastroAnimal();
            break;
        case 'lista_animais.html':
            initListaAnimais();
            break;
        case 'apadrinhamento.html':
            initApadrinhamento();
            break;
        case 'lista_apadrinhados.html':
            initListaApadrinhados();
            break;
    }
});

// Page-specific functions
function initCadastroPadrinho() {
    const form = document.getElementById('cadastro-padrinho-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            idade: formData.get('idade'),
            cpf: formData.get('cpf'),
            email: formData.get('email'),
            telefone: formData.get('telefone')
        };
        
        const requiredFields = ['nome', 'idade', 'cpf', 'email', 'telefone'];
        const errors = validateForm(data, requiredFields);
        
        if (errors.length > 0) {
            showToast(errors.join(', '), 'error', 'Erro de Validação');
            return;
        }
        
        try {
            adocaoSystem.adicionarPadrinho(data);
            showToast('Padrinho cadastrado com sucesso!', 'success', 'Sucesso!');
            setTimeout(() => {
                window.location.href = 'lista_padrinhos.html';
            }, 1500);
        } catch (error) {
            showToast('Erro ao cadastrar padrinho', 'error', 'Erro');
        }
    });
}

function initListaPadrinhos() {
    const padrinhos = adocaoSystem.getPadrinhos();
    const container = document.getElementById('padrinhos-container');
    
    if (!container) return;
    
    if (padrinhos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users empty-icon"></i>
                <h3 class="empty-title">Nenhum padrinho cadastrado</h3>
                <p class="empty-description">Comece cadastrando o primeiro padrinho interessado em adotar</p>
                <a href="cdst_animal.html" class="btn btn-primary">
                    <i class="fas fa-user-plus"></i>
                    Cadastrar Primeiro Padrinho
                </a>
            </div>
        `;
        return;
    }
    
    const tableHTML = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>CPF</th>
                        <th>Contato</th>
                    </tr>
                </thead>
                <tbody>
                    ${padrinhos.map(padrinho => `
                        <tr>
                            <td><strong>${padrinho.nome}</strong></td>
                            <td>${padrinho.idade} anos</td>
                            <td><code>${padrinho.cpf}</code></td>
                            <td>
                                <div class="contact-info">
                                    <a href="mailto:${padrinho.email}" class="contact-link">
                                        <i class="fas fa-envelope"></i>
                                        ${padrinho.email}
                                    </a>
                                    <a href="tel:${padrinho.telefone}" class="contact-link">
                                        <i class="fas fa-phone"></i>
                                        ${padrinho.telefone}
                                    </a>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

function initCadastroAnimal() {
    const form = document.getElementById('cadastro-animal-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            idade: formData.get('idade'),
            raca: formData.get('raca'),
            cor: formData.get('cor'),
            fichaSaude: formData.get('fichaSaude') || ''
        };
        
        const requiredFields = ['nome', 'idade', 'raca', 'cor'];
        const errors = validateForm(data, requiredFields);
        
        if (errors.length > 0) {
            showToast(errors.join(', '), 'error', 'Erro de Validação');
            return;
        }
        
        try {
            adocaoSystem.adicionarAnimal(data);
            showToast('Animal cadastrado com sucesso!', 'success', 'Sucesso!');
            setTimeout(() => {
                window.location.href = 'lista_animais.html';
            }, 1500);
        } catch (error) {
            showToast('Erro ao cadastrar animal', 'error', 'Erro');
        }
    });
}

function initListaAnimais() {
    const animais = adocaoSystem.getAnimais();
    const container = document.getElementById('animais-container');
    
    if (!container) return;
    
    if (animais.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <i class="fas fa-dog empty-icon"></i>
                    <h3 class="empty-title">Nenhum animal cadastrado</h3>
                    <p class="empty-description">Comece cadastrando o primeiro animal em busca de um lar</p>
                    <a href="cdst_animal.html" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Cadastrar Primeiro Animal
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    const cardsHTML = animais.map(animal => `
        <div class="animal-card">
            <div class="animal-header">
                <div class="animal-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3 class="animal-name">${animal.nome}</h3>
                <div class="animal-badges">
                    <span class="badge badge-secondary">${animal.idade} ano${animal.idade != 1 ? 's' : ''}</span>
                    <span class="badge badge-outline">${animal.raca}</span>
                </div>
            </div>
            <div class="animal-content">
                <div class="animal-info">
                    <span class="animal-info-label">Cor:</span>
                    <span class="animal-info-value">${animal.cor}</span>
                </div>
                
                ${animal.fichaSaude ? `
                    <div class="health-info">
                        <div class="health-label">
                            <i class="fas fa-stethoscope"></i>
                            Ficha de Saúde:
                        </div>
                        <div class="health-content">${animal.fichaSaude}</div>
                    </div>
                ` : ''}
                
                <a href="apadrinhamento.html" class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-heart"></i>
                    Adotar ${animal.nome}
                </a>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `<div class="animals-grid">${cardsHTML}</div>`;
}

function initApadrinhamento() {
    const padrinhos = adocaoSystem.getPadrinhos();
    const animais = adocaoSystem.getAnimais();
    
    // Check if we have data
    if (padrinhos.length === 0) {
        document.getElementById('apadrinhamento-container').innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <i class="fas fa-users empty-icon"></i>
                    <h3 class="empty-title">Nenhum padrinho cadastrado</h3>
                    <p class="empty-description">É necessário ter padrinhos cadastrados para realizar apadrinhamentos</p>
                    <a href="cdst_padrinho.html" class="btn btn-primary">Cadastrar Padrinho</a>
                </div>
            </div>
        `;
        return;
    }
    
    if (animais.length === 0) {
        document.getElementById('apadrinhamento-container').innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <i class="fas fa-dog empty-icon"></i>
                    <h3 class="empty-title">Nenhum animal disponível</h3>
                    <p class="empty-description">É necessário ter animais cadastrados para realizar apadrinhamentos</p>
                    <a href="cdst_animal.html" class="btn btn-primary">Cadastrar Animal</a>
                </div>
            </div>
        `;
        return;
    }
    
    // Initialize selects
    initApadrinhamentoSelects();
    
    // Form submission
    const form = document.getElementById('apadrinhamento-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const padrinhoId = document.getElementById('padrinho-select').value;
            const animalId = document.getElementById('animal-select').value;
            
            if (!padrinhoId || !animalId) {
                showToast('Selecione um padrinho e um animal para criar o apadrinhamento', 'error', 'Erro');
                return;
            }
            
            try {
                const apadrinhamento = adocaoSystem.criarApadrinhamento(padrinhoId, animalId);
                if (apadrinhamento) {
                    showToast('Apadrinhamento realizado com sucesso! 🎉', 'success', 'Parabéns!');
                    setTimeout(() => {
                        window.location.href = 'lista_apadrinhados.html';
                    }, 2000);
                } else {
                    showToast('Erro ao criar apadrinhamento', 'error', 'Erro');
                }
            } catch (error) {
                showToast('Erro ao processar apadrinhamento', 'error', 'Erro');
            }
        });
    }
}

function initApadrinhamentoSelects() {
    const padrinhos = adocaoSystem.getPadrinhos();
    const animais = adocaoSystem.getAnimais();
    
    const padrinhoSelect = document.getElementById('padrinho-select');
    const animalSelect = document.getElementById('animal-select');
    
    if (padrinhoSelect) {
        padrinhoSelect.innerHTML = '<option value="">Selecione um padrinho</option>' +
            padrinhos.map(padrinho => 
                `<option value="${padrinho.id}">${padrinho.nome} - ${padrinho.email}</option>`
            ).join('');
        
        padrinhoSelect.addEventListener('change', updatePadrinhoInfo);
    }
    
    if (animalSelect) {
        animalSelect.innerHTML = '<option value="">Selecione um animal</option>' +
            animais.map(animal => 
                `<option value="${animal.id}">${animal.nome} - ${animal.raca} • ${animal.cor} • ${animal.idade} anos</option>`
            ).join('');
        
        animalSelect.addEventListener('change', updateAnimalInfo);
    }
}

function updatePadrinhoInfo() {
    const padrinhoSelect = document.getElementById('padrinho-select');
    const padrinhoInfo = document.getElementById('padrinho-info');
    
    if (!padrinhoSelect || !padrinhoInfo) return;
    
    const padrinhoId = padrinhoSelect.value;
    if (!padrinhoId) {
        padrinhoInfo.innerHTML = '';
        updateConnectionPreview();
        return;
    }
    
    const padrinho = adocaoSystem.getPadrinhos().find(p => p.id === padrinhoId);
    if (padrinho) {
        padrinhoInfo.innerHTML = `
            <div class="selection-info">
                <h4>${padrinho.nome}</h4>
                <div class="selection-details">
                    <p>Idade: ${padrinho.idade} anos</p>
                    <p>Email: ${padrinho.email}</p>
                    <p>Telefone: ${padrinho.telefone}</p>
                </div>
            </div>
        `;
    }
    
    updateConnectionPreview();
}

function updateAnimalInfo() {
    const animalSelect = document.getElementById('animal-select');
    const animalInfo = document.getElementById('animal-info');
    
    if (!animalSelect || !animalInfo) return;
    
    const animalId = animalSelect.value;
    if (!animalId) {
        animalInfo.innerHTML = '';
        updateConnectionPreview();
        return;
    }
    
    const animal = adocaoSystem.getAnimais().find(a => a.id === animalId);
    if (animal) {
        animalInfo.innerHTML = `
            <div class="selection-info">
                <h4>${animal.nome}</h4>
                <div class="animal-badges" style="margin: 0.5rem 0;">
                    <span class="badge badge-secondary">${animal.idade} anos</span>
                    <span class="badge badge-outline">${animal.raca}</span>
                    <span class="badge badge-outline">${animal.cor}</span>
                </div>
                ${animal.fichaSaude ? `<p style="font-size: 0.875rem; color: var(--muted-foreground);">Saúde: ${animal.fichaSaude.substring(0, 100)}...</p>` : ''}
            </div>
        `;
    }
    
    updateConnectionPreview();
}

function updateConnectionPreview() {
    const padrinhoSelect = document.getElementById('padrinho-select');
    const animalSelect = document.getElementById('animal-select');
    const previewContainer = document.getElementById('connection-preview');
    
    if (!padrinhoSelect || !animalSelect || !previewContainer) return;
    
    const padrinhoId = padrinhoSelect.value;
    const animalId = animalSelect.value;
    
    if (!padrinhoId || !animalId) {
        previewContainer.style.display = 'none';
        return;
    }
    
    const padrinho = adocaoSystem.getPadrinhos().find(p => p.id === padrinhoId);
    const animal = adocaoSystem.getAnimais().find(a => a.id === animalId);
    
    if (padrinho && animal) {
        previewContainer.innerHTML = `
            <div class="connection-display">
                <div class="connection-item">
                    <div class="connection-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <p class="connection-name">${padrinho.nome}</p>
                </div>
                
                <div class="connection-arrows">
                    <i class="fas fa-arrow-right"></i>
                    <i class="fas fa-heart"></i>
                    <i class="fas fa-arrow-right"></i>
                </div>
                
                <div class="connection-item">
                    <div class="connection-icon">
                        <i class="fas fa-dog"></i>
                    </div>
                    <p class="connection-name">${animal.nome}</p>
                </div>
            </div>
        `;
        previewContainer.style.display = 'block';
    }
}

function initListaApadrinhados() {
    const apadrinhamentos = adocaoSystem.getApadrinhamentos();
    const container = document.getElementById('apadrinhados-container');
    
    if (!container) return;
    
    if (apadrinhamentos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart empty-icon"></i>
                <h3 class="empty-title">Nenhum apadrinhamento realizado</h3>
                <p class="empty-description">Comece realizando o primeiro apadrinhamento e una famílias</p>
                <a href="apadrinhamento.html" class="btn btn-primary">
                    <i class="fas fa-code-branch"></i>
                    Realizar Primeiro Apadrinhamento
                </a>
            </div>
        `;
        return;
    }
    
    const cardsHTML = apadrinhamentos.map(apadrinhamento => `
        <div class="apadrinhado-card">
            <div class="apadrinhado-header">
                <div class="adopted-badge">
                    <i class="fas fa-heart"></i>
                    <span>Adotado!</span>
                </div>
                <h3 class="apadrinhado-name">${apadrinhamento.animal.nome}</h3>
                <div class="adoption-date">
                    <i class="fas fa-calendar"></i>
                    <span>Adotado em ${apadrinhamento.dataAdocao}</span>
                </div>
            </div>
            <div class="apadrinhado-content">
                <div class="info-section">
                    <div class="info-header">
                        <i class="fas fa-dog"></i>
                        Dados do Animal
                    </div>
                    <div class="info-content">
                        <div class="animal-badges">
                            <span class="badge badge-secondary">${apadrinhamento.animal.idade} anos</span>
                            <span class="badge badge-outline">${apadrinhamento.animal.raca}</span>
                            <span class="badge badge-outline">${apadrinhamento.animal.cor}</span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <div class="info-header">
                        <i class="fas fa-user"></i>
                        Padrinho Responsável
                    </div>
                    <div class="info-content">
                        <p class="padrinho-name">${apadrinhamento.padrinho.nome}</p>
                        <div class="contact-details">
                            <a href="mailto:${apadrinhamento.padrinho.email}" class="contact-link">
                                <i class="fas fa-envelope"></i>
                                ${apadrinhamento.padrinho.email}
                            </a>
                            <a href="tel:${apadrinhamento.padrinho.telefone}" class="contact-link">
                                <i class="fas fa-phone"></i>
                                ${apadrinhamento.padrinho.telefone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    const tableHTML = `
        <div style="border-top: 1px solid var(--border); padding-top: 1.5rem; margin-top: 2rem;">
            <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">Histórico Detalhado</h3>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Padrinho</th>
                            <th>Data da Adoção</th>
                            <th>Contato</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${apadrinhamentos.map(apadrinhamento => `
                            <tr>
                                <td>
                                    <div>
                                        <p style="font-weight: 500;">${apadrinhamento.animal.nome}</p>
                                        <p style="font-size: 0.875rem; color: var(--muted-foreground);">
                                            ${apadrinhamento.animal.raca} • ${apadrinhamento.animal.cor} • ${apadrinhamento.animal.idade} anos
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <p style="font-weight: 500;">${apadrinhamento.padrinho.nome}</p>
                                        <p style="font-size: 0.875rem; color: var(--muted-foreground);">
                                            ${apadrinhamento.padrinho.idade} anos
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <span class="badge badge-success">${apadrinhamento.dataAdocao}</span>
                                </td>
                                <td>
                                    <div class="contact-info">
                                        <a href="mailto:${apadrinhamento.padrinho.email}" class="contact-link">
                                            <i class="fas fa-envelope"></i>
                                            ${apadrinhamento.padrinho.email}
                                        </a>
                                        <a href="tel:${apadrinhamento.padrinho.telefone}" class="contact-link">
                                            <i class="fas fa-phone"></i>
                                            ${apadrinhamento.padrinho.telefone}
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = `
        <div class="apadrinhados-grid">${cardsHTML}</div>
        ${tableHTML}
    `;
}