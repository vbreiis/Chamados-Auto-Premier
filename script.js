document.getElementById('ticketForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const issue = document.getElementById('issue').value;



    const responseMessage = document.getElementById('responseMessage');
    responseMessage.classList.remove('hidden');
    responseMessage.innerHTML = `Seu ticket foi enviado! Você pode fechar a aba.<br>Nome: ${name}, E-mail: ${email}, Descrição: ${issue}`;

    document.getElementById('ticketForm').reset();

    setTimeout(function() {
        document.getElementById('ticketForm').style.display = 'none';
    }, 1000);
});
