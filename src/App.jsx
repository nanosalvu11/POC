import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios
      .get('/api/users')
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
        // Tomar el primer usuario como usuario actual
        if (response.data.length > 0) {
          setCurrentUser(response.data[0]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      });
  }, []);

  const onSendClick = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);
    try {
      const response = await axios.post(
        '/api/messages',
        { content },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token123',
          },
        }
      );
      console.log('Message sent:', response.data);
      setContent(''); // Limpiar el campo después de enviar
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Mock Service Worker</h1>
        {isLoading ? (
          <div className="user-info loading">
            <div className="small-spinner"></div>
            <span>Cargando usuario...</span>
          </div>
        ) : currentUser ? (
          <div className="user-info">
            <div className="current-user-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="current-user-name">
              {currentUser.name}
            </span>
          </div>
        ) : null}
      </header>

      <main className="main-content single-section">
        <section className="message-section">
          <h2 className="section-title">Enviar Mensaje</h2>
          <form className="message-form" onSubmit={onSendClick}>
            <div className="input-group">
              <textarea
                className="message-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                rows="3"
              />
            </div>
            <button
              type="submit"
              className={`send-button ${isSending ? 'sending' : ''}`}
              disabled={isSending || !content.trim()}
            >
              {isSending ? (
                <>
                  <div className="button-spinner"></div>
                  Enviando...
                </>
              ) : (
                <>Enviar</>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
