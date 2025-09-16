import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [nextId, setNextId] = useState(1);

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

      // Agregar el mensaje a la lista local
      const newMessage = {
        id: nextId,
        content: content,
        createdAt: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setNextId((prev) => prev + 1);
      setContent(''); // Limpiar el campo después de enviar
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Función para actualizar un mensaje (PUT)
  const updateMessage = async (messageId, newContent) => {
    try {
      const response = await axios.put(
        `/api/messages/${messageId}`,
        { content: newContent },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'token123',
          },
        }
      );
      console.log('Message updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  };

  // Función para eliminar un mensaje (DELETE)
  const deleteMessage = async (messageId) => {
    try {
      const response = await axios.delete(`/api/messages/${messageId}`, {
        headers: {
          Authorization: 'token123',
        },
      });
      console.log('Message deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const testUpdateMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedMessageId) return;

    setIsSending(true);
    try {
      await updateMessage(selectedMessageId, content);

      // Actualizar el mensaje en la lista local
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === selectedMessageId
            ? {
                ...msg,
                content: content,
                updatedAt: new Date().toLocaleString(),
              }
            : msg
        )
      );
      setContent('');
      setSelectedMessageId(null);
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const testDeleteMessage = async () => {
    if (!selectedMessageId) return;

    try {
      await deleteMessage(selectedMessageId);

      // Eliminar el mensaje de la lista local
      setMessages((prev) => prev.filter((msg) => msg.id !== selectedMessageId));
      setSelectedMessageId(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMessageSelect = (messageId) => {
    if (selectedMessageId === messageId) {
      // Si se hace clic en el mensaje ya seleccionado, deseleccionar
      setSelectedMessageId(null);
      setContent('');
    } else {
      // Seleccionar el mensaje
      setSelectedMessageId(messageId);
      const selectedMessage = messages.find((msg) => msg.id === messageId);
      if (selectedMessage) {
        setContent(selectedMessage.content);
      }
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
            <span className="current-user-name">{currentUser.name}</span>
          </div>
        ) : null}
      </header>

      <main className="main-content single-section">
        <section className="message-section">
          <h2 className="section-title">
            {selectedMessageId
              ? `Editando Mensaje ID: ${selectedMessageId}`
              : 'Nuevo Mensaje'}
          </h2>
          <form className="message-form" onSubmit={onSendClick}>
            <div className="input-group">
              <textarea
                className="message-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  selectedMessageId
                    ? 'Modifica el contenido del mensaje seleccionado...'
                    : 'Escribe tu mensaje aquí...'
                }
                rows="3"
              />
            </div>

            <div className="action-buttons">
              <button
                type="submit"
                className={`action-button send-button ${
                  isSending ? 'sending' : ''
                }`}
                disabled={isSending || !content.trim() || selectedMessageId}
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

              {selectedMessageId && (
                <>
                  <button
                    type="submit"
                    className={`action-button update-button ${
                      isSending ? 'sending' : ''
                    }`}
                    disabled={isSending || !content.trim()}
                    onClick={testUpdateMessage}
                  >
                    {isSending ? (
                      <>
                        <div className="button-spinner"></div>
                        Modificando...
                      </>
                    ) : (
                      <>Modificar</>
                    )}
                  </button>

                  <button
                    type="button"
                    className="action-button delete-button"
                    onClick={testDeleteMessage}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Lista de mensajes */}
          {messages.length > 0 && (
            <div className="messages-list">
              <h3 className="section-title">Mensajes Enviados</h3>
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item ${
                      selectedMessageId === message.id ? 'selected' : ''
                    }`}
                    onClick={() => handleMessageSelect(message.id)}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-meta">
                      <span className="message-id">ID: {message.id}</span>
                      <span className="message-date">
                        {message.updatedAt || message.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {selectedMessageId && (
                <p className="selection-hint">
                  Mensaje seleccionado: ID {selectedMessageId}.
                  <br />
                  <span className="deselect-hint">
                    Haz clic en el mensaje nuevamente para deseleccionar.
                  </span>
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
