const form = document.getElementById("formAluno");
const divAlunos = document.getElementById("alunos");

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.className = `notification ${isError ? 'error' : ''}`;
  notification.innerHTML = `
    <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  // Remove a notificação após a animação
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const aluno = {
      nome: form.nome.value,
      email: form.email.value,
      data_nascimento: form.data_nascimento.value,
      cpf: form.cpf.value
    };
    
    const response = await fetch("http://localhost:5000/cadastrar_aluno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aluno),
    });
    
    if (response.ok) {
      showNotification("Aluno cadastrado com sucesso!");
      form.reset();
      setTimeout(() => {
        carregarAlunos();
      }, 500);
    } else {
      throw new Error('Erro ao cadastrar aluno');
    }
  } catch (error) {
    showNotification("Erro ao cadastrar aluno", true);
    console.error(error);
  }
});

async function carregarAlunos() {
  const res = await fetch("http://localhost:5000/buscar_alunos");
  const alunos = await res.json();
  divAlunos.innerHTML = alunos.map(a => `
    <div class="card">
      <strong>ID: ${a.id}</strong><br>
      <strong>${a.nome}</strong><br>
      Email: ${a.email}<br>
      Nascimento: ${(a.data_nascimento)}<br>
      CPF: ${a.cpf}<br>
    </div>
  `).join("");
}

async function buscarAlunoPorCpf() {
  const cpf = document.getElementById("buscarCpf").value;
  if (!cpf) return alert("Informe um CPF");

  const res = await fetch(`http://localhost:5000/buscar_aluno/${cpf}`);
  const resultadoDiv = document.getElementById("resultadoBusca");

  if (res.status === 404) {
    resultadoDiv.innerHTML = `<p style="color: red;">Aluno não encontrado.</p>`;
    return;
  }

  const aluno = await res.json();
  resultadoDiv.innerHTML = `
    <div class="card">
      <strong>${aluno.nome}</strong><br>
      CPF: ${aluno.cpf}<br>
      Email: ${aluno.email}<br>
      Nascimento: ${formatarData(aluno.data_nascimento)}<br>
      <button onclick="deletarAluno('${aluno.cpf}')"><i class="fas fa-trash-alt"></i> Excluir Aluno</button>
    </div>
  `;
}

async function deletarAluno(cpf) {
  try {
    const response = await fetch(`http://localhost:5000/deletar_aluno/${cpf}`, {
      method: "DELETE"
    });
    
    if (response.ok) {
      showNotification("Aluno excluído com sucesso!");
      setTimeout(() => {
        carregarAlunos();
        // Limpa o resultado da busca se estiver visível
        document.getElementById("resultadoBusca").innerHTML = "";
      }, 500);
    } else {
      throw new Error('Erro ao excluir aluno');
    }
  } catch (error) {
    showNotification("Erro ao excluir aluno", true);
    console.error(error);
  }
}

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [dia, mes, ano] = dataISO.split("/");
  return `${dia}/${mes}/${ano}`;
}

window.onload = carregarAlunos;