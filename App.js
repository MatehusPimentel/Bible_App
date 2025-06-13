// Importação de dependências do React e React Native
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação de telas/componentes personalizados
import BibleScreen from './biblescrenn';
import PlanScreen from './planscreen';
import FavoritesScreen from './favorite';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './loginScreen';
import { styles } from './styles';
import { BOOKS_WITH_CHAPTERS, BOOKS, DAYS } from './constants';

// Mapeamento de tamanhos de fonte para valores numéricos
const fontSizeMap = { pequena: 15, média: 19, grande: 23 };

// Componente principal do aplicativo
export default function App() {
  // ---------- ESTADOS PRINCIPAIS ----------
  const [dark, setDark] = useState(false); // Estado para modo escuro/claro
  const [currentTab, setCurrentTab] = useState('bible'); // Aba selecionada
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [fontSize, setFontSize] = useState('média'); // Tamanho da fonte

  // ---------- CARREGAMENTO DAS PREFERÊNCIAS ----------
  // Função para carregar preferências do AsyncStorage
  const loadPreferences = useCallback(async () => {
    try {
      const preferences = await AsyncStorage.getItem('preferences');
      if (preferences) {
        const { darkMode, lastTab } = JSON.parse(preferences);
        setDark(!!darkMode);
        if (lastTab) setCurrentTab(lastTab);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar preferências.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para salvar preferências no AsyncStorage
  const savePreferences = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        'preferences',
        JSON.stringify({
          darkMode: dark,
          lastTab: currentTab,
        })
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar preferências.');
    }
  }, [dark, currentTab]);

  // Carrega as preferências ao montar o componente
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Salva as preferências toda vez que dark ou currentTab mudarem (após carregamento inicial)
  useEffect(() => {
    if (!loading) {
      savePreferences();
    }
  }, [dark, currentTab, savePreferences, loading]);

  // Carrega o tamanho da fonte armazenado ao montar o componente
  useEffect(() => {
    AsyncStorage.getItem('fontSize').then((value) => {
      if (value) {
        setFontSize(value);
      }
    });
  }, []);

  // Função para alterar e salvar o tamanho da fonte
  const setAndSaveFontSize = (size) => {
    setFontSize(size);
    AsyncStorage.setItem('fontSize', size);
  };

  // ---------- TEMA E CORES ----------
  // Objeto que define as cores do tema atual
  const theme = {
    bg: dark ? '#0D0D0D' : '#FAFAFA', // Fundo principal
    text: dark ? '#F5F5F5' : '#333333', // Texto
    card: dark ? '#1A1A1A' : '#FFFFFF', // Cartões/elementos de fundo
    border: dark ? '#2C2C2C' : '#E0E0E0', // Bordas
    primary: '#34D399', // Cor principal (destaque)
  };

  // Função para alternar entre temas claro e escuro
  const changeTheme = (isDark) => {
    setDark(isDark);
  };

  // ---------- CONFIGURAÇÃO DAS ABAS ----------
  // Definição das abas de navegação inferior
  const tabs = [
    { key: 'bible', label: '📖' },
    { key: 'planner', label: '📅' },
    { key: 'favorites', label: '⭐' },
    { key: 'settings', label: '⚙️' },
  ];

  // ---------- RENDERIZAÇÃO ----------
  // Exibe indicador de carregamento enquanto as preferências são carregadas
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.bg,
        }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 10 }}>
          Carregando preferências...
        </Text>
      </SafeAreaView>
    );
  }

  // Renderização principal do app
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.bg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      {/* Tela de login */}
      {currentTab === 'login' ? (
        <LoginScreen
          onBack={() => setCurrentTab('settings')}
          theme={theme}
          dark={dark}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            {/* Título principal */}
            <Text style={[styles.title, { color: theme.text }]}>
              📖 Vida com Propósito
            </Text>

            {/* Renderização condicional das telas conforme a aba selecionada */}
            {currentTab === 'bible' && (
              <BibleScreen
                theme={theme}
                dark={dark}
                fontSize={fontSize}
                fontSizeMap={fontSizeMap}
              />
            )}
            {currentTab === 'planner' && (
              <PlanScreen
                theme={theme}
                dark={dark}
                fontSize={fontSize}
                fontSizeMap={fontSizeMap}
              />
            )}
            {currentTab === 'favorites' && (
              <FavoritesScreen theme={theme} dark={dark} />
            )}
            {currentTab === 'settings' && (
              <SettingsScreen
                theme={theme}
                dark={dark}
                onThemeChange={changeTheme}
                fontSize={fontSize}
                setAndSaveFontSize={setAndSaveFontSize}
                fontSizeMap={fontSizeMap}
                setCurrentTab={setCurrentTab}
              />
            )}
          </ScrollView>

          {/* Barra de navegação inferior */}
          <View
            style={[
              styles.navbar,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setCurrentTab(tab.key)}
                style={styles.navButton}>
                <Text
                  style={{
                    color: currentTab === tab.key ? theme.primary : '#888',
                  }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}