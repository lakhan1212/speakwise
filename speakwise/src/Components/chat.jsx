import { useCallback, useEffect, useState } from 'react'
const defaultConversationId = 'd3ac57a8-2037-4e74-b88b-ae8ac1bc84ac'
 const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi there! I’m SpeakWise, your AI conversation partner. What would you like to practice today?',
    time: 'NOW',
  },
]

 

function Icon({ name, size = 20 }) {
  const paths = {
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    send: <><path d="m21 3-7.2 18-3.8-7-7-3.8L21 3Z" /><path d="M10 14 21 3" /></>,
    sparkles: <><path d="m12 3-1.3 4.7L6 9l4.7 1.3L12 15l1.3-4.7L18 9l-4.7-1.3L12 3ZM19 15l-.7 2.3L16 18l2.3.7L19 21l.7-2.3L22 18l-2.3-.7L19 15ZM5 15l-.5 1.5L3 17l1.5.5L5 19l.5-1.5L7 17l-1.5-.5L5 15Z" /></>,
    mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.8-.9L4 20l1.9-3.8A7.3 7.3 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5a7.5 7.5 0 0 1 8 7Z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Chat(user_Id) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(defaultConversationId)

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return

    try {
      setLoading(true)
      setError('')

      const api = import.meta.env.VITE_BACKEND_API?.replace(/\/+$/, '')
      const response = await fetch(`${api}/msg?id=${encodeURIComponent(conversationId)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setMessages(
        (Array.isArray(data) ? data : []).map((message) => ({
          id: message.id,
          role: message.role,
          text: message.content,
          time: message.created_at
            ? new Date(message.created_at).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })
            : 'Now',
        })),
      )
    } catch (requestError) {
      console.error(requestError)
      setError('Unable to load messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const getConversation = async () => {
      try {
        setLoading(true)
        setError('')

        const api = import.meta.env.VITE_BACKEND_API?.replace(/\/+$/, '')
        const response = await fetch(`${api}/con?user_id=${user_Id.user_id.id}`)
        console.log(user_Id.user_id.id);
        
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Request failed')
        }

        const conversationList = Array.isArray(data) ? data : []
        setConversations(conversationList)
        if (conversationList.length > 0) {
          setActiveConversationId(conversationList[0].id)
          await loadMessages(conversationList[0].id)
        }
      } catch (requestError) {
        console.error(requestError)
        setError('Unable to load conversations. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    getConversation()
  }, [loadMessages])

  
const sendMessage = async (event) => {
  event?.preventDefault();

  const text = draft.trim();
  if (!text || loading) return;

  const api = import.meta.env.VITE_BACKEND_API?.replace(/\/+$/, "");
  const userMessageId = Date.now();
  const assistantMessageId = userMessageId + 1;

  setMessages((current) => [
    ...current,
    {
      id: userMessageId,
      role: "user",
      text,
      time: "Now",
    },
    {
      id: assistantMessageId,
      role: "assistant",
      text: "",
      time: "Now",
    },
  ]);

  setDraft("");
  setError("");
  setLoading(true);

  try {
    const response = await fetch(`${api}/llm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: activeConversationId,
        message: text,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Request failed");
    }

    if (!response.body) {
      throw new Error("Streaming is not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, {
        stream: true,
      });

      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? { ...message, text: message.text + chunk }
            : message
        )
      );
    }

    const remaining = decoder.decode();

    if (remaining) {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? { ...message, text: message.text + remaining }
            : message
        )
      );
    }
  } catch (requestError) {
    console.error(requestError);
    setError(requestError.message || "Unable to reach SpeakWise.");
  } finally {
    setLoading(false);
  }
};


  const handleSuggestion = (suggestion) => setDraft(suggestion)
 
  return (
    <main className="chat-app">
      <aside className={`chat-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Icon name="sparkles" size={19} /></div>
          <span>Speak<span>Wise</span></span>
        </div>
        <button className="new-chat-button" type="button" onClick={() => setMessages(initialMessages)}>
          <Icon name="plus" size={18} /> New conversation
        </button>
        <p className="sidebar-label">Recent conversations</p>
        <nav className="conversation-list" aria-label="Recent conversations">
          {conversations.map((conversation) => (
            <button
              className={`conversation ${activeConversationId === conversation.id ? 'active' : ''}`}
              type="button"
              key={conversation.id}
              onClick={() => {
                setActiveConversationId(conversation.id)
                loadMessages(conversation.id)
              }}
            >
              <span className="conversation-icon">
                <Icon name="message" size={16} />
              </span>

              <span className="conversation-copy">
                <strong>{conversation.title || 'Untitled conversation'}</strong>
                <small>{conversation.latest_interaction_id ? `Interaction #${conversation.latest_interaction_id}` : 'No messages yet'}</small>
              </span>

              <time>
                {conversation.updated_at
                  ? new Date(conversation.updated_at).toLocaleDateString()
                  : '—'}
              </time>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">LS</div>
          <div><strong>Lakhan</strong><small>Free plan</small></div>
          <button className="more-button" type="button" aria-label="Account options">•••</button>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <button className="mobile-menu" type="button" aria-label="Open conversations" onClick={() => setSidebarOpen(!sidebarOpen)}><Icon name="menu" /></button>
          <div>
            <h1>{conversations.find((conversation) => conversation.id === activeConversationId)?.title || 'Conversation'}</h1>
            <p><span className="online-dot" /> AI conversation practice</p>
          </div>
          <button className="header-action" type="button"><span>•••</span></button>
        </header>

        <div className="message-area">
          <div className="date-divider"><span>Today</span></div>
          {messages.map((message) => (
            <article className={`message-row ${message.role}`} key={message.id}>
              {message.role === 'assistant' && <div className="assistant-avatar"><Icon name="sparkles" size={16} /></div>}
              <div className="message-content">
                <div className="message-meta"><strong>{message.role === 'assistant' ? 'SpeakWise' : 'You'}</strong><time>{message.time}</time></div>
                <div className="message-bubble">{message.text}</div>
              </div>
            </article>
          ))}
          {loading && <div className="loading-message">SpeakWise is typing...</div>}
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="suggestions">
            <span>Try asking</span>
            {['What size would you like?', 'Can I get that to go?', 'Help me with pronunciation'].map((suggestion) => (
              <button type="button" key={suggestion} onClick={() => handleSuggestion(suggestion)}>{suggestion}</button>
            ))}
          </div>
        </div>

        <div className="composer-wrap">
          <form className="composer bg-amber-50" onSubmit={sendMessage}>
            <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message SpeakWise..." aria-label="Message SpeakWise" />
            <button className="mic-button" type="button" aria-label="Use microphone"><Icon name="mic" size={19} /></button>
            <button className="send-button" type="submit" aria-label="Send message"><Icon name="send" size={18} /></button>
          </form>
          <p className="composer-note">SpeakWise can make mistakes. Practice is the key to progress.</p>
        </div>
      </section>
    </main>
  )
}

export default Chat
