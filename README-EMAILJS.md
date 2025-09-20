# Configuração do EmailJS para JMV Landing Page

## Funcionalidades Implementadas

✅ **Modal de Orçamento**: Abre ao clicar em "Solicitar Orçamento"
✅ **Scroll Suave**: Botão "Nossos Serviços" rola para a seção de serviços
✅ **Formulários Funcionais**: Tanto orçamento quanto contato enviam emails
✅ **Títulos Diferentes**: Emails de orçamento e contato têm assuntos distintos

## Como Configurar o EmailJS

### 1. Criar Conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email
1. No dashboard, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Configure as credenciais
5. Anote o **Service ID**

### 3. Criar Templates de Email

#### Template para Orçamento:
```
Assunto: Solicitação de Orçamento - JMV Technologies

Nova solicitação de orçamento recebida:

Nome: {{nome}}
Email: {{email}}
Telefone: {{telefone}}
Empresa: {{empresa}}
Serviços: {{servicos}}
Descrição: {{descricao}}
Orçamento Estimado: {{orcamento}}

Data/Hora: {{data_atual}}
```

#### Template para Contato:
```
Assunto: Novo Contato - JMV Technologies

Nova mensagem de contato recebida:

Nome: {{nome}}
Email: {{email}}
Serviço de Interesse: {{servico}}
Mensagem: {{mensagem}}

Data/Hora: {{data_atual}}
```

### 4. Atualizar o Código
No arquivo `index.html`, substitua:

```javascript
// Linha 390
emailjs.init("YOUR_PUBLIC_KEY"); // Substitua pela sua chave pública

// Linha 444
emailjs.send("YOUR_SERVICE_ID", templateId, templateParams)

// Linha 487
enviarEmail("YOUR_TEMPLATE_ID_ORCAMENTO", templateParams, 'orcamento');

// Linha 504
enviarEmail("YOUR_TEMPLATE_ID_CONTATO", templateParams, 'contato');
```

### 5. Onde Encontrar as Chaves

- **Public Key**: Dashboard > Account > API Keys
- **Service ID**: Email Services > Seu serviço configurado
- **Template IDs**: Email Templates > Seus templates criados

### 6. Teste de Funcionamento

1. Abra a página no navegador
2. Clique em "Solicitar Orçamento" - deve abrir o modal
3. Preencha o formulário e envie
4. Clique em "Nossos Serviços" - deve rolar para a seção
5. Preencha o formulário de contato e envie

## Emails de Destino

Ambos os formulários enviam para: **contato@jmvtechnologies.com.br**

- **Orçamento**: Assunto "Solicitação de Orçamento - JMV Technologies"
- **Contato**: Assunto "Novo Contato - JMV Technologies"

## Funcionalidades do Modal

- ✅ Abre ao clicar no botão "Solicitar Orçamento"
- ✅ Fecha com botão X, botão Cancelar, clique fora ou tecla ESC
- ✅ Formulário completo com validação
- ✅ Campos obrigatórios marcados com *
- ✅ Seleção múltipla de serviços
- ✅ Responsivo para mobile

## Suporte

Se tiver dúvidas na configuração, consulte a documentação oficial do EmailJS: https://www.emailjs.com/docs/
