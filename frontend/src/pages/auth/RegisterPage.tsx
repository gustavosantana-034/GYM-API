import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { getErrorMessage, getErrorStatus } from '@/api/errors'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/FormError'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/toast-context'
import { useAuth } from '@/features/auth/auth-context'
import { registerSchema, type RegisterFormData } from '@/schemas/auth'
import { getFirstName } from '@/utils/format'

export function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    setFormError(null)

    try {
      await signUp(data)
      showToast({ tone: 'success', title: `Bem-vindo, ${getFirstName(data.name)}!`, description: 'Sua conta foi criada.' })
      navigate('/', { replace: true })
    } catch (error) {
      if (getErrorStatus(error) === 409) {
        setError('email', { message: 'Este e-mail já está cadastrado. Que tal entrar?' }, { shouldFocus: true })
      } else {
        setFormError(getErrorMessage(error))
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-extrabold font-expanded">Comece sua jornada.</h1>
        <p className="text-body text-muted">Crie sua conta em menos de um minuto.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <FormError message={formError} />
        <Input id="name" label="Nome" autoComplete="name" error={errors.name?.message} {...register('name')} />
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
          autoComplete="new-password"
          hint="Mínimo de 6 caracteres."
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
          Criar minha conta
        </Button>
      </form>

      <p className="text-center text-label text-muted">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-semibold text-primary-ink underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
