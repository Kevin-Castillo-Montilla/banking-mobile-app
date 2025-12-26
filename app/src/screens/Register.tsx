import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterProps {
  onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigateToLogin }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setMobile('');
    setEmail('');
    setPassword('');
    setConfirm('');
  };

  const validate = (): string | null => {
    if (!firstname.trim()) return 'Nombre es requerido';
    if (!lastname.trim()) return 'Apellido es requerido';
    if (!mobile.trim()) return 'Número móvil es requerido';
    if (!email.trim()) return 'Email es requerido';
    if (!EMAIL_RE.test(email)) return 'Formato de email inválido';
    if (!password) return 'Contraseña es requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (password !== confirm) return 'Las contraseñas no coinciden';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Validación', err);
      return;
    }

    try {
      setLoading(true);

      // REGISTRO EN SUPABASE AUTH
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            first_name: firstname.trim(),
            last_name: lastname.trim(),
            mobile_number: mobile.trim(),
          }
        }
      });

      if (authError) throw authError;
// HASH CONTRASEÑA
 const hashedPassword = await bcrypt.hash(password.trim(), 10);
      // INSERT A LA TABLA (SIN ID → SE AUTOGENERA)
      const nowIso = new Date().toISOString();

      const { error: profileError } = await supabase
        .from('Proyect_app')
        .insert({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          mobile_number: mobile.trim(),
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          status: true,
          created_at: nowIso,
          update_at: nowIso,
          deleted_at: null,
        });

      if (profileError) {
        console.error('Insert error:', profileError);
        Alert.alert('Error guardando datos en la base', profileError.message);
        return;
      }

      Alert.alert('Éxito', '¡Registro exitoso! Revisa tu correo para confirmar.');
      resetForm();
      onNavigateToLogin();
    } catch (e: any) {
      Alert.alert('Error en registro', e?.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Crear Cuenta</Text>

          <View style={styles.row}>
            <View style={[styles.inputWrap, { marginRight: 6 }]}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                value={firstname}
                onChangeText={setFirstname}
                placeholder="Escribe tu nombre"
                autoCapitalize="words"
                style={styles.input}
              />
            </View>

            <View style={[styles.inputWrap, { marginLeft: 6 }]}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                value={lastname}
                onChangeText={setLastname}
                placeholder="Escribe tu apellido"
                autoCapitalize="words"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Número móvil</Text>
            <TextInput
              value={mobile}
              onChangeText={setMobile}
              placeholder="Escribe tu telefono o WhatsApp"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Escribe tu correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Escribe tu contraseña"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirme su contraseña"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
          </TouchableOpacity>

          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={styles.helper}>
              ¿Ya tienes una cuenta?{' '}
              <Text style={styles.link} onPress={onNavigateToLogin}>Inicia sesión</Text>
            </Text>
          </View>

          <Text style={styles.helperSmall}>
            Al registrarte aceptas nuestros términos y política de privacidad.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#fff8f8ff',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  inputWrap: {
    flex: 1,
    marginVertical: 6,
  },
  label: {
    color: '#ffffffff',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: 'white',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#0b1421',
    fontWeight: '700',
    fontSize: 16,
  },
  helper: {
    color: '#cdd1d8ff',
    textAlign: 'center',
  },
  helperSmall: {
    color: '#bcc1c9ff',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
  },
  link: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
});

export default Register;
