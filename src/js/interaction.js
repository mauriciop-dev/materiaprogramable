/**
 * Interaction Module - Handles community features, sharing, and article Q&A
 */

class InteractionModule {
  constructor() {
    this.articleText = '';
    this.init();
  }

  init() {
    // Extract article content for Q&A context
    this.extractArticleContent();
    
    // Initialize UI components
    this.initActionBar();
    this.initCommunityForm();
    this.initShareButton();
    this.initAskArticle();
  }

  extractArticleContent() {
    // Get article text from the page
    const articleElement = document.querySelector('article');
    if (articleElement) {
      // Get text content, excluding scripts and styles
      this.articleText = articleElement.innerText || articleElement.textContent || '';
    }
  }

  initActionBar() {
    // Create action bar container if it doesn't exist
    let actionBar = document.querySelector('.action-bar');
    if (!actionBar) {
      actionBar = document.createElement('div');
      actionBar.className = 'action-bar';
      actionBar.innerHTML = `
        <button id="insightBtn" class="btn insight-btn">Insight (Enfoque Técnico)</button>
        <button id="shareBtn" class="btn share-btn">Share (Compartir)</button>
      `;
      
      // Insert after article content
      const article = document.querySelector('article');
      if (article) {
        article.appendChild(actionBar);
      }
    }

    // Add event listeners
    document.getElementById('insightBtn')?.addEventListener('click', () => this.showInsight());
    document.getElementById('shareBtn')?.addEventListener('click', () => this.shareArticle());
  }

  initCommunityForm() {
    // Create community form if it doesn't exist
    let communityForm = document.querySelector('.community-form');
    if (!communityForm) {
      communityForm = document.createElement('div');
      communityForm.className = 'community-form';
      communityForm.innerHTML = `
        <h3>Únete a nuestra comunidad de Materia Programable</h3>
        <form id="communityRegisterForm">
          <div class="form-group">
            <label for="communityName">Nombre:</label>
            <input type="text" id="communityName" name="name" required>
          </div>
          <div class="form-group">
            <label for="communityEmail">Email:</label>
            <input type="email" id="communityEmail" name="email" required>
          </div>
          <div class="form-group">
            <label for="communityInterest">Área de interés:</label>
            <select id="communityInterest" name="interest" required>
              <option value="">Seleccione una opción</option>
              <option value="nanotecnologia">Nanotecnología</option>
              <option value="autoensamblaje">Autoensamblaje y 4D</option>
              <option value="inteligencia-enjambre">Inteligencia de Enjambre</option>
              <option value="aplicaciones">Aplicaciones Industriales</option>
              <option value="teoria">Teoría y Fundamentos</option>
            </select>
          </div>
          <button type="submit" class="btn register-btn">Registrarse</button>
          <div id="formMessage"></div>
        </form>
      `;
      
      // Insert at the end of article
      const article = document.querySelector('article');
      if (article) {
        article.appendChild(communityForm);
      }

      // Form submission handler
      document.getElementById('communityRegisterForm')?.addEventListener('submit', (e) => this.handleCommunityRegistration(e));
    }
  }

  initShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareArticle());
    }
  }

  initAskArticle() {
    // Create Ask Article modal if it doesn't exist
    let askModal = document.querySelector('#askArticleModal');
    if (!askModal) {
      askModal = document.createElement('div');
      askModal.id = 'askArticleModal';
      askModal.className = 'modal';
      askModal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2>Pregúntale al Artículo</h2>
          <div id="chatContainer">
            <div id="chatMessages"></div>
            <form id="chatForm">
              <input type="text" id="chatInput" placeholder="Haz una pregunta sobre el artículo..." required>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      `;
      
      document.body.appendChild(askModal);

      // Modal functionality
      const modal = askModal;
      const closeBtn = modal.querySelector('.close-modal');
      const chatForm = modal.querySelector('#chatForm');
      const chatInput = modal.querySelector('#chatInput');
      const chatMessages = modal.querySelector('#chatMessages');

      // Open modal when insight button is clicked (alternative approach)
      document.getElementById('insightBtn')?.addEventListener('click', () => {
        modal.style.display = 'block';
        chatInput.focus();
      });

      // Close modal
      closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      // Close when clicking outside
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });

      // Handle chat submission
      chatForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const question = chatInput.value.trim();
        if (question) {
          this.addMessage(question, 'user');
          chatInput.value = '';
          
          // Simulate thinking
          setTimeout(() => {
            const answer = this.generateAnswer(question);
            this.addMessage(answer, 'assistant');
          }, 500);
        }
      });
    }
  }

  showInsight() {
    // Alternative: Show technical insight in a toast or inline
    alert(`Insight Técnico: Este artículo describe la Claytrónica y los Catoms como "píxeles físicos" que pueden formar estructuras 3D mediante fuerzas electrostáticas/magnéticas, basándose en inteligencia de enjambre para comportamientos emergentes como autorreparación.`);
  }

  async shareArticle() {
    const article = document.querySelector('article');
    const title = article?.querySelector('h1')?.textContent || 'Materia Programable: La materia como software';
    const text = `Descubre cómo la materia programable transforma el hardware en algo tan flexible como el software. #MateriaProgramable #Nanotecnología`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error('Error sharing:', err);
        this.fallbackShare(title, text, url);
      }
    } else {
      this.fallbackShare(title, text, url);
    }
  }

  fallbackShare(title, text, url) {
    // Fallback to clipboard sharing
    navigator.clipboard.writeText(`${title}\n${text}\n${url}`).then(() => {
      alert('Enlace copiado al portapapeles. Compártelo donde desees.');
    }).catch(() => {
      prompt('Copia este enlace para compartir:', `${title}\n${text}\n${url}`);
    });
  }

  handleCommunityRegistration(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Here we would normally send to Supabase
    // For now, we'll simulate and show success message
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `
      <div class="success-message">
        ¡Gracias por unirte a nuestra comunidad! Hemos recibido tu registro.
        <br>
        Nombre: ${data.name}
        <br>
        Email: ${data.email}
        <br>
        Interés: ${data.interest}
      </div>
    `;
    messageDiv.style.display = 'block';
    
    // Reset form
    form.reset();
    
    // In a real implementation, we would send this to Supabase:
    // fetch('/api/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  }

  addMessage(message, sender) {
    const chatMessages = document.querySelector('#chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  generateAnswer(question) {
    // Simple rule-based answers based on article content
    const lowerQuestion = question.toLowerCase();
    const lowerText = this.articleText.toLowerCase();
    
    if (lowerQuestion.includes('claytronia') || lowerQuestion.includes('catom')) {
      if (lowerText.includes('claytronia') && lowerText.includes('catom')) {
        return "Los Catoms son átomos de claytrónica, micro-robots modulares que actúan como 'píxeles físicos'. Pueden unirse mediante fuerzas electrostáticas o magnéticas para formar objetos 3D con piel sensible al tacto y capacidad de transmitir información.";
      }
    }
    
    if (lowerQuestion.includes('inteligencia de enjambre') || lowerQuestion.includes('swarm')) {
      if (lowerText.includes('inteligencia de enjambre')) {
        return "La materia programable se basa en la inteligencia de enjambre y sistemas distribuidos. Cada unidad mínima tiene capacidad de cómputo propia, pero el comportamiento del objeto final emerge de la cooperación masiva, permitiendo autorreparación cuando componentes fallan.";
      }
    }
    
    if (lowerQuestion.includes('actualizar') || lowerQuestion.includes('software')) {
      if (lowerText.includes('actualizar') && lowerText.includes('software')) {
        return "La materia programable transforma el hardware en algo tan flexible y actualizable como el software. En lugar de fabricar objetos estáticos, los 'compilamos' a partir de unidades inteligentes que pueden reconfigurarse mediante algoritmos.";
      }
    }
    
    if (lowerQuestion.includes('desperdicio') || lowerQuestion.includes('obsolescencia') || lowerQuestion.includes('reciclaje')) {
      if (lowerText.includes('desperdicio') && lowerText.includes('obsolescencia')) {
        return "Esta tecnología acabará con la obsolescencia física: cuando un objeto ya no es necesario, sus componentes reciben nuevas instrucciones para reorganizarse en algo diferente, desplazando el valor del material hacia el diseño y código que lo gobierna.";
      }
    }
    
    if (lowerQuestion.includes('mit') || lowerQuestion.includes('carnegie mellon')) {
      if (lowerText.includes('mit') && lowerText.includes('carnegie mellon')) {
        return "Los pioneros en esta campo son el proyecto Claytrónica de la Universidad Carnegie Mellon y el Laboratorio de Autoensamblaje del MIT, quienes han desarrollado la teoría y experimentos fundamentales.";
      }
    }
    
    // Default answer
    return "Basándome en el artículo sobre materia programable, puedo decirte que se trata de sistemas que pueden cambiar sus propiedades físicas (forma, densidad, color, conductividad) mediante algoritmos, usando unidades inteligentes llamadas Catoms que trabajan en colaboración como un enjambre para crear objetos reconfigurables con capacidades de autorreparación.";
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.interactionModule = new InteractionModule();
});

// Export for use in other modules
export { InteractionModule };