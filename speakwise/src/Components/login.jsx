import { useState } from 'react'

const getApiUrl = () => import.meta.env.VITE_BACKEND_API?.replace(/\/+$/, '') || 'http://localhost:9998'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(`${getApiUrl()}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in.')
      }

      if (!data.user) {
        throw new Error('Login succeeded, but no user session was returned.')
      }

      onLogin(data.user)
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.message || 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_15%_15%,#f1efff_0,transparent_34%),radial-gradient(circle_at_85%_85%,#f8f3ff_0,transparent_32%),#fff] p-6 font-['DM_Sans',sans-serif] text-[#202033]">
      <section className="w-full max-w-[430px] rounded-[20px] border border-[#ececf3] bg-white px-6 py-8 shadow-[0_20px_60px_#403c7114] sm:px-11 sm:py-[42px]" aria-labelledby="login-title">
        <div className="mb-[38px] flex items-center gap-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-[21px] font-extrabold tracking-[-0.7px] sm:mb-12">
          <span className="grid size-8 place-items-center rounded-[10px] bg-[linear-gradient(135deg,#8e84f4,#6154d4)] text-lg text-white" aria-hidden="true">✦</span>
          <span>Speak<span className="text-[#7265e8]">Wise</span></span>
        </div>
        <div className="mb-[27px]">
          <p className="mb-2 text-[10px] font-bold tracking-[1.2px] text-[#7265e8]">WELCOME BACK</p>
<h2
  id="login-title"
  className="!text-black mb-2 font-['Plus_Jakarta_Sans',sans-serif] text-[20px] font-bold tracking-[-0.6px]"
>
  Sign in to SpeakWise
</h2>         <p className="text-[13px] text-[#89899c]">Continue your conversation practice.</p>
        </div>

        <form className="grid gap-[9px]" onSubmit={handleSubmit}>
          <label className="text-xs font-semibold text-[#555466]" htmlFor="email">Email address</label>
          <input
            className="w-full rounded-[9px] border border-[#dedeea] px-[13px] py-3 text-[13px] text-[#202033] outline-none transition focus:border-[#9c95ed] focus:ring-4 focus:ring-[#7265e814]"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <div className="mt-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-[#555466]" htmlFor="password">Password</label>
            <a className="text-[11px] text-[#7265e8] hover:underline" href="#forgot-password">Forgot password?</a>
          </div>
          <input
            className="w-full rounded-[9px] border border-[#dedeea] px-[13px] py-3 text-[13px] text-[#202033] outline-none transition focus:border-[#9c95ed] focus:ring-4 focus:ring-[#7265e814]"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="mt-1 text-xs text-[#c25563]" role="alert">{error}</p>}
          <button className="mt-3 rounded-[9px] border-0 bg-[#7265e8] px-3 py-3 text-[13px] font-semibold text-white shadow-[0_7px_15px_#7265e834] transition hover:bg-[#6255d5] disabled:cursor-wait disabled:opacity-70" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-[26px] text-center text-xs text-[#89899c]">
          New to SpeakWise? <a className="text-[#7265e8] hover:underline" href="#create-account">Create an account</a>
        </p>
      </section>
    </main>
  )
}

export default Login