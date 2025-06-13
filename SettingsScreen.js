import React, { useState } from 'react';
import { Alert, Linking, Switch, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';

// Componente para ícones simples usando texto
const Icon = ({ name, size = 20, color = '#666' }) => {
  const icons = {
    moon: '🌙',
    sun: '☀️',
    font: '🔤',
    download: '📥',
    trash: '🗑️',
    info: 'ℹ️',
    mail: '📧',
    user: '👤',
    chevron: '>',
    close: '✕'
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {icons[name] || '•'}
    </Text>
  );
};

// Componente para item de configuração
const SettingItem = ({ 
  icon, 
  title, 
  subtitle, 
  rightComponent, 
  onPress, 
  theme, 
  fontSize, 
  fontSizeMap,
  danger = false,
  disabled = false 
}) => (
  <TouchableOpacity
    style={[
      styles.settingsOption,
      { 
        borderBottomColor: theme.border,
        opacity: disabled ? 0.5 : 1,
        paddingVertical: 16
      }
    ]}
    onPress={disabled ? null : onPress}
    disabled={disabled}
    accessibilityRole="button"
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      {icon && (
        <View style={{ marginRight: 12, width: 24, alignItems: 'center' }}>
          <Icon name={icon} color={danger ? '#E53E3E' : theme.text} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={[
          styles.settingsOptionText, 
          { 
            color: danger ? '#E53E3E' : theme.text, 
            fontSize: fontSizeMap[fontSize],
            fontWeight: '500'
          }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[
            { 
              color: theme.textSecondary || (theme.text + '80'), 
              fontSize: fontSizeMap[fontSize] - 2,
              marginTop: 2
            }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
    {rightComponent}
  </TouchableOpacity>
);

// Modal para seleção de tamanho de fonte
const FontSizeModal = ({ visible, onClose, currentSize, onSelect, theme, fontSizeMap }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end'
    }}>
      <View style={[
        styles.card,
        {
          backgroundColor: theme.card,
          margin: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 20
        }
      ]}>
        <View style={[styles.modalHeader, { backgroundColor: 'transparent', padding: 0, marginBottom: 16 }]}>
          <Text style={[styles.modalHeaderText, { color: theme.text, fontSize: 18 }]}>
            Tamanho da Fonte
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" color={theme.text} />
          </TouchableOpacity>
        </View>
        
        {['pequena', 'média', 'grande'].map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.selectionItem,
              {
                backgroundColor: currentSize === size ? theme.primary + '20' : 'transparent',
                borderColor: currentSize === size ? theme.primary : 'transparent',
                borderWidth: currentSize === size ? 1 : 0
              }
            ]}
            onPress={() => {
              onSelect(size);
              onClose();
            }}
          >
            <Text style={{
              color: currentSize === size ? theme.primary : theme.text,
              fontSize: fontSizeMap[size],
              fontWeight: currentSize === size ? '600' : '400'
            }}>
              {size.charAt(0).toUpperCase() + size.slice(1)} - Exemplo de texto
            </Text>
          </TouchableOpacity>
        ))}
        
        <View style={{ height: 20 }} />
      </View>
    </View>
  </Modal>
);

function SettingsScreen({ 
  theme, 
  dark, 
  onThemeChange, 
  fontSize, 
  setAndSaveFontSize, 
  fontSizeMap, 
  setCurrentTab 
}) {
  const [fontModalVisible, setFontModalVisible] = useState(false);

  const clearAllData = async () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja limpar todos os dados do aplicativo? Esta ação não pode ser desfeita e você perderá todos os seus versículos favoritos e configurações.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Tudo', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                'Dados Removidos', 
                'Todos os dados foram removidos com sucesso. O aplicativo será reiniciado.',
                [{ text: 'OK', onPress: () => {/* Aqui você pode reiniciar o app */} }]
              );
            } catch (error) {
              console.error('Erro ao limpar dados:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao tentar limpar os dados. Tente novamente.');
            }
          }
        }
      ]
    );
  };

  const exportData = async () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados serão exportados e você poderá compartilhá-los ou fazer backup.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: async () => {
            try {
              // Mostrar loading/progresso aqui
              Alert.alert(
                'Em Desenvolvimento', 
                'A função de exportação será implementada na próxima atualização. Você receberá uma notificação quando estiver disponível.'
              );
            } catch (error) {
              console.error('Erro ao exportar dados:', error);
              Alert.alert('Erro', 'Não foi possível exportar os dados no momento.');
            }
          }
        }
      ]
    );
  };

  const openAbout = () => {
    Alert.alert(
      'Vida com Propósito', 
      'Versão 0.0.12\n\n📖 Leitura da Bíblia\n📅 Planejamento semanal\n⭐ Versículos favoritos\n\nDesenvolva sua vida espiritual com propósito e organização.',
      [
        { text: 'Avaliar App', onPress: () => {/* Link para loja */} },
        { text: 'Fechar', style: 'cancel' }
      ]
    );
  };

  const contactSupport = () => {
    Alert.alert(
      'Contato e Suporte',
      'Como podemos ajudá-lo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar Email', 
          onPress: () => {
            Linking.openURL('mailto:matheuspsilva91@gmail.com?subject=Suporte%20Vida%20com%20Proposito&body=Descreva%20sua%20dúvida%20ou%20problema:')
              .catch(() => Alert.alert('Erro', 'Não foi possível abrir o aplicativo de email.'));
          }
        }
      ]
    );
  };

  const handleLogin = () => {
    Alert.alert(
      'Fazer Login',
      'Ao fazer login você poderá sincronizar seus dados entre dispositivos e fazer backup na nuvem.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => setCurrentTab('login') }
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.card, marginTop: 10 }]}>
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={[
            styles.subtitle, 
            { 
              color: theme.text, 
              fontSize: fontSizeMap[fontSize] + 4,
              fontWeight: 'bold'
            }
          ]}>
            ⚙️ Configurações
          </Text>
          <Text style={{
            color: theme.textSecondary || (theme.text + '80'),
            fontSize: fontSizeMap[fontSize] - 2,
            marginTop: 2
          }}>
            Personalize sua experiência
          </Text>
        </View>
        
        {/* Seção Aparência */}
        <Text style={[
          styles.sectionHeader, 
          { 
            color: theme.primary, 
            fontSize: fontSizeMap[fontSize],
            fontWeight: '600',
            marginBottom: 12
          }
        ]}>
          🎨 Aparência
        </Text>
        
        <SettingItem
          icon={dark ? "moon" : "sun"}
          title="Modo Escuro"
          subtitle={dark ? "Ativo - Melhor para ambientes com pouca luz" : "Inativo - Tema claro ativo"}
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          rightComponent={
            <Switch
              value={dark}
              onValueChange={onThemeChange}
              trackColor={{ false: '#E2E8F0', true: theme.primary + '40' }}
              thumbColor={dark ? theme.primary : '#F7FAFC'}
            />
          }
        />
        
        <SettingItem
          icon="font"
          title="Tamanho da Fonte"
          subtitle={`Atual: ${fontSize.charAt(0).toUpperCase() + fontSize.slice(1)} - Toque para alterar`}
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          onPress={() => setFontModalVisible(true)}
          rightComponent={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ 
                color: theme.primary, 
                fontSize: fontSizeMap[fontSize],
                marginRight: 8,
                fontWeight: '500'
              }}>
                {fontSize}
              </Text>
              <Icon name="chevron" color={theme.primary} />
            </View>
          }
        />
        
        {/* Seção Conta */}
        <Text style={[
          styles.sectionHeader, 
          { 
            color: theme.primary, 
            fontSize: fontSizeMap[fontSize],
            fontWeight: '600',
            marginTop: 32,
            marginBottom: 12
          }
        ]}>
          👤 Conta
        </Text>
        
        <SettingItem
          icon="user"
          title="Fazer Login"
          subtitle="Sincronize seus dados e faça backup na nuvem"
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          onPress={handleLogin}
          rightComponent={<Icon name="chevron" color={theme.primary} />}
        />
        
        {/* Seção Dados */}
        <Text style={[
          styles.sectionHeader, 
          { 
            color: theme.primary, 
            fontSize: fontSizeMap[fontSize],
            fontWeight: '600',
            marginTop: 32,
            marginBottom: 12
          }
        ]}>
          💾 Dados
        </Text>
        
        <SettingItem
          icon="download"
          title="Exportar Dados"
          subtitle="Faça backup dos seus versículos e configurações"
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          onPress={exportData}
          rightComponent={<Icon name="chevron" color={theme.primary} />}
        />
        
        <SettingItem
          icon="trash"
          title="Limpar Todos os Dados"
          subtitle="Remove permanentemente todos os dados do app"
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          onPress={clearAllData}
          danger={true}
          rightComponent={<Icon name="chevron" color="#E53E3E" />}
        />
        
        {/* Seção Sobre */}
        <Text style={[
          styles.sectionHeader, 
          { 
            color: theme.primary, 
            fontSize: fontSizeMap[fontSize],
            fontWeight: '600',
            marginTop: 32,
            marginBottom: 12
          }
        ]}>
          ℹ️ Informações
        </Text>
        
        <SettingItem
          icon="info"
          title="Sobre o Aplicativo"
          subtitle="Versão, recursos e informações do desenvolvedor"
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          onPress={openAbout}
          rightComponent={<Icon name="chevron" color={theme.primary} />}
        />
        
        <SettingItem
          icon="mail"
          title="Contato e Suporte"
          subtitle="Dúvidas, sugestões ou problemas técnicos"
          theme={theme}
          fontSize={fontSize}
          fontSizeMap={fontSizeMap}
          onPress={contactSupport}
          rightComponent={<Icon name="chevron" color={theme.primary} />}
        />
        
        {/* Footer */}
        <View style={{ 
          marginTop: 32, 
          paddingTop: 24,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          alignItems: 'center' 
        }}>
          <Text style={{ 
            color: theme.textSecondary || (theme.text + '60'), 
            fontSize: 12,
            fontWeight: '400'
          }}>
            Vida com Propósito v0.0.12
          </Text>
          <Text style={{ 
            color: theme.textSecondary || (theme.text + '40'), 
            fontSize: 10,
            marginTop: 4
          }}>

          </Text>
        </View>
      </View>
      
      {/* Modal de seleção de fonte */}
      <FontSizeModal
        visible={fontModalVisible}
        onClose={() => setFontModalVisible(false)}
        currentSize={fontSize}
        onSelect={setAndSaveFontSize}
        theme={theme}
        fontSizeMap={fontSizeMap}
      />
    </ScrollView>
  );
}

export default SettingsScreen;