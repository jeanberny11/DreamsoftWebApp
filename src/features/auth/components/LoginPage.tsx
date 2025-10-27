import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { AuthLayout } from './AuthLayout';
import { loginSchema, type LoginFormData } from '../utils/validation.schemas';
import { useAuthStore } from '../stores/auth.store';

// ========================================
// LOGIN PAGE COMPONENT
// ========================================

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toastRef = useRef<Toast>(null);
  // Get auth store state and actions
  const { login, isLoading, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      userName: '',
      password: '',
      rememberMe: false,
    },
  });

  // Watch form values
  const rememberMe = watch('rememberMe');
  const password = watch('password');

  // ========================================
  // FORM SUBMIT HANDLER
  // ========================================
  const onSubmit = async (data: LoginFormData) => {
    try {
      // Clear any previous errors
      clearError();

      // Call auth store login
      await login(data);

      // Show success message
      toastRef.current?.show({
        severity: 'success',
        summary: 'Login Successful',
        detail: 'Welcome back!',
        life: 3000,
      });

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      toastRef.current?.show({
        severity: 'error',
        summary: 'Login Failed',
        detail: error.message || 'Invalid email or password',
        life: 5000,
      });
    }
  };

  // ========================================
  // SOCIAL LOGIN HANDLERS
  // ========================================
  const handleGoogleLogin = () => {
    toastRef.current?.show({
      severity: 'info',
      summary: 'Google Login',
      detail: 'Google OAuth integration coming soon...',
      life: 3000,
    });
  };

  const handleFacebookLogin = () => {
    toastRef.current?.show({
      severity: 'info',
      summary: 'Facebook Login',
      detail: 'Facebook OAuth integration coming soon...',
      life: 3000,
    });
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <AuthLayout title="Bienvenido" subtitle="Inicia session en tu cuenta para continuar">
      <Toast ref={toastRef} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ========================================
            EMAIL FIELD
            ======================================== */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electronico
          </label>
          <InputText
            id="email"
            type="email"
            placeholder="Digita tu correo electronico"
            className={`w-full ${errors.email ? 'p-invalid' : ''}`}
            {...register('email')}
            disabled={isLoading}
          />
          {errors.email && (
            <small className="text-red-500 mt-1 block">{errors.email.message}</small>
          )}
        </div>

        {/* ========================================
            USERNAME FIELD
            ======================================== */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de Usuario
          </label>
          <InputText
            id="username"
            type="text"
            placeholder="Digita tu nombre de usuario"
            className={`w-full ${errors.userName ? 'p-invalid' : ''}`}
            {...register('userName')}
            disabled={isLoading}
          />
          {errors.userName && (
            <small className="text-red-500 mt-1 block">{errors.userName.message}</small>
          )}
        </div>

        {/* ========================================
            PASSWORD FIELD
            ======================================== */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contrasena
          </label>
          <Password
            id="password"
            placeholder="Digita tu contrasena"
            toggleMask
            feedback={false}
            className={`w-full ${errors.password ? 'p-invalid' : ''}`}
            inputClassName="w-full"
            value={password}
            onChange={(e) => setValue('password', e.target.value, { shouldValidate: true })}
            disabled={isLoading}
          />
          {errors.password && (
            <small className="text-red-500 mt-1 block">{errors.password.message}</small>
          )}
        </div>

        {/* ========================================
            REMEMBER ME & FORGOT PASSWORD
            ======================================== */}
        <div className="flex items-center justify-between">
          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <Checkbox
              inputId="rememberMe"
              checked={rememberMe || false}
              onChange={(e) => setValue('rememberMe', e.checked ?? false)}
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
              Recordar Usuario
            </label>
          </div>

          {/* Forgot Password Link */}
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Olvidate tu contrasena?
          </Link>
        </div>

        {/* ========================================
            SUBMIT BUTTON
            ======================================== */}
        <Button
          type="submit"
          label={isLoading ? 'Iniciando Session...' : 'Iniciar Session'}
          icon={isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        />

        {/* ========================================
            DIVIDER
            ======================================== */}
        <Divider align="center">
          <span className="text-gray-500 text-sm">O Iniciar Session Con</span>
        </Divider>

        {/* ========================================
            SOCIAL LOGIN BUTTONS
            ======================================== */}
        <div className="grid grid-cols-2 gap-4">
          {/* Google Button */}
          <Button
            type="button"
            label="Google"
            icon="pi pi-google"
            className="w-full p-button-outlined"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          />

          {/* Facebook Button */}
          <Button
            type="button"
            label="Facebook"
            icon="pi pi-facebook"
            className="w-full p-button-outlined"
            onClick={handleFacebookLogin}
            disabled={isLoading}
          />
        </div>

        {/* ========================================
            REGISTER LINK
            ======================================== */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;