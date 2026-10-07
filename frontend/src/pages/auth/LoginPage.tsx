import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/FormError'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/features/auth/auth-context'
import { loginSchema, type LoginFormData } from '@/schemas/auth'

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setFormError(null)

    try {
      await signIn(data)
      const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error, { 401: 'E-mail ou senha incorretos.' }))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-extrabold font-expanded">Que bom ter você de volta.</h1>
        <p className="text-body text-muted">Entre para ver as academias perto de você.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <FormError message={formError} />
        <Input
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Entrar
        </Button>
      </form>

      <p className="text-center text-label text-muted">
        Ainda não possui conta?{' '}
        <Link to="/register" className="font-semibold text-primary-ink underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
