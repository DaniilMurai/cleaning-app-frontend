import Typography from "@/ui/Typography";
import { View } from "react-native";
import Input from "@/ui/Input";
import { Button } from "@/ui";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import { LoginData } from "@/api/auth";

export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: loginFn } = useAuth();

        const handleSubmit = async () => {
            const loginData: LoginData = {
                nickname: login,
                password: password
            };

            try {
                setError('');
                await loginFn(loginData);
            } catch (err) {
                setError('Неверный логин или пароль');
                console.error('Login error:', err);
            }
        }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            gap: 16, // Добавим отступы между элементами
        }}>
            <Typography variant="h5">Вход в систему</Typography>

            <Input
                placeholder="Введите login"
                variant="outlined"
                color="primary"
                size="medium"
                value={login}
                onChangeText={setLogin}
                error={error}
            />

            <Input
                placeholder="Введите password"
                variant="outlined"
                color="primary"
                size="medium"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true} // Скрываем пароль
                error={error}
            />

            <Button
                variant="contained"
                onPress={handleSubmit}
                disabled={!login || !password} // Кнопка неактивна если поля пустые
            >
                Войти
            </Button>
        </View>
    );
}