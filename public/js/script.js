document.getElementById('reclamacaoForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const companhia = document.getElementById('companhia').value;
    const mensagem = document.getElementById('mensagem').value.trim();
    const arquivo = document.getElementById('arquivo').files[0];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const responseEl = document.getElementById('responseMessage');
    responseEl.textContent = '';
    responseEl.style.color = 'red';

    if (!nome || !email || !companhia || !mensagem) {
        responseEl.textContent = 'Preencha todos os campos obrigatórios.';
        return;
    }

    if (!emailRegex.test(email)) {
        responseEl.textContent = 'E-mail inválido.';
        return;
    }

    if (arquivo) {
        const tiposPermitidos = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!tiposPermitidos.includes(arquivo.type)) {
            responseEl.textContent = 'Formato de arquivo não suportado. Use JPG, PNG ou PDF.';
            return;
        }
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('companhia', companhia);
    formData.append('mensagem', mensagem);
    if (arquivo) formData.append('arquivo', arquivo);

    fetch('http://localhost:3000/api/reclamacoes', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            responseEl.textContent = `Erro: ${data.error}`;
        } else {
            responseEl.textContent = 'Reclamação enviada com sucesso!';
            responseEl.style.color = 'green';
            document.getElementById('reclamacaoForm').reset();
        }
    })
    .catch(() => {
        responseEl.textContent = 'Erro ao enviar a reclamação.';
    });
});